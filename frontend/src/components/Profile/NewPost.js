import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import moment from 'moment-timezone';
import styles from "./Profile.module.css";

const NewPost = (props) => {
    const userId = parseInt(props.userId); 
    const setPost = props.setPost;
    const [isNewPostModalOpen, setNewPostModal] = useState(false);
    const [newPostTitleData, setNewPostTitleData] = useState('');
    const [newPostImageData, setNewPostImageData] = useState({});
    const [modalMsg, setModalMsg] = useState('');

    const toggleNewPostModal = () => {
        setNewPostModal(!isNewPostModalOpen);
        setModalMsg('');
        setNewPostTitleData('');
        setNewPostImageData({});
    };
    
    const handleNewPostTitleInputChange = (event) => {
        setNewPostTitleData(event.target.value);
    }

    const handleNewPostFileInputChange = (event) => {
        setNewPostImageData(event.target.files[0]);
    }

    const handleNewPost = (event) => {
        event.preventDefault();
        if (!newPostTitleData|| !newPostImageData) {
            setModalMsg('Please enter all the fields :)');
        } else if (newPostImageData.type !== "image/jpeg" && newPostImageData.type !== "image/png" && newPostImageData.type !== "image/gif") {
            setModalMsg('The image must be a png, jpg, or gif file');
        } else {
            const formData = new FormData();
            formData.append('title', newPostTitleData);
            formData.append('body', newPostImageData);
            formData.append('authorId', userId);
            formData.append('timestamp', moment().tz("Europe/Madrid").format("YYYY-MM-DDTHH:mm:ss"));
            const config = {     
                headers: { 'content-type': 'multipart/form-data' }
            };
            (async () => {
                await AxiosApi.post('/post/', formData, config)
                .then(function (res) {
                    if (res.data.posted && res.status === 200) {
                        console.log(res.data);
                        setNewPostTitleData('');
                        setNewPostImageData({});
                        toggleNewPostModal();
                        (async () => {
                            let postData = await AxiosApi.get('/post/author/' + userId).then(({ data }) => data);
                            setPost(postData);
                        })();
                    } else {
                        setModalMsg(res.data.msg);
                    }
                })
                .catch(function (error) { 
                    if (error.response.status === 401) {
                        console.log(error);
                        setModalMsg("Woops, looks like your session has expired. Please log in again to create this post.");
                    } else {
                        console.log(error);
                    }
                });
            })(); 
        } 
    } 

    return (
        <React.Fragment>
                <Button className={styles.newPostBtn} onClick={toggleNewPostModal}>New Post</Button>
            <Modal className={styles.newPostModal} contentClassName={styles.newPostModalContent} isOpen={isNewPostModalOpen} toggle={toggleNewPostModal}>
                <ModalHeader className={styles.newPostModalHeader} toggle={toggleNewPostModal}>New Post</ModalHeader> 
                <ModalBody className={styles.newPostModalBody}>
                    <Form className={styles.newPostModalForm} onSubmit={handleNewPost}>
                        <FormGroup>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" onChange={handleNewPostTitleInputChange} name="title"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="body">Image</Label>
                            <Input type="file" onChange={handleNewPostFileInputChange} name="body" />
                        </FormGroup>
                        <div className={styles.newPostModalFormBtnContainer}>
                            <Button className={styles.newPostModalFormBtn} type="submit" value="submit" color="primary">Post!</Button>
                        </div>                    
                    </Form>
                    {modalMsg}          
                </ModalBody>               
            </Modal>
        </React.Fragment>

    )
}

export default NewPost;