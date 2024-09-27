import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import DetalleProductoService from '../services/DetalleProductoService'; // Servicio para manejar detalle producto
import ProductoService from '../services/ProductoService';  // Servicio para manejar productos
import TallaService from '../services/TallaService';  // Servicio para manejar tallas
import { Modal, Button } from 'react-bootstrap';  // Importar Modal de Bootstrap
import '../styles/DetalleProducto.css';  // Estilos específicos del Dashboard de detalle producto

function GestionDetalleProducto() {
  const [detallesProducto, setDetallesProducto] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetalleProducto, setSelectedDetalleProducto] = useState(null);
  const [nuevoDetalleProducto, setNuevoDetalleProducto] = useState({
    precio: '',
    color: '',
    producto: { id: '' },  // Cambiado a objeto con estructura { id: '' }
    talla: { id: '' }  // Cambiado a objeto con estructura { id: '' }
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [buscarId, setBuscarId] = useState('');  // Estado para manejar la búsqueda por ID
  const [detalleEncontrado, setDetalleEncontrado] = useState(null);  // Estado para almacenar el detalle encontrado
  const detallesPorPagina = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    DetalleProductoService.obtenerDetalleProductos()
      .then(response => {
        setDetallesProducto(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los detalles del producto:', error);
        setLoading(false);
      });

    ProductoService.obtenerProductos()
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });

    TallaService.obtenerTallas()
      .then(response => {
        setTallas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las tallas:', error);
      });
  };

  // Función para buscar detalle por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID de detalle de producto.');
      return;
    }
    DetalleProductoService.obtenerDetalleProductoPorId(buscarId)
      .then(response => {
        setDetalleEncontrado(response.data);  // Almacenar el detalle encontrado
      })
      .catch(error => {
        console.error('Error al buscar el detalle de producto:', error);
        alert('Detalle de producto no encontrado');
        setDetalleEncontrado(null);  // Reiniciar si no se encuentra
      });
  };

  const handleCrearDetalleProducto = (e) => {
    e.preventDefault();

    // Validar que productoId y tallaId no sean vacíos
    if (!nuevoDetalleProducto.producto.id || !nuevoDetalleProducto.talla.id) {
      alert('Por favor, seleccione un producto y una talla.');
      return;
    }

    DetalleProductoService.crearDetalleProducto(nuevoDetalleProducto)
      .then(response => {
        console.log('Detalle de producto creado exitosamente:', response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al crear el detalle del producto:', error);
      });
  };

  const handleEditarDetalleProducto = (detalleProducto) => {
    setSelectedDetalleProducto({
      ...detalleProducto,
      producto: { id: detalleProducto.producto.id },  // Estructura del objeto producto
      talla: { id: detalleProducto.talla.id }  // Estructura del objeto talla
    });
    setShowEditModal(true);
  };

  const handleGuardarCambios = () => {
    if (!selectedDetalleProducto.producto.id || !selectedDetalleProducto.talla.id) {
      alert('Por favor, seleccione un producto y una talla.');
      return;
    }

    DetalleProductoService.actualizarDetalleProducto(selectedDetalleProducto.id, selectedDetalleProducto)
      .then(response => {
        console.log('Detalle de producto actualizado:', response.data);
        setShowEditModal(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al actualizar el detalle del producto:', error);
      });
  };

  const handleEliminarDetalleProducto = (idDetalleProducto) => {
    if (window.confirm('¿Estás seguro de eliminar este detalle de producto?')) {
      DetalleProductoService.eliminarDetalleProducto(idDetalleProducto)
        .then(() => {
          console.log('Detalle de producto eliminado exitosamente');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error al eliminar el detalle del producto:', error);
        });
    }
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (e, isCreate = false) => {
    const { name, value } = e.target;
  
    if (name === 'productoId') {
      const productoSeleccionado = productos.find(producto => producto.id === parseInt(value));
      if (isCreate) {
        setNuevoDetalleProducto({ ...nuevoDetalleProducto, producto: productoSeleccionado });
      } else {
        setSelectedDetalleProducto({ ...selectedDetalleProducto, producto: productoSeleccionado });
      }
    } else if (name === 'tallaId') {
      const tallaSeleccionada = tallas.find(talla => talla.id === parseInt(value));
      if (isCreate) {
        setNuevoDetalleProducto({ ...nuevoDetalleProducto, talla: tallaSeleccionada });
      } else {
        setSelectedDetalleProducto({ ...selectedDetalleProducto, talla: tallaSeleccionada });
      }
    } else {
      if (isCreate) {
        setNuevoDetalleProducto({ ...nuevoDetalleProducto, [name]: value });
      } else {
        setSelectedDetalleProducto({ ...selectedDetalleProducto, [name]: value });
      }
    }
  };

  const indexOfLastDetalleProducto = currentPage * detallesPorPagina;
  const indexOfFirstDetalleProducto = indexOfLastDetalleProducto - detallesPorPagina;
  const detallesActuales = detallesProducto.slice(indexOfFirstDetalleProducto, indexOfLastDetalleProducto);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando detalles de productos...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Detalle de Productos</h1>

        {/* Buscar detalle por ID */}
        <div className="buscar-detalle">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar detalle de producto por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar detalles del producto encontrado */}
        {detalleEncontrado && (
          <div className="detalle-encontrado">
            <h3>Detalle de Producto Encontrado</h3>
            <p><strong>ID:</strong> {detalleEncontrado.id}</p>
            <p><strong>Precio:</strong> {detalleEncontrado.precio}</p>
            <p><strong>Color:</strong> {detalleEncontrado.color}</p>
            <p><strong>Producto:</strong> {detalleEncontrado.producto ? detalleEncontrado.producto.nombre : 'Producto no disponible'}</p>
            <p><strong>Talla:</strong> {detalleEncontrado.talla ? detalleEncontrado.talla.nombre : 'Talla no disponible'}</p>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Precio</th>
              <th>Color</th>
              <th>Producto</th> {/* Nombre del producto */}
              <th>Talla</th> {/* Talla */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detallesActuales.map(detalle => (
              <tr key={detalle.id}>
                <td>{detalle.id}</td>
                <td>{detalle.precio}</td>
                <td>{detalle.color}</td>
                <td>{detalle.producto ? detalle.producto.nombre : 'Producto no disponible'}</td>
                <td>{detalle.talla ? detalle.talla.nombre : 'Talla no disponible'}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleEditarDetalleProducto(detalle)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleEliminarDetalleProducto(detalle.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(detallesProducto.length / detallesPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Agregar Detalle de Producto</button>
      </div>

      {/* Modal para editar detalle de producto */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Detalle de Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetalleProducto && (
            <form>
              <div className="form-group">
                <label>Precio:</label>
                <input
                  type="text"
                  className="form-control"
                  name="precio"
                  value={selectedDetalleProducto.precio}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Color:</label>
                <input
                  type="text"
                  className="form-control"
                  name="color"
                  value={selectedDetalleProducto.color}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Producto:</label>
                <select
                  className="form-control"
                  name="productoId"
                  value={selectedDetalleProducto.producto.id}
                  onChange={(e) => handleInputChange(e)}
                >
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Talla:</label>
                <select
                  className="form-control"
                  name="tallaId"
                  value={selectedDetalleProducto.talla.id}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="">Seleccione una talla</option>
                  {tallas.map(talla => (
                    <option key={talla.id} value={talla.id}>
                      {talla.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarCambios}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear detalle de producto */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Detalle de Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="text"
                className="form-control"
                name="precio"
                value={nuevoDetalleProducto.precio}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Color:</label>
              <input
                type="text"
                className="form-control"
                name="color"
                value={nuevoDetalleProducto.color}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Producto:</label>
              <select
                className="form-control"
                name="productoId"
                value={nuevoDetalleProducto.producto.id}
                onChange={(e) => handleInputChange(e, true)}
              >
                <option value="">Seleccione un producto</option>
                {productos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Talla:</label>
              <select
                className="form-control"
                name="tallaId"
                value={nuevoDetalleProducto.talla.id}
                onChange={(e) => handleInputChange(e, true)}
              >
                <option value="">Seleccione una talla</option>
                {tallas.map(talla => (
                  <option key={talla.id} value={talla.id}>
                    {talla.nombre}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleCrearDetalleProducto}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionDetalleProducto;
