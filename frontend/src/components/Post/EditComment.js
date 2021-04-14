import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import styles from "./Post.module.css";

const EditCommentBtn = (props) => {
	const userId = parseInt(props.userId);
	const comment = props.comment;
	const setComment = props.setComment;
	const [isCommentModalOpen, setCommentModal] = useState(false);
	const [modalMsg, setModalMsg] = useState('');
	const [commentData, setCommentData] = useState('');

	const toggleCommentModal = () => {
		setCommentModal(!isCommentModalOpen);
		setModalMsg('');

	};

	const handleCommentChange = (event) => {
		setCommentData(event.target.value);
	}

	const handleComment = (event) => {
		event.preventDefault();
		if (!commentData) {
			setModalMsg('Please enter something :)');
		} else {
			(async () => {
				await AxiosApi.put('/comment/', {id: comment.id, comment: commentData})
				.then(function (res) {
					if (res.data.updated && res.status === 200) {
						setCommentData('');
						toggleCommentModal();
						(async () => {
							let commentData = await AxiosApi.get(`/comment/${comment.id}`).then(({ data }) => data);
							setComment([commentData]);
						})();
					} else {
						setModalMsg(res.data.msg);
					}
				})
				.catch(function (error) { 
					if (error.response.status === 401) {
						setModalMsg("Woops, looks like your session has expired. Please log in again to update this comment.");
					} else {
						setModalMsg("An error has ocurred :/");
					}
				}); 
			})();  
		}   
	}

	if (userId === comment.user.id) {
		return (
			<React.Fragment>
				<Button className={`far fa-edit ${styles.editCommentTitleBtn}`} onClick={toggleCommentModal} />
				<Modal className={styles.editCommentModal} contentClassName={styles.editCommentModalContent} isOpen={isCommentModalOpen} toggle={toggleCommentModal}>
				<ModalHeader className={styles.editCommentModalHeader} toggle={toggleCommentModal}>Edit comment</ModalHeader> 
				<ModalBody  className={styles.editCommentModalBody}>
					<Form className={styles.editCommentModalForm} onSubmit={handleComment}>
						<FormGroup>
							<Label htmlFor="body">Comment</Label>
							<Input className={styles.textarea} type="textarea" placeholder={comment.comment} onChange={handleCommentChange} name="body" maxLength="200" required/>
						</FormGroup>
						<div className={styles.editCommentModalFormBtnContainer}>
							<Button className={styles.editCommentModalFormBtn} type="submit" value="submit" color="primary">Update!</Button>
						</div>                    
					</Form>
					{modalMsg}          
				</ModalBody>             
			</Modal>
			</React.Fragment>
		)
	} else return null;

}

export default EditCommentBtn;