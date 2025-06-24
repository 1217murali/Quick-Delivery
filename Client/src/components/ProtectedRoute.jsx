import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const { userId: routeUserId } = useParams();

  if (!userType || !userId) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (routeUserId && userId !== routeUserId) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
