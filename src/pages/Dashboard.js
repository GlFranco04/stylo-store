import React from 'react';
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import '../styles/Dashboard.css';  // Estilos específicos del Dashboard

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar separado como componente */}
      <div className="main-content">
        <h1>Bienvenido al Dashboard</h1>
        <p>Aquí va el contenido principal del dashboard.</p>
      </div>
    </div>
  );
}

export default Dashboard;
