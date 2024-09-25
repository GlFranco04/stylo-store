// src/pages/Login.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Theme.css"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Restablece el mensaje de error cuando el usuario intenta nuevamente
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:8080/authenticate', {
        correo: email,
        contrasena: password
      });
      // Una vez autenticado, redirige a la página principal
      navigate('/dashboard');
      // Guarda el token en el localStorage
      const token = response.data.jwt;
      localStorage.setItem('token', token);  // Guarda el token para futuras peticiones

    } catch (error) {
      // Manejo del error, muestra un mensaje al usuario
      setErrorMessage('Ingreso erróneo. Revise los datos por favor.');
      console.error('Error en el login:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="row w-100">
        <div className="col-lg-4 col-md-6 col-sm-8 mx-auto">
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          {errorMessage && (  // Si hay un mensaje de error, lo muestra
            <div className="alert alert-danger text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
              <button 
              type="submit" 
              className="btn btn-primary btn-block mt-4"
              >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
