import React, { useEffect, useState } from 'react';
import RolService from '../services/RolService';  // Servicio para manejar roles
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import { Modal, Button } from 'react-bootstrap';  // Importar Modal de Bootstrap
import '../styles/Rol.css';  // Estilos específicos del Dashboard

function GestionarRoles() {
  const [roles, setRoles] = useState([]);  // Lista de todos los roles
  const [loading, setLoading] = useState(true);
  const [buscarId, setBuscarId] = useState('');  // Estado para buscar por ID
  const [rolEncontrado, setRolEncontrado] = useState(null);  // Estado para almacenar el rol encontrado por ID
  const [nuevoRol, setNuevoRol] = useState('');  // Nombre del nuevo rol
  const [rolEditado, setRolEditado] = useState(null);  // Estado para el rol a modificar
  const [showCreateModal, setShowCreateModal] = useState(false);  // Estado para el modal de crear rol
  const [showEditModal, setShowEditModal] = useState(false);  // Estado para el modal de editar rol
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const rolesPorPagina = 10;  // Número de roles por página

  useEffect(() => {
    // Obtener todos los roles
    RolService.obtenerRoles()
      .then(response => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los roles:', error);
        setLoading(false);
      });
  }, []);

  // Función para buscar por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID.');
      setRolEncontrado(null);
      return;
    }

    RolService.obtenerRolPorId(buscarId)
      .then(response => {
        setRolEncontrado(response.data);
      })
      .catch(error => {
        console.error('Error al buscar el rol:', error);
        alert('Rol no encontrado');
        setRolEncontrado(null);
      });
  };

  // Función para crear un nuevo rol
  const handleCrearRol = () => {
    if (!nuevoRol) {
      alert('Por favor, ingrese un nombre para el rol.');
      return;
    }

    const rolData = { nombre: nuevoRol };

    RolService.crearRol(rolData)
      .then(() => {
        console.log('Rol creado exitosamente');
        window.location.reload();  // Recargar la página después de crear
      })
      .catch(error => {
        console.error('Error al crear el rol:', error);
      });
  };

  // Función para abrir el modal de editar rol
  const handleAbrirEditarModal = (rol) => {
    setRolEditado(rol);
    setShowEditModal(true);
  };

  // Función para manejar el cambio de nombre del rol en el modal de editar
  const handleEditarRol = () => {
    if (!rolEditado || !rolEditado.nombre) {
      alert('Por favor, ingrese un nombre para el rol.');
      return;
    }

    RolService.actualizarRol(rolEditado.id, { nombre: rolEditado.nombre })
      .then(() => {
        console.log('Rol modificado exitosamente');
        setShowEditModal(false);  // Cerrar el modal
        window.location.reload();  // Recargar la página
      })
      .catch(error => {
        console.error('Error al modificar el rol:', error);
      });
  };

  // Función para eliminar un rol
  const handleEliminarRol = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      RolService.eliminarRol(id)
        .then(() => {
          console.log('Rol eliminado exitosamente');
          window.location.reload();  // Recargar la página
        })
        .catch(error => {
          console.error('Error al eliminar el rol:', error);
        });
    }
  };

  // Obtener los roles para la página actual
  const indexOfLastRol = currentPage * rolesPorPagina;
  const indexOfFirstRol = indexOfLastRol - rolesPorPagina;
  const rolesActuales = roles.slice(indexOfFirstRol, indexOfLastRol);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando roles...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Roles</h1>
        
        {/* Sección para buscar rol por ID */}
        <div className="buscar-rol">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar rol por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar rol encontrado */}
        {rolEncontrado && (
          <div className="rol-encontrado">
            <h3>Rol Encontrado</h3>
            <p>Id: {rolEncontrado.id}</p>
            <p>Nombre: {rolEncontrado.nombre}</p>
          </div>
        )}

        {/* Listar todos los roles */}
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rolesActuales.map(rol => (
              <tr key={rol.id}>
                <td>{rol.id}</td>
                <td>{rol.nombre}</td>
                <td>
                  <button className="btn btn-info" onClick={() => handleAbrirEditarModal(rol)}>
                    Editar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleEliminarRol(rol.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(roles.length / rolesPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón para abrir el modal de crear rol */}
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Rol</button>
      </div>

      {/* Modal para crear rol */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre del Rol:</label>
              <input
                type="text"
                className="form-control"
                value={nuevoRol}
                onChange={(e) => setNuevoRol(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearRol}>
            Crear Rol
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar rol */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre del Rol:</label>
              <input
                type="text"
                className="form-control"
                value={rolEditado ? rolEditado.nombre : ''}
                onChange={(e) => setRolEditado({ ...rolEditado, nombre: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditarRol}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionarRoles;
