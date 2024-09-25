import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ThemeToggle from './components/ThemeToggle';  // Si lo tienes en una carpeta components
import ProtectedRoute from './components/ProtectedRoute';
import GestionPermisos from './pages/Permiso';
import Producto from './pages/Producto';
import GestionUsuarios from './pages/Usuario';
import GestionRoles from './pages/Rol';

function App() {
  return (
    <Router>
      <div>
        <ThemeToggle /> {/* Botón para cambiar entre temas */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['SuperUsuario','Vendedor','Gerente Sucursal']} element={<Dashboard />} />} />
          <Route path="/gestion-usuario" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionUsuarios />} />} />
          <Route path="/gestion-rol" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionRoles />} />} />
          <Route path="/gestion-permiso" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionPermisos />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
