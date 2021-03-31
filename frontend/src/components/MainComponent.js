import React, { useState, useEffect } from 'react';
import Home from './Home/HomeComponent';
import Post from './Post/PostComponent';
import Profile from './Profile/ProfileComponent';
import User from './User/UserComponent';
import Header from './Header/HeaderComponent';
import Footer from './Footer/FooterComponent';
import { Switch, Route } from 'react-router-dom';

const Main = () => {
    const [auth, setAuth] = useState(false); 

    useEffect(() => {
        var localAuth = localStorage.getItem("auth");
        localAuth = (localAuth === 'true'); /*convert to boolean*/
        setAuth(localAuth);   
    }, []);

    useEffect(() => {
        localStorage.setItem("auth", auth);
    }, [auth]);  

    return(
        <div>
            <Header auth={auth} setAuth={setAuth}/>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/post/:postId">
                    <Post />
                </Route>
                <Route exact path="/profile">
                    <Profile />
                </Route>
                <Route exact path="/user/:userId">
                    <User />
                </Route>
                <Route path="*">Not found</Route>
            </Switch> 
            <Footer />
        </div>               
    );
}

export default Main;
