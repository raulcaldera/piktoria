import React, { useState } from 'react';
import AxiosApi from '../AxiosApi';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';

const EditBodyBtn = (props) => {
    let postId = parseInt(props.postId);
    const body = props.body; 
    const setPost = props.setPost;
    const [isBodyModalOpen, setBodyModal] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [bodyData, setBodyData] = useState('');

    const toggleBodyModal = () => {
        setBodyModal(!isBodyModalOpen);
        setModalMsg('');

    };

    const handleBodyChange = (event) => {
        setBodyData(event.target.value);
    }

    
    const handleBody = (event) => {
        event.preventDefault();
        console.log({postId: postId, body: bodyData});
        if (!bodyData) {
            setModalMsg('Please enter something :)');
        } else {
            (async () => {
                await AxiosApi.put('/post/body', {id: postId, body: bodyData})
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
                            <Input type="text" placeholder={body} onChange={handleBodyChange} name="body"/>
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