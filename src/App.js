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
import GestionTallas from './pages/Talla'
import GestionCategorias from './pages/Categoria'
import GestionRolPermisos from './pages/RolPermiso'
import GestionProducto from './pages/Producto'
import GestionDetalleProducto from './pages/DetalleProducto'
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
            <Route path="/gestion-talla" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionTallas />} />} />
            <Route path="/gestion-categoria" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionCategorias />} />} />
            <Route path="/gestion-rol-permiso" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionRolPermisos />} />} />
            <Route path="/gestion-producto" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionProducto />} />} />
            <Route path="/gestion-detalle-producto" element={<ProtectedRoute roles={['SuperUsuario']} element={<GestionDetalleProducto />} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
