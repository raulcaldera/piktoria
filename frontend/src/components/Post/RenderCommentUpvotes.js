import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';

const RenderCommentUpvotes = (props) => {
    let commentId = props.commentId;

    const [commentUpvotes, setCommentUpvotes] = useState();

    useEffect(() => {
        (async () => {
            let commentUpvotesData = await AxiosApi.get('/commentupvotes/comment/' + commentId).then(({ data }) => data);
            setCommentUpvotes(commentUpvotesData.commentUpvoteCount);
        })();     
    }, [commentId]);

    return (
        <div className="CommentUpvote">
            {commentUpvotes}
        </div>                   
    )    
}

export default RenderCommentUpvotes;