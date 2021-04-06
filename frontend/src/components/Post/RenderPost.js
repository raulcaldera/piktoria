import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import AxiosApi from '../AxiosApi';

const RenderPost = (props) => {
    let postId = parseInt(props.postId);
    let userPostUpvotes = props.userPostUpvotes;
    let setUserPostUpvotes = props.setUserPostUpvotes;
    let auth = props.auth;
    let user = props.user;  

    const [posts, setPost] = useState([]);
    const [postUpvotes, setPostUpvotes] = useState([]);
    const [postCommentCount, setPostComments] = useState([]);
    const [isPostUpvoted, setIsPostUpvoted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;                    
        (async () => {
            setLoading(true);
            let postData = await AxiosApi.get('/post/' + postId).then(({ data }) => data);
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);

            if (isMounted) {
                setPost([postData]);
                setPostComments(postCommentData.commentCount);
                setPostUpvotes(postUpvoteData.postUpvoteCount);
            }
            setLoading(false);
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

    const handleDownvote = (event) => {
        event.preventDefault();
        console.log({postId: postId, userId: user.userId});
        (async () => {
            await AxiosApi.delete('/postupvotes/', {data: {postId: postId, userId: user.userId}})
            .then(function (res) {
                if (res.data.downvoted && res.status === 200) {
                    console.log(res.data);
                    (async () => {
                        let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);
                        setPostUpvotes(postUpvoteData.postUpvoteCount);
                        setIsPostUpvoted(false);
                        const newUserPostUpvotes = userPostUpvotes.filter((item) => item !== postId);
                        setUserPostUpvotes(newUserPostUpvotes);
                    })();
                } else {
                    console.log(res);
                }
            })
            .catch(function (error) { console.log(error) });  
        })();      
    }

    const handleUpvote = (event) => {
        event.preventDefault();
        console.log({postId: postId, userId: user.userId});
        (async () => {
            await AxiosApi.post('/postupvotes/', {postId: postId, userId: user.userId})
            .then(function (res) {
                if (res.data.upvoted && res.status === 200) {
                    console.log(res.data);
                    (async () => {
                        let postUpvoteData = await AxiosApi.get('/postupvotes/post/' + postId).then(({ data }) => data);
                        setPostUpvotes(postUpvoteData.postUpvoteCount);
                        setIsPostUpvoted(true);
                        setUserPostUpvotes([...userPostUpvotes, postId]);
                    })();
                } else {
                    console.log(res);
                }
            })
            .catch(function (error) { console.log(error) });  
        })();      
    }

    const UpvoteBtn = () => {
        if (auth) {
            if(isPostUpvoted) {
                return (
                    <Button onClick={handleDownvote}> Downvote </Button>
                )
            } else {
                return (
                    <Button onClick={handleUpvote}> Upvote </Button>
                )
            }
        } else {
            return null;
        }
    }
    
    if (loading) {
        return (
            <p1>Loading...</p1>
        )
    } else {
        return (
            <div key={postId} className="Post">
                {posts.map(post => 
                    <div key={postId}>
                        <Link to={`/post/${post.id}`}>Title: {post.title}</Link><br></br> 
                        Body: {post.body}<br></br> 
                        <Link to={`/user/${post.author.id}`}>Author: {post.author.username}</Link><br></br>
                        Timestamp: {post.timestamp}<br></br>
                        Upvotes: {postUpvotes}<br></br>
                        Comments: {postCommentCount}<br></br>
                        <UpvoteBtn />
                    </div>
                )}
                <p>----------------------</p>
            </div>                   
        )
    }
}

export default RenderPost;