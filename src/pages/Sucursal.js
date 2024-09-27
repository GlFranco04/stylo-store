import React, { useState, useEffect } from 'react';
import SucursalService from '../services/SucursalService';  // Servicio para manejar sucursales
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import { Modal, Button } from 'react-bootstrap';

function GestionSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [direccionesDisponibles, setDireccionesDisponibles] = useState([]); // Direcciones disponibles para crear
  const [loading, setLoading] = useState(true);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);  // Modal de edición
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal de creación
  const [nombreNuevaSucursal, setNombreNuevaSucursal] = useState('');
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  const [error, setError] = useState('');
  const [buscarId, setBuscarId] = useState('');  // Estado para almacenar el ID de búsqueda
  const [sucursalEncontrada, setSucursalEncontrada] = useState(null); // Sucursal encontrada

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [sucursalesPorPagina] = useState(10);  // Número de sucursales por página

  useEffect(() => {
    cargarSucursales();
    cargarDireccionesDisponibles(); // Cargar direcciones disponibles para crear nuevas sucursales
  }, []);

  // Función para cargar todas las sucursales
  const cargarSucursales = () => {
    SucursalService.obtenerSucursales()
      .then(response => {
        setSucursales(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las sucursales:', error);
        setLoading(false);
      });
  };

  // Cargar direcciones disponibles para nuevas sucursales
  const cargarDireccionesDisponibles = () => {
    SucursalService.obtenerDireccionesDisponibles()
      .then(response => {
        setDireccionesDisponibles(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las direcciones disponibles:', error);
      });
  };

  // Función para buscar una sucursal por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID de sucursal.');
      return;
    }
    SucursalService.obtenerSucursalPorId(buscarId)
      .then(response => {
        setSucursalEncontrada(response.data); // Almacenar la sucursal encontrada
      })
      .catch(error => {
        console.error('Error al buscar la sucursal:', error);
        alert('Sucursal no encontrada');
        setSucursalEncontrada(null);
      });
  };

  // Función para manejar el estado activo/inactivo
  const toggleEstadoSucursal = (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    SucursalService.activarDesactivarSucursal(id, nuevoEstado)
      .then(() => {
        console.log('Estado de sucursal actualizado');
        cargarSucursales();  // Recargar la lista de sucursales
      })
      .catch(error => {
        console.error('Error al actualizar el estado de la sucursal:', error);
      });
  };

  // Función para abrir el modal de edición con los datos de la sucursal seleccionada
  const handleEditarSucursal = (sucursal) => {
    setSelectedSucursal(sucursal);
    setShowEditModal(true);
  };

  // Función para guardar los cambios en la sucursal
  const handleGuardarCambios = () => {
    SucursalService.actualizarSucursal(selectedSucursal.id, selectedSucursal)
      .then(() => {
        console.log('Sucursal actualizada');
        setShowEditModal(false);  // Cerrar el modal
        cargarSucursales();  // Recargar la lista de sucursales
        cargarDireccionesDisponibles();  // Recargar las direcciones disponibles
      })
      .catch(error => {
        console.error('Error al actualizar la sucursal:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'direccionId') {
      setSelectedSucursal({ ...selectedSucursal, direccion: { id: value } });
    } else {
      setSelectedSucursal({ ...selectedSucursal, [name]: value });
    }
  };

  // Función para manejar la creación de una nueva sucursal
  const handleCrearSucursal = (e) => {
    e.preventDefault();
    if (!nombreNuevaSucursal || !direccionSeleccionada) {
      setError('Por favor, ingrese un nombre y seleccione una dirección.');
      return;
    }

    const nuevaSucursal = {
      nombre: nombreNuevaSucursal,
      direccion: { id: direccionSeleccionada }
    };

    SucursalService.crearSucursal(nuevaSucursal)
      .then(() => {
        console.log('Sucursal creada exitosamente');
        setShowCreateModal(false);  // Cerrar el modal
        cargarSucursales();  // Recargar la lista de sucursales
        cargarDireccionesDisponibles();  // Recargar las direcciones disponibles
      })
      .catch(error => {
        console.error('Error al crear la sucursal:', error);
        setError('Error al crear la sucursal');
      });
  };

  // Obtener las sucursales actuales (paginadas)
  const indexOfLastSucursal = currentPage * sucursalesPorPagina;
  const indexOfFirstSucursal = indexOfLastSucursal - sucursalesPorPagina;
  const sucursalesActuales = sucursales.slice(indexOfFirstSucursal, indexOfLastSucursal);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando sucursales...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Sucursales</h1>

        {/* Buscar sucursal por ID */}
        <div className="buscar-sucursal">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar sucursal por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar detalles de la sucursal encontrada */}
        {sucursalEncontrada && (
          <div className="sucursal-encontrada">
            <h3>Sucursal Encontrada</h3>
            <p><strong>ID:</strong> {sucursalEncontrada.id}</p>
            <p><strong>Nombre:</strong> {sucursalEncontrada.nombre}</p>
            <p><strong>Dirección:</strong> {sucursalEncontrada.direccion ? sucursalEncontrada.direccion.ubicacion : 'Sin dirección'}</p>
            <p><strong>Estado:</strong> {sucursalEncontrada.estaActivo ? 'Activo' : 'Inactivo'}</p>
          </div>
        )}

        {/* Tabla de todas las sucursales (paginadas) */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursalesActuales.map(sucursal => (
              <tr key={sucursal.id}>
                <td>{sucursal.id}</td>
                <td>{sucursal.nombre}</td>
                <td>{sucursal.direccion ? sucursal.direccion.ubicacion : 'Sin dirección'}</td>
                <td>{sucursal.estaActivo ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <button
                    className={`btn ${sucursal.estaActivo ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => toggleEstadoSucursal(sucursal.id, sucursal.estaActivo)}
                  >
                    {sucursal.estaActivo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="btn btn-warning" onClick={() => handleEditarSucursal(sucursal)}>
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(sucursales.length / sucursalesPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Crear Nueva Sucursal
        </button>

        {/* Modal para editar la sucursal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Sucursal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSucursal && (
              <form>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={selectedSucursal.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Dirección:</label>
                  <select
                    className="form-control"
                    name="direccionId"
                    value={selectedSucursal.direccion ? selectedSucursal.direccion.id : ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una dirección</option>
                    {direccionesDisponibles.map(direccion => (
                      <option key={direccion.id} value={direccion.id}>
                        {direccion.ubicacion}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarCambios}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para crear una nueva sucursal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Nueva Sucursal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCrearSucursal}>
              <div className="form-group">
                <label>Nombre de la Sucursal:</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombreNuevaSucursal}
                  onChange={(e) => setNombreNuevaSucursal(e.target.value)}
                  placeholder="Nombre de la sucursal"
                />
              </div>

              <div className="form-group">
                <label>Dirección:</label>
                <select
                  className="form-control"
                  value={direccionSeleccionada}
                  onChange={(e) => setDireccionSeleccionada(e.target.value)}
                >
                  <option value="">Seleccione una dirección</option>
                  {direccionesDisponibles.map(direccion => (
                    <option key={direccion.id} value={direccion.id}>
                      {direccion.ubicacion}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <Button variant="primary" type="submit">
                Crear Sucursal
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default GestionSucursales;
