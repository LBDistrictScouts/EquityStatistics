import {Alert, Button } from 'react-bootstrap';


interface AlertProps {
    status: boolean|undefined
    text: string|undefined
    show: boolean
    setShow: Function
    button: boolean
}


function AlertDismissibleResponse({status, text, show, setShow, button}: AlertProps) {
    if (show) {
        return (
            <Alert variant={status ? 'success' : 'danger'} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{text ? text : 'Unknown'}</Alert.Heading>
            </Alert>
        );
    }

    if (button) {
        return <Button onClick={() => setShow(true)}>Show Alert</Button>;
    }

    return (
        <></>
    )
}

export default AlertDismissibleResponse;