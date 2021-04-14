import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import styles from "./Profile.module.css";

const EditTitleBtn = (props) => {
	const postId = parseInt(props.postId);
	const title = props.title; 
	const setPost = props.setPost;
	const [isTitleModalOpen, setTitleModal] = useState(false);
	const [modalMsg, setModalMsg] = useState('');
	const [titleData, setTitleData] = useState('');

	const toggleTitleModal = () => {
		setTitleModal(!isTitleModalOpen);
		setModalMsg('');
	};

	const handleTitleChange = (event) => {
		setTitleData(event.target.value);
	}

	const handleTitle = (event) => {
		event.preventDefault();
		if (!titleData) {
			setModalMsg('Please enter something :)');
		} else {
			(async () => {
				await AxiosApi.put('/post/title', {id: postId, title: titleData})
				.then(function (res) {
					if (res.data.updated && res.status === 200) {
						setTitleData('');
						toggleTitleModal();
						(async () => {
							let postData = await AxiosApi.get(`/post/${postId}`).then(({ data }) => data);
							setPost([postData]);
						})();
					} else {
						setModalMsg(res.data.msg);
					}
				})
				.catch(function (error) { 
					if (error.response.status === 401) {
						setModalMsg("Woops, looks like your session has expired. Please log in again to edit this post.");
					} else {
						setModalMsg("An error has ocurred :/");
					}
				});  
			})();  
		}   
	}  

	return (
		<React.Fragment>
			<Button className={`far fa-edit ${styles.editPostTitleBtn}`} onClick={toggleTitleModal} />
			<Modal className={styles.editPostTitleModal} contentClassName={styles.editPostTitleModalContent} isOpen={isTitleModalOpen} toggle={toggleTitleModal}>
				<ModalHeader className={styles.editPostTitleModalHeader} toggle={toggleTitleModal}>Edit post title</ModalHeader> 
				<ModalBody className={styles.editPostTitleModalBody}>
					<Form className={styles.editPostTitleModalForm} onSubmit={handleTitle}>
						<FormGroup>
							<Label htmlFor="title">Title</Label>
							<Input type="text" placeholder={title} onChange={handleTitleChange} name="title" maxLength="50" required/>
						</FormGroup>
						<div className={styles.editPostTitleModalFormBtnContainer}>
							<Button className={styles.editPostTitleModalFormBtn} type="submit" value="submit" color="primary">Update!</Button>
						</div>                    
					</Form>
					{modalMsg}          
				</ModalBody>             
			</Modal>
		</React.Fragment>
	)
}

export default EditTitleBtn;