import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';

const EditTitleBtn = (props) => {
    let postId = parseInt(props.postId);
    const title = props.title; 
    const setPost = props.setPost;
    const [isTitleModalOpen, setTitleModal] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [titleData, setTitleData] = useState('');

    const toggleTitleModal = () => {
        setTitleModal(!isTitleModalOpen);
        setModalMsg('');
    };

    const handleTitleChange = (event) => {
        setTitleData(event.target.value);
    }

    const handleTitle = (event) => {
        event.preventDefault();
        console.log({postId: postId, title: titleData});
        if (!titleData) {
            setModalMsg('Please enter something :)');
        } else {
            (async () => {
                await AxiosApi.put('/post/title', {id: postId, title: titleData})
                .then(function (res) {
                    if (res.data.updated && res.status === 200) {
                        console.log(res.data);
                        toggleTitleModal();
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
            <Button className="far fa-edit" onClick={toggleTitleModal} />
            <Modal isOpen={isTitleModalOpen} toggle={toggleTitleModal}>
                <ModalHeader toggle={toggleTitleModal}>Edit post title</ModalHeader> 
                <ModalBody>
                    <Form onSubmit={handleTitle}>
                        <FormGroup>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" placeholder={title} onChange={handleTitleChange} name="title"/>
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Update!</Button>
                    </Form>
                    {modalMsg}          
                </ModalBody>             
            </Modal>
        </React.Fragment>
    )
}

export default EditTitleBtn;