import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';

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
                        toggleBodyModal();
                        (async () => {
                            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
                            setPost([postData]);
                        })();
                    } else {
                        console.log(res);
                    }
                })
                .catch(function (error) { console.log(error) });  
            })();  
        }   
    }  

    return (
        <React.Fragment>
            <Button onClick={toggleBodyModal}> Edit </Button>
            <Modal isOpen={isBodyModalOpen} toggle={toggleBodyModal}>
                <ModalHeader toggle={toggleBodyModal}>Edit post body</ModalHeader> 
                <ModalBody>
                    <Form onSubmit={handleBody}>
                        <FormGroup>
                        <Label htmlFor="body">Body</Label>
                            <Input type="file" onChange={handleFileInputChange} name="body" />
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Update!</Button>
                    </Form>
                    {modalMsg}          
                </ModalBody>             
            </Modal>
        </React.Fragment>
    )
}

export default EditBodyBtn;