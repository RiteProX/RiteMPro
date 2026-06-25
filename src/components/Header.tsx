import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import MobileNav from './MobileNav';

type Props = {
  currentTab?: string;
  onChangeTab?: (tab:string)=>void;
  onOpenAuth?: ()=>void;
};

export default function Header({ currentTab='home', onChangeTab=()=>{}, onOpenAuth=()=>{} }:Props){
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header" role="banner">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button className="logo" aria-label="Open menu" onClick={()=>setOpen(!open)} aria-expanded={open}>{open? '✕':'☰'}</button>
        <div className="logo" style={{fontSize:18}}>Ritem Pro</div>
      </div>
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <a href="#features" onClick={()=>onChangeTab('home')} style={{color:'var(--muted)'}}>Suites</a>
        <a href="#pricing" onClick={()=>onChangeTab('pricing')} style={{color:'var(--muted)'}}>Pricing</a>
        <ThemeSwitcher />
        <button className="btn" onClick={onOpenAuth} aria-haspopup="dialog" aria-label="Sign in">Sign In</button>
      </nav>

      {/* slide-over mobile nav */}
      {open && <MobileNav onClose={()=>setOpen(false)} onSelect={(t)=>{ onChangeTab(t); setOpen(false); }} />}
    </header>
  );
}
