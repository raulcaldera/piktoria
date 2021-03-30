import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
        Button, Modal, ModalHeader, ModalBody,
        Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import styles from "./Footer.module.css"


const Footer = () => {
    return(
        <div className={styles.footer}>
            <div className="container">
                <div className="row justify-content-center"> 
                    This is a footer  
                </div>
            </div> 
        </div>         
    );
}

export default Footer;