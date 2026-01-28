import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Redirect to login page and save the attempted location
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};