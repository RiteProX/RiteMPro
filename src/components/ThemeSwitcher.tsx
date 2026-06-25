import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSwitcher(){
  const { theme, setTheme, bright, setBright } = useTheme();
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <select aria-label="Theme" value={theme} onChange={(e)=> setTheme(e.target.value as any)} style={{background:'transparent',color:'var(--text)',border:'1px solid rgba(255,255,255,0.06)',padding:'6px 8px',borderRadius:8}}>
        <option value="futuristic">Futuristic</option>
        <option value="warm">Warm Premium</option>
      </select>
      <label style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,color:'var(--muted)'}}>
        <input type="checkbox" checked={bright} onChange={(e)=> setBright(e.target.checked)} />
        Bright
      </label>
    </div>
  );
}
