// RoleBasedRoute.jsx — Auth + role guard

import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !authService.hasRole(allowedRoles)) {
    const user = authService.getCurrentUser();
    const redirect = user?.role === 'customer' ? '/portal' : '/dashboard';
    return <Navigate to={redirect} replace />;
  }
  return children;
};

export default RoleBasedRoute;
