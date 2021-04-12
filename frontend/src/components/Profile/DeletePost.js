import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import styles from "./Profile.module.css";

const DeletePostBtn = (props) => {
    let postId = parseInt(props.postId);
    let userId = parseInt(props.userId);
    const setPost = props.setPost;
    const setIsPostUpvoted = props.setIsPostUpvoted;
    const setPostComments = props.setPostComments;
    const setPostUpvotes = props.setPostUpvotes;
    const [isDeleteModalOpen, setDeleteModal] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    const toggleDeleteModal = () => {
        setDeleteModal(!isDeleteModalOpen);
        setModalMsg('');

    };
    
    const handleDeletion = (event) => {
        event.preventDefault();
        console.log(userId);
        (async () => {
            await AxiosApi.delete(`/post/${postId}`, {data: {postId: postId}})
            .then(function (res) {
                if (res.data.deleted && res.status === 200) {
                    console.log(res.data);
                    setPost([]);
                    setIsPostUpvoted(false);
                    setPostComments([]);
                    setPostUpvotes([]);
                } else {
                    setModalMsg(res.data.msg);
                }
                window.location.href=`/profile/${userId}`;
            })
            .catch(function (error) { 
                if (error.response.status === 401) {
                    console.log(error);
                    setModalMsg("Woops, looks like your session has expired. Please log in again to delete this post.");
                } else {
                    console.log(error);
                }
            });  
        })();      
    }  

    return (
        <React.Fragment>
            <Button className={`far fa-trash-alt ${styles.deletePostBtn}`} onClick={toggleDeleteModal} />
            <Modal className={styles.deletePostModal} contentClassName={styles.deletePostModalContent} isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Delete Post</ModalHeader> 
                <ModalBody>
                    <span>Are you sure you want to delete this post?</span>
                    <div className={styles.deletePostModalBtns}>
                        <Button className={styles.yesBtn} onClick={handleDeletion}>Yes</Button>
                        <Button className={styles.noBtn} onClick={toggleDeleteModal}> No</Button>   
                    </div>
                    {modalMsg}        
                </ModalBody>               
            </Modal>
        </React.Fragment>
    )
}

export default DeletePostBtn;