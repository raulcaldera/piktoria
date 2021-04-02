import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';

const User = (props) => {
    let { userId } = useParams();
    const [posts, setPost] = useState([]);
    const userPostUpvotes = props.userPostUpvotes;

    useEffect(() => {
        let isMounted = true;
        (async () => {
            let postData = await AxiosApi.get('/post/author/' + userId).then(({ data }) => data);
            if (isMounted) {
                setPost(postData);
            }
        })();

        return () => { isMounted = false };
    });

    return (
        <div className="container-fluid">
            <p>{userPostUpvotes}</p>
            <div className="row align-items-start">
                <div className="PostSection">
                    {posts.map(post => 
                        <RenderPost key={post.id} postId={post.id} />
                    )}
                </div>               
            </div>                    
        </div>    
    )    
}

export default User;