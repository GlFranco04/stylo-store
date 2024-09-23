import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ThemeToggle from './components/ThemeToggle';  // Si lo tienes en una carpeta components

function App() {
  return (
    <Router>
      <div>
        <ThemeToggle /> {/* Botón para cambiar entre temas */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
