import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import React from 'react';
import RenderPost from '../Post/RenderPost';
import RenderComment from '../Post/RenderComment';

const Post = (props) => { 
    let { postId } = useParams();
    const userPostUpvotes = props.userPostUpvotes;
    const userCommentUpvotes = props.userCommentUpvotes;
    const auth = props.auth;

    return (
        <div className="container-fluid">
            <p>Post upvotes: {userPostUpvotes}</p>
            <p>Comment upvotes: {userCommentUpvotes}</p> 
            <div className="row align-items-start">
                <div className="PostSection">   
                    <RenderPost auth={auth} postId={postId} userPostUpvotes={userPostUpvotes} />
                </div>                
            </div>
            <div className="row align-items-start">
                <div className="CommentSection">   
                    <RenderComment auth={auth} postId={postId} userCommentUpvotes={userCommentUpvotes} />             
                </div>                
            </div>                       
        </div>                               
    )    
}

export default Post;