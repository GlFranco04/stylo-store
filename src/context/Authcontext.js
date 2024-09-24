import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario actual
  const [loading, setLoading] = useState(true); // Para gestionar el estado de carga
  const navigate = useNavigate();

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem('token', token); // Guardar el token en el localStorage
    const decodedUser = parseJwt(token); // Decodificar el token JWT para obtener la información del usuario
    setUser(decodedUser); // Establecer el usuario decodificado en el estado
    navigate('/dashboard');
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Función para verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = parseJwt(token);
      setUser(decodedUser);
    }
    setLoading(false);
  }, []);

  // Función para decodificar el token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
