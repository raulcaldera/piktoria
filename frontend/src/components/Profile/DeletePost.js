import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const DeletePostBtn = (props) => {
    let postId = parseInt(props.postId);
    let userId = parseInt(props.userId);
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
                    console.log(res);
                }
                window.location.href=`/profile/${userId}`;
            })
            .catch(function (error) { console.log(error) });  
        })();      
    }  

    return (
        <React.Fragment>
            <Button className="far fa-trash-alt" onClick={toggleDeleteModal} />
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

export default DeletePostBtn;