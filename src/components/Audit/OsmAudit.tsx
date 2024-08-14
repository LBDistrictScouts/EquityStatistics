import React, {useEffect, useState} from 'react';
import './audit.css';

import {checkAuthenticated, checkCodeInUrl, getRedirect, processCode} from './authenticate';
import {Container} from "react-bootstrap";
import UserInfoModal from "./UserInfoModal";
import Button from "react-bootstrap/Button";

export default function OsmAudit() {

    const [isAuthenticated, setAuthenticated] = useState(false);
    const [codeInUrl, setCodeInUrl] = useState(false);

    function redirectToAuth(): void {
        window.location.href = getRedirect();
    }

    useEffect(() => {
        if (checkAuthenticated()) {
            console.log('Authenticated')
            setAuthenticated(true);
        }

        if (!isAuthenticated && checkCodeInUrl()) {
            processCode().then(() => {
                console.log('Processed Code In Url.');
                setCodeInUrl(true);
                setAuthenticated(true);
                return true
            })
        }
    }, [isAuthenticated, codeInUrl]);

    if (!isAuthenticated) {
        return (
            <section className="text-center download-section content-section" id="audit">
                <Container>
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

    return (
        <section className="text-center download-section content-section" id="audit">
            <Container>
                <div className="col-lg-8 mx-auto">
                    <h1>Submit Data</h1>
                    <p>Click the button below to authenticate with OSM.</p>
                    <UserInfoModal key={'osm'}/>
                </div>
            </Container>
        </section>
    )
}