import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  // If token exists, render the protected component. Otherwise, redirect to auth.
  return token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export const PublicRoute = () => {
  const token = localStorage.getItem('token');
  // If token exists, redirect away from public pages (like login/signup) to home.
  return token ? <Navigate to="/" replace /> : <Outlet />;
};