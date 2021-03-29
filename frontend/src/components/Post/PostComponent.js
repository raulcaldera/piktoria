import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import React from 'react';
import RenderPost from '../Post/RenderPost';

const Post = () => { 
    let { postId } = useParams();

    return (
        <div className="container">
            <div className="row align-items-start">
                <div className="Posts">   
                    <RenderPost postId={postId} />             
                </div>                
            </div>                    
        </div>                               
    )    
}

export default Post;