import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import React from 'react';
import RenderPost from '../Post/RenderPost';
import Comment from '../Post/CommentComponent';

const Post = (props) => { 
    let { postId } = useParams();
    const auth = props.auth;
    const user = props.user;  

    const userCommentUpvotes = JSON.parse(localStorage.getItem("userCommentUpvotes"));
    const userPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes"));

    return (
        <div className="container-fluid">
            <p>Post upvotes: {userPostUpvotes}</p>
            <p>Comment upvotes: {userCommentUpvotes}</p> 
            <div className="row align-items-start">
                <div className="PostSection col-12 col-md-6">   
                    <RenderPost user={user} auth={auth} postId={postId} userPostUpvotes={userPostUpvotes} />
                </div>                
            </div>
            <Comment user={user} auth={auth} postId={postId} userCommentUpvotes={userCommentUpvotes} />                                                 
        </div>                               
    )    
}

export default Post;