import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Utility to decode JWT payload safely
export const getJwtPayload = () => {
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

// Utility to check if token exists and is not expired
export const isTokenValid = () => {
  const payload = getJwtPayload();
  if (!payload) return false;

  // 'exp' is in seconds, Date.now() is in milliseconds
  if (payload.exp && (payload.exp * 1000 < Date.now())) {
    localStorage.removeItem('token'); // Purge expired token
    return false;
  }
  
  return true;
};

export const PrivateRoute = () => {
  return isTokenValid() ? <Outlet /> : <Navigate to="/auth" replace />;
};

export const PublicRoute = () => {
  return isTokenValid() ? <Navigate to="/" replace /> : <Outlet />;
};

// Admin Guard
export const AdminRoute = () => {
  if (!isTokenValid()) {
    return <Navigate to="/auth" replace />;
  }
  
  const payload = getJwtPayload();
  
  if (payload.role !== 'ADMIN') {
    // If a normal user tries to access /admin, kick them to home
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};