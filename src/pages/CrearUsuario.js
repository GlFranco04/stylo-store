import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioService from '../services/UsuarioService';  // Servicio para manejar usuarios
import RolService from '../services/RolService';  // Servicio para manejar roles

function CrearUsuario() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [sexo, setSexo] = useState('M');  // Valor predeterminado 'M'
  const [rol, setRol] = useState('');     // Aquí se guarda el ID del rol seleccionado
  const [roles, setRoles] = useState([]); // Aquí se guarda la lista de roles disponibles
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los roles disponibles desde el backend
    RolService.obtenerRoles()
      .then(response => {
        setRoles(response.data);  // Guardar los roles en el estado
      })
      .catch(error => {
        console.error('Error al obtener los roles:', error);
      });
  }, []);

  // Función para manejar la creación de usuario
  const handleCrearUsuario = (e) => {
    e.preventDefault();
    
    // Datos del nuevo usuario con la estructura correcta
    const nuevoUsuario = {
      nombre: nombres,
      apellido: apellidos,
      correo,
      contrasena,
      sexo,
      estaActivo: true,  // Establecer el estado activo por defecto
      rol: {             // El objeto "rol" que incluye el ID, tal como lo espera el backend
        id: rol          // Enviar el ID del rol como un objeto anidado
      }
    };

    // Llamar al servicio para crear el usuario
    UsuarioService.crearUsuarios(nuevoUsuario)
      .then(response => {
        console.log('Usuario creado exitosamente:', response.data);
        // Redirigir a la página de gestión de usuarios
        navigate('/gestion-usuario');
      })
      .catch(error => {
        console.error('Error al crear el usuario:', error);
      });
  };

  // Función para cancelar y volver a la lista de usuarios
  const handleCancelar = () => {
    navigate('/gestion-usuario');
  };

  return (
    <div className="container">
      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={handleCrearUsuario}>
        <div className="form-group">
          <label>Nombres:</label>
          <input
            type="text"
            className="form-control"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellidos:</label>
          <input
            type="text"
            className="form-control"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Sexo:</label>
          <select
            className="form-control"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="form-group">
          <label>Rol:</label>
          <select
            className="form-control"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="">Seleccionar Rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Confirmar</button>
        <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
      </form>
    </div>
  );
}

export default CrearUsuario;
