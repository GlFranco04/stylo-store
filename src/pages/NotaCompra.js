import React, { useState, useEffect } from 'react';
import NotaCompraService from '../services/NotaCompraService';
import Sidebar from '../components/Sidebar';

function GestionNotaCompra() {
  const [notasCompra, setNotasCompra] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNotasCompra();
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

  if (loading) {
    return <div>Cargando notas de compra...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Notas de Compra</h1>

        {/* Tabla de notas de compra */}
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Sucursal</th>
            </tr>
          </thead>
          <tbody>
            {notasCompra.map(nota => (
              <tr key={nota.id}>
                <td>{nota.id}</td>
                <td>{nota.fechaVenta}</td>
                <td>{nota.total}</td>
                <td>{nota.sucursal ? nota.sucursal.nombre : 'Sin sucursal'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionNotaCompra;
