import React from "react";
import "./assets/bootstrap/css/bootstrap.min.css";
import './layout.css'
import './assets/fonts/font-awesome.min.css'
import GreyScaleNavbar from "../Navbar/GreyScaleNavbar";
import GreyScaleFooter from "../Footer/Footer";


// @ts-ignore
export default function GreyScale({ children }) {
    return (
        // <div id="page-top" data-bs-spy="scroll" data-bs-target="#mainNav" data-bs-offset="77">
        <>
            <GreyScaleNavbar/>
            {/* display the child prop */}
            {children}
            <GreyScaleFooter/>
        </>
    );
}