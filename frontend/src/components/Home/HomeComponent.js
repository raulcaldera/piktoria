import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';

const Home = (props) => {
    const [posts, setPost] = useState([]);
    const userPostUpvotes = props.userPostUpvotes;
    const userCommentUpvotes = props.userCommentUpvotes;
    const setUserPostUpvotes = props.setUserPostUpvotes;
    const auth = props.auth;
    const user = props.user;    


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
            <p>Post upvotes: {userPostUpvotes}</p>
            <p>Comment upvotes: {userCommentUpvotes}</p>  
            <div className="row align-items-start">
                <div className="PostSection">
                    {posts.map(post => 
                        <RenderPost key={post.id} user={user} auth={auth} postId={post.id} userPostUpvotes={userPostUpvotes} setUserPostUpvotes={setUserPostUpvotes}/>
                    )}
                </div>              
            </div>                    
        </div>
    )    
}

export default Home;