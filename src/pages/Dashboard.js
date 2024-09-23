import React, { useState } from 'react';
import '../Dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          {/* Agregar más enlaces según sea necesario */}
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
