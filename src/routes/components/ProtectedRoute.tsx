import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useAccount';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute: React.FC<{ element: React.ReactElement; roles?: string[] }> = ({
  element,
  roles = []
}) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { current: user, isLoading: isUserLoading } = useUser();
  const location = window.location;

  if (isAuthLoading || isUserLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required roles if any are specified
  if (roles.length > 0 && !roles.some(role => user?.labels?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute; 
