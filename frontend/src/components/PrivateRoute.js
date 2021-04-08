import React from 'react';
import { Route } from 'react-router-dom';
import Unauthorized from './UnauthorizedComponent';

export const PrivateRoute = ({ component: Component, auth, user, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth === true
        ? <Component {...props} user={user} auth={auth} />
        : <Unauthorized />
    )} />
  );    
