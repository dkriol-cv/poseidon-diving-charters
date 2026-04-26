import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { logAuthDebug } from '@/lib/debugAuth';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading, isLoadingRole } = useAuth();

  if (loading || isLoadingRole) {
    logAuthDebug('ProtectedRoute - Loading state active', { loading, isLoadingRole });
    return <LoadingSpinner text="Verifying Access..." />;
  }

  logAuthDebug('ProtectedRoute - Access check', { 
    hasUser: !!user, 
    isAdmin, 
    loading, 
    isLoadingRole 
  });

  if (!user) {
    logAuthDebug('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    logAuthDebug('ProtectedRoute - User is not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  logAuthDebug('ProtectedRoute - User is admin, rendering protected content');
  return children;
};

export default ProtectedRoute;