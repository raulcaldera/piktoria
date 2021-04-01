import React from 'react';
import { Route } from 'react-router-dom';
import Unauthorized from './UnauthorizedComponent';

export const PrivateRoute = ({ component: Component, params, ...rest }) => (
    <Route {...rest} render={(props) => (
        params.auth === true
        ? <Component {...props} user={params.user} />
        : <Unauthorized />
    )} />
  );    
