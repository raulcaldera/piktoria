import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderCommentUpvotes from '../Post/RenderCommentUpvotes';

const RenderComment = (props) => {
    let postId = props.postId;

    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        (async () => {
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            await setPostComments(postCommentData.postComments);
        })();     
    }, [postId]);
    return (
        <div className="Comment">
                {postComments.map(comment => 
                    <div key={comment.id}>
                        Comment: {comment.comment}<br></br> 
                        Author: {comment.user.username}<br></br>
                        Timestamp: {comment.timestamp}<br></br>
                        Upvotes: <RenderCommentUpvotes commentId={comment.id} /><br></br>
                    </div>
                )}
        </div>                   
    )    
}

export default RenderComment;