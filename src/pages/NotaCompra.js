import React, { useState, useEffect } from 'react';
import NotaCompraService from '../services/NotaCompraService';
import SucursalService from '../services/SucursalService'; // Importar el servicio de sucursales
import Sidebar from '../components/Sidebar';
import { Modal, Button } from 'react-bootstrap';

function GestionNotaCompra() {
  const [notasCompra, setNotasCompra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [nuevaNotaCompra, setNuevaNotaCompra] = useState({
    sucursal: { id: '' },
    fechaVenta: '',
    total: 0,
    estado: true
  });
  const [sucursales, setSucursales] = useState([]);
  const [buscarId, setBuscarId] = useState('');
  const [notaCompraEncontrada, setNotaCompraEncontrada] = useState(null);
  const [detalleCompra, setDetalleCompra] = useState([]); // Detalles de la nota de compra seleccionada

  useEffect(() => {
    cargarNotasCompra();
    cargarSucursales(); // Cargar las sucursales disponibles
  }, []);

  // Cargar todas las notas de compra
  const cargarNotasCompra = () => {
    NotaCompraService.obtenerNotasCompra()
      .then(response => {
        setNotasCompra(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las notas de compra:', error);
        setLoading(false);
      });
  };

  // Cargar todas las sucursales disponibles
  const cargarSucursales = () => {
    SucursalService.obtenerSucursales()
      .then(response => {
        setSucursales(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las sucursales:', error);
      });
  };

  // Manejar el cambio de sucursal en el formulario de crear nota de compra
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaNotaCompra({ ...nuevaNotaCompra, [name]: value });
  };

  // Crear una nueva nota de compra
  const handleCrearNotaCompra = (e) => {
    e.preventDefault();

    // Asignar la fecha actual y los valores por defecto
    const fechaActual = new Date().toISOString().split('T')[0];
    const nuevaNota = {
      ...nuevaNotaCompra,
      fechaVenta: fechaActual,
      total: 0,
      estado: true
    };

    NotaCompraService.crearNotaCompra(nuevaNota)
      .then(() => {
        console.log('Nota de compra creada exitosamente');
        setShowCreateModal(false);
        cargarNotasCompra();
      })
      .catch(error => {
        console.error('Error al crear la nota de compra:', error);
      });
  };

  // Buscar una nota de compra por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID de nota de compra.');
      return;
    }

    NotaCompraService.obtenerNotaCompraPorId(buscarId)
      .then(response => {
        setNotaCompraEncontrada(response.data);
      })
      .catch(error => {
        console.error('Error al buscar la nota de compra:', error);
        alert('Nota de compra no encontrada');
        setNotaCompraEncontrada(null);
      });
  };

  // Manejar la visualización de los detalles de compra para una nota específica
  const handleVerDetalles = (notaId) => {
    NotaCompraService.obtenerNotaCompraPorId(notaId)
      .then(response => {
        setDetalleCompra(response.data.detalleCompras);
        setShowDetalleModal(true);
      })
      .catch(error => {
        console.error('Error al obtener los detalles de compra:', error);
      });
  };

  if (loading) {
    return <div>Cargando notas de compra...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Notas de Compra</h1>

        {/* Buscar nota de compra por ID */}
        <div className="buscar-nota-compra">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar nota de compra por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar detalles de la nota de compra encontrada */}
        {notaCompraEncontrada && (
          <div className="nota-compra-encontrada mt-4">
            <h3>Nota de Compra Encontrada</h3>
            <p><strong>ID:</strong> {notaCompraEncontrada.id}</p>
            <p><strong>Fecha:</strong> {notaCompraEncontrada.fechaVenta}</p>
            <p><strong>Total:</strong> {notaCompraEncontrada.total}</p>
            <p><strong>Sucursal:</strong> {notaCompraEncontrada.sucursal ? notaCompraEncontrada.sucursal.nombre : 'Sin sucursal'}</p>
          </div>
        )}

        {/* Tabla de notas de compra */}
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notasCompra.map(nota => (
              <tr key={nota.id}>
                <td>{nota.id}</td>
                <td>{nota.fechaVenta}</td>
                <td>{nota.total}</td>
                <td>{nota.sucursal ? nota.sucursal.nombre : 'Sin sucursal'}</td>
                <td>
                  <button className="btn btn-info" onClick={() => handleVerDetalles(nota.id)}>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón para abrir el modal de creación */}
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Nueva Nota de Compra</button>

        {/* Modal para crear una nueva nota de compra */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Nueva Nota de Compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCrearNotaCompra}>
              <div className="form-group">
                <label>Sucursal:</label>
                <select
                  className="form-control"
                  name="sucursal.id"
                  value={nuevaNotaCompra.sucursal.id}
                  onChange={(e) => setNuevaNotaCompra({ ...nuevaNotaCompra, sucursal: { id: e.target.value } })}
                  required
                >
                  <option value="">Seleccione una sucursal</option>
                  {sucursales.map(sucursal => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="primary" type="submit">
                Crear Nota de Compra
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para mostrar detalles de compra */}
        <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de Compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detalleCompra.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleCompra.map(detalle => (
                    <tr key={detalle.id}>
                      <td>{detalle.id}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.subtotal}</td>
                      <td>{detalle.detalleProducto ? detalle.detalleProducto.nombre : 'Sin producto'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay detalles de compra para mostrar.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default GestionNotaCompra;
