import React, { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkTheme);
  }, [isDarkTheme]);

  return (
    <button
      onClick={() => setIsDarkTheme(!isDarkTheme)}
      className="theme-toggle"
    >
      {isDarkTheme ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;