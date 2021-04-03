import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';
import Unauthorized from '../UnauthorizedComponent';

const Profile = (props) => {
    let { userId } = useParams();
    const [posts, setPost] = useState([]);
    const userPostUpvotes = props.userPostUpvotes;
    const userCommentUpvotes = props.userCommentUpvotes;
    const setUserPostUpvotes = props.setUserPostUpvotes;
    const auth = props.auth;
    const user = props.user;    

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

    if (parseInt(userId) === parseInt(props.user.userId)) {
        return (
            <React.Fragment>
            <p>Post upvotes: {userPostUpvotes}</p>
            <p>Comment upvotes: {userCommentUpvotes}</p>  
                <p>Hello {user.username}, with Id {user.userId}!!</p>
                <div className="container-fluid">
                    <div className="row align-items-start">
                        <div className="PostSection">
                            {posts.map(post => 
                                <RenderPost key={post.id} user={user} auth={auth} postId={post.id} userPostUpvotes={userPostUpvotes} setUserPostUpvotes={setUserPostUpvotes} />
                            )}
                        </div>             
                    </div>                    
                </div>   
            </React.Fragment>
        ) 
    } else {
        return (
            <Unauthorized />
        )         
    }
}

export default Profile;