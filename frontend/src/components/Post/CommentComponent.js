import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import AxiosApi from '../AxiosApi';
import RenderComment from './RenderComment';

const Comment = (props) => {
    let postId = props.postId;
    let userCommentUpvotes = props.userCommentUpvotes;
    let setUserCommentUpvotes = props.setUserCommentUpvotes;
    const auth = props.auth;
    const user = props.user;  

    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        (async () => {
            let postCommentData = await AxiosApi.get('/comment/post/' + postId).then(({ data }) => data);
            setPostComments(postCommentData.postComments);
        })();  
    }, [postId]);

    const CommentForm = () => {
        if (auth) {
            return(
                <React.Fragment>
                    <Form>
                        <FormGroup>
                            <Input placeholder="Post a comment..." type="textarea" name="textarea"/>
                        </FormGroup>
                        <Button type="submit" value="submit" color="primary">Post</Button>
                    </Form>
                    <br></br>
                </React.Fragment>    
            ) 
        } else {
            return null; 
        }
    }

    return (
        <div className="CommentSection">
                <div className="CommentForm">
                    <CommentForm />         
                </div>
                {postComments.map(comment => 
                    <div key={comment.id}>
                        <RenderComment user={user} auth={auth} commentId={comment.id} userCommentUpvotes={userCommentUpvotes} setUserCommentUpvotes={setUserCommentUpvotes} /><br></br>
                    </div>
                )}
        </div>                 
    )    
}

export default Comment;