import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardBody, CardSubtitle, Modal, ModalHeader, ModalBody } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import styles from "./Post.module.css";
import { FadeLoader } from "react-spinners";

const RenderPost = (props) => {
    let postId = parseInt(props.postId);
    let userPostUpvotes = props.userPostUpvotes;
    let auth = props.auth;
    let user = props.user;  

    const [posts, setPost] = useState([]);
    const [postUpvotes, setPostUpvotes] = useState([]);
    const [postCommentCount, setPostComments] = useState([]);
    const [isPostUpvoted, setIsPostUpvoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpvoteModalOpen, setUpvoteModalOpen] = useState(false);

    const toggleUpvoteModal = () => {
        setUpvoteModalOpen(!isUpvoteModalOpen);
    };

    useEffect(() => {
        let isMounted = true;                    
        (async () => {
            setLoading(true);
            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);

            if (isMounted) {
                setPost([postData]);
                setPostComments(postCommentData.commentCount);
                setPostUpvotes(postUpvoteData.postUpvoteCount);
            }
            setLoading(false);
        })();

        if (isMounted) {
            if (userPostUpvotes?.includes(parseInt(postId))) {
                setIsPostUpvoted(true);
            } else {
                setIsPostUpvoted(false);
            }
        }

        return () => { isMounted = false };
    }, [postId,userPostUpvotes]);

    const handleDownvote = (event) => {
        event.preventDefault();
        console.log({postId: postId, userId: user.userId});
        (async () => {
            await AxiosApi.delete('/postupvotes/', {data: {postId: postId, userId: user.userId}})
            .then(function (res) {
                if (res.data.downvoted && res.status === 200) {
                    console.log(res.data);
                    (async () => {
                        let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);
                        setPostUpvotes(postUpvoteData.postUpvoteCount);
                        setIsPostUpvoted(false);
                        const newUserPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes")).filter((item) => item !== postId);
                        localStorage.setItem("userPostUpvotes", JSON.stringify(newUserPostUpvotes));
                    })();
                } else {
                    console.log(res);
                }
            })
            .catch(function (error) { 
                if (error.response.status === 401) {
                    console.log(error);
                    toggleUpvoteModal();
                } else {
                    console.log(error);
                }
            });
        })();      
    }

    const handleUpvote = (event) => {
        event.preventDefault();
        console.log({postId: postId, userId: user.userId});
        (async () => {
            await AxiosApi.post('/postupvotes/', {postId: postId, userId: user.userId})
            .then(function (res) {
                if (res.data.upvoted && res.status === 200) {
                    console.log(res.data);
                    (async () => {
                        let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);
                        setPostUpvotes(postUpvoteData.postUpvoteCount);
                        setIsPostUpvoted(true);
                        const newUserPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes"));
                        localStorage.setItem("userPostUpvotes", JSON.stringify([...newUserPostUpvotes, postId]));
                    })();
                } else {
                    console.log(res);
                }
            })
            .catch(function (error) { 
                if (error.response.status === 401) {
                    console.log(error);
                    toggleUpvoteModal();
                } else {
                    console.log(error);
                }
            });
        })();      
    }

    const UpvoteBtn = () => {
        if (auth) {
            if(isPostUpvoted) {
                return (
                    <i className={`fas fa-arrow-down fa-lg ${styles.upvoteBtnDown}`} onClick={handleDownvote}/>
                )
            } else {
                return (
                    <i className={`fas fa-arrow-up fa-lg ${styles.upvoteBtnUp}`} onClick={handleUpvote}/>
                )
            }
        } else {
            return <i className="fas fa-arrow-up fa-lg"/>;
        }
    }
    
    if (loading) {
        return (
            <FadeLoader loading height={15} width={5} radius={2} margin={2} color='grey'/>
        )
    } else {
        return (
            <div key={postId} className="Post">
                {posts.map(post => 
                    <React.Fragment key={postId}>
                        <Card key={postId} className={styles.postCard}>
                            <CardBody className={styles.postCardBody}>
                                <CardTitle tag="h5" className={styles.postCardTitle}>
                                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                                </CardTitle>
                                <CardSubtitle tag="h6" className={`mb-2 text-muted" ${styles.postCardAuthor}`}>
                                    By <Link to={`/user/${post.author.id}`}>{post.author.username} </Link>
                                    <p className={styles.timestamp}>{post.timestamp.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</p>
                                </CardSubtitle>
                            </CardBody>
                            <CardBody className={styles.postCardBody}>
                                <div width="100%">
                                    <a href={`/post/${post.id}`}>
                                        <img width="100%" max-height="auto" src={`http://localhost:3001/${post.body}`} alt={post.body}/> 
                                    </a>
                                </div>
                            </CardBody>
                            <CardBody className={styles.postCardCount}>
                                <div className={styles.postCardCountContainer}>
                                    <span>{postUpvotes} <UpvoteBtn /> </span>
                                    <span>{postCommentCount} <a href={`/post/${post.id}`}><i className="far fa-comment-alt fa-lg"></i></a></span>
                                </div>
                            </CardBody>
                        </Card>
                        <Modal isOpen={isUpvoteModalOpen} toggle={toggleUpvoteModal}>
                            <ModalHeader toggle={toggleUpvoteModal}>Woops</ModalHeader> 
                            <ModalBody>
                                Looks like your session has expired. Please log in again to upvote or downvote this post.          
                            </ModalBody>             
                        </Modal>
                    </React.Fragment>
                )}
            </div>                   
        )
    }
}

export default RenderPost;