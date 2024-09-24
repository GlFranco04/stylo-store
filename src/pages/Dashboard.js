import React, { useState } from 'react';
import '../Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Estado para el submenu de perfil
  const navigate = useNavigate();

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    navigate('/login'); // Redirige al login
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? '⮜' : '⮞'}
        </button>
        <ul>
          <li><a href="/gestion-usuario">Gestionar Usuario</a></li>
          <li><a href="/gestion-rol">Gestionar Rol</a></li>
          <li><a href="/gestion-permisos">Gestionar Permisos</a></li>
          {/* Sección de perfil */}
          <li onClick={() => setIsProfileOpen(!isProfileOpen)}>
            Perfil {isProfileOpen ? '▲' : '▼'}
          </li>
          {isProfileOpen && (
            <ul className="submenu">
              <li><a href="/mi-perfil">Mi Perfil</a></li>
              <li onClick={() => handleLogout()}>Cerrar Sesión</li>
            </ul>
          )}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <h1>Bienvenido al Dashboard</h1>
        <p>Aquí va el contenido principal del dashboard.</p>
      </div>
    </div>
  );
}

export default Dashboard;
