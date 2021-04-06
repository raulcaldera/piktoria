import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const DeleteBtn = (props) => {
    let postId = parseInt(props.postId);
    const setPost = props.setPost;
    const setIsPostUpvoted = props.setIsPostUpvoted;
    const setPostComments = props.setPostComments;
    const setPostUpvotes = props.setPostUpvotes;
    const [isDeleteModalOpen, setDeleteModal] = useState(false);
    
    const toggleDeleteModal = () => {
        setDeleteModal(!isDeleteModalOpen);
    };
    
    const handleDeletion = (event) => {
        event.preventDefault();
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
                    console.log(res);
                }
            })
            .catch(function (error) { console.log(error) });  
        })();      
    }  

    return (
        <React.Fragment>
            <Button onClick={toggleDeleteModal}> Delete </Button>
            <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Delete Post</ModalHeader> 
                <ModalBody>
                    Are you sure you want to delete this post?
                    <Button onClick={handleDeletion}>Yes</Button>
                    <Button onClick={toggleDeleteModal}> No</Button>           
                </ModalBody>               
            </Modal>
        </React.Fragment>
    )
}

export default DeleteBtn;