import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';  // Para obtener el rol del usuario
import PermisoService from '../services/PermisoService'; // Un servicio para manejar los permisos
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';  // Importar Modal de Bootstrap
import '../styles/Permiso.css';  // Estilos específicos del Dashboard de permisos

function GestionarPermisos() {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermiso, setSelectedPermiso] = useState(null);  // Permiso seleccionado para editar
  const [showEditModal, setShowEditModal] = useState(false);  // Estado para controlar el modal de edición
  const [showCreateModal, setShowCreateModal] = useState(false);  // Estado para controlar el modal de creación
  const [buscarId, setBuscarId] = useState('');  // Estado para el ID a buscar
  const [permisoEncontrado, setPermisoEncontrado] = useState(null); // Estado para almacenar el permiso encontrado
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const permisosPorPagina = 10;  // Número de permisos por página
  const [nuevoPermiso, setNuevoPermiso] = useState({
    nombre: '',
    descripcion: ''
  });
  const userRole = AuthService.getRoleFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    PermisoService.obtenerPermisos()
      .then(response => {
        setPermisos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los permisos:', error);
        setLoading(false);
      });
  }, []);

  // Función para manejar la búsqueda por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID.');
      setPermisoEncontrado(null);
      return;
    }

    PermisoService.obtenerPermisoPorId(buscarId)
      .then(response => {
        setPermisoEncontrado(response.data);
      })
      .catch(error => {
        console.error('Error al buscar el permiso:', error);
        alert('Permiso no encontrado');
        setPermisoEncontrado(null);
      });
  };

  // Función para crear un nuevo permiso
  const handleCrearPermiso = (e) => {
    e.preventDefault();
    PermisoService.crearPermiso(nuevoPermiso)
      .then(response => {
        console.log('Permiso creado exitosamente:', response.data);
        window.location.reload();  // Recargar la página después de crear
      })
      .catch(error => {
        console.error('Error al crear el permiso:', error);
      });
  };

  // Función para manejar la edición de un permiso
  const handleEditarPermiso = (permiso) => {
    setSelectedPermiso(permiso);  // Selecciona el permiso a editar
    setShowEditModal(true);  // Muestra el modal
  };

  // Función para guardar los cambios del permiso
  const handleGuardarCambios = () => {
    PermisoService.actualizarPermiso(selectedPermiso.id, selectedPermiso)
      .then(response => {
        console.log('Permiso actualizado:', response.data);
        setShowEditModal(false);  // Cierra el modal
        window.location.reload();  // Refrescar la página
      })
      .catch(error => {
        console.error('Error al actualizar el permiso:', error);
      });
  };

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e, isCreate = false) => {
    const { name, value } = e.target;
    if (isCreate) {
      setNuevoPermiso({ ...nuevoPermiso, [name]: value });
    } else {
      setSelectedPermiso({ ...selectedPermiso, [name]: value });
    }
  };

  // Función para eliminar un permiso
  const handleEliminarPermiso = (idPermiso) => {
    if (window.confirm('¿Estás seguro de eliminar este permiso?')) {
      PermisoService.EliminarPermiso(idPermiso)
        .then(() => {
          console.log('Permiso eliminado exitosamente');
          window.location.reload();  // Refrescar la página
        })
        .catch(error => {
          console.error('Error al eliminar el permiso:', error);
        });
    }
  };

  // Obtener los permisos para la página actual
  const indexOfLastPermiso = currentPage * permisosPorPagina;
  const indexOfFirstPermiso = indexOfLastPermiso - permisosPorPagina;
  const permisosActuales = permisos.slice(indexOfFirstPermiso, indexOfLastPermiso);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Permisos</h1>
        
        {/* Sección para buscar permiso por ID */}
        <div className="buscar-permiso">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar permiso por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar permiso encontrado */}
        {permisoEncontrado && (
          <div className="permiso-encontrado">
            <h3>Permiso Encontrado</h3>
            <p>Id: {permisoEncontrado.id}</p>
            <p>Nombre: {permisoEncontrado.nombre}</p>
            <p>Descripción: {permisoEncontrado.descripcion}</p>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              {userRole === 'SuperUsuario' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {permisosActuales.map(permiso => (
              <tr key={permiso.id}>
                <td>{permiso.id}</td>
                <td>{permiso.nombre}</td>
                <td>{permiso.descripcion}</td>
                {userRole === 'SuperUsuario' && (
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEditarPermiso(permiso)}>Editar</button>
                    <button className="btn btn-danger ml-2" onClick={() => handleEliminarPermiso(permiso.id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(permisos.length / permisosPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {userRole === 'SuperUsuario' && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Permiso</button>
        )}
      </div>

      {/* Modal para editar permiso */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPermiso && (
            <form>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={selectedPermiso.nombre}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  value={selectedPermiso.descripcion}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCambios}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear permiso */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={nuevoPermiso.nombre}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                className="form-control"
                name="descripcion"
                value={nuevoPermiso.descripcion}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearPermiso}>
            Crear Permiso
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionarPermisos;
