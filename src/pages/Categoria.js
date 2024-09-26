import React, { useEffect, useState } from 'react';
import CategoriaService from '../services/CategoriaService';  // Servicio para manejar las categorías
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import { Modal, Button } from 'react-bootstrap';  // Importar Modal de Bootstrap
import '../styles/Categoria.css';  // Estilos específicos del Dashboard

function GestionarCategorias() {
  const [categorias, setCategorias] = useState([]);  // Lista de todas las categorías
  const [loading, setLoading] = useState(true);
  const [buscarId, setBuscarId] = useState('');  // Estado para buscar por ID
  const [categoriaEncontrada, setCategoriaEncontrada] = useState(null); // Estado para almacenar la categoría encontrada por ID
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });  // Datos de la nueva categoría
  const [categoriaEditada, setCategoriaEditada] = useState(null); // Estado para la categoría a modificar
  const [showCreateModal, setShowCreateModal] = useState(false);  // Estado para el modal de crear categoría
  const [showEditModal, setShowEditModal] = useState(false);  // Estado para el modal de editar categoría
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const categoriasPorPagina = 10;  // Número de categorías por página

  useEffect(() => {
    // Obtener todas las categorías
    CategoriaService.obtenerCategorias()
      .then(response => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
        setLoading(false);
      });
  }, []);

  // Función para buscar por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID.');
      setCategoriaEncontrada(null);
      return;
    }

    CategoriaService.obtenerCategoriaPorId(buscarId)
      .then(response => {
        setCategoriaEncontrada(response.data);
      })
      .catch(error => {
        console.error('Error al buscar la categoría:', error);
        alert('Categoría no encontrada');
        setCategoriaEncontrada(null);
      });
  };

  // Función para crear una nueva categoría
  const handleCrearCategoria = () => {
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const categoriaData = { ...nuevaCategoria, estaActivo: true };  // Categoría creada como activa por defecto

    CategoriaService.crearCategoria(categoriaData)
      .then(() => {
        console.log('Categoría creada exitosamente');
        window.location.reload();  // Recargar la página después de crear
      })
      .catch(error => {
        console.error('Error al crear la categoría:', error);
      });
  };

  // Función para abrir el modal de editar categoría
  const handleAbrirEditarModal = (categoria) => {
    setCategoriaEditada(categoria);
    setShowEditModal(true);
  };

  // Función para manejar el cambio de nombre y descripción de la categoría en el modal de editar
  const handleEditarCategoria = () => {
    if (!categoriaEditada || !categoriaEditada.nombre || !categoriaEditada.descripcion) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    CategoriaService.actualizarCategoria(categoriaEditada.id, categoriaEditada)
      .then(() => {
        console.log('Categoría modificada exitosamente');
        setShowEditModal(false);  // Cerrar el modal
        window.location.reload();  // Recargar la página
      })
      .catch(error => {
        console.error('Error al modificar la categoría:', error);
      });
  };

  // Función para eliminar o desactivar/activar una categoría
  const handleToggleCategoria = (id, estadoActual) => {
    CategoriaService.desactivarCategoria(id, !estadoActual)
      .then(() => {
        console.log(`Categoría ${estadoActual ? 'desactivada' : 'activada'} exitosamente`);
        window.location.reload();  // Recargar la página
      })
      .catch(error => {
        console.error('Error al cambiar el estado de la categoría:', error);
      });
  };

  // Obtener las categorías para la página actual
  const indexOfLastCategoria = currentPage * categoriasPorPagina;
  const indexOfFirstCategoria = indexOfLastCategoria - categoriasPorPagina;
  const categoriasActuales = categorias.slice(indexOfFirstCategoria, indexOfLastCategoria);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Categorías</h1>
        
        {/* Sección para buscar categoría por ID */}
        <div className="buscar-categoria">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar categoría por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar categoría encontrada */}
        {categoriaEncontrada && (
          <div className="categoria-encontrada">
            <h3>Categoría Encontrada</h3>
            <p>Id: {categoriaEncontrada.id}</p>
            <p>Nombre: {categoriaEncontrada.nombre}</p>
            <p>Descripción: {categoriaEncontrada.descripcion}</p>
            <p>Estado: {categoriaEncontrada.estaActivo ? 'Activo' : 'Inactivo'}</p>
          </div>
        )}

        {/* Listar todas las categorías */}
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasActuales.map(categoria => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>{categoria.estaActivo ? 'Activo' : 'No activo'}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleToggleCategoria(categoria.id, categoria.estaActivo)}>
                    Activar/Desactivar
                  </button>
                  <button className="btn btn-info" onClick={() => handleAbrirEditarModal(categoria)}>
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
            {Array.from({ length: Math.ceil(categorias.length / categoriasPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón para abrir el modal de crear categoría */}
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Categoría</button>
      </div>

      {/* Modal para crear categoría */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre de la Categoría:</label>
              <input
                type="text"
                className="form-control"
                value={nuevaCategoria.nombre}
                onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                className="form-control"
                value={nuevaCategoria.descripcion}
                onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearCategoria}>
            Crear Categoría
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar categoría */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre de la Categoría:</label>
              <input
                type="text"
                className="form-control"
                value={categoriaEditada ? categoriaEditada.nombre : ''}
                onChange={(e) => setCategoriaEditada({ ...categoriaEditada, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                className="form-control"
                value={categoriaEditada ? categoriaEditada.descripcion : ''}
                onChange={(e) => setCategoriaEditada({ ...categoriaEditada, descripcion: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditarCategoria}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionarCategorias;
