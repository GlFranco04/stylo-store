// src/components/ThemeToggle.js
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';  // Importa el contexto

function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Usa el contexto para acceder al estado y la función

  return (
    <button 
      onClick={toggleTheme} 
      className="btn btn-secondary theme-toggle-btn"
      style={{ 
        backgroundColor: darkMode ? 'white' : '#252525', 
        color: darkMode ? '#252525' : 'white' 
      }}
    >
      {darkMode ? '☼' : '☾'}
    </button>
  );
}

export default ThemeToggle;
