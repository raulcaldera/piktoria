import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderProfilePost from './RenderProfilePost';
import Unauthorized from '../UnauthorizedComponent';
import moment from 'moment-timezone';
import Pagination from '../Pagination';

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
                            <Input type="text" onChange={handleNewPostTitleInputChange} name="title"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="body">Body</Label>
                            <Input type="file" onChange={handleNewPostFileInputChange} name="body" />
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
    const userPostUpvotes = props.userPostUpvotes;
    const userCommentUpvotes = props.userCommentUpvotes;
    const setUserPostUpvotes = props.setUserPostUpvotes;
    const auth = props.auth;
    const user = props.user;
    const [posts, setPost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

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

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (parseInt(userId) === parseInt(props.user.userId)) {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <p>Post upvotes: {userPostUpvotes}</p>
                    <p>Comment upvotes: {userCommentUpvotes}</p>  
                    <p>Hello {user.username}, with Id {user.userId}!!</p>
                    <div className="NewPost">
                        <NewPost userId={userId} setPost={setPost}/>     
                    </div>
                    <br></br>   
                    <div className="row align-items-start">
                        <div className="PostSection col-12 col-md-6">
                            {currentPosts.map(post => 
                                <RenderProfilePost key={post.id} user={user} auth={auth} postId={post.id} userPostUpvotes={userPostUpvotes} setUserPostUpvotes={setUserPostUpvotes} />
                            )}
                        </div>             
                    </div>
                    <div className="row align-items-start">
                        <div className="PaginationSection">
                            <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
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