import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import DireccionService from '../services/DireccionService';  // Servicio para manejar direcciones
import CiudadService from '../services/CiudadService';  // Servicio para manejar ciudades
import PaisService from '../services/PaisService';  // Servicio para manejar países
import { Button, Modal } from 'react-bootstrap';

function GestionDireccion() {
  const [direcciones, setDirecciones] = useState([]);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscarId, setBuscarId] = useState('');  // ID para buscar
  const [direccionEncontrada, setDireccionEncontrada] = useState(null); // Dirección encontrada
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal de creación
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición
  const [nuevaDireccion, setNuevaDireccion] = useState({
    nombre: '',
    ubicacion: '',
    edificio: '',
    ciudad: { id: '' }
  });
  const [direccionEditada, setDireccionEditada] = useState(null); // Dirección a editar
  const [paisSeleccionado, setPaisSeleccionado] = useState(''); // País seleccionado

  useEffect(() => {
    cargarDirecciones();
    cargarPaises();
  }, []);

  // Función para cargar todas las direcciones
  const cargarDirecciones = () => {
    DireccionService.obtenerDirecciones()
      .then(response => {
        setDirecciones(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las direcciones:', error);
        setLoading(false);
      });
  };

  // Función para cargar todos los países
  const cargarPaises = () => {
    PaisService.obtenerPaises()
      .then(response => {
        setPaises(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los países:', error);
      });
  };

  // Función para cargar las ciudades del país seleccionado
  const cargarCiudades = (paisId) => {
    CiudadService.obtenerCiudadesPorPais(paisId)
      .then(response => {
        setCiudades(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las ciudades:', error);
      });
  };

  // Función para manejar el cambio en el país seleccionado
  const handlePaisChange = (e) => {
    const paisId = e.target.value;
    setPaisSeleccionado(paisId);
    if (paisId) {
      cargarCiudades(paisId);
    } else {
      setCiudades([]);
    }
  };

  // Función para manejar el cambio en los campos del formulario de crear dirección
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ciudadId') {
      setNuevaDireccion({ ...nuevaDireccion, ciudad: { id: value } });
    } else {
      setNuevaDireccion({ ...nuevaDireccion, [name]: value });
    }
  };

  // Función para crear una nueva dirección
  const handleCrearDireccion = (e) => {
    e.preventDefault();
    if (!nuevaDireccion.ciudad.id) {
      alert('Por favor, seleccione una ciudad.');
      return;
    }

    DireccionService.crearDireccion(nuevaDireccion)
      .then(() => {
        console.log('Dirección creada exitosamente');
        setShowCreateModal(false);  // Cerrar el modal
        cargarDirecciones();  // Recargar la lista de direcciones
      })
      .catch(error => {
        console.error('Error al crear la dirección:', error);
      });
  };

  // Función para buscar una dirección por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID de dirección.');
      return;
    }

    DireccionService.obtenerDireccionPorId(buscarId)
      .then(response => {
        setDireccionEncontrada(response.data);
      })
      .catch(error => {
        console.error('Error al buscar la dirección:', error);
        alert('Dirección no encontrada');
        setDireccionEncontrada(null);
      });
  };

  // Función para eliminar una dirección
  const handleEliminarDireccion = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta dirección?')) {
      DireccionService.eliminarDireccion(id)
        .then(() => {
          console.log('Dirección eliminada exitosamente');
          cargarDirecciones();  // Recargar la lista de direcciones
        })
        .catch(error => {
          console.error('Error al eliminar la dirección:', error);
        });
    }
  };

  // Función para manejar el clic en "Modificar" y abrir el modal de edición
  const handleEditarDireccion = (direccion) => {
    setDireccionEditada(direccion);
    setPaisSeleccionado(direccion.ciudad?.pais?.id || '');
    cargarCiudades(direccion.ciudad?.pais?.id || '');
    setShowEditModal(true);
  };

  // Función para manejar el cambio en los campos del formulario de editar dirección
  const handleInputChangeEditar = (e) => {
    const { name, value } = e.target;

    if (name === 'ciudadId') {
      setDireccionEditada({ ...direccionEditada, ciudad: { id: value } });
    } else {
      setDireccionEditada({ ...direccionEditada, [name]: value });
    }
  };

  // Función para guardar los cambios al editar una dirección
  const handleGuardarCambiosDireccion = (e) => {
    e.preventDefault();
    if (!direccionEditada.ciudad.id) {
      alert('Por favor, seleccione una ciudad.');
      return;
    }

    DireccionService.actualizarDireccion(direccionEditada.id, direccionEditada)
      .then(() => {
        console.log('Dirección actualizada exitosamente');
        setShowEditModal(false);  // Cerrar el modal
        cargarDirecciones();  // Recargar la lista de direcciones
      })
      .catch(error => {
        console.error('Error al actualizar la dirección:', error);
      });
  };

  if (loading) {
    return <div>Cargando direcciones...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Direcciones</h1>

        {/* Buscar dirección por ID */}
        <div className="buscar-direccion">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar dirección por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar detalles de la dirección encontrada */}
        {direccionEncontrada && (
          <div className="direccion-encontrada mt-4">
            <h3>Dirección Encontrada</h3>
            <p><strong>ID:</strong> {direccionEncontrada.id}</p>
            <p><strong>País:</strong> {direccionEncontrada.ciudad && direccionEncontrada.ciudad.pais ? direccionEncontrada.ciudad.pais.nombre : 'Sin país'}</p>
            <p><strong>Ciudad:</strong> {direccionEncontrada.ciudad ? direccionEncontrada.ciudad.nombre : 'Sin ciudad'}</p>
            <p><strong>Nombre:</strong> {direccionEncontrada.nombre}</p>
            <p><strong>Ubicación:</strong> {direccionEncontrada.ubicacion}</p>
            <p><strong>Edificio:</strong> {direccionEncontrada.edificio}</p>
          </div>
        )}

        {/* Tabla de direcciones */}
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>País</th>
              <th>Ciudad</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Edificio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {direcciones.map(direccion => (
              <tr key={direccion.id}>
                <td>{direccion.id}</td>
                <td>{direccion.ciudad && direccion.ciudad.pais ? direccion.ciudad.pais.nombre : 'Sin país'}</td>
                <td>{direccion.ciudad ? direccion.ciudad.nombre : 'Sin ciudad'}</td>
                <td>{direccion.nombre}</td>
                <td>{direccion.ubicacion}</td>
                <td>{direccion.edificio}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminarDireccion(direccion.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditarDireccion(direccion)}
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón para abrir el modal de creación */}
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Nueva Dirección</button>

        {/* Modal para crear una nueva dirección */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Nueva Dirección</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCrearDireccion}>
              <div className="form-group">
                <label>País:</label>
                <select className="form-control" value={paisSeleccionado} onChange={handlePaisChange}>
                  <option value="">Seleccione un país</option>
                  {paises.map(pais => (
                    <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ciudad:</label>
                <select className="form-control" name="ciudadId" value={nuevaDireccion.ciudad.id} onChange={handleInputChange}>
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={nuevaDireccion.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Ubicación:</label>
                <input
                  type="text"
                  className="form-control"
                  name="ubicacion"
                  value={nuevaDireccion.ubicacion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Edificio:</label>
                <input
                  type="text"
                  className="form-control"
                  name="edificio"
                  value={nuevaDireccion.edificio}
                  onChange={handleInputChange}
                />
              </div>
              <Button variant="primary" type="submit">
                Crear Dirección
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para editar una dirección */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Dirección</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {direccionEditada && (
              <form onSubmit={handleGuardarCambiosDireccion}>
                <div className="form-group">
                  <label>País:</label>
                  <select className="form-control" value={paisSeleccionado} onChange={(e) => handlePaisChange(e)}>
                    <option value="">Seleccione un país</option>
                    {paises.map(pais => (
                      <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ciudad:</label>
                  <select className="form-control" name="ciudadId" value={direccionEditada.ciudad.id} onChange={handleInputChangeEditar}>
                    <option value="">Seleccione una ciudad</option>
                    {ciudades.map(ciudad => (
                      <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={direccionEditada.nombre}
                    onChange={handleInputChangeEditar}
                  />
                </div>
                <div className="form-group">
                  <label>Ubicación:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ubicacion"
                    value={direccionEditada.ubicacion}
                    onChange={handleInputChangeEditar}
                  />
                </div>
                <div className="form-group">
                  <label>Edificio:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="edificio"
                    value={direccionEditada.edificio}
                    onChange={handleInputChangeEditar}
                  />
                </div>
                <Button variant="primary" type="submit">
                  Guardar Cambios
                </Button>
              </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default GestionDireccion;
