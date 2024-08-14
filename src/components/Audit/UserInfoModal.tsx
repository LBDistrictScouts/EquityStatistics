import React, {useEffect, useState} from "react";
import {UserResponse, userResourceInfo, UserProfile} from "./osm-data";
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';



export default function UserInfoModal() {
    const [showUIM, setShowUIM] = useState(false);

    const handleClose = () => setShowUIM(false);
    const handleShow = () => setShowUIM(true);

    const [sectionData, setSectionData] = useState<UserProfile>();

    useEffect(() => {
        userResourceInfo().then((userResponse: UserResponse) => {
            setSectionData(userResponse.data);
        })
    }, [showUIM]);


    return (
        <>
            <Button
                variant={'primary'}
                size={'lg'}
                className="btn-default"
                onClick={handleShow}
            >
                Select Section & Term
            </Button>

            <Modal
                size={'lg'}
                show={showUIM}
                scrollable={true}
                onHide={handleClose}
                dialogClassName={'dark'}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Select>
                            {sectionData?.sections.map(section => (
                                    <option value={section.section_id}>{section.group_name}: {section.section_name} ({section.section_type})</option>
                                )
                            )}
                        </Form.Select>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}
