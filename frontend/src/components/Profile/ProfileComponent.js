import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderProfilePost from './RenderProfilePost';
import NewPost from './NewPost';
import Unauthorized from '../UnauthorizedComponent';
import Pagination from '../Pagination/Pagination';
import styles from "./Profile.module.css";

const Profile = (props) => {
	const { userId } = useParams();
	const userPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes"));
	const auth = props.auth;
	const user = props.user;
	const [posts, setPost] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(5);
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			let postData = await AxiosApi.get(`/post/author/${userId}`).then(({ data }) => data);
			if (isMounted) {
				setPost(postData);
			}
		})();

		return () => { isMounted = false };
	},[userId]);

	if (parseInt(userId) === parseInt(props.user.userId)) {
		return (
			<React.Fragment>
				<div className={`container-fluid ${styles.postsContainer}`}>
					<div className="row align-items-start">
						<div className="PostSection col-12 col-md-6 offset-md-3">
							<div>
								<p className={styles.greeting}>Hello {user.username}!</p>
							</div>                    
							<div className={styles.newPost}>
								<NewPost userId={userId} setPost={setPost}/>     
							</div>
						</div>
					</div>
					<div className="row align-items-start">
						<div className="PostSection col-12 col-md-6 offset-md-3">
							{currentPosts.map(post => 
								<RenderProfilePost key={post.id} user={user} auth={auth} post={post} userPostUpvotes={userPostUpvotes} />
							)}
						</div>             
					</div>                 
				</div>  
				<div className={`container-fluid ${styles.paginationContainer}`}>
					<div className="row align-items-start">
						<div className={`PaginationSection ${styles.pagination}`}>
							<Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
						</div>  
					</div> 
				</div> 
			</React.Fragment>
		) 
	} else return <Unauthorized />         
}

export default Profile;