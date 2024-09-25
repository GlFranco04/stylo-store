import React, { useState } from 'react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    setDarkMode(!darkMode);
  };

  return (
    <button 
      style={{ 
        backgroundColor: darkMode ? 'white' : '#252525', 
        color: darkMode ? '#252525' : 'white' 
      }}
      onClick={toggleTheme} 
      className="btn btn-secondary theme-toggle-btn"
    >
      {darkMode ? '☼' : '☾'}
    </button>
  );
}

export default ThemeToggle;