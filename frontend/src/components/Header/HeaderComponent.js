import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
        Button, Modal, ModalHeader, ModalBody,
        Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import AxiosApi from '../AxiosApi';
import styles from "./Header.module.css";

const Header = () => {
    const [isNavOpen, setNav] = useState(false);
    const [isLoginModalOpen, setLoginModal] = useState(false);
    const [isSignupModalOpen, setSignupModal] = useState(false);
    const [logInData, setlogInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
    const [modalMsg, setModalMsg] = useState('');

    const toggleNav = () => {
        setNav(!isNavOpen);
    };
    
    const toggleLoginModal = () => {
        setLoginModal(!isLoginModalOpen);
        setModalMsg('');
    };

    const toggleSignupModal = () => {
        setSignupModal(!isSignupModalOpen);
        setModalMsg('');
    };
    
    const handleLoginInputChange = (event) => {
        setlogInData({
            ...logInData,
            [event.target.name] : event.target.value
        })
    }     

    const handleSignupInputChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name] : event.target.value
        })
    }   

    const handleLogin = (event) => {
        event.preventDefault();
        AxiosApi.post('/user/login/', {
            email: logInData.email,
            password: logInData.password
        })
        .then(function (res) {
            if (res.data.logedIn && res.status === 200) {
                toggleLoginModal();
                console.log(res);
                console.log(res.data.msg);
                /*cookies.set('jwt', res.data.jwt)*/
            } else {
                console.log(res);
                console.log(res.data.msg);
                setModalMsg(res.data.msg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const handleSignUp = (event) => {
        event.preventDefault();
        AxiosApi.post('/user/signup/', {
            username: signUpData.username,
            email: signUpData.email,
            password: signUpData.password
        })
        .then(function (res) {
            if (res.data.signedUp && res.status === 200) {
                toggleSignupModal();
                console.log(res);
                console.log(res.data.msg);
                console.log(document.cookies);
                /*cookies.set('jwt', res.data.jwt)*/
            } else {
                console.log(res);
                console.log(res.data.msg);
                setModalMsg(res.data.msg);
            }
        })
        .catch(function (error) {
            console.log(error);
        });        
    }    

    return(
        <React.Fragment>
            <Navbar light className={styles.navbar} expand="md">
                <div className="container-fluid">
                    <NavbarToggler onClick={toggleNav} />
                    <NavbarBrand className="mr-auto" href="/">
                        Brand
                    </NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                        <NavItem>
                            <NavLink className="nav-link " to="/">
                                <span className="fa fa-home fa-lg"></span> Home
                            </NavLink>
                        </NavItem>                        
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Button outline onClick={toggleLoginModal}>
                                    <span className="fa fa-sign-in fa-lg"></span> Log In
                                </Button>
                            </NavItem>
                        </Nav>
                        <Nav className="ml" navbar>
                            <NavItem>
                                <Button outline onClick={toggleSignupModal}>
                                    <span className="fa fa-sign-in fa-lg"></span> Sign Up
                                </Button>
                            </NavItem>
                        </Nav>
                    </Collapse> 
                </div>    
            </Navbar>
            <Modal isOpen={isLoginModalOpen} toggle={toggleLoginModal}>
                <ModalHeader toggle={toggleLoginModal}>Log In</ModalHeader> 
                <ModalBody>
                    <Form onSubmit={handleLogin}>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" onChange={handleLoginInputChange} name="email"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" onChange={handleLoginInputChange} name="password"/>
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Log In</Button>
                    </Form>
                    {modalMsg}                       
                </ModalBody>               
            </Modal>
            <Modal isOpen={isSignupModalOpen} toggle={toggleSignupModal}>
                <ModalHeader toggle={toggleSignupModal}>Sign Up</ModalHeader> 
                <ModalBody>
                    <Form onSubmit={handleSignUp}>
                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input type="text" onChange={handleSignupInputChange} name="username"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" onChange={handleSignupInputChange} name="email"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" onChange={handleSignupInputChange} name="password"/>
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Sign Up</Button>
                    </Form>
                    {modalMsg}          
                </ModalBody>               
            </Modal>
        </React.Fragment>
    )
}

export default Header;