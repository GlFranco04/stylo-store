import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';  // Los estilos específicos del sidebar
import AuthService from '../services/AuthService';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGestionUsuarioOpen, setIsGestionUsuarioOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = AuthService.getRoleFromToken();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? '⮜' : '⮞'}
      </button>
      <ul>
        {/* Solo mostrar "Gestionar Usuario" si el rol es SuperUsuario */}
        {userRole === 'SuperUsuario' && (
          <>
            <li onClick={() => setIsGestionUsuarioOpen(!isGestionUsuarioOpen)}>
              Gestionar Usuario {isGestionUsuarioOpen ? '▲' : '▼'}
            </li>
            {isGestionUsuarioOpen && (
              <ul className="menuUsuario">
                <li><a href="/gestion-usuario">Gestión de Usuarios</a></li>
                <li><a href="/gestion-rol">Gestión de Roles</a></li>
                <li><a href="/gestion-permiso">Gestión de Permisos</a></li>
              </ul>
            )}
          </>
        )}

        {/* Sección de perfil (disponible para todos los roles) */}
        <li onClick={() => setIsProfileOpen(!isProfileOpen)}>
          Perfil {isProfileOpen ? '▲' : '▼'}
        </li>
        {isProfileOpen && (
          <ul className="menuPerfil">
            <li><a href="/mi-perfil">Mi Perfil</a></li>
            <li onClick={handleLogout}>Cerrar Sesión</li>
          </ul>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
