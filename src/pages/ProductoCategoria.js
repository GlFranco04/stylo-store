import React, { useState, useEffect } from 'react';
import ProductoService from '../services/ProductoService';  // Servicio para manejar productos
import ProductoCategoriaService from '../services/ProductoCategoriaService';  // Servicio para manejar la relación producto-categoría
import CategoriaService from '../services/CategoriaService';  // Servicio para manejar categorías
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import '../styles/Usuario.css';  // Estilos específicos

function AsignarCategorias() {
  const [producto, setProducto] = useState(null);  // Producto seleccionado
  const [buscarId, setBuscarId] = useState('');  // Estado para buscar por ID
  const [productoCategorias, setProductoCategorias] = useState([]);  // Categorías asignadas al producto
  const [categorias, setCategorias] = useState([]);  // Todas las categorías disponibles
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');  // Para manejar la categoría seleccionada
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);  // Categorías no asignadas al producto
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const categoriasPorPagina = 10;  // Categorías por página

  useEffect(() => {
    // Cargar todas las categorías disponibles
    CategoriaService.obtenerCategorias()
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al obtener las categorías:', error));
  }, []);

  // Función para buscar un producto por ID y cargar sus categorías asignadas
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID de producto.');
      return;
    }

    // Buscar el producto por ID
    ProductoService.obtenerProductoPorId(buscarId)
      .then(response => { 
        setProducto(response.data);

        // Obtener las relaciones producto-categoría por el productoId
        ProductoCategoriaService.obtenerCategoriasPorProductoId(buscarId)
          .then(response => {
            setProductoCategorias(response.data);

            // Filtrar las categorías que aún no están asignadas al producto
            const categoriasAsignadas = response.data.map(pc => pc.categoria.id);
            const categoriasNoAsignadas = categorias.filter(categoria => !categoriasAsignadas.includes(categoria.id));
            setCategoriasDisponibles(categoriasNoAsignadas);
          })
          .catch(error => {
            console.error('Error al obtener las categorías del producto:', error);
            setProductoCategorias([]);
            setCategoriasDisponibles(categorias);  // Mostrar todas las categorías si ocurre un error
          });
      })
      .catch(error => {
        console.error('Error al buscar el producto:', error);
        alert('Producto no encontrado');
        setProducto(null);
        setProductoCategorias([]);
        setCategoriasDisponibles([]);
      });
  };

  // Función para eliminar una categoría asignada al producto
  const handleEliminarProductoCategoria = (idProductoCategoria) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría del producto?')) {
      ProductoCategoriaService.EliminarProductoCategoria(idProductoCategoria)
        .then(() => {
          console.log('Categoría eliminada exitosamente');
          // Actualizar la lista de categorías asignadas
          setProductoCategorias(prevState => prevState.filter(pc => pc.id !== idProductoCategoria));

          // Agregar la categoría eliminada a las categorías disponibles
          const categoriaEliminada = productoCategorias.find(pc => pc.id === idProductoCategoria).categoria;
          setCategoriasDisponibles([...categoriasDisponibles, categoriaEliminada]);
        })
        .catch(error => {
          console.error('Error al eliminar la categoría del producto:', error);
        });
    }
  };

  // Función para agregar una nueva categoría al producto
  const handleAgregarCategoria = () => {
    if (!categoriaSeleccionada) {
      alert('Por favor, seleccione una categoría válida.');
      return;
    }

    const nuevaRelacion = {
      producto: { id: producto.id },
      categoria: { id: categoriaSeleccionada }
    };

    ProductoCategoriaService.crearProductoCategoria(nuevaRelacion)
      .then(response => {
        console.log('Categoría asignada exitosamente:', response.data);

        // Buscar el nombre de la categoría desde el array de categorías disponibles
        const categoriaAgregada = categorias.find(categoria => categoria.id === parseInt(categoriaSeleccionada));

        // Actualizar la lista de categorías asignadas con el nombre de la nueva categoría
        setProductoCategorias([...productoCategorias, { ...response.data, categoria: categoriaAgregada }]);

        // Remover la categoría asignada de las categorías disponibles
        setCategoriasDisponibles(categoriasDisponibles.filter(categoria => categoria.id !== parseInt(categoriaSeleccionada)));
        setCategoriaSeleccionada('');  // Limpiar la selección
      })
      .catch(error => {
        console.error('Error al asignar la categoría:', error);
      });
  };

  // Paginación
  const indexOfLastCategoria = currentPage * categoriasPorPagina;
  const indexOfFirstCategoria = indexOfLastCategoria - categoriasPorPagina;
  const categoriasActuales = productoCategorias.slice(indexOfFirstCategoria, indexOfLastCategoria);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Asignar Categorías</h1>

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

        {/* Agregar nueva categoría */}
        {producto && (
          <div className="agregar-categoria mt-4">
            <h3>Asignar Nueva Categoría al Producto</h3>
            <select
              className="form-control"
              value={categoriaSeleccionada}  // Vincular con el estado de la categoría seleccionada
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}  // Almacenar la categoría seleccionada
            >
              <option value="">Seleccione una categoría</option>
              {categoriasDisponibles.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <button className="btn btn-success mt-2" onClick={handleAgregarCategoria}>
              Asignar Categoría
            </button>
          </div>
        )}

        {/* Mostrar detalles del producto encontrado */}
        {producto && (
          <div className="producto-encontrado">
            <h3>Producto Encontrado</h3>
            <p><strong>ID:</strong> {producto.id}</p>
            <p><strong>Nombre:</strong> {producto.nombre}</p>

            {/* Tabla de categorías asignadas */}
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>ID Relación</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasActuales.map((productoCategoria) => (
                  <tr key={productoCategoria.id}>
                    <td>{productoCategoria.id}</td>
                    <td>{productoCategoria.categoria ? productoCategoria.categoria.nombre : "Categoría no disponible"}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleEliminarProductoCategoria(productoCategoria.id)}>
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
                {Array.from({ length: Math.ceil(productoCategorias.length / categoriasPorPagina) }).map((_, index) => (
                  <li key={index + 1} className="page-item">
                    <button onClick={() => paginate(index + 1)} className="page-link">
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignarCategorias;
