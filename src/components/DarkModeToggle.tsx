import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function DarkModeToggle(){
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme(theme === 'futuristic' ? 'warm' : 'futuristic');
  return (
    <button onClick={toggle} className="btn" aria-label="Toggle theme">
      {theme === 'futuristic' ? 'Warm' : 'Futuristic'}
    </button>
  );
}
