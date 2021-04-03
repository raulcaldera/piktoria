import React, { useState, useEffect } from 'react';
import Home from './Home/HomeComponent';
import Post from './Post/PostComponent';
import Profile from './Profile/ProfileComponent';
import User from './User/UserComponent';
import Header from './Header/HeaderComponent';
import Footer from './Footer/FooterComponent';
import { PrivateRoute } from './PrivateRoute';
import { Switch, Route } from 'react-router-dom';
import AxiosApi from './AxiosApi';

const Main = () => {
    const [auth, setAuth] = useState(false); 
    const [user, setUser] = useState({userId: '', username: ''});
    const [userPostUpvotes, setUserPostUpvotes] = useState([]);
    const [userCommentUpvotes, setUserCommentUpvotes] = useState([]);    

    useEffect(() => {
        var localAuth = localStorage.getItem("auth");
        localAuth = (localAuth === 'true'); /*convert to boolean*/
        setAuth(localAuth);   

        var localUserId = parseInt(localStorage.getItem("userId"));     
        var localUsername = localStorage.getItem("username");
        setUser({userId: localUserId, username: localUsername}); 
    
    }, []);

    useEffect(() => {
        localStorage.setItem("auth", auth);
        localStorage.setItem("userId", user.userId);
        localStorage.setItem("username", user.username);

        let isMounted = true;
        if (user.userId) {
            (async () => {
                let postUpvoteData = await AxiosApi.get('/postupvotes/user/' + user.userId).then(({ data }) => data);
                let commentUpvoteData = await AxiosApi.get('/commentupvotes/user/' + user.userId).then(({ data }) => data);
                if (isMounted) {
                    setUserPostUpvotes(handleUserPostUpvotes(postUpvoteData.upvotes));
                    setUserCommentUpvotes(handleUserCommentUpvotes(commentUpvoteData.upvotes));
                }
            })();
        } else {
            if (isMounted) {
                setUserPostUpvotes([]);
                setUserCommentUpvotes([]);
            }            
        }
        return () => { isMounted = false };
    }, [auth, user]);

    const handleUserPostUpvotes = (upvotes) => {
        let upvotedPostIds = [];
        upvotes.map(postUpvote => 
            upvotedPostIds = [...upvotedPostIds, postUpvote.post.id]
        );
        return upvotedPostIds;
    }

    const handleUserCommentUpvotes = (upvotes) => {
        let upvotedCommentIds = [];
        upvotes.map(commentUpvote => 
            upvotedCommentIds = [...upvotedCommentIds, commentUpvote.comment.id]
        );
        return upvotedCommentIds;
    }

    return(
        <div>
            <Header 
                auth={auth} 
                setAuth={setAuth} 
                user={user} 
                setUser={setUser} 
                setUserPostUpvotes={setUserPostUpvotes} 
                setUserCommentUpvotes={setUserCommentUpvotes}
            />
            <Switch>
                <Route exact path="/">
                    <Home 
                        user={user} 
                        auth={auth} 
                        userPostUpvotes={userPostUpvotes} 
                        setUserPostUpvotes={setUserPostUpvotes} 
                        userCommentUpvotes={userCommentUpvotes}
                     />
                </Route>
                <Route exact path="/post/:postId">
                    <Post 
                        user={user} 
                        auth={auth} 
                        userPostUpvotes={userPostUpvotes} 
                        setUserPostUpvotes={setUserPostUpvotes} 
                        userCommentUpvotes={userCommentUpvotes}
                        setUserCommentUpvotes={setUserCommentUpvotes} 
                    />
                </Route>
                <Route exact path="/user/:userId">
                    <User 
                        user={user} 
                        auth={auth} 
                        userPostUpvotes={userPostUpvotes} 
                        setUserPostUpvotes={setUserPostUpvotes} 
                        userCommentUpvotes={userCommentUpvotes}
                    />
                </Route>
                <PrivateRoute exact path='/profile/:userId' component={Profile}
                    user={user} 
                    auth={auth} 
                    userPostUpvotes={userPostUpvotes}  
                    setUserPostUpvotes={setUserPostUpvotes} 
                    userCommentUpvotes={userCommentUpvotes}
                />
                <Route path="*">Not found</Route>
            </Switch> 
            <Footer />
        </div>               
    );
}

export default Main;
