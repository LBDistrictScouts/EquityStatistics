import React, {useEffect, useState} from "react";
import {Container, Navbar} from "react-bootstrap";
import NavList from "./NavList";


export default function GreyScaleNavbar() {
    const [navShrink, setNavShrink] = useState(false);

    useEffect(() => {
        const updatePosition = () => {
            const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

            if (scrollTop > 100) {
                setNavShrink(true)
            } else {
                setNavShrink(false)
            }
        }
        window.addEventListener("scroll", updatePosition);
        updatePosition();
        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    // let className = "navbar navbar-expand-md fixed-top navbar-light";
    let barClassName = navShrink ? 'navbar-shrink' : '';



    return (
        <Navbar collapseOnSelect className={barClassName} id={'mainNav'} expand="lg" fixed={'top'} variant={'light'}>
            <Container>
                <Navbar.Brand href={'#'}>Letchworth, Baldock & Ashwell Scouts</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <NavList/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}