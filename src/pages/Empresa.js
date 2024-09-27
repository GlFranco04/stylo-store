import React, { useState, useEffect } from 'react';
import EmpresaService from '../services/EmpresaService';
import Sidebar from '../components/Sidebar';
import { Modal, Button } from 'react-bootstrap';  // Usaremos un modal para la edición

function GestionEmpresa() {
  const [empresa, setEmpresa] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    propietario: ''
  });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);  // Control del modal de edición

  useEffect(() => {
    // Cargar los datos de la empresa (ID 1)
    EmpresaService.obtenerEmpresaPorId(1)
      .then(response => {
        setEmpresa(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener la empresa:', error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleGuardarCambios = () => {
    EmpresaService.actualizarEmpresa(1, empresa)
      .then(() => {
        alert('Datos actualizados correctamente');
        setShowEditModal(false);  // Cerrar el modal después de guardar los cambios
      })
      .catch(error => {
        console.error('Error al actualizar los datos de la empresa:', error);
      });
  };

  if (loading) {
    return <div>Cargando datos de la empresa...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Empresa</h1>

        {/* Mostrar los datos de la empresa */}
        <div className="empresa-detalle">
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>Correo:</strong> {empresa.correo}</p>
          <p><strong>Teléfono:</strong> {empresa.telefono}</p>
          <p><strong>Propietario:</strong> {empresa.propietario}</p>

          {/* Botón para abrir el modal de edición */}
          <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
            Editar Empresa
          </button>
        </div>

        {/* Modal para editar los datos de la empresa */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Empresa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Nombre:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="nombre" 
                  value={empresa.nombre} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Correo:</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="correo" 
                  value={empresa.correo} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="telefono" 
                  value={empresa.telefono} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Propietario:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="propietario" 
                  value={empresa.propietario} 
                  onChange={handleInputChange} 
                />
              </div>
            </form>
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
      </div>
    </div>
  );
}

export default GestionEmpresa;
