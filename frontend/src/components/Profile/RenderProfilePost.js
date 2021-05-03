import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardBody, CardSubtitle, Modal, ModalHeader, ModalBody, UncontrolledTooltip } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import DeletePostBtn from './DeletePost';
import EditTitleBtn from './EditPostTitle';
import EditBodyBtn from './EditPostBody';
import styles from "./Profile.module.css";
import { FadeLoader } from "react-spinners";

const RenderProfilePost = (props) => {
	const postId = parseInt(props.post?.id);
	const userPostUpvotes = props.userPostUpvotes;
	const auth = props.auth;
	const user = props.user;
	const [post, setPost] = useState(props.post);
	const [postUpvotes, setPostUpvotes] = useState(post?.upvotes);
	const [postCommentCount, setPostComments] = useState(post?.commentCount);
	const [isPostUpvoted, setIsPostUpvoted] = useState(userPostUpvotes?.includes(parseInt(postId)));
	const [isUpvoteModalOpen, setUpvoteModalOpen] = useState(false);
	/*const [loading, setLoading] = useState(false);*/

	const toggleUpvoteModal = () => {
		setUpvoteModalOpen(!isUpvoteModalOpen);
	};

	useEffect(() => {
		let isMounted = true;                    
		if (isMounted) {
			setIsPostUpvoted(userPostUpvotes?.includes(parseInt(postId)));
		}
		return () => { isMounted = false };
	}, [postId, userPostUpvotes]);

	const handleDownvote = (event) => {
		event.preventDefault();
		(async () => {
			await AxiosApi.delete('/postupvotes/', {data: {postId: postId, userId: user.userId}})
			.then(function (res) {
				if (res.data.downvoted && res.status === 200) {
					(async () => {
						let postUpvoteData = await AxiosApi.get(`/postupvotes/post/${postId}`).then(({ data }) => data);
						setPostUpvotes(postUpvoteData.postUpvoteCount);
						setIsPostUpvoted(false);
						const newUserPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes")).filter((item) => item !== postId);
						localStorage.setItem("userPostUpvotes", JSON.stringify(newUserPostUpvotes));
					})();
				} else {
					console.log(res);
				}
			})
			.catch(function (error) { 
				if (error.response.status === 401) {
					toggleUpvoteModal();
				} else {
					console.log(error);
				}
			}); 
		})();      
	}

	const handleUpvote = (event) => {
		event.preventDefault();
		(async () => {
			await AxiosApi.post('/postupvotes/', {postId: postId, userId: user.userId})
			.then(function (res) {
				if (res.data.upvoted && res.status === 200) {
					(async () => {
						let postUpvoteData = await AxiosApi.get(`/postupvotes/post/${postId}`).then(({ data }) => data);
						setPostUpvotes(postUpvoteData.postUpvoteCount);
						setIsPostUpvoted(true);
						const newUserPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes"));
						localStorage.setItem("userPostUpvotes", JSON.stringify([...newUserPostUpvotes, postId]));
					})();
				} else {
					console.log(res);
				}
			})
			.catch(function (error) { 
				if (error.response.status === 401) {
					toggleUpvoteModal();
				} else {
					console.log(error);
				}
			});
		})();      
	}

	const UpvoteBtn = () => {
		if (auth) {
			if(isPostUpvoted) {
				return <i className={`fas fa-arrow-down fa-lg ${styles.upvoteBtnDown}`} onClick={handleDownvote}/>
			} else return <i className={`fas fa-arrow-up fa-lg ${styles.upvoteBtnUp}`} onClick={handleUpvote}/>
		} else {
			return (
				<React.Fragment>
					<i id="upvoteTooltip" className="fas fa-arrow-up fa-lg"/>
					<UncontrolledTooltip  placement="bottom" target="upvoteTooltip">
						You must be logged in to upvote
					</UncontrolledTooltip >
				</React.Fragment>
			)}
	}
	
	if (!post) {
		return <FadeLoader loading height={15} width={5} radius={2} margin={2} color='grey'/>
	}

	return (
		<div key={postId} className={styles.post}>
			<div key={postId}>
				<div className={styles.deletePost}>
					<DeletePostBtn postId={postId} userId={user.userId} setPost={setPost} setIsPostUpvoted={setIsPostUpvoted} setPostComments={setPostComments} setPostUpvotes={setPostUpvotes} />
				</div>
				<Card className={styles.postCard}>
					<CardBody className={styles.postCardBody}> 
						<CardTitle tag="h5" className={styles.postCardTitle}>
							<EditTitleBtn postId={postId} title={post.title} setPost={setPost}/>
							<Link className={styles.link} to={`/post/${post.id}`}>{post.title}</Link>
						</CardTitle>
						<CardSubtitle tag="h6" className={`mb-2 text-muted" ${styles.postCardAuthor}`}>
							By <Link className={styles.link} to={`/user/${post.author.id}`}>{post.author.username}</Link>
							<p className={styles.timestamp}>{post.timestamp.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</p>
						</CardSubtitle>
					</CardBody>
					<CardBody className={styles.postCardBody}>
						<div className={styles.editPostBody}>
							<EditBodyBtn postId={postId} body={post.body} setPost={setPost}/>
						</div>
						<Link to={`/post/${post.id}`}>
							<img width="100%" src={`${process.env.REACT_APP_BASE_URL}${post.body}`} alt={post.body}/> 
						</Link>
					</CardBody>
					<CardBody className={styles.postCardCount}>
						<div className={styles.postCardCountContainer}>
							<span>{postUpvotes} <UpvoteBtn /> </span>
							<span>{postCommentCount} <Link to={`/post/${post.id}`}><i className="far fa-comment-alt fa-lg"></i></Link></span>
						</div>
					</CardBody>
				</Card>
				<Modal className={styles.upvoteModal} contentClassName={styles.upvoteModalContent} isOpen={isUpvoteModalOpen} toggle={toggleUpvoteModal}>
					<ModalHeader className={styles.upvoteModalHeader} toggle={toggleUpvoteModal}>Woops</ModalHeader> 
					<ModalBody className={styles.upvoteModalBody}>
						Looks like your session has expired. Please log in again to upvote or downvote this post.          
					</ModalBody>             
				</Modal>
				<hr className={styles.postSeparator}></hr> 
			</div>
		</div>                   
	)
}

export default RenderProfilePost;