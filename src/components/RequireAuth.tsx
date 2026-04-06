import React, { JSX } from 'react'
import { useAuth } from './AuthProvider'
import { useAdminAuth } from './AdminAuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth: React.FC<{children: JSX.Element}> = ({children}) => {
    const {member} = useAuth();
    const {isAdmin} = useAdminAuth();
    const location = useLocation();
    if (!member && !isAdmin) {
        return <Navigate to="/login" state={{from: location}} replace />;
    }
    return children;
};

export default RequireAuth