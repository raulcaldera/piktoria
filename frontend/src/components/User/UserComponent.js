import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';
import Pagination from '../Pagination';
import styles from "./User.module.css";

const User = (props) => {
    let { userId } = useParams();
    const auth = props.auth;
    const user = props.user;
    const [posts, setPost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);  
    
    const userCommentUpvotes = JSON.parse(localStorage.getItem("userCommentUpvotes"));
    const userPostUpvotes = JSON.parse(localStorage.getItem("userPostUpvotes"));

    useEffect(() => {
        let isMounted = true;
        (async () => {
            let postData = await AxiosApi.get('/post/author/' + userId).then(({ data }) => data);
            if (isMounted) {
                setPost(postData);
            }
        })();

        return () => { isMounted = false };
    },[userId]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <p>Post upvotes: {userPostUpvotes}</p>
            <p>Comment upvotes: {userCommentUpvotes}</p> 
            <div className="row align-items-start">
                <div className="PostSection col-12 col-md-6">
                    {currentPosts.map(post => 
                        <RenderPost key={post.id} user={user} auth={auth} postId={post.id} userPostUpvotes={userPostUpvotes}/>
                    )}
                </div>               
            </div>
            <div className="row align-items-start">   
                <div className={`PaginationSection ${styles.pagination}`}>
                    <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
                </div>  
            </div>                   
        </div>    
    )    
}

export default User;