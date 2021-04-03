import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderComment from './RenderComment';

const Comment = (props) => {
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    let setUserCommentUpvotes = props.setUserCommentUpvotes;
    const auth = props.auth;
    const user = props.user;  

    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        (async () => {
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            setPostComments(postCommentData.postComments);
        })();  
        
        
    }, [postId]);

    return (
        <div className="CommentSection">
                {postComments.map(comment => 
                    <div key={comment.id}>
                        <RenderComment user={user} auth={auth} commentId={comment.id} userCommentUpvotes={userCommentUpvotes} setUserCommentUpvotes={setUserCommentUpvotes} /><br></br>
                    </div>
                )}
        </div>                   
    )    
}

export default Comment;