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

    useEffect(() => {
        var localAuth = localStorage.getItem("auth");
        localAuth = (localAuth === 'true'); /*convert to boolean*/
        setAuth(localAuth);   

        var localUserId = localStorage.getItem("userId");     
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
                let data = await AxiosApi.get('/postupvotes/user/' + user.userId).then(({ data }) => data);
                if (isMounted) {
                    setUserPostUpvotes(handleUserPostUpvotes(data.upvotes)) 
                }
            })();
        } else {
            if (isMounted) {
                setUserPostUpvotes([]);
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

    return(
        <div>
            <Header auth={auth} setAuth={setAuth} user={user} setUser={setUser}/>
            <Switch>
                <Route exact path="/">
                    <Home userPostUpvotes={userPostUpvotes}/>
                </Route>
                <Route exact path="/post/:postId">
                    <Post userPostUpvotes={userPostUpvotes}/>
                </Route>
                <Route exact path="/user/:userId">
                    <User userPostUpvotes={userPostUpvotes}/>
                </Route>
                <PrivateRoute exact path='/profile/:userId' component={Profile} user={user} auth={auth} userPostUpvotes={userPostUpvotes}/>
                <Route path="*">Not found</Route>
            </Switch> 
            <Footer />
        </div>               
    );
}

export default Main;
