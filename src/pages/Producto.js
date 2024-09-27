import React, { useEffect, useState } from 'react';
import ProductoService from '../services/ProductoService';
import Sidebar from '../components/Sidebar';
import { Modal, Button } from 'react-bootstrap';

function GestionProducto() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    estaActivo: true,
    fechaCreacion: new Date().toISOString().split('T')[0],  // Fecha actual
  });
  const [buscarId, setBuscarId] = useState(''); // Estado para manejar la búsqueda por ID
  const [productoEncontrado, setProductoEncontrado] = useState(null); // Estado para almacenar el producto encontrado
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 10;

  useEffect(() => {
    ProductoService.obtenerProductos()
      .then(response => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      });
  }, []);

  // Función para buscar producto por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID de producto.');
      return;
    }
    ProductoService.obtenerProductoPorId(buscarId)
      .then(response => {
        setProductoEncontrado(response.data); // Almacenar el producto encontrado
      })
      .catch(error => {
        console.error('Error al buscar el producto:', error);
        alert('Producto no encontrado');
        setProductoEncontrado(null); // Reiniciar si no se encuentra el producto
      });
  };

  const handleCrearProducto = (e) => {
    e.preventDefault();
    ProductoService.crearProducto(nuevoProducto)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al crear el producto:', error);
      });
  };

  const handleEditarProducto = (producto) => {
    setSelectedProducto(producto);
    setShowEditModal(true);
  };

  const handleGuardarCambios = () => {
    ProductoService.actualizarProducto(selectedProducto.id, selectedProducto)
      .then(response => {
        setShowEditModal(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al actualizar el producto:', error);
      });
  };

  const handleActivarDesactivar = (producto) => {
    ProductoService.desactivarProducto(producto.id)
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al cambiar el estado del producto:', error);
      });
  };

  const handleInputChange = (e, isCreate = false) => {
    const { name, value } = e.target;
    if (isCreate) {
      setNuevoProducto({ ...nuevoProducto, [name]: value });
    } else {
      setSelectedProducto({ ...selectedProducto, [name]: value });
    }
  };

  const indexOfLastProducto = currentPage * productosPorPagina;
  const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
  const productosActuales = productos.slice(indexOfFirstProducto, indexOfLastProducto);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Productos</h1>

        {/* Buscar producto por ID */}
        <div className="buscar-producto">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar producto por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar detalles del producto encontrado */}
        {productoEncontrado && (
          <div className="producto-encontrado">
            <h3>Producto Encontrado</h3>
            <p><strong>ID:</strong> {productoEncontrado.id}</p>
            <p><strong>Nombre:</strong> {productoEncontrado.nombre}</p>
            <p><strong>Descripción:</strong> {productoEncontrado.descripcion}</p>
            <p><strong>Fecha Creación:</strong> {productoEncontrado.fechaCreacion}</p>
            <p><strong>Activo:</strong> {productoEncontrado.estaActivo ? 'Sí' : 'No'}</p>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha Creación</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosActuales.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.fechaCreacion}</td>
                <td>{producto.estaActivo ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleEditarProducto(producto)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleActivarDesactivar(producto)}>
                    {producto.estaActivo ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(productos.length / productosPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Producto</button>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProducto && (
            <form>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={selectedProducto.nombre}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  value={selectedProducto.descripcion}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarCambios}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                className="form-control"
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleCrearProducto}>Crear Producto</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionProducto;
