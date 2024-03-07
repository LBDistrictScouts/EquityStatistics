import React, {useState} from "react";
import {userResourceInfo} from "./osm-data";
import {Form, Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';


// const userSectionInfo = await userResourceInfo();


function SectionSelectForm() {
    // const [termsAvailable, setTermsAvailable] = useState(true)

    // if (typeof userSectionInfo === "undefined") {
    //     return (
    //         <></>
    //     )
    // }
    //
    // const user_name = userSectionInfo.data.full_name;
    // const sections = userSectionInfo.data.sections;

    return (
        <Form>
            <Form.Select>
                {/*{sections.map(section => (*/}
                {/*    <option value={section.section_id}>{section.group_name}: {section.section_name} ({section.section_type})</option>*/}
                {/*    )*/}
                {/*)}*/}
            </Form.Select>
        </Form>
    )
}




export default function UserInfoModal() {
    const [showUIM, setShowUIM] = useState(false);

    const handleClose = () => setShowUIM(false);
    const handleShow = () => setShowUIM(true);

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
                    <SectionSelectForm/>
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
