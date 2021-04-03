import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import React from 'react';
import RenderPost from '../Post/RenderPost';
import Comment from '../Post/CommentComponent';

const Post = (props) => { 
    let { postId } = useParams();
    const userPostUpvotes = props.userPostUpvotes;
    const setUserPostUpvotes = props.setUserPostUpvotes;
    const userCommentUpvotes = props.userCommentUpvotes;
    const setUserCommentUpvotes = props.setUserCommentUpvotes;
    const auth = props.auth;
    const user = props.user;  

    return (
        <div className="container-fluid">
            <p>Post upvotes: {userPostUpvotes}</p>
            <p>Comment upvotes: {userCommentUpvotes}</p> 
            <div className="row align-items-start">
                <div className="PostSection">   
                    <RenderPost user={user} auth={auth} postId={postId} userPostUpvotes={userPostUpvotes} setUserPostUpvotes={setUserPostUpvotes}/>
                </div>                
            </div>
            <div className="row align-items-start">
                <Comment user={user} auth={auth} postId={postId} userCommentUpvotes={userCommentUpvotes} setUserCommentUpvotes={setUserCommentUpvotes}/>                          
            </div>                       
        </div>                               
    )    
}

export default Post;