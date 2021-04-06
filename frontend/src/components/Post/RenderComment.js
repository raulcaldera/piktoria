import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import { Link } from 'react-router-dom';
import EditCommentBtn from './EditComment';
import DeleteCommentBtn from './DeleteComment';

const RenderComment= (props) => {
    let commentId = props.commentId;
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    let setUserCommentUpvotes = props.setUserCommentUpvotes;
    let setPostComments = props.setPostComments;
    let auth = props.auth;
    let user = props.user; 

    const [comments, setComment] = useState([]);
    const [commentUpvotes, setCommentUpvotes] = useState();
    const [isCommentUpvoted, setIsCommentUpvoted] = useState(false);

    useEffect(() => {
        let isMounted = true;     
        (async () => {
            let commentData = await AxiosApi.get('/comment/' + commentId).then(({ data }) => data);
            let commentUpvoteData = await AxiosApi.get('/commentupvotes/comment/' + commentId).then(({ data }) => data);

            if (isMounted) {
                setComment([commentData]);
                setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
            }
        })();  
        
        if (isMounted) {
            if (userCommentUpvotes.includes(parseInt(commentId))) {
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
                        setUserCommentUpvotes(newUserCommentUpvotes);
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
                        setUserCommentUpvotes([...userCommentUpvotes, commentId]);
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
                    <Button onClick={handleDownvote}> Downvote </Button>
                )
            } else {
                return (
                    <Button onClick={handleUpvote}> Upvote </Button>
                )
            }
        } else {
            return null;
        }
    }

    return (
        <div className="Comment">
            {comments.map(comment => 
                <div key={commentId}>
                    <DeleteCommentBtn userId={user.userId} comment={comment} postId={postId} setComment={setComment} setCommentUpvotes={setCommentUpvotes} setIsCommentUpvoted={setIsCommentUpvoted} setPostComments={setPostComments}/> 
                    Comment: {comment.comment}<span> </span><EditCommentBtn userId={user.userId} comment={comment} setComment={setComment}/><br></br> 
                    <Link to={`/user/${comment.user.id}`}>Author: {comment.user.username}</Link><br></br>
                    Timestamp: {comment.timestamp}<br></br>
                    Upvotes: {commentUpvotes}<br></br>
                    <UpvoteBtn />
                </div>
             )}                    
        </div>                   
    )    
}

export default RenderComment;