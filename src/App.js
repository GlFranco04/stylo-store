// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Importa el proveedor del tema
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ThemeToggle from './components/ThemeToggle';  // El botón para cambiar el tema
import ProtectedRoute from './components/ProtectedRoute';
import GestionUsuarios from './pages/Usuario';
import GestionPermisos from './pages/Permiso';
import GestionRoles from './pages/Rol';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <ThemeProvider>
      <Router>
        <div>
          <ThemeToggle /> {/* Botón para cambiar el tema */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute roles={['SuperUsuario', 'Vendedor', 'Gerente Sucursal']} element={<Dashboard />} />} />
            <Route path="/gestion-usuario" element={<ProtectedRoute roles={['SuperUsuario', 'Vendedor']} element={<GestionUsuarios />} />} />
            <Route path="/gestion-rol" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionRoles />} />} />
            <Route path="/gestion-permiso" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionPermisos />} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
