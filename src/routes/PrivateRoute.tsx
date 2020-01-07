import React from "react";
import {router} from "dva";
import {  RouteProps } from 'dva/router';
import User from '@/storage/User';

const {Route, Redirect} = router;

const AuthRouter:React.FC<RouteProps> = (props) => {
    return User.token?<Route {...props} /> : <Redirect to="/login" />
};

export default AuthRouter;
