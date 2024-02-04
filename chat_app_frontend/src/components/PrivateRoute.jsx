import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import useAuthService from '../hooks/useAuthService';

const PrivateRoute = ({children, redirectTo}) => {
    const authService = useAuthService();

    return (
        authService.isAuthenticated() ? children ? children : <Outlet/> : <Navigate to={redirectTo}/>
    )
};

export default PrivateRoute;