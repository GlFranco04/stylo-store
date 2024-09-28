import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';  // Los estilos específicos del sidebar
import AuthService from '../services/AuthService';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(''); // Estado para manejar qué menú está abierto
  const navigate = useNavigate();
  const userRole = AuthService.getRoleFromToken();

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Cerrar automáticamente el sidebar en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Cierra el sidebar cuando la pantalla es pequeña
      } else {
        setIsSidebarOpen(true); // Lo abre cuando la pantalla es grande
      }
    };

    // Ejecutar la función cuando la pantalla se redimensiona
    window.addEventListener('resize', handleResize);

    // Ejecutar la función inmediatamente para verificar el tamaño inicial de la pantalla
    handleResize();

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Función para manejar la apertura de los menús
  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? '' : menu); // Alternar el menú seleccionado
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? '⮜' : '⮞'}
      </button>
      <ul>

        {userRole === 'SuperUsuario' && (
          <>
            <li onClick={() => handleMenuClick('empresa')}>
              Gestionar Empresa {activeMenu === 'empresa' ? '▲' : '▼'}
            </li>
            {activeMenu === 'empresa' && (
              <ul className="menuEmpresa">
                <li><a href="/ver-empresa">Datos de Empresa</a></li>
                <li><a href="/gestion-sucursal">Gestión de Sucursales</a></li>
                <li><a href="/gestion-direccion">Gestión de Direcciones</a></li>
              </ul>
            )}
          </>
        )}

        {/* Solo mostrar "Gestionar Usuario" si el rol es SuperUsuario */}
        {userRole === 'SuperUsuario' && (
          <>
            <li onClick={() => handleMenuClick('usuario')}>
              Gestionar Usuario {activeMenu === 'usuario' ? '▲' : '▼'}
            </li>
            {activeMenu === 'usuario' && (
              <ul className="menuUsuario">
                <li><a href="/gestion-usuario">Gestión de Usuarios</a></li>
                <li><a href="/gestion-rol">Gestión de Roles</a></li>
                <li><a href="/gestion-permiso">Gestión de Permisos</a></li>
                <li><a href="/gestion-rol-permiso">Asignar Permisos</a></li>
              </ul>
            )}
          </>
        )}

        {userRole === 'SuperUsuario' && (
          <>
            <li onClick={() => handleMenuClick('producto')}>
              Gestionar Producto {activeMenu === 'producto' ? '▲' : '▼'}
            </li>
            {activeMenu === 'producto' && (
              <ul className="menuProducto">
                <li><a href="/gestion-producto">Gestión de Productos</a></li>
                <li><a href="/gestion-talla">Gestión de Tallas</a></li>
                <li><a href="/gestion-categoria">Gestión de Categorias</a></li>
                <li><a href="/gestion-detalle-producto">Gestión de DetallesProducto</a></li>
                <li><a href="/gestion-producto-categoria">Asignar Categoria</a></li>
              </ul>
            )}
          </>
        )}

        {/* Sección de perfil (disponible para todos los roles) */}
        <li onClick={() => handleMenuClick('perfil')}>
          Perfil {activeMenu === 'perfil' ? '▲' : '▼'}
        </li>
        {activeMenu === 'perfil' && (
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
