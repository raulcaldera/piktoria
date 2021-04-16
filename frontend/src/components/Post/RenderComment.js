import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardSubtitle, Modal, ModalHeader, ModalBody, UncontrolledTooltip } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import { Link } from 'react-router-dom';
import EditCommentBtn from './EditComment';
import DeleteCommentBtn from './DeleteComment';
import styles from "./Post.module.css";
import { FadeLoader } from "react-spinners";

const RenderComment = (props) => {
	const commentId = props.commentId;
	const postId = props.postId;
	const userCommentUpvotes = props.userCommentUpvotes;
	const setPostComments = props.setPostComments;
	const auth = props.auth;
	const user = props.user; 
	const [comments, setComment] = useState([]);
	const [commentUpvotes, setCommentUpvotes] = useState();
	const [isCommentUpvoted, setIsCommentUpvoted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isUpvoteModalOpen, setUpvoteModalOpen] = useState(false);

	const toggleUpvoteModal = () => {
		setUpvoteModalOpen(!isUpvoteModalOpen);
	};

	useEffect(() => {
		let isMounted = true;    
		(async () => {
			setLoading(true); 
			let commentData = await AxiosApi.get(`/comment/${commentId}`).then(({ data }) => data);
			let commentUpvoteData = await AxiosApi.get(`/commentupvotes/comment/${commentId}`).then(({ data }) => data);

			if (isMounted) {
				setComment([commentData]);
				setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
			}
			setLoading(false);
		})();  
		
		if (isMounted) {
			if (userCommentUpvotes?.includes(parseInt(commentId))) {
				setIsCommentUpvoted(true);
			} else {
				setIsCommentUpvoted(false);
			}
		}

		return () => { isMounted = false };
	}, [commentId, userCommentUpvotes]);

	const handleDownvote = (event) => {
		event.preventDefault();
		(async () => {
			await AxiosApi.delete('/commentupvotes/', {data: {commentId: commentId, userId: user.userId}})
			.then(function (res) {
				if (res.data.downvoted && res.status === 200) {
					(async () => {
						let commentUpvoteData = await AxiosApi.get(`/commentupvotes/comment/${commentId}`).then(({ data }) => data);
						setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
						setIsCommentUpvoted(false);
						const newUserCommentUpvotes = userCommentUpvotes.filter((item) => item !== commentId);
						localStorage.setItem("userCommentUpvotes", JSON.stringify(newUserCommentUpvotes));
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
			await AxiosApi.post('/commentupvotes/', {commentId: commentId, userId: user.userId})
			.then(function (res) {
				if (res.data.upvoted && res.status === 200) {
					(async () => {
						let commentUpvoteData = await AxiosApi.get(`/commentupvotes/comment/${commentId}`).then(({ data }) => data);
						setCommentUpvotes(commentUpvoteData.commentUpvoteCount);
						setIsCommentUpvoted(true);
						const newUserCommentUpvotes = JSON.parse(localStorage.getItem("userCommentUpvotes"));
						localStorage.setItem("userCommentUpvotes", JSON.stringify([...newUserCommentUpvotes, commentId]));
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
			if(isCommentUpvoted) {
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

	if (loading) {
		return (
			<FadeLoader loading height={15} width={5} radius={2} margin={2} color='grey'/>
		)
	} else {
		return (
			<div className={styles.comment}>
				{comments.map(comment => 
					<React.Fragment key={commentId}>
						<Card key={commentId} className={`${styles.commentCard} ${styles.sb}`}>
							<CardBody className={styles.commentCardBody}>
								<CardSubtitle tag="h6" className={`mb-2 text-muted" ${styles.commentCardAuthor}`}>
									<Link className={styles.link} to={`/user/${comment.user.id}`}>{comment.user.username}</Link>
									<p className={styles.timestamp}>{comment.timestamp.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</p>
								</CardSubtitle>
							</CardBody>
							<CardBody className={styles.commentCardBody}>
								<div className={styles.commentCardComment}>
									<span>
										{comment.comment}
										<EditCommentBtn userId={user.userId} comment={comment} setComment={setComment}/>
										<DeleteCommentBtn 
											userId={user.userId} 
											comment={comment} 
											postId={postId} 
											setComment={setComment} 
											setCommentUpvotes={setCommentUpvotes} 
											setIsCommentUpvoted={setIsCommentUpvoted} 
											setPostComments={setPostComments}
										/>
									</span>
								</div>
							</CardBody>
							<CardBody className={styles.commentCardCount}>
								<div className={styles.commentCardCountContainer}>
									<span>{commentUpvotes} <UpvoteBtn /> </span>
								</div>
							</CardBody>
						</Card>
						<Modal className={styles.upvoteModal} contentClassName={styles.upvoteModalContent} isOpen={isUpvoteModalOpen} toggle={toggleUpvoteModal}>
							<ModalHeader className={styles.upvoteModalHeader} toggle={toggleUpvoteModal}>Woops</ModalHeader> 
							<ModalBody className={styles.upvoteModalBody}>
								Looks like your session has expired. Please log in again to upvote or downvote this comment.          
							</ModalBody>             
						</Modal>
					</React.Fragment>
				)}                    
			</div>                   
		)    
	}
}

export default RenderComment;