import React from 'react';

function ThemeSwitcher({ darkMode, toggleTheme }) {
    return (
        <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? '🌞 Modo Claro' : '🌙 Modo Escuro'}
        </button>
    );
}

export default ThemeSwitcher;
