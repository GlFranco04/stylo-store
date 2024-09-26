import React, { useEffect, useState } from 'react';
import TallaService from '../services/TallaService';  // Servicio para manejar las tallas
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import { Modal, Button } from 'react-bootstrap';  // Importar Modal de Bootstrap
import '../styles/Talla.css';  // Estilos específicos del Dashboard

function GestionarTallas() {
  const [tallas, setTallas] = useState([]);  // Lista de todas las tallas
  const [loading, setLoading] = useState(true);
  const [buscarId, setBuscarId] = useState('');  // Estado para buscar por ID
  const [tallaEncontrada, setTallaEncontrada] = useState(null); // Estado para almacenar la talla encontrada por ID
  const [nuevaTalla, setNuevaTalla] = useState('');  // Nombre de la nueva talla
  const [tallaEditada, setTallaEditada] = useState(null); // Estado para la talla a modificar
  const [showCreateModal, setShowCreateModal] = useState(false);  // Estado para el modal de crear talla
  const [showEditModal, setShowEditModal] = useState(false);  // Estado para el modal de editar talla
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const tallasPorPagina = 10;  // Número de tallas por página

  useEffect(() => {
    // Obtener todas las tallas
    TallaService.obtenerTallas()
      .then(response => {
        setTallas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las tallas:', error);
        setLoading(false);
      });
  }, []);

  // Función para buscar por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID.');
      setTallaEncontrada(null);
      return;
    }

    TallaService.obtenerTallaPorId(buscarId)
      .then(response => {
        setTallaEncontrada(response.data);
      })
      .catch(error => {
        console.error('Error al buscar la talla:', error);
        alert('Talla no encontrada');
        setTallaEncontrada(null);
      });
  };

  // Función para crear una nueva talla
  const handleCrearTalla = () => {
    if (!nuevaTalla) {
      alert('Por favor, ingrese un nombre para la talla.');
      return;
    }

    const tallaData = { nombre: nuevaTalla, estaActivo: true };  // Talla creada como activa por defecto

    TallaService.crearTalla(tallaData)
      .then(() => {
        console.log('Talla creada exitosamente');
        window.location.reload();  // Recargar la página después de crear
      })
      .catch(error => {
        console.error('Error al crear la talla:', error);
      });
  };

  // Función para abrir el modal de editar talla
  const handleAbrirEditarModal = (talla) => {
    setTallaEditada(talla);
    setShowEditModal(true);
  };

  // Función para manejar el cambio de nombre de la talla en el modal de editar
  const handleEditarTalla = () => {
    if (!tallaEditada || !tallaEditada.nombre) {
      alert('Por favor, ingrese un nombre para la talla.');
      return;
    }

    TallaService.actualizarTalla(tallaEditada.id, { nombre: tallaEditada.nombre })
      .then(() => {
        console.log('Talla modificada exitosamente');
        setShowEditModal(false);  // Cerrar el modal
        window.location.reload();  // Recargar la página
      })
      .catch(error => {
        console.error('Error al modificar la talla:', error);
      });
  };

  // Función para eliminar o desactivar/activar una talla
  const handleToggleTalla = (id, estadoActual) => {
    TallaService.desactivarTalla(id, !estadoActual)
      .then(() => {
        console.log(`Talla ${estadoActual ? 'desactivada' : 'activada'} exitosamente`);
        window.location.reload();  // Recargar la página
      })
      .catch(error => {
        console.error('Error al cambiar el estado de la talla:', error);
      });
  };

  // Obtener las tallas para la página actual
  const indexOfLastTalla = currentPage * tallasPorPagina;
  const indexOfFirstTalla = indexOfLastTalla - tallasPorPagina;
  const tallasActuales = tallas.slice(indexOfFirstTalla, indexOfLastTalla);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando tallas...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Tallas</h1>
        
        {/* Sección para buscar talla por ID */}
        <div className="buscar-talla">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar talla por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar talla encontrada */}
        {tallaEncontrada && (
          <div className="talla-encontrada">
            <h3>Talla Encontrada</h3>
            <p>Id: {tallaEncontrada.id}</p>
            <p>Nombre: {tallaEncontrada.nombre}</p>
            <p>Estado: {tallaEncontrada.estaActivo ? 'Activo' : 'Inactivo'}</p>
          </div>
        )}

        {/* Listar todas las tallas */}
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tallasActuales.map(talla => (
              <tr key={talla.id}>
                <td>{talla.id}</td>
                <td>{talla.nombre}</td>
                <td>{talla.estaActivo ? 'Activo' : 'No activo'}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleToggleTalla(talla.id, talla.estaActivo)}>
                    Activar/Desactivar
                  </button>
                  <button className="btn btn-info" onClick={() => handleAbrirEditarModal(talla)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(tallas.length / tallasPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón para abrir el modal de crear talla */}
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Talla</button>
      </div>

      {/* Modal para crear talla */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre de la Talla:</label>
              <input
                type="text"
                className="form-control"
                value={nuevaTalla}
                onChange={(e) => setNuevaTalla(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearTalla}>
            Crear Talla
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar talla */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre de la Talla:</label>
              <input
                type="text"
                className="form-control"
                value={tallaEditada ? tallaEditada.nombre : ''}
                onChange={(e) => setTallaEditada({ ...tallaEditada, nombre: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditarTalla}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionarTallas;
