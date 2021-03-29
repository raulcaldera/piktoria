import axios from 'axios';
import React, { useState, useEffect } from 'react';

const api = axios.create({
    baseURL: `http://localhost:3001/`
  })

const Home = () => {
    const [posts, setPost] = useState([]);

    useEffect(() => {
        (async () => {
            let data = await api.get('/post').then(({ data }) => data);
            setPost(data);
        })();
    });

    return (
        <div className="container">
            <div className="row align-items-start">
                <div className="Posts">
                    {posts.map(post => 
                        <p key={post.id}>
                        Title: {post.title}<br></br> 
                        Body: {post.body}<br></br> 
                        Author: {post.author.username}<br></br>
                        Timestamp: {post.timestamp}<br></br>
                        </p>)}
                </div>                
            </div>                    
        </div>
    )    
}

export default Home;