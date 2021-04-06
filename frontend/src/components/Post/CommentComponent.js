import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import RenderComment from './RenderComment';
import moment from 'moment-timezone';
import Pagination from '../Pagination';

const CommentForm = (props) => {
    const postId = parseInt(props.postId);
    const user = props.user; 
    const setPostComments = props.setPostComments;
    const auth = props.auth;

    const [commentData, setCommentData] = useState('');

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
                .catch(function (error) { console.log(error) });
            })();   
        }
    }

    if (auth) {
        return(
            <React.Fragment>
                <Form onSubmit={handleCommentPost}>
                    <FormGroup>
                        <Input type="textarea" placeholder="Post a comment..." onChange={handleCommentInputChange} name="comment"/>
                    </FormGroup>
                    <Button type="submit" value="submit" color="primary">Post</Button>
                </Form>
                <br></br>
            </React.Fragment>    
        ) 
    } else {
        return null; 
    }
}

const Comment = (props) => {
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    let setUserCommentUpvotes = props.setUserCommentUpvotes;
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
        <div className="CommentSection">
            <div className="CommentForm">
                <CommentForm postId={postId} user={user} setPostComments={setPostComments} auth={auth}/>         
            </div>
            {currentComments.map(comment => 
                <div key={comment.id}>
                    <RenderComment user={user} auth={auth} commentId={comment.id} postId={postId} userCommentUpvotes={userCommentUpvotes} setUserCommentUpvotes={setUserCommentUpvotes} setPostComments={setPostComments}/><br></br>
                </div>
            )}
            <div className="PaginationSection">
                <Pagination postsPerPage={commentsPerPage} totalPosts={postComments.length} paginate={paginate}/>
            </div>
        </div>                
)    
}

export default Comment;