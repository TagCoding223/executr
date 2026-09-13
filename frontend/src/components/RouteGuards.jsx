import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Utility to decode JWT payload safely
const getJwtPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

export const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export const PublicRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

// New Admin Guard
export const AdminRoute = () => {
  const payload = getJwtPayload();
  
  if (!payload) {
    return <Navigate to="/auth" replace />;
  }
  
  if (payload.role !== 'ADMIN') {
    // If a normal user tries to access /admin, kick them to home
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};