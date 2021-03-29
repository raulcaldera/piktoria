import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';

const RenderPost = (props) => {
    let postId = props.postId;

    const [posts, setPost] = useState([]);
    const [postUpvotes, setPostUpvotes] = useState([]);
    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        (async () => {
            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
            setPost([postData]);
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            setPostComments(postCommentData);
            let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);
            setPostUpvotes(postUpvoteData);
        })();     
    }, [postId]);

    return (
        <div className="Post">
            {posts.map(post => 
                <p key={postId}>
                    <a href={`/post/${post.id}`}>Title: {post.title}</a><br></br> 
                    Body: {post.body}<br></br> 
                    Author: {post.author.username}<br></br>
                    Timestamp: {post.timestamp}<br></br>
                    Upvotes: {postUpvotes.postUpvoteCount}<br></br>
                    Comments: {postComments.commentCount}<br></br>
                </p>
            )}
        </div>                           
    )    
}

export default RenderPost;