import React, {useCallback, useEffect, useState} from 'react';
import './audit.css';

import {checkAuthenticated, checkCodeInUrl, getRedirect, processCode} from './authenticate';
import {Col, Container, Row, Table, Badge, Card, Form, Button} from "react-bootstrap";
// @ts-ignore
import {FormCheckType} from "react-bootstrap/FormCheck"
import UserInfoModal from "./UserInfoModal";
import {
    checkSectionIdSet,
    checkTermIdSet,
    DataResponse, getDataFromIds,
    getExtractionData,
    getGridData, MemberRecord,
    RecordList,
    Section,
    Term, UserProfile, userResourceInfo, UserResponse
} from "./osm-data";
import {getCookie} from "typescript-cookie";
import {isJsonObject} from "../../utilities";
import {DataSubmission, submitData} from "./district-data";
import AlertDismissibleResponse from "./alert";

export default function OsmAudit() {
    const [section, setSection] = useState<Section>();
    const [term, setTerm] = useState<Term>();
    const [userProfile, setUserProfile] = useState<UserProfile>();

    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isSectionIdSet] = useState<boolean>(checkSectionIdSet());
    const [isTermIdSet] = useState<boolean>(checkTermIdSet());
    const [gridData, setGridData] = useState<RecordList>();
    const [checkedCount, setCheckedCount] = useState(0);
    const [filteredOutCount, setFilteredOutCount] = useState(0);

    const [responseText, setResponseText] = useState<string|undefined>();
    const [submitSuccess, setSubmitSuccess] = useState<boolean|undefined>();
    const [dismissableAlert, setDismissableAlert] = useState<boolean>(false);

    useEffect(() => {
        // Initialize the count of checked checkboxes when the component mounts
        updateCheckedCount();
    }, [gridData]);

    const updateCheckedCount = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const checked = Array.from(checkboxes).filter((checkbox: FormCheckType) => checkbox.checked);
        setCheckedCount(checked.length);
    };

    const handleCheckboxChange = () => {
        updateCheckedCount();
    };

    function redirectToAuth(): void {
        window.location.href = getRedirect();
    }

    useEffect(() => {
        if (checkAuthenticated()) {
            // console.log('Authenticated')
            setAuthenticated(true);
        }

        if (!checkAuthenticated() && checkCodeInUrl()) {
            processCode().then(() => {
                // console.log('Processed Code In Url.');
                setAuthenticated(true);
            })
        }
    }, []);

    const setContextSection = useCallback((section: Section) => {
        setSection(section);
    }, [])

    const setContextTerm = useCallback((term: Term) => {
        setTerm(term);
    }, [])

    useEffect(() => {
        if (section) {
            const termId = getCookie('term-id');

            if (termId) {
                const cookieTerm = section.terms.find(term => term.term_id === Number(termId));
                setTerm(cookieTerm);
            }
        }
    }, [section]);

    useEffect(() => {
        if (checkAuthenticated()) {
            userResourceInfo().then((userResponse: UserResponse) =>  {
                setUserProfile(userResponse.data)
            })
        }
    }, []);

    const handleDataSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = Array.from(event.currentTarget.elements)
        let idList: number[] = []

        for (const inputId in formData) {
            const controlElement = formData[inputId];

            if (!isJsonObject<HTMLInputElement>(controlElement)) {
                throw new Error('Elements must be an input type.')
            }

            if (controlElement.type === 'checkbox' && controlElement.checked) {
                idList.push(Number(controlElement.id));
            }
        }

        if (!isJsonObject<UserProfile>(userProfile) || !isJsonObject<Section>(section)) {
            throw new Error('User & Section Profile must be set')
        }

        const timestamp = new Date();
        const submissionData: DataSubmission = {
            groupId: section.group_id,
            groupName: section.group_name,

            sectionName: section.section_name,
            sectionId: section.section_id,
            sectionType: section.section_type,

            userName: userProfile.full_name,
            userEmail: userProfile.email,
            userId: userProfile.user_id,

            submissionTimestamp: timestamp.toISOString(),

            members: getDataFromIds(idList, gridData)
        }

        submitData(submissionData).then((response: Response) => {
            setSubmitSuccess(response.ok)
            response.json().then((data: any) => {
                setResponseText(data.message)
            })
            setDismissableAlert(true);
        })
    };



    useEffect(() => {
        getGridData().then((data:DataResponse) => {
            setGridData(data.data)

            if (data.filteredOutCount) {
                setFilteredOutCount(data.filteredOutCount)
            }
        })
    }, [isTermIdSet]);

    if (!isAuthenticated) {
        return (
            <section className="text-center download-section content-section" id="audit">
                <Container className="content">
                    <div className="col-lg-8 mx-auto">
                        <h1>Submit Data</h1>
                        <p>Click the button below to authenticate with OSM.</p>
                        <Button
                            variant={'primary'}
                            size={'lg'}
                            className="btn-default"
                            disabled={isAuthenticated}
                            onClick={!isAuthenticated ? redirectToAuth : undefined}
                        >
                            Authenticate
                        </Button>
                    </div>
                </Container>
            </section>
        );
    }

    if (isSectionIdSet && isTermIdSet) {
        return (
            <section className="text-center download-section" id="audit">
                <Container>
                    <Row className="py-5">
                        <Col>
                            {(userProfile) ? (
                                <>
                                    <Row>
                                        <Col className="px-5">
                                            <Card>
                                                <Card.Header>
                                                    User Info
                                                </Card.Header>
                                                <Card.Body>
                                                    <Table hover>
                                                        <tbody>
                                                            <tr>
                                                                <td>User Full Name</td>
                                                                <td>
                                                                    <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge>
                                                                </td>
                                                                <td>{userProfile.full_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>User Email</td>
                                                                <td>
                                                                    <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge>
                                                                </td>
                                                                <td>{userProfile.email}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <br/>
                                </>
                                ) : (
                                    <> </>
                                )}
                            {(section) ? (
                                <Row>
                                    <Col className="px-5">
                                        <Card>
                                            <Card.Header>
                                                Section Info
                                            </Card.Header>
                                            <Card.Body>
                                                <Table hover>
                                                    <tbody>
                                                    {section ? (
                                                        <>
                                                            <tr>
                                                                <td>Group</td>
                                                                <td>
                                                                    <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge>
                                                                </td>
                                                                <td>{section.group_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Section</td>
                                                                <td>
                                                                    <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge>
                                                                </td>
                                                                <td>{section.section_name}</td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {term ? (
                                                        <>
                                                            <tr>
                                                                <td>Term</td>
                                                                <td>
                                                                    <Badge bg={'success'}>NOT SHARED<br/>Only Visible Here</Badge>
                                                                </td>
                                                                <td>{term.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Term Dates</td>
                                                                <td>
                                                                    <Badge bg={'success'}>NOT SHARED<br/>Only Visible Here</Badge>
                                                                </td>
                                                                <td>{term.startdate} - {term.enddate}</td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    </tbody>
                                                </Table>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            ) : (
                                <></>
                            )}
                        </Col>
                        <Col>
                            <UserInfoModal
                                buttonLabel={'Change Section & Term'}

                                section={section}
                                setSection={setContextSection}

                                term={term}
                                setTerm={setContextTerm}

                                key={'osm'}
                            />
                            <Container className="p-5 text-center">
                                <p>Filtered out {filteredOutCount} Adults & Young Leaders.</p>
                            </Container>
                        </Col>
                    </Row>
                    {gridData ? (
                        <Row>
                            <Col>
                                <Form onSubmit={handleDataSubmit}>
                                    <Table striped bordered hover>
                                        <thead className="thead-dark">
                                        <tr>
                                            <td>Include Member</td>
                                            <td>Member Name
                                                <hr/>
                                                <Badge bg={'success'}>NOT SHARED<br/>Only Visible Here</Badge></td>
                                            <td>Record ID
                                                <hr/>
                                                <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge></td>
                                            <td>Age
                                                <hr/>
                                                <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge></td>
                                            <td>Best Postcode
                                                <hr/>
                                                <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge></td>
                                            <td>Other Postcodes
                                                <hr/>
                                                <Badge bg={'warning'}>SHARED<br/>Sent to District</Badge></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(gridData).map((memberRecord: MemberRecord) => (
                                                <tr key={memberRecord.member_id}>
                                                    <td><Form.Check key={memberRecord.member_id} id={String(memberRecord.member_id)} defaultChecked={true} onChange={handleCheckboxChange}/></td>
                                                    <td>{memberRecord.first_name} {memberRecord.last_name}</td>
                                                    <td>{memberRecord.member_id}<Form.Control hidden={true} readOnly={true} value={memberRecord.member_id}/></td>
                                                    <td>{memberRecord.age}</td>
                                                    <td>{getExtractionData(memberRecord).selectedPostcode}</td>
                                                    <td>{getExtractionData(memberRecord).otherPostcodes.map((postcode, index) => (
                                                        <Badge key={index} bg={'secondary'}>{postcode}</Badge>
                                                    ))}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <div className="mt-5">
                                        <p>{checkedCount} Records</p>
                                        <AlertDismissibleResponse
                                            status={submitSuccess}
                                            text={responseText}
                                            show={dismissableAlert}
                                            setShow={setDismissableAlert}
                                            button={false}
                                        />
                                        <Button type={'submit'} size={'lg'} variant={'success'}>Send Data</Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    ) : (
                    <></>
                    )}
                </Container>
            </section>
        )
    }

    return (
        <section className="text-center download-section content-section" id="audit">
            <Container className="content">
                <Row>
                    <Col lg={8} className="mx-auto">
                        <h1>Submit Data</h1>
                        <p>Click the button below to set section & term for OSM.</p>
                        <UserInfoModal
                            buttonLabel={'Select OSM Section & Term'}

                            section={section}
                            setSection={setContextSection}

                            term={term}
                            setTerm={setContextTerm}

                            key={'osm'}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    )
}