import React, { useState } from 'react';
import { Navbar, Nav, NavbarToggler, Collapse, NavItem,
	Button, Modal, ModalHeader, ModalBody,
	Form, FormGroup, Input, Label
} from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import AxiosApi from '../AxiosApi';
import styles from "./Header.module.css";
import { useHistory } from "react-router-dom";
import Logo from "../../static/PiktoriaLogo.png" 

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
		setLogInData({ ...logInData, [event.target.name]: event.target.value });
	}

	const handleSignupInputChange = (event) => {
		setSignUpData({ ...signUpData, [event.target.name]: event.target.value });
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
							setModalMsg('Something went wrong :/');
						} else {
							setModalMsg(`Error: ${error.response.status}`);
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
							setModalMsg('Something went wrong :/');
						} else {
							setModalMsg(`Error: ${error.response.status}`);
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
				.catch(function (error) { setModalMsg('Something went wrong :/'); });
		})();
	}

	const RenderNavButtons = () => {
		if (!auth) {
			return (
				<React.Fragment>
					<Nav className={`ml-auto ${styles.nav}`} navbar>
						<NavItem className={styles.navItem}>
							<button className={styles.navButton} onClick={toggleLoginModal}>
								Log In
							</button>
						</NavItem>
					</Nav>
					<Nav className={`ml ${styles.nav}`} navbar>
						<NavItem className={styles.navItem}>
							<button className={styles.navButton} onClick={toggleSignupModal}>
								Sign Up
							</button>
						</NavItem>
					</Nav>
				</React.Fragment>
			)
		} else {
			return (
				<React.Fragment>
					<Nav className={styles.nav} navbar>
						<NavItem className={styles.navItem}>
							<NavLink className={`nav-link ${styles.profileLink}`} activeClassName={`nav-link ${styles.profileLinkActive}`} to={`/profile/${user.userId}`}>
								Profile
							</NavLink>
						</NavItem>
					</Nav>
					<Nav className={`ml-auto ${styles.nav}`} navbar>
						<NavItem className={styles.navItem}>
							<button className={styles.navButton} onClick={handleLogOut}>
								Log Out
							</button>
						</NavItem>
					</Nav>
				</React.Fragment>
			);
		}
	}

	return (
		<React.Fragment>
			<Navbar light className={styles.navbar} expand="md">
				<div className={`container-fluid ${styles.navContainer}`}>
					<NavLink className={styles.navBrand} to="/">
						<img className={styles.logo} src={Logo} alt='Home'/>
					</NavLink>
					<NavbarToggler className={`ml-auto ${styles.navToggler}`} onClick={toggleNav} />
					<Collapse className={styles.navCollapse} isOpen={isNavOpen} navbar>
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
							<Input type="email" onChange={handleLoginInputChange} name="email" maxLength="50" required />
						</FormGroup>
						<FormGroup>
							<Label htmlFor="password">Password</Label>
							<Input type="password" onChange={handleLoginInputChange} name="password" minLength="4" maxLength="50" required />
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
							<Input type="text" onChange={handleSignupInputChange} name="username" maxLength="50" required />
						</FormGroup>
						<FormGroup>
							<Label htmlFor="email">Email</Label>
							<Input type="email" onChange={handleSignupInputChange} name="email" maxLength="50" required />
						</FormGroup>
						<FormGroup>
							<Label htmlFor="password">Password</Label>
							<Input type="password" onChange={handleSignupInputChange} name="password" minLength="4" maxLength="50" required />
						</FormGroup>
						<FormGroup check className={styles.checkBox}>
        			<Input className={styles.tosCheck} type="checkbox" name="check" id="tosCheck" required/>
							<Label for="tosCheck" check>
								By clicking Sign Up, you agree to our <Link className={styles.link} to="/tos" target="_blank" rel="noopener noreferrer">Terms and Conditions</Link>
							</Label>
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