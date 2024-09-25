// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
export const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Lee el tema desde localStorage cuando la aplicación se carga
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
      if (JSON.parse(savedTheme)) {
        document.body.classList.add('dark-mode');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('darkMode', JSON.stringify(newTheme)); // Guarda el estado en localStorage
    if (newTheme) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
