import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && (!userProfile || userProfile.role !== requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}