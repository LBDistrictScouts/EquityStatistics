import React, {useEffect, useState} from "react";
import {UserResponse, userResourceInfo, UserProfile, Term} from "./osm-data";
import {Container, Form, Modal, Button} from "react-bootstrap";
import {Section} from './osm-data';
import {setValidCookie} from "../../utilities";
import {getCookie} from "typescript-cookie";

interface UserInfoModalProps {
    buttonLabel: string

    section: Section | undefined
    term: Term | undefined

    setSection: Function
    setTerm: Function
}


export default function UserInfoModal({buttonLabel, section, term, setTerm, setSection}: UserInfoModalProps) {
    const [showUIM, setShowUIM] = useState(false);

    const handleClose = () => setShowUIM(false);
    const handleShow = () => setShowUIM(true);

    const [sectionData, setSectionData] = useState<UserProfile>();
    const [selectedSection, setSelectedSection] = useState<Section>();
    const [selectedTermId, setSelectedTermId] = useState<number>();



    useEffect(() => {
        userResourceInfo().then((userResponse: UserResponse) => {
            const data: UserProfile|undefined = userResponse.data

            setSectionData(data);

            if (!data) {
                return
            }

            const getSectionData = (sectionId: number): Section|undefined => {
                if (!data.sections) {
                    return undefined
                }

                return data.sections.find(section => section.section_id === sectionId);
            };

            const sectionId: string|undefined = getCookie('section-id');
            if (sectionId) {
                setSection(getSectionData(Number(sectionId)))
            }
        })
    }, [setSection, setTerm]);

    const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const getSectionData = (sectionId: number): Section|undefined => {
            if (!sectionData?.sections) {
                return undefined
            }

            return sectionData?.sections?.find(section => section.section_id === sectionId);
        };

        const sectionId: number = Number(event.target.value);
        const cngSection: Section|undefined = getSectionData(sectionId);
        setSelectedSection(cngSection);

        const today = new Date();

        const currentTerm = cngSection?.terms.find(term => {
            const start = new Date(term.startdate);
            const end = new Date(term.enddate);
            return today >= start && today <= end;
        });

        if (currentTerm) {
            setSelectedTermId(currentTerm.term_id);
        }
    };

    const handleTermChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTermId(Number(event.target.value));
    };

    const handleSectionTermFormSubmit = (event: React.FormEvent) => {
        // event.preventDefault();
        setValidCookie('section-id', selectedSection?.section_id);
        setSection(selectedSection)

        const getTermData = (termId: number|undefined): Term|undefined => {
            if (!selectedSection || !termId) {
                return undefined
            }

            return selectedSection.terms.find(term => term.term_id === termId);
        };

        setValidCookie('term-id', selectedTermId)
        const selectedTerm = getTermData(selectedTermId)
        setTerm(selectedTerm)

        setShowUIM(false);
        window.location.hash = 'audit';
    };

    return (
        <>
            <Button variant={'primary'} size={'lg'} className="btn-default" onClick={handleShow}>{buttonLabel}</Button>
            <Modal size={'lg'} show={showUIM} scrollable={true} onHide={handleClose} dialogClassName={'dark'} backdrop="static" keyboard={false}>
                <Form onSubmit={handleSectionTermFormSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container className="p-3" fluid>
                            <Form.Label htmlFor="sectionSelect">Select OSM Section</Form.Label>
                            <Form.Select id="sectionSelect" onChange={handleSectionChange}>
                                {sectionData?.sections.map(section => (
                                    <option key={section.section_id} value={section.section_id}>
                                        {section.group_name}: {section.section_name} ({section.section_type})
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Label htmlFor="termSelect" className="pt-3">Select OSM Section Term</Form.Label>
                            <Form.Select id="termSelect" value={selectedTermId} disabled={!selectedSection} onChange={handleTermChange}>
                                {selectedSection?.terms.map(term => (
                                    <option key={term.term_id} value={term.term_id}>
                                        {term.name} ({term.startdate} - {term.enddate})
                                    </option>
                                ))}
                            </Form.Select>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" type="submit" onSubmit={handleSectionTermFormSubmit}>Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );

}
