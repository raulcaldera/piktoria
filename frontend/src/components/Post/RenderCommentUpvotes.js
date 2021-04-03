import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import AxiosApi from '../AxiosApi';

const RenderCommentUpvotes = (props) => {
    let commentId = props.commentId;
    let userCommentUpvotes = props.userCommentUpvotes;
    const auth = props.auth;

    const [commentUpvotes, setCommentUpvotes] = useState();
    const [isCommentUpvoted, setIsCommentUpvoted] = useState(false);

    useEffect(() => {
        (async () => {
            let commentUpvotesData = await AxiosApi.get('/commentupvotes/comment/' + commentId).then(({ data }) => data);
            setCommentUpvotes(commentUpvotesData.commentUpvoteCount);

            if (userCommentUpvotes.includes(parseInt(commentId))) {
                setIsCommentUpvoted(true);
            } else {
                setIsCommentUpvoted(false);
            }
        })();     
    }, [commentId, userCommentUpvotes]);

    const UpvoteBtn = () => {
        if (auth) {
            if(isCommentUpvoted) {
                return (
                    <Button> Downvote </Button>
                )
            } else {
                return (
                    <Button> Upvote </Button>
                )
            }
        } else {
            return null;
        }
    }

    return (
        <div className="CommentUpvote">
            {commentUpvotes}
            <UpvoteBtn />
        </div>                   
    )    
}

export default RenderCommentUpvotes;