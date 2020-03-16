import React from "react";
import {Route,Redirect} from "umi";
import {  RouteProps } from 'dva/router';
import User from '@/storage/User';

const AuthRouter:React.FC<RouteProps> = (props) => {
    return User.token?<Route {...props} /> : <Redirect to="/login" />
};

export default AuthRouter;
