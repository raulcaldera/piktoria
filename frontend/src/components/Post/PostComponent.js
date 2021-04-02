import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import React from 'react';
import RenderPost from '../Post/RenderPost';
import RenderComment from '../Post/RenderComment';

const Post = (props) => { 
    let { postId } = useParams();
    const userPostUpvotes = props.userPostUpvotes;

    return (
        <div className="container-fluid">
            <p>{userPostUpvotes}</p>
            <div className="row align-items-start">
                <div className="PostSection">   
                    <RenderPost postId={postId} />             
                </div>                
            </div>
            <div className="row align-items-start">
                <div className="CommentSection">   
                    <RenderComment postId={postId} />             
                </div>                
            </div>                       
        </div>                               
    )    
}

export default Post;