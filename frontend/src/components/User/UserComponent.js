import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';

const User = () => {
    let { userId } = useParams();

    const [posts, setPost] = useState([]);

    useEffect(() => {
        (async () => {
            let postData = await AxiosApi.get('/post/author/' + userId).then(({ data }) => data);
            setPost(postData);
        })();
    });

    return (
        <div className="container-fluid">
            <div className="row align-items-start">
                <div className="PostSection">
                    {posts.map(post => 
                        <RenderPost postId={post.id} />
                    )}
                </div>                
            </div>                    
        </div>    
    )    
}

export default User;