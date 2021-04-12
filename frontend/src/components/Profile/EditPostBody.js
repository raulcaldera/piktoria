import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import styles from "./Profile.module.css";

const EditBodyBtn = (props) => {
    let postId = parseInt(props.postId);
    const setPost = props.setPost;
    const [isBodyModalOpen, setBodyModal] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [imageData, setImageData] = useState({});

    const toggleBodyModal = () => {
        setBodyModal(!isBodyModalOpen);
        setModalMsg('');

    };

    const handleFileInputChange = (event) => {
        setImageData(event.target.files[0]);
    }

    
    const handleBody = (event) => {
        event.preventDefault();
        console.log({postId: postId, body: imageData});
        if (imageData.type !== "image/jpeg" && imageData.type !== "image/png" && imageData.type !== "image/gif") {
            setModalMsg('The image must be a png, jpg, or gif file');
        } else if (!imageData) {
            setModalMsg('Please upload something :)');
        } else {
            const formData = new FormData();
            formData.append('id', postId);
            formData.append('body', imageData);
            const config = {     
                headers: { 'content-type': 'multipart/form-data' }
            };
            (async () => {
                await AxiosApi.put('/post/body', formData, config)
                .then(function (res) {
                    if (res.data.updated && res.status === 200) {
                        console.log(res.data);
                        setImageData({});
                        toggleBodyModal();
                        (async () => {
                            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
                            setPost([postData]);
                        })();
                    } else {
                        setModalMsg(res.data.msg);
                    }
                })
                .catch(function (error) { 
                    if (error.response.status === 401) {
                        console.log(error);
                        setModalMsg("Woops, looks like your session has expired. Please log in again to edit this post.");
                    } else {
                        console.log(error);
                    }
                });
            })();  
        }   
    }  

    return (
        <React.Fragment>
            <Button className={`far fa-edit ${styles.editPostBodyBtn}`} onClick={toggleBodyModal} />
            <Modal className={styles.editPostBodyModal} contentClassName={styles.editPostBodyModalContent} isOpen={isBodyModalOpen} toggle={toggleBodyModal}>
                <ModalHeader className={styles.editPostBodyModalHeader} toggle={toggleBodyModal}>Edit post image</ModalHeader> 
                <ModalBody className={styles.editPostBodyModalBody}>
                    <Form className={styles.editPostBodyModalForm} onSubmit={handleBody}>
                        <FormGroup>
                        <Label htmlFor="body">Body</Label>
                            <Input type="file" onChange={handleFileInputChange} name="body" />
                        </FormGroup>
                        <div className={styles.editPostBodyModalFormBtnContainer}>
                            <Button className={styles.editPostBodyModalFormBtn} type="submit" value="submit" color="primary">Update!</Button>
                        </div>                    
                    </Form>
                    {modalMsg}          
                </ModalBody>             
            </Modal>
        </React.Fragment>
    )
}

export default EditBodyBtn;