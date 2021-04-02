import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderCommentUpvotes from '../Post/RenderCommentUpvotes';
import { Link } from 'react-router-dom';

const RenderComment = (props) => {
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    const auth = props.auth;

    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        (async () => {
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            setPostComments(postCommentData.postComments);
        })();  
        
        
    }, [postId]);

    return (
        <div className="Comment">
                {postComments.map(comment => 
                    <div key={comment.id}>
                        Comment: {comment.comment}<br></br> 
                        <Link to={`/user/${comment.user.id}`}>Author: {comment.user.username}</Link><br></br>
                        Timestamp: {comment.timestamp}<br></br>
                        Upvotes: <RenderCommentUpvotes auth={auth} commentId={comment.id} userCommentUpvotes={userCommentUpvotes} /><br></br>
                    </div>
                )}
        </div>                   
    )    
}

export default RenderComment;