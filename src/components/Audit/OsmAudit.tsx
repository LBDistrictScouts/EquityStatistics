import React from 'react';
import './audit.css';

import {checkAuthenticated, checkCodeInUrl} from './authenticate';
import {Container} from "react-bootstrap";
import AuthButton from "./AuthButton";
import UserInfoModal from "./UserInfoModal";


function AuditSelector() {

    const auth = !checkAuthenticated();
    const in_url = checkCodeInUrl();

    if ((auth || in_url) && !(auth && in_url)) {
        return AuthButton();
    }

    return UserInfoModal();
}

export default function OsmAudit() {
    return (
        <section className="text-center download-section content-section" id="audit">
            <Container>
                <div className="col-lg-8 mx-auto">
                    <h1>Submit Data</h1>
                    <p>Click the button below to authenticate with OSM.</p>
                    <AuditSelector key={'osm'}/>
                </div>
            </Container>
        </section>
    )
}