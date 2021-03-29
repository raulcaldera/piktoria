import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';

const Home = () => {
    const [posts, setPost] = useState([]);

    useEffect(() => {
        (async () => {
            let postData = await AxiosApi.get('/post').then(({ data }) => data);
            setPost(postData);
        })();
    });

    return (
        <div className="container-fluid">
            <div className="row align-items-start">
                <div className="Posts">
                    {posts.map(post => 
                        <RenderPost postId={post.id} />
                    )}
                </div>                
            </div>                    
        </div>
    )    
}

export default Home;