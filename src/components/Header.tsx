import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header(){
  return (
    <header className="site-header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div className="logo">Ritem Pro</div>
      </div>
      <nav className="nav">
        <a href="#features" style={{color:'var(--muted)'}}>Suites</a>
        <a href="#pricing" style={{color:'var(--muted)'}}>Pricing</a>
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
