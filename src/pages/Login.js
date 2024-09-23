// src/pages/Login.js
import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/authenticate', {
        correo: email,
        contrasena: password
      });

      // Guarda el token en el localStorage
      const token = response.data.jwt;
      localStorage.setItem('token', token);  // Guarda el token para futuras peticiones
      console.log('Token guardado:', token);

    } catch (error) {
      console.error('Error en el login:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;