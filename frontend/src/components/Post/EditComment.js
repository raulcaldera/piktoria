import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';

const EditCommentBtn = (props) => {
    let userId = parseInt(props.userId);
    let comment = props.comment;
    let setComment = props.setComment;

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
        console.log({id: comment.id, comment: commentData});
        if (!commentData) {
            setModalMsg('Please enter something :)');
        } else {
            (async () => {
                await AxiosApi.put('/comment/', {id: comment.id, comment: commentData})
                .then(function (res) {
                    if (res.data.updated && res.status === 200) {
                        console.log(res.data);
                        toggleCommentModal();
                        (async () => {
                            let commentData = await AxiosApi.get('/comment/' + comment.id).then(({ data }) => data);
                            setComment([commentData]);
                        })();
                    } else {
                        console.log(res);
                    }
                })
                .catch(function (error) { console.log(error) });  
            })();  
        }   
    }

    if (userId === comment.user.id) {
        return (
            <React.Fragment>
                <Button onClick={toggleCommentModal}> Edit </Button>
                <Modal isOpen={isCommentModalOpen} toggle={toggleCommentModal}>
                <ModalHeader toggle={toggleCommentModal}>Edit comment</ModalHeader> 
                <ModalBody>
                    <Form onSubmit={handleComment}>
                        <FormGroup>
                            <Label htmlFor="body">Comment</Label>
                            <Input type="text" placeholder={comment.comment} onChange={handleCommentChange} name="body"/>
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Update!</Button>
                    </Form>
                    {modalMsg}          
                </ModalBody>             
            </Modal>
            </React.Fragment>
        )
    } else {
        return null;
    }
}

export default EditCommentBtn;