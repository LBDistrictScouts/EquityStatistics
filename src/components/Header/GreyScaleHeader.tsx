import React from "react";
import './header.css'

export default function GreyScaleHeader() {
    return (
        <header id={'masthead-photo'} className="masthead">
            <div className="intro-body">
                <div className="container">
                    <div id={'photo-padding'}></div>
                    <div className="row">
                        <div id={'title-box'} className="col-lg-8 mx-auto">
                            <h1 className="brand-heading">Equity Audit</h1>
                            <p className="intro-text">Understanding our community
                                better.</p><a className="btn btn-link btn-circle" role="button" href="#about"><i
                            className="fa fa-angle-double-down animated"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}