import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderProfilePost from './RenderProfilePost';
import Unauthorized from '../UnauthorizedComponent';
import moment from 'moment-timezone';

const NewPost = (props) => {
    const userId = parseInt(props.userId); 
    const setPost = props.setPost;
    const [isNewPostModalOpen, setNewPostModal] = useState(false);
    const [newPostData, setNewPostData] = useState({ title: '', body: '' });
    const [modalMsg, setModalMsg] = useState('');

    const toggleNewPostModal = () => {
        setNewPostModal(!isNewPostModalOpen);
        setModalMsg('');
    };
    
    const handleNewPostInputChange = (event) => {
        setNewPostData({...newPostData, [event.target.name] : event.target.value});
    }

    const handleNewPost = (event) => {
        event.preventDefault();
        console.log({ title: newPostData.title, body: newPostData.body, authorId: userId, timestamp: moment().tz("Europe/Madrid").format("YYYY-MM-DDTHH:mm:ss")});
        if (!newPostData.title || !newPostData.body) {
            setModalMsg('Please enter all the fields :)');
        } else {
            (async () => {
                await AxiosApi.post('/post/', {title: newPostData.title, body: newPostData.body, authorId: userId, timestamp: moment().tz("Europe/Madrid").format("YYYY-MM-DDTHH:mm:ss") })
                .then(function (res) {
                    if (res.data.posted && res.status === 200) {
                        console.log(res.data);
                        toggleNewPostModal();
                        (async () => {
                            let postData = await AxiosApi.get('/post/author/' + userId).then(({ data }) => data);
                            setPost(postData);
                        })();
                    } else {
                        setModalMsg(res.data.msg);
                    }
                })
                .catch(function (error) { console.log(error) });
            })();      
        } 
    }  

    return (
        <React.Fragment>
            <Button onClick={toggleNewPostModal}>New Post</Button>
            <Modal isOpen={isNewPostModalOpen} toggle={toggleNewPostModal}>
                <ModalHeader toggle={toggleNewPostModal}>New Post</ModalHeader> 
                <ModalBody>
                    <Form onSubmit={handleNewPost}>
                        <FormGroup>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" onChange={handleNewPostInputChange} name="title"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="body">Body</Label>
                            <Input type="text" onChange={handleNewPostInputChange} name="body"/>
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Post!</Button>
                    </Form>
                    {modalMsg}          
                </ModalBody>               
            </Modal>
        </React.Fragment>

    )
}

const Profile = (props) => {
    let { userId } = useParams();
    const [posts, setPost] = useState([]);
    const userPostUpvotes = props.userPostUpvotes;
    const userCommentUpvotes = props.userCommentUpvotes;
    const setUserPostUpvotes = props.setUserPostUpvotes;
    const auth = props.auth;
    const user = props.user;    

    useEffect(() => {
        let isMounted = true;
        (async () => {
            let postData = await AxiosApi.get('/post/author/' + userId).then(({ data }) => data);
            if (isMounted) {
                setPost(postData);
            }
        })();

        return () => { isMounted = false };
    },[userId]);

    if (parseInt(userId) === parseInt(props.user.userId)) {
        return (
            <React.Fragment>
                <p>Post upvotes: {userPostUpvotes}</p>
                <p>Comment upvotes: {userCommentUpvotes}</p>  
                <p>Hello {user.username}, with Id {user.userId}!!</p>
                <div className="NewPost">
                    <NewPost userId={userId} setPost={setPost}/>     
                </div>
                <br></br>   
                <div className="container-fluid">
                    <div className="row align-items-start">
                        <div className="PostSection">
                            {posts.map(post => 
                                <RenderProfilePost key={post.id} user={user} auth={auth} postId={post.id} userPostUpvotes={userPostUpvotes} setUserPostUpvotes={setUserPostUpvotes} />
                            )}
                        </div>             
                    </div>                    
                </div>   
            </React.Fragment>
        ) 
    } else {
        return (
            <Unauthorized />
        )         
    }
}

export default Profile;