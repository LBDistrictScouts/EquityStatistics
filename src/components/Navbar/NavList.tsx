import React from "react";
import {Nav} from "react-bootstrap";


export default function NavList() {
    return (
        <Nav as={'ul'} className={'ms-auto'} defaultActiveKey={'none'} navbarScroll={true}>
            <Nav.Item as={'li'} className={'nav-link'}>
                <Nav.Link href={'#about'}>About</Nav.Link>
            </Nav.Item>
            <Nav.Item as={'li'} className={'nav-link'}>
                <Nav.Link href={'#process'}>Process</Nav.Link>
            </Nav.Item>
            <Nav.Item as={'li'} className={'nav-link'}>
                <Nav.Link href={'#audit'}>Audit</Nav.Link>
            </Nav.Item>
            <Nav.Item as={'li'} className={'nav-link'}>
                <Nav.Link href={'#contact'}>Contact</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}