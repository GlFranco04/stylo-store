// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; // La función que obtiene el rol

const ProtectedRoute = ({ roles, element }) => {
  const token = localStorage.getItem('token');
  const userRole = AuthService.getRoleFromToken();

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si el rol del usuario no está permitido, redirigir al dashboard
  if (!roles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

export default ProtectedRoute;