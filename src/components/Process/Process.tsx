import React from "react";
import {Container, Card, Table} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShieldCheck, faShieldXmark} from '@awesome.me/kit-6ca014ec2b/icons/classic/light'


export default function Process() {
    return (
        <section className="text-center process-section content-section" id="process">
            <Container>
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2>Collection Process</h2>
                        <p>Grayscale is a free Bootstrap theme. It can be yours right now, simply download the template
                            on the preview page. The theme is open source, and you can use it for
                            any purpose, personal or commercial.</p>
                        <p>This theme features stock photos by Gratisography along with a
                            custom Google Maps skin courtesy of Snazzy Maps.</p>
                        <Card>
                            <Card.Header>
                                Fields Extracted
                            </Card.Header>
                            <Card.Body>
                                <Table>
                                    <thead>
                                        <tr>
                                            <td><span className={'fw-bolder'}>Field</span></td>
                                            <td><span className={'fw-bolder'}>Sent to District</span></td>
                                            <td><span className={'fw-bolder'}>Reason for Collection</span></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Group</td>
                                            <td className={'text-warning text-center'}>
                                                <FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.
                                            </td>
                                            <td>Required to help differentiate by group and display results.</td>
                                        </tr>
                                        <tr>
                                            <td>Section</td>
                                            <td className={'text-warning text-center'}>
                                                <FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.
                                            </td>
                                            <td>Required to help differentiate by section & section type and display results.</td>
                                        </tr>
                                        <tr>
                                            <td>Member Name</td>
                                            <td className={'text-success align-content-center text-center'}>
                                                <FontAwesomeIcon size={'xl'} icon={faShieldXmark}/> No.
                                            </td>
                                            <td>Displayed locally on the screen to help users identify the records. Not sent
                                                in the data package District.
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                    </div>
                </div>
            </Container>
        </section>
    )
}