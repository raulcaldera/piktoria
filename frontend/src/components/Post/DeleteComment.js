import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const DeleteCommentBtn = (props) => {
    let postId = parseInt(props.postId);
    let userId = parseInt(props.userId);
    let comment = props.comment;
    let setComment = props.setComment;
    let setCommentUpvotes = props.setCommentUpvotes;
    let setIsCommentUpvoted = props.setIsCommentUpvoted;
    let setPostComments = props.setPostComments;
    const [isDeleteModalOpen, setDeleteModal] = useState(false);

    const toggleDeleteModal = () => {
        setDeleteModal(!isDeleteModalOpen);
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
                } else {
                    console.log(res);
                }
            })
            .catch(function (error) { console.log(error) });  
        })();
    }  

    if (userId === comment.user.id) {
        return (
            <React.Fragment>
                <Button onClick={toggleDeleteModal}> Delete </Button><br></br>
                <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
                    <ModalHeader toggle={toggleDeleteModal}>Delete Comment</ModalHeader> 
                    <ModalBody>
                        Are you sure you want to delete this comment?
                        <Button onClick={handleDeletion}>Yes</Button>
                        <Button onClick={toggleDeleteModal}> No</Button>           
                    </ModalBody>               
                </Modal>
            </React.Fragment>
        )
    } else {
        return null;
    }
}

export default DeleteCommentBtn;