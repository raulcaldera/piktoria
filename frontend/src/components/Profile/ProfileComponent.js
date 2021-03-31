import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AxiosApi from '../AxiosApi';
import RenderPost from '../Post/RenderPost';

const Profile = (props) => {
    let { userId } = useParams();

    const [posts, setPost] = useState([]);

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
        <React.Fragment>
            <p>Hello {props.user.username}, with Id {props.user.userId}!!</p>
            <div className="container-fluid">
                <div className="row align-items-start">
                    <div className="PostSection">
                        {posts.map(post => 
                            <RenderPost key={post.id} postId={post.id} />
                        )}
                    </div>                
                </div>                    
            </div>   
        </React.Fragment>
    )    
}

export default Profile;