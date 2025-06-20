import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import LoadingSpinner from './LoadingSpinner';

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isUserLoading } = useUser();

  if (isAuthLoading || isUserLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : element;
};

export default PublicRoute; 
