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
    const [postUpvotes, setPostUpvotes] = useState([]);  

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
                    console.log(data.upvotes);
                    setPostUpvotes(data.upvotes);
                }
            })();
        } else {
            if (isMounted) {
                setPostUpvotes([]);
            }            
        }
        return () => { isMounted = false };
    }, [auth, user]);

    console.log(postUpvotes);

    return(
        <div>
            <Header auth={auth} setAuth={setAuth} user={user} setUser={setUser}/>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/post/:postId">
                    <Post />
                </Route>
                <Route exact path="/user/:userId">
                    <User />
                </Route>
                <PrivateRoute exact path='/profile/:userId' component={Profile} user={user} auth={auth} />
                <Route path="*">Not found</Route>
            </Switch> 
            <Footer />
        </div>               
    );
}

export default Main;
