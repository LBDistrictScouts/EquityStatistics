import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {checkAuthenticated, checkCodeInUrl, getRedirect, processCode} from './authenticate';


export default function AuthButton() {
    const [isAuthenticated, setAuthenticated] = useState(false);

    function redirectToAuth(): void {
        window.location.href = getRedirect();
    }

    useEffect(() => {
        if (isAuthenticated) {
            console.log('Authenticated')
        }
    }, [isAuthenticated]);

    if (!checkAuthenticated() && checkCodeInUrl()) {
        processCode().then(() => {
            setAuthenticated(true);
            return true
        })
    }

    return (
        <Button
            variant={'primary'}
            size={'lg'}
            className="btn-default"
            disabled={isAuthenticated}
            onClick={!isAuthenticated ? redirectToAuth : undefined}
        >
            Authenticate
        </Button>
    );
}