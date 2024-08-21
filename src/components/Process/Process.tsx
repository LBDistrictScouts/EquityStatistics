import React from "react";
import {Container, Card, Table} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShieldCheck, faShieldXmark, faLockOpen, faDatabase, faFingerprint, faDisplay, faPaperPlaneTop} from '@awesome.me/kit-6ca014ec2b/icons/classic/light'


export default function Process() {
    return (
        <section className="text-center process-section content-section" id="process">
            <Container>
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2>Collection Process</h2>
                        <p>This web app has been built specifically to securely anonymise and transmit data. This means that GDPR data is kept secure and private by design. The web app has been built to prepare and process data in the browser and ensure that only the data as specified below is sent to District.</p>
                        <Card>
                            <Card.Header className="card-header">How the Process Works</Card.Header>
                            <Card.Body className="px-5">
                                <dl className="row text-start">
                                    <dt className={'col-sm-1 py-3'}><FontAwesomeIcon size={'xl'} icon={faLockOpen}/></dt>
                                    <dt className={'col-sm-3 py-3'}>Authenticate</dt>
                                    <dd className={'col-sm-8 py-3'}>This web app will use your credentials to authenticate with OSM, locally on your machine.</dd>

                                    <dt className={'col-sm-1 py-3'}><FontAwesomeIcon size={'xl'} icon={faDatabase}/></dt>
                                    <dt className={'col-sm-3 py-3'}>Get Data</dt>
                                    <dd className={'col-sm-8 py-3'}>Once the authentication has been completed it will request minimal data from OSM for the members in the section.</dd>

                                    <dt className={'col-sm-1 py-3'}><FontAwesomeIcon size={'xl'} icon={faFingerprint}/></dt>
                                    <dt className={'col-sm-3 py-3'}>Local Anonymisation</dt>
                                    <dd className={'col-sm-8 py-3'}>It then anonymises the data locally (i.e. on your computer, in browser memory) and prepares a data set which is displayed to you.</dd>

                                    <dt className={'col-sm-1 py-3'}><FontAwesomeIcon size={'xl'} icon={faDisplay}/></dt>
                                    <dt className={'col-sm-3 py-3'}>Display Members</dt>
                                    <dd className={'col-sm-8 py-3'}>The display will show you where postcodes are missing from your data, it will also give you the option to remove members from the selection.</dd>

                                    <dt className={'col-sm-1 py-3'}><FontAwesomeIcon size={'xl'} icon={faPaperPlaneTop}/></dt>
                                    <dt className={'col-sm-3 py-3'}>Send to District</dt>
                                    <dd className={'col-sm-8 py-3'}>Once you are happy with the selection, you will click 'Send Data', which will send the data into a secure store run by District.</dd>
                                </dl>
                            </Card.Body>
                        </Card>
                        <br/>
                        <Card>
                            <Card.Header>
                                Fields Extracted
                            </Card.Header>
                            <Card.Body>
                                <Table responsive>
                                    <thead>
                                        <tr className="table-primary align-middle py-5">
                                            <td><span className={'fw-bolder'}>Field</span></td>
                                            <td><span className={'fw-bolder'}>Sent to District</span></td>
                                            <td><span className={'fw-bolder'}>Reason for Collection</span></td>
                                        </tr>
                                    </thead>
                                    <tbody className={'align-middle'}>
                                    <tr>
                                        <td className={'py-4'}>User Full Name</td>
                                        <td className={'text-warning text-center py-4'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Included to help identify who uploaded the information and for GDPR audit purposes.</td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>User Email Address</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Included to contact the member in case of queries.</td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>Group</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Required to help differentiate by group and display results.</td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>Section</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Required to help differentiate by section & section type and display results.</td>
                                    </tr>
                                    <tr className={'table-success'}>
                                        <td className={'py-4'}>Current Term</td>
                                        <td className={'text-success align-content-center text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldXmark}/> No.</td>
                                        <td className={'py-4'}>Displayed locally on the screen to limit to only the members present this term. Not sent in the data package to District.</td>
                                    </tr>
                                    <tr className={'table-success'}>
                                        <td className={'py-4'}>Member Name</td>
                                        <td className={'text-success align-content-center text-center'}><FontAwesomeIcon
                                            size={'xl'} icon={faShieldXmark}/> No.
                                        </td>
                                        <td className={'py-4'}>Displayed locally on the screen to help users identify
                                            the records. Not sent in the data package to District.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>Member Record ID</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Included to help separate the analysis by age distribution and section type.</td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>Member Age</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Included to help separate the analysis by age distribution and section type.</td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>Member Postcode</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Included as core purpose of the analysis, will be joined with the publicly available Index of Multiple Deprivation data set.</td>
                                    </tr>
                                    <tr>
                                        <td className={'py-4'}>Member Other Postcodes</td>
                                        <td className={'text-warning text-center'}><FontAwesomeIcon size={'xl'} icon={faShieldCheck}/> Yes.</td>
                                        <td className={'py-4'}>Included as a backup for postcode analysis. Does not include medical record postcode.</td>
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