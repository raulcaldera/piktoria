import React from 'react';
import { Route } from 'react-router-dom';
import Unauthorized from './UnauthorizedComponent';

export const PrivateRoute = ({ component: Component, auth, user, userPostUpvotes, setUserPostUpvotes, userCommentUpvotes, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth === true
        ? <Component {...props} user={user} auth={auth} userPostUpvotes={userPostUpvotes} setUserPostUpvotes={setUserPostUpvotes} userCommentUpvotes={userCommentUpvotes} />
        : <Unauthorized />
    )} />
  );    
