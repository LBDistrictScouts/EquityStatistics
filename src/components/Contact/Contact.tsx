import React from "react";
import Button from "react-bootstrap/Button";


export default function Contact() {
    return (
        <section className="text-center content-section" id="contact">
            <div className="container">
                <div className="row">
                    <div className=" mx-auto">
                        <h2>Contact us</h2>
                        <p>Feel free to leave us a comment on the Grayscale template overview
                            page to give some feedback about this theme!</p>
                        <Button variant={'primary'} size={'lg'} className={'btn-default'}>equity-audit@lbdscouts.org.uk</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}