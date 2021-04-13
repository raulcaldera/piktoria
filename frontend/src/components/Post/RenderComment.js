import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardSubtitle, Modal, ModalHeader, ModalBody } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import { Link } from 'react-router-dom';
import EditCommentBtn from './EditComment';
import DeleteCommentBtn from './DeleteComment';
import styles from "./Post.module.css";
import { FadeLoader } from "react-spinners";


const RenderComment = (props) => {
    let commentId = props.commentId;
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    let setPostComments = props.setPostComments;
    let auth = props.auth;
    let user = props.user; 

    const [comments, setComment] = useState([]);
    const [commentUpvotes, setCommentUpvotes] = useState();
    const [isCommentUpvoted, setIsCommentUpvoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpvoteModalOpen, setUpvoteModalOpen] = useState(false);

    const toggleUpvoteModal = () => {
        setUpvoteModalOpen(!isUpvoteModalOpen);
    };

    useEffect(() => {
        let isMounted = true;    
        (async () => {
            setLoading(true); 
            let commentData = await AxiosApi.get('/comment/' + commentId).then(({ data }) => data);
            let commentUpvoteData = await AxiosApi.get('/commentupvotes/comment/' + commentId).then(({ data }) => data);

            if (isMounted) {
                setComment([commentData]);
                setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
            }
            setLoading(false);
        })();  
        
        if (isMounted) {
            if (userCommentUpvotes?.includes(parseInt(commentId))) {
                setIsCommentUpvoted(true);
            } else {
                setIsCommentUpvoted(false);
            }
        }

        return () => { isMounted = false };
    }, [commentId, userCommentUpvotes]);

    const handleDownvote = (event) => {
        event.preventDefault();
        console.log({commentId: commentId, userId: user.userId});
        (async () => {
            await AxiosApi.delete('/commentupvotes/', {data: {commentId: commentId, userId: user.userId}})
            .then(function (res) {
                if (res.data.downvoted && res.status === 200) {
                    console.log(res.data);
                    (async () => {
                        let commentUpvoteData = await AxiosApi.get('/commentupvotes/comment/' + commentId).then(({ data }) => data);
                        setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
                        setIsCommentUpvoted(false);
                        const newUserCommentUpvotes = userCommentUpvotes.filter((item) => item !== commentId);
                        localStorage.setItem("userCommentUpvotes", JSON.stringify(newUserCommentUpvotes));
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
        console.log({commentId: commentId, userId: user.userId});
        (async () => {
            await AxiosApi.post('/commentupvotes/', {commentId: commentId, userId: user.userId})
            .then(function (res) {
                if (res.data.upvoted && res.status === 200) {
                    console.log(res.data);
                    (async () => {
                        let commentUpvoteData = await AxiosApi.get('/commentupvotes/comment/' + commentId).then(({ data }) => data);
                        setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
                        setIsCommentUpvoted(true);
                        const newUserCommentUpvotes = JSON.parse(localStorage.getItem("userCommentUpvotes"));
                        localStorage.setItem("userCommentUpvotes", JSON.stringify([...newUserCommentUpvotes, commentId]));
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
            if(isCommentUpvoted) {
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
            <div className={styles.comment}>
                {comments.map(comment => 
                    <React.Fragment key={commentId}>
                        <Card key={commentId} className={`${styles.commentCard} ${styles.sb}`}>
                            <CardBody className={styles.commentCardBody}>
                                <CardSubtitle tag="h6" className={`mb-2 text-muted" ${styles.commentCardAuthor}`}>
                                    <Link className={styles.link} to={`/user/${comment.user.id}`}>{comment.user.username}</Link>
                                    <p className={styles.timestamp}>{comment.timestamp.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</p>
                                </CardSubtitle>
                            </CardBody>
                            <CardBody className={styles.commentCardBody}>
                                <div className={styles.commentCardComment}>
                                    <span>
                                        {comment.comment}
                                        <EditCommentBtn userId={user.userId} comment={comment} setComment={setComment}/>
                                        <DeleteCommentBtn userId={user.userId} comment={comment} postId={postId} setComment={setComment} setCommentUpvotes={setCommentUpvotes} setIsCommentUpvoted={setIsCommentUpvoted} setPostComments={setPostComments}/>
                                    </span>
                                </div>
                            </CardBody>
                            <CardBody className={styles.commentCardCount}>
                                <div className={styles.commentCardCountContainer}>
                                    <span>{commentUpvotes} <UpvoteBtn /> </span>
                                </div>
                            </CardBody>
                        </Card>
                        <Modal className={styles.upvoteModal} contentClassName={styles.upvoteModalContent} isOpen={isUpvoteModalOpen} toggle={toggleUpvoteModal}>
                            <ModalHeader className={styles.upvoteModalHeader} toggle={toggleUpvoteModal}>Woops</ModalHeader> 
                            <ModalBody className={styles.upvoteModalBody}>
                                Looks like your session has expired. Please log in again to upvote or downvote this comment.          
                            </ModalBody>             
                        </Modal>
                    </React.Fragment>
                )}                    
            </div>                   
        )    
    }
}

export default RenderComment;