import React, { useState, useEffect } from 'react';
import RolService from '../services/RolService';  // Servicio para manejar roles
import RolPermisoService from '../services/RolPermisoService';  // Servicio para manejar rol-permiso
import PermisoService from '../services/PermisoService';  // Servicio para manejar permisos
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import '../styles/RolPermiso.css';  // Estilos específicos del Dashboard

function AsignarPermisos() {
  const [rol, setRol] = useState(null);  // Rol seleccionado
  const [buscarId, setBuscarId] = useState('');  // Estado para buscar por ID
  const [rolPermisos, setRolPermisos] = useState([]);  // Permisos asignados al rol
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);  // Permisos disponibles para asignar
  const [permisoSeleccionado, setPermisoSeleccionado] = useState('');  // Permiso seleccionado para agregar

  // Cargar todos los permisos disponibles al iniciar el componente
  useEffect(() => {
    PermisoService.obtenerPermisos()
      .then(response => {
        setPermisosDisponibles(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los permisos:', error);
      });
  }, []);

  // Función para buscar un rol por ID y cargar sus permisos
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID.');
      return;
    }

    // Buscar el rol por ID
    RolService.obtenerRolPorId(buscarId)
      .then(response => {
        setRol(response.data);

        // Obtener las relaciones rol-permiso por el rolId
        RolPermisoService.obtenerPermisosPorRolId(buscarId)
          .then(response => {
            setRolPermisos(response.data);
            // Filtrar los permisos que ya están asignados
            const permisosNoAsignados = permisosDisponibles.filter(p => 
              !response.data.some(rp => rp.permiso.id === p.id)
            );
            setPermisosDisponibles(permisosNoAsignados);
          })
          .catch(error => {
            console.error('Error al obtener los permisos del rol:', error);
            setRolPermisos([]);
          });
      })
      .catch(error => {
        console.error('Error al buscar el rol:', error);
        alert('Rol no encontrado');
        setRol(null);
        setRolPermisos([]);
      });
  };

  // Función para eliminar un rol-permiso
  const handleEliminarRolPermiso = (idRolPermiso) => {
      RolPermisoService.EliminarRolPermiso(idRolPermiso)
        .then(() => {
          console.log('Permiso eliminado exitosamente');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error al eliminar el permiso:', error);
        });
  };

  // Función para agregar un nuevo permiso al rol
  const handleAgregarPermiso = () => {
    if (!permisoSeleccionado) {
      alert('Por favor, seleccione un permiso.');
      return;
    }

    const nuevaRelacion = {
      fechaAsignacion: new Date().toISOString().split('T')[0],  // Fecha actual
      rol: { id: rol.id },
      permiso: { id: permisoSeleccionado }
    };

    RolPermisoService.crearRolPermiso(nuevaRelacion)
      .then(() => {
        console.log('Permiso agregado exitosamente');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al agregar el permiso:', error);
      });
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Asignar Permisos</h1>

        {/* Buscar rol por ID */}
        <div className="buscar-rol">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar rol por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar detalles del rol encontrado */}
        {rol && (
          <div className="rol-encontrado">
            <h3>Rol Encontrado</h3>
            <p><strong>ID:</strong> {rol.id}</p>
            <p><strong>Nombre:</strong> {rol.nombre}</p>

            {/* Seleccionar permiso disponible */}
            <div className="asignar-permiso">
              <select
                className="form-control"
                value={permisoSeleccionado}
                onChange={(e) => setPermisoSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar Permiso</option>
                {permisosDisponibles.map((permiso) => (
                  <option key={permiso.id} value={permiso.id}>
                    {permiso.nombre}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary mt-2" onClick={handleAgregarPermiso}>
                Asignar Permiso
              </button>
            </div>

            {/* Tabla de permisos asignados */}
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>ID Relación</th>
                  <th>Fecha Asignación</th>
                  <th>Permiso</th>  {/* Nueva columna para mostrar el nombre del permiso */}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rolPermisos.map((rolPermiso) => (
                  <tr key={rolPermiso.id}>
                    <td>{rolPermiso.id}</td>  {/* ID de la relación rol-permiso */}
                    <td>{rolPermiso.fechaAsignacion ? rolPermiso.fechaAsignacion : "Sin fecha"}</td>  {/* Fecha asignada */}
                    <td>{rolPermiso.permiso ? rolPermiso.permiso.nombre : "Permiso no disponible"}</td>  {/* Nombre del permiso */}
                    <td>
                      <button className="btn btn-danger" onClick={() => handleEliminarRolPermiso(rolPermiso.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignarPermisos;
