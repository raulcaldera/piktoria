import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import styles from "./Post.module.css";

const DeleteCommentBtn = (props) => {
    let postId = parseInt(props.postId);
    let userId = parseInt(props.userId);
    let comment = props.comment;
    let setComment = props.setComment;
    let setCommentUpvotes = props.setCommentUpvotes;
    let setIsCommentUpvoted = props.setIsCommentUpvoted;
    let setPostComments = props.setPostComments;
    const [isDeleteModalOpen, setDeleteModal] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    const toggleDeleteModal = () => {
        setDeleteModal(!isDeleteModalOpen);
        setModalMsg('');
    };
    
    const handleDeletion = (event) => {
        event.preventDefault();
        console.log(comment.id);
        (async () => {
            await AxiosApi.delete(`/comment/${comment.id}`)
            .then(function (res) {
                if (res.data.deleted && res.status === 200) {
                    console.log(res.data);
                    setComment([]);
                    setIsCommentUpvoted(false);
                    setCommentUpvotes([]);
                    (async () => {
                        let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
                        setPostComments(postCommentData.postComments);
                    })();
                    window.location.href=`/post/${postId}`;
                } else {
                    setModalMsg(res.data.msg);
                }
            })
            .catch(function (error) { 
                if (error.response.status === 401) {
                    console.log(error);
                    setModalMsg("Woops, looks like your session has expired. Please log in again to delete this comment.");
                } else {
                    console.log(error);
                }
            }); 
        })();
    }  

    if (userId === comment.user.id) {
        return (
            <React.Fragment>
                <Button className={`far fa-trash-alt ${styles.deletePostBtn}`} onClick={toggleDeleteModal} /><br></br>
                <Modal className={styles.deleteCommentModal} contentClassName={styles.deleteCommentModalContent} isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
                    <ModalHeader className={styles.deleteCommentModalHeader}  toggle={toggleDeleteModal}>Delete Comment</ModalHeader> 
                    <ModalBody className={styles.deleteCommentModalBody}>
                        <span>Are you sure you want to delete this comment?</span>
                        <div className={styles.deleteCommentModalBtns}>
                            <Button className={styles.yesBtn} onClick={handleDeletion}>Yes</Button>
                            <Button className={styles.noBtn} onClick={toggleDeleteModal}> No</Button>    
                        </div>
                        {modalMsg}       
                    </ModalBody>               
                </Modal>
            </React.Fragment>
        )
    } else {
        return null;
    }
}

export default DeleteCommentBtn;