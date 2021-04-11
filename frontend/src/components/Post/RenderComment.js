import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardSubtitle } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import { Link } from 'react-router-dom';
import EditCommentBtn from './EditComment';
import DeleteCommentBtn from './DeleteComment';
import styles from "./Post.module.css";
import { FadeLoader } from "react-spinners";


const RenderComment= (props) => {
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
            .catch(function (error) { console.log(error) });  
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
            .catch(function (error) { console.log(error) });  
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
            <div className="Comment">
                {comments.map(comment => 
                    <Card key={commentId} className={styles.commentCard}>
                        <CardBody className={styles.commentCardBody}>
                            <div className={styles.deletePost}>
                                <DeleteCommentBtn userId={user.userId} comment={comment} postId={postId} setComment={setComment} setCommentUpvotes={setCommentUpvotes} setIsCommentUpvoted={setIsCommentUpvoted} setPostComments={setPostComments}/>
                            </div>
                        </CardBody>
                        <CardBody className={styles.commentCardBody}>
                            <CardSubtitle tag="h6" className={`mb-2 text-muted" ${styles.commentCardAuthor}`}>
                                <Link to={`/user/${comment.user.id}`}>{comment.user.username}</Link>
                                <p className={styles.timestamp}>{comment.timestamp.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</p>
                            </CardSubtitle>
                        </CardBody>
                        <CardBody className={styles.commentCardBody}>
                            <div className={styles.commentCardComment}>
                                <span>
                                    {comment.comment}
                                    <EditCommentBtn userId={user.userId} comment={comment} setComment={setComment}/>
                                </span>
                            </div>
                        </CardBody>
                        <CardBody className={styles.commentCardCount}>
                            <div className={styles.commentCardCountContainer}>
                                <span>{commentUpvotes} <UpvoteBtn /> </span>
                            </div>
                        </CardBody>
                    </Card>
                )}                    
            </div>                   
        )    
    }
}

export default RenderComment;