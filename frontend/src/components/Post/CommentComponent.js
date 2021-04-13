import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import RenderComment from './RenderComment';
import moment from 'moment-timezone';
import Pagination from '../Pagination/Pagination';
import styles from "./Post.module.css";

const CommentForm = (props) => {
    const postId = parseInt(props.postId);
    const user = props.user; 
    const setPostComments = props.setPostComments;
    const auth = props.auth;

    const [commentData, setCommentData] = useState('');
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);

    const toggleCommentModal = () => {
        setCommentModalOpen(!isCommentModalOpen);
    };

    const handleCommentInputChange = (event) => {
        setCommentData(event.target.value);
    }
    
    const handleCommentPost = (event) => {
        event.preventDefault();
        console.log({ comment: commentData, postId: postId, userId: user.userId, timestamp: moment().tz("Europe/Madrid").format("YYYY-MM-DDTHH:mm:ss") });
        if (commentData) {
            (async () => {
                await AxiosApi.post('/comment/', { comment: commentData, postId: postId, userId: user.userId, timestamp: moment().tz("Europe/Madrid").format("YYYY-MM-DDTHH:mm:ss") })
                .then(function (res) {
                    if (res.data.posted && res.status === 200) {
                        console.log(res.data);
                        (async () => {
                            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
                            setPostComments(postCommentData.postComments);
                        })();
                        setCommentData('');
                    } else {
                        console.log(res);
                    }
                })
                .catch(function (error) { 
                    if (error.response.status === 401) {
                        console.log(error);
                        toggleCommentModal();
                    } else {
                        console.log(error);
                    }
                });
            })();   
        }
    }

    if (auth) {
        return(
            <React.Fragment>
                <Form onSubmit={handleCommentPost}>
                    <FormGroup>
                        <Input className={styles.textarea} type="textarea" placeholder="Post a comment..." onChange={handleCommentInputChange} name="comment" maxLength="200" required/>
                    </FormGroup>
                    <div className={styles.postCommentBtnContainer}>
                        <Button className={styles.postCommentBtn} type="submit" value="submit" color="primary">Post</Button>
                    </div>
                </Form>
                <Modal className={styles.commentModal} contentClassName={styles.commentModalContent} isOpen={isCommentModalOpen} toggle={toggleCommentModal}>
                    <ModalHeader className={styles.commentModalHeader} toggle={toggleCommentModal}>Woops</ModalHeader> 
                    <ModalBody className={styles.commentModalBody}>
                        Looks like your session has expired. Please log in again to post a comment.          
                    </ModalBody>             
                </Modal>
            </React.Fragment>    
        ) 
    } else {
        return null; 
    }
}

const Comment = (props) => {
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    const auth = props.auth;
    const user = props.user; 
    const [postComments, setPostComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPerPage] = useState(5);

    useEffect(() => {
        let isMounted = true;  
        (async () => {
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            if (isMounted) {
                setPostComments(postCommentData.postComments);
            }
        })();
        return () => { isMounted = false };  
    }, [postId]);

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = postComments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <React.Fragment>
            <div className="row align-items-start">
                <div className="CommentSection col-12 col-md-6 offset-md-3">
                    <div className={styles.commentForm}>
                        <CommentForm postId={postId} user={user} setPostComments={setPostComments} auth={auth}/>         
                    </div>
                    <hr className={styles.postSeparator}></hr>
                    {currentComments.map(comment => 
                        <RenderComment key={comment.id} user={user} auth={auth} commentId={comment.id} postId={postId} userCommentUpvotes={userCommentUpvotes} setPostComments={setPostComments}/>
                    )}
                </div> 
            </div>
            <div className="row align-items-start">
                <div className={`PaginationSection ${styles.pagination}`}>
                    <Pagination currentPage={currentPage} postsPerPage={commentsPerPage} totalPosts={postComments.length} paginate={paginate}/>
                </div>  
            </div>
        </React.Fragment>          
)    
}

export default Comment;