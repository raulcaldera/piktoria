import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardTitle, CardBody, CardSubtitle } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import DeletePostBtn from './DeletePost';
import EditTitleBtn from './EditPostTitle';
import EditBodyBtn from './EditPostBody';

const RenderProfilePost = (props) => {
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
            return <span>Upvotes </span>;
        }
    }
    
    if (loading) {
        return (
            <div>
                <p>Loading...</p><br></br>
            </div>
        )
    } else {
        return (
            <div key={postId} className="Post">
                {posts.map(post => 
                    <Card key={postId}>
                        <CardBody> 
                            <DeletePostBtn postId={postId} userId={user.userId} setPost={setPost} setIsPostUpvoted={setIsPostUpvoted} setPostComments={setPostComments} setPostUpvotes={setPostUpvotes} />
                            <CardTitle tag="h5">
                                <span><Link to={`/post/${post.id}`}>{post.title}</Link> <EditTitleBtn postId={postId} title={post.title} setPost={setPost}/></span>
                            </CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                                <Link to={`/user/${post.author.id}`}>{post.author.username}</Link>
                            </CardSubtitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                                {post.timestamp}
                            </CardSubtitle>
                        </CardBody>
                        <CardBody>
                            <EditBodyBtn postId={postId} body={post.body} setPost={setPost}/>
                            <img width="100%" src={`http://localhost:3001/${post.body}`} alt={post.body}/> 
                        </CardBody>
                        <CardBody>
                            <span>{postUpvotes} <UpvoteBtn /> </span>
                            <span>{postCommentCount} Comments</span>
                        </CardBody>
                    </Card> 
                )}
            </div>                   
        )
    }
}

export default RenderProfilePost;