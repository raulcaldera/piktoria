import React, { useState, useEffect } from 'react';
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';
import Pagination from '../Pagination/Pagination';
import styles from "./Home.module.css";

const Home = (props) => {
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
			let postData = await AxiosApi.get('/post').then(({ data }) => data);
			if (isMounted) {
				setPost(postData);
			}
		})();
		
		return () => { isMounted = false };
	},[]);

	return (
		<React.Fragment>
			<div className={`container-fluid ${styles.postsContainer}`}>  
				<div className="row align-items-start">
					<div className="postSection col-12 col-md-6 offset-md-3">
						{currentPosts.map(post => 
							<RenderPost key={post.id} user={user} auth={auth} post={post} userPostUpvotes={userPostUpvotes} />
						)}
					</div>          
				</div>                       
			</div>
			<div className={`container-fluid ${styles.paginationContainer}`}>
				<div className="row align-items-start">
					<div className={styles.pagination}>
						<Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
					</div>
				</div>
			</div>
		</React.Fragment>
	)    
}

export default Home;