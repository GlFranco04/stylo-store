import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';  // Para obtener el rol del usuario
import UsuarioService from '../services/UsuarioService'; // Un servicio para manejar los usuarios
import RolService from '../services/RolService';  // Servicio para manejar roles
import Sidebar from '../components/Sidebar';  // Importamos el Sidebar
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';  // Importar Modal de Bootstrap
import '../styles/Usuario.css';  // Estilos específicos del Dashboard

function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsuario, setSelectedUsuario] = useState(null);  // Usuario seleccionado para editar
  const [showEditModal, setShowEditModal] = useState(false);  // Estado para controlar el modal de edición
  const [showCreateModal, setShowCreateModal] = useState(false);  // Estado para controlar el modal de creación
  const [roles, setRoles] = useState([]);  // Almacenar los roles
  const [buscarId, setBuscarId] = useState('');  // Estado para el ID a buscar
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null); // Estado para almacenar el usuario encontrado
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const usuariosPorPagina = 10;  // Número de usuarios por página
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    sexo: 'M',
    rol: null,
    estaActivo: true  // Siempre por defecto en true
  });
  const userRole = AuthService.getRoleFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    UsuarioService.obtenerUsuarios()
      .then(response => {
        setUsuarios(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
        setLoading(false);
      });

    // Cargar los roles
    RolService.obtenerRoles()
      .then(response => setRoles(response.data))
      .catch(error => console.error('Error al obtener roles', error));
  }, []);

  // Función para manejar la búsqueda por ID
  const handleBuscarPorId = () => {
    if (!buscarId) {
      alert('Por favor, ingrese un ID.');
      return;
    }

    UsuarioService.obtenerUsuarioPorId(buscarId)
      .then(response => {
        setUsuarioEncontrado(response.data);
      })
      .catch(error => {
        console.error('Error al buscar el usuario:', error);
        alert('Usuario no encontrado');
        setUsuarioEncontrado(null);
      });
  };

  const handleCrearUsuario = (e) => {
    e.preventDefault();
    
    if (!nuevoUsuario.rol) {
      alert('Por favor, selecciona un rol antes de continuar.');
      return;
    }
  
    UsuarioService.crearUsuarios(nuevoUsuario)
      .then(response => {
        console.log('Usuario creado exitosamente:', response.data);
        window.location.reload();  // Recargar la página después de crear
      })
      .catch(error => {
        console.error('Error al crear el usuario:', error);
      });
  };

  const handleEditarUsuario = (usuario) => {
    setSelectedUsuario(usuario);  // Selecciona el usuario a editar
    setShowEditModal(true);  // Muestra el modal
  };

  const handleGuardarCambios = () => {
    UsuarioService.actualizarUsuario(selectedUsuario.id, selectedUsuario)
      .then(response => {
        console.log('Usuario actualizado:', response.data);
        setShowEditModal(false);  // Cierra el modal
        window.location.reload();  // Refrescar la página
      })
      .catch(error => {
        console.error('Error al actualizar el usuario:', error);
      });
  };

  const handleInputChange = (e, isCreate = false) => {
    const { name, value } = e.target;
    if (name === "rol") {
      const rolSeleccionado = roles.find(rol => rol.id === parseInt(value));
      if (isCreate) {
        setNuevoUsuario({ ...nuevoUsuario, rol: rolSeleccionado });
      } else {
        setSelectedUsuario({ ...selectedUsuario, rol: rolSeleccionado });
      }
    } else {
      if (isCreate) {
        setNuevoUsuario({ ...nuevoUsuario, [name]: value });
      } else {
        setSelectedUsuario({ ...selectedUsuario, [name]: value });
      }
    }
  };

  const handleDesactivarUsuario = (id) => {
    UsuarioService.desactivarUsuario(id)
      .then(response => {
        console.log('Usuario desactivado:', response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error al desactivar el usuario:', error);
      });
  };

  // Obtener los usuarios para la página actual
  const indexOfLastUsuario = currentPage * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
  const usuariosActuales = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Gestión de Usuarios</h1>
        
        {/* Sección para buscar usuario por ID */}
        <div className="buscar-usuario">
          <input 
            type="text"
            className="form-control"
            placeholder="Buscar usuario por ID"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
          />
          <button className="btn btn-info" onClick={handleBuscarPorId}>
            Buscar
          </button>
        </div>

        {/* Mostrar usuario encontrado */}
        {usuarioEncontrado && (
          <div className="usuario-encontrado">
            <h3>Usuario Encontrado</h3>
            <p>Id: {usuarioEncontrado.id}</p>
            <p>Nombre: {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}</p>
            <p>Correo: {usuarioEncontrado.correo}</p>
            <p>Rol: {usuarioEncontrado.rol.nombre}</p>
            <p>Estado: {usuarioEncontrado.estaActivo ? 'Activo' : 'No Activo'}</p>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th className='col_rol'>Rol</th>
              <th className='col_estado'>Estado</th>
              {userRole === 'SuperUsuario' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {usuariosActuales.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td className='col_rol'>{usuario.rol.nombre}</td>
                <td className='col_estado'>{usuario.estaActivo ? 'Activo' : 'No Activo'}</td>
                {userRole === 'SuperUsuario' && (
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEditarUsuario(usuario)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDesactivarUsuario(usuario.id)}>Activar/Desactivar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(usuarios.length / usuariosPorPagina) }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {userRole === 'SuperUsuario' && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Usuario</button>
        )}
      </div>

      {/* Modal para editar usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUsuario && (
            <form>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={selectedUsuario.nombre}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Apellido:</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={selectedUsuario.apellido}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={selectedUsuario.correo}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Sexo:</label>
                <select
                  className="form-control"
                  name="sexo"
                  value={selectedUsuario.sexo}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  className="form-control"
                  name="rol"
                  value={selectedUsuario.rol.id}  // Asegúrate de que el valor es el id del rol
                  onChange={(e) => handleInputChange(e)}
                >
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCambios}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear usuario */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                className="form-control"
                name="apellido"
                value={nuevoUsuario.apellido}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Correo:</label>
              <input
                type="email"
                className="form-control"
                name="correo"
                value={nuevoUsuario.correo}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                className="form-control"
                name="contrasena"
                value={nuevoUsuario.contrasena}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label>Sexo:</label>
              <select
                className="form-control"
                name="sexo"
                value={nuevoUsuario.sexo}
                onChange={(e) => handleInputChange(e, true)}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option> 
              </select>
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select
                className="form-control"
                name="rol"
                value={nuevoUsuario.rol ? nuevoUsuario.rol.id : ''}  // Asegura que el valor coincida con el rol seleccionado
                onChange={(e) => handleInputChange(e, true)}  // Marca el cambio para rol
              >
                <option value="">------</option>
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearUsuario}>
            Crear Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionarUsuarios;