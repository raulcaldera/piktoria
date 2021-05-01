import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import RenderPost from '../Post/RenderPost';
import Comment from '../Post/CommentComponent';

const Post = (props) => { 
	const { postId } = useParams();
	const auth = props.auth;
	const user = props.user;
	const [posts, setPost] = useState([]);
	const userCommentUpvotes = JSON.parse(localStorage.getItem("userCommentUpvotes"));
	const userPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes"));

	useEffect(() => {
		let isMounted = true;
		(async () => {
			let postData = await AxiosApi.get(`/post/${postId}`).then(({ data }) => data);
			if (isMounted) {
				setPost(postData);
			}
		})();
		return () => { isMounted = false };
	}, [postId]);

	return (
		<div className="container-fluid">
			<div className="row align-items-start">
				<div className="PostSection col-12 col-md-6 offset-md-3">   
					{posts.map(post => 
						<RenderPost key={post.id} user={user} auth={auth} post={post} userPostUpvotes={userPostUpvotes} />
					)}
				</div>                
			</div>
			<Comment user={user} auth={auth} postId={postId} userCommentUpvotes={userCommentUpvotes} />
		</div>                               
	)    
}

export default Post;