import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosApi from '../AxiosApi';

const RenderPost = (props) => {
    let postId = props.postId;
    let userPostUpvotes = props.userPostUpvotes;
    const auth = props.auth;

    const [posts, setPost] = useState([]);
    const [postUpvotes, setPostUpvotes] = useState([]);
    const [postCommentCount, setPostComments] = useState([]);
    const [isPostUpvoted, setIsPostUpvoted] = useState(false);

    useEffect(() => {
        let isMounted = true;                    
        (async () => {
            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);

            
            if (isMounted) {
                setPost([postData]);
                setPostComments(postCommentData.commentCount);
                setPostUpvotes(postUpvoteData.postUpvoteCount);
            }
        })();

        if (isMounted) {
            if (userPostUpvotes.includes(parseInt(postId))) {
                setIsPostUpvoted(true);
            } else {
                setIsPostUpvoted(false);
            }
        }

        return () => { isMounted = false };
    }, [postId, userPostUpvotes]);

    const UpvoteHandler = () => {
        if (auth) {
            if(isPostUpvoted) {
                return (
                    <p>THIS POST IS UPVOTED!!!!</p>
                )
            } else {
                return (
                    <p>THIS POST IS NOT UPVOTED!!!!</p>
                )
            }
        } else {
            return null;
        }
    }

        return (
            <div className="Post">
                {posts.map(post => 
                    <div key={postId}>
                        <Link to={`/post/${post.id}`}>Title: {post.title}</Link><br></br> 
                        Body: {post.body}<br></br> 
                        <Link to={`/user/${post.author.id}`}>Author: {post.author.username}</Link><br></br>
                        Timestamp: {post.timestamp}<br></br>
                        Upvotes: {postUpvotes}<br></br>
                        Comments: {postCommentCount}<br></br>
                        <UpvoteHandler />
                        <p>----------------------</p>
                    </div>
                )}
            </div>                   
        )

}

export default RenderPost;