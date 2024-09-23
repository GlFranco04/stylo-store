import React, { useEffect, useState } from 'react';
import ProductoService from '../services/ProductoService';

function ProductoList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Llamada a la API para obtener los productos
    ProductoService.obtenerProductos()
      .then(response => {
        console.log('Productos recibidos:', response.data);  // Para depuración
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {productos.length > 0 ? (
          productos.map(producto => (
            <li key={producto.id}>           
              {producto.id} - {producto.nombre} - {producto.descripcion}
            </li>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </ul>
    </div>
  );
}

export default ProductoList;
