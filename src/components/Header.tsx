import React from 'react';
import DarkModeToggle from './DarkModeToggle';

export default function Header(){
  return (
    <header className="site-header">
      <div className="logo">Ritem Pro</div>
      <nav className="nav">
        <a href="#features" style={{color:'var(--muted)'}}>Suites</a>
        <a href="#pricing" style={{color:'var(--muted)'}}>Pricing</a>
        <DarkModeToggle />
      </nav>
    </header>
  );
}
