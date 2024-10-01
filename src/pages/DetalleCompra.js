import React, { useState, useEffect } from 'react';
import NotaCompraService from '../services/NotaCompraService';
import DetalleProductoService from '../services/DetalleProductoService'; // Importar el servicio de detalleProducto
import { Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

function AsignarCompra() {
  const [buscarId, setBuscarId] = useState(''); // Estado para el ID de búsqueda
  const [notaCompra, setNotaCompra] = useState(null); // Estado para almacenar la nota de compra encontrada
  const [detalleCompra, setDetalleCompra] = useState([]); // Estado para almacenar los detalles de compra asociados
  const [detalleProductos, setDetalleProductos] = useState([]); // Estado para almacenar los detalleProducto disponibles
  const [productoSeleccionado, setProductoSeleccionado] = useState(''); // Estado para el detalleProducto seleccionado
  const [cantidad, setCantidad] = useState(''); // Estado para la cantidad

  useEffect(() => {
    cargarDetalleProductos(); // Cargar los detalleProducto disponibles al iniciar
  }, []);

  // Cargar todos los detalleProducto disponibles
  const cargarDetalleProductos = () => {
    DetalleProductoService.obtenerDetalleProductos()
      .then(response => {
        setDetalleProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
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
        setNotaCompra(response.data);

        // Luego de obtener la nota de compra, buscar los detalles asociados
        NotaCompraService.obtenerDetallesCompraPorNotaCompraId(buscarId)
          .then(detalleResponse => {
            setDetalleCompra(detalleResponse.data || []);
          })
          .catch(error => {
            console.error('Error al obtener los detalles de compra:', error);
            setDetalleCompra([]);
          });
      })
      .catch(error => {
        console.error('Error al buscar la nota de compra:', error);
        alert('Nota de compra no encontrada');
        setNotaCompra(null);
        setDetalleCompra([]);
      });
  };

  // Manejar la asignación de un nuevo detalle de compra
  const handleAsignarDetalle = () => {
    if (!productoSeleccionado || !cantidad) {
      alert('Por favor, seleccione un producto y especifique la cantidad.');
      return;
    }

    const nuevoDetalleCompra = {
      cantidad: parseInt(cantidad, 10),
      subtotal: 0, // Este valor debería calcularse correctamente en el backend
      notaCompra: { id: notaCompra.id },
      detalleProducto: { id: productoSeleccionado }
    };

    NotaCompraService.crearDetalleCompra(nuevoDetalleCompra)
      .then(() => {
        console.log('Detalle de compra asignado correctamente');
        handleBuscarPorId(); // Recargar la nota de compra para actualizar los detalles
      })
      .catch(error => {
        console.error('Error al asignar el detalle de compra:', error);
      });
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Asignar Compra</h1>

        {/* Buscar nota de compra por ID */}
        <div className="buscar-nota-compra">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar nota de compra por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <Button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </Button>
        </div>

        {/* Mostrar detalles de la nota de compra encontrada */}
        {notaCompra && (
          <div className="nota-compra-encontrada mt-4">
            <h3>Nota de Compra</h3>
            <p><strong>ID:</strong> {notaCompra.id}</p>
            <p><strong>Fecha:</strong> {notaCompra.fechaVenta}</p>
            <p><strong>Total:</strong> {notaCompra.total}</p>
            <p><strong>Sucursal:</strong> {notaCompra.sucursal ? notaCompra.sucursal.nombre : 'Sin sucursal'}</p>

            {/* Mostrar los detalles de compra asociados */}
            <h4 className="mt-4">Detalles de Compra</h4>
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

            {/* Formulario para asignar un nuevo detalle de compra */}
            <h4 className="mt-4">Asignar Nuevo Detalle de Compra</h4>
            <div className="form-group">
              <label>Producto:</label>
              <select
                className="form-control"
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {detalleProductos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <Button className="btn btn-success" onClick={handleAsignarDetalle}>
              Asignar Detalle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignarCompra;
