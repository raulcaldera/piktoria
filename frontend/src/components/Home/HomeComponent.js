import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';

const Home = () => {
    const [posts, setPost] = useState([]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            let postData = await AxiosApi.get('/post').then(({ data }) => data);
            if (isMounted) {
                setPost(postData);
            }
        })();
        return () => { isMounted = false };
    });

    return (
        <div className="container-fluid">
            <div className="row align-items-start">
                <div className="PostSection">
                    {posts.map(post => 
                        <RenderPost key={post.id} postId={post.id} />
                    )}
                </div>                
            </div>                    
        </div>
    )    
}

export default Home;