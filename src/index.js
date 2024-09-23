import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Estilos globales
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Asegurarse de importar los scripts JS de Bootstrap

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
