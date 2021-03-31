import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosApi from '../AxiosApi';

const RenderPost = (props) => {
    let postId = props.postId;

    const [posts, setPost] = useState([]);
    const [postUpvotes, setPostUpvotes] = useState([]);
    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        let isMounted = true;                    
        (async () => {
            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);
            
            if (isMounted) {
                setPost([postData]);
                setPostComments(postCommentData);
                setPostUpvotes(postUpvoteData);
            }
        })(); 
        return () => { isMounted = false };
    }, [postId]);

    return (
        <div className="Post">
            {posts.map(post => 
                <div key={postId}>
                    <Link to={`/post/${post.id}`}>Title: {post.title}</Link><br></br> 
                    Body: {post.body}<br></br> 
                    <Link to={`/user/${post.author.id}`}>Author: {post.author.username}</Link><br></br>
                    Timestamp: {post.timestamp}<br></br>
                    Upvotes: {postUpvotes.postUpvoteCount}<br></br>
                    Comments: {postComments.commentCount}<br></br>
                </div>
            )}
        </div>                   
    )    
}

export default RenderPost;