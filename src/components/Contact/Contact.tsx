import React from "react";
import {Button} from "react-bootstrap";


export default function Contact() {
    return (
        <section className="text-center contact-section content-section" id="contact">
            <div className="container">
                <div className="row">
                    <div className="mx-auto">
                        <h2>Contact us</h2>
                        <p>Get in contact with a member of the team for any questions.</p>
                        <Button variant={'primary'} size={'lg'} className={'btn-default'}>equity-audit@lbdscouts.org.uk</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}