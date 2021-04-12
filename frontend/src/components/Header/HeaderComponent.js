import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
        Button, Modal, ModalHeader, ModalBody,
        Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import AxiosApi from '../AxiosApi';
import styles from "./Header.module.css";
import { useHistory } from "react-router-dom";

const Header = (props) => {
    const auth = props.auth;
    const setAuth = props.setAuth;  
    const user = props.user;
    const setUser = props.setUser;
    const setUserPostUpvotes = props.setUserPostUpvotes;
    const setUserCommentUpvotes = props.setUserCommentUpvotes;
    const [isNavOpen, setNav] = useState(false);
    const [isLoginModalOpen, setLoginModal] = useState(false);
    const [isSignupModalOpen, setSignupModal] = useState(false);
    const [logInData, setLogInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
    const [modalMsg, setModalMsg] = useState('');
    const history = useHistory();  

    const toggleNav = () => {
        setNav(!isNavOpen);
    };
    
    const toggleLoginModal = () => {
        setLoginModal(!isLoginModalOpen);
        setModalMsg('');
        setLogInData({ email: '', password: '' });
    };

    const toggleSignupModal = () => {
        setSignupModal(!isSignupModalOpen);
        setModalMsg('');
        setSignUpData({ username: '', email: '', password: '' });
    };
    
    const handleLoginInputChange = (event) => {
        setLogInData({...logInData, [event.target.name] : event.target.value})
    }     

    const handleSignupInputChange = (event) => {
        setSignUpData({...signUpData, [event.target.name] : event.target.value})
    }   

    const handleLogin = (event) => {
        event.preventDefault();
        if (logInData.email && logInData.password) {
            (async () => {
                await AxiosApi.post('/user/login/', { email: logInData.email, password: logInData.password })
                .then(function (res) {
                    if (res.data.logedIn && res.status === 200) {
                        toggleLoginModal();
                        setAuth(true);
                        setUser({ userId: res.data.userId, username: res.data.username });
                        setModalMsg('');
                    } else {
                        setModalMsg(res.data.msg);
                    }
                })
                .catch(function (error) { 
                    if (error.response.status === 400) {
                        console.log(error);
                        setModalMsg('Something went wrong :/');
                    } else {
                        console.log(error);
                    }
                });
            })(); 
        } else {
            setModalMsg('Please enter all the fields');
        }    
    }

    const handleSignUp = (event) => {
        event.preventDefault();
        if (signUpData.username && signUpData.email && signUpData.password) {
            (async () => {
                await AxiosApi.post('/user/signup/', { username: signUpData.username, email: signUpData.email, password: signUpData.password })
                .then(function (res) {
                    if (res.data.signedUp && res.status === 200) {
                        toggleSignupModal();
                        setAuth(true);
                        setUser({ userId: res.data.userId, username: res.data.username });
                        setModalMsg('');
                    } else {
                        setModalMsg(res.data.msg);
                    }
                })
                .catch(function (error) { 
                    if (error.response.status === 400) {
                        console.log(error);
                        setModalMsg('Something went wrong :/');
                    } else {
                        console.log(error);
                    }
                });
            })();
        } else {
            setModalMsg('Please enter all the fields');
        }          
    }  

    const handleLogOut = (event) => {
        event.preventDefault();
        (async () => {
            await AxiosApi.post('/user/logout/')
            .then(function (res) {
                if (res.data.logedOut && res.status === 200) {
                    setAuth(false);
                    setUser({ userId: '', username: '' });
                    setUserPostUpvotes([]);
                    setUserCommentUpvotes([]);
                    setLogInData({ email: '', password: '' });
                    setSignUpData({ username: '', email: '', password: '' });
                    setModalMsg('');
                    history.push("/");                
                } else {
                    setModalMsg(res.data.msg);
                }
            })
            .catch(function (error) { console.log(error) });  
        })();      
    }    

    const RenderNavButtons = () => {
        if(!auth) {
            return (
                <React.Fragment>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Button outline onClick={toggleLoginModal}>
                                Log In
                            </Button>
                        </NavItem>
                    </Nav>
                    <Nav className="ml" navbar>
                        <NavItem>
                            <Button outline onClick={toggleSignupModal}>
                                Sign Up
                            </Button>
                        </NavItem>
                    </Nav>
            </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Nav navbar>
                        <NavItem>
                            <NavLink className="nav-link " to={`/profile/${user.userId}`}>
                                Profile
                            </NavLink>
                        </NavItem>                        
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Button outline onClick={handleLogOut}>
                                Log Out
                            </Button>
                        </NavItem>
                    </Nav>
                </React.Fragment>
            );
        }      
    }

    return(
        <React.Fragment>
            <Navbar light className={styles.navbar} expand="md">
                <div className="container-fluid">
                    <NavbarToggler onClick={toggleNav} />
                    <NavbarBrand className="mr-auto">
                        <NavLink className="nav-link " to="/">
                            Brand
                        </NavLink>
                    </NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <RenderNavButtons />
                    </Collapse> 
                </div>    
            </Navbar>
            <Modal className={styles.navModal} contentClassName={styles.navModalContent} isOpen={isLoginModalOpen} toggle={toggleLoginModal}>
                <ModalHeader className={styles.navModalHeader} toggle={toggleLoginModal}>Log In</ModalHeader> 
                <ModalBody className={styles.navModalBody}>
                    <Form className={styles.navModalForm} onSubmit={handleLogin}>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" onChange={handleLoginInputChange} name="email"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" onChange={handleLoginInputChange} name="password"/>
                        </FormGroup>
                        <div className={styles.navModalFormBtnContainer}>
                            <Button className={styles.navModalFormBtn} type="submit" value="submit" color="primary">Log In</Button>
                        </div>                    
                    </Form>
                    <div className={styles.navModalMsg}>
                        {modalMsg}    
                    </div>                    
                </ModalBody>               
            </Modal>
            <Modal className={styles.navModal} contentClassName={styles.navModalContent} isOpen={isSignupModalOpen} toggle={toggleSignupModal}>
                <ModalHeader className={styles.navModalHeader} toggle={toggleSignupModal}>Sign Up</ModalHeader> 
                <ModalBody className={styles.navModalBody}>
                    <Form className={styles.navModalForm} onSubmit={handleSignUp}>
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
                        <div className={styles.navModalFormBtnContainer}>
                            <Button className={styles.navModalFormBtn} type="submit" value="submit" color="primary">Sign Up</Button>
                        </div>                    
                    </Form>
                    <div className={styles.navModalMsg}>
                        {modalMsg}    
                    </div>      
                </ModalBody>               
            </Modal>
        </React.Fragment>
    )
}

export default Header;