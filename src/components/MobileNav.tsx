import React from 'react';

export default function MobileNav({ onClose, onSelect }:{ onClose: ()=>void; onSelect: (t:string)=>void}){
  return (
    <div role="dialog" aria-modal="true" aria-label="Mobile menu" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'flex-start'}}>
      <div style={{width:'78%',maxWidth:360,background:'var(--bg)',padding:16}}>
        <button onClick={onClose} aria-label="Close menu" style={{marginBottom:12}}>Close</button>
        <ul style={{listStyle:'none',padding:0,display:'flex',flexDirection:'column',gap:8}}>
          <li><button onClick={()=>onSelect('home')} className="surface">Home</button></li>
          <li><button onClick={()=>onSelect('dashboard')} className="surface">Dashboard</button></li>
          <li><button onClick={()=>onSelect('templates')} className="surface">Templates</button></li>
          <li><button onClick={()=>onSelect('design')} className="surface">Cover Designer</button></li>
          <li><button onClick={()=>onSelect('export')} className="surface">Export</button></li>
        </ul>
      </div>
      <div style={{flex:1}} onClick={onClose} />
    </div>
  );
}
