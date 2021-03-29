import React from 'react';
import Home from './Home/HomeComponent';
import Post from './Post/PostComponent';
import Profile from './Profile/ProfileComponent';
import User from './User/UserComponent';
import { Switch, Route } from 'react-router-dom';

const Main = () => {
    return(
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
    );
}

export default Main;