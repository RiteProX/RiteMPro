import React from 'react';

export default function TemplateGallery({ onSelect}:{ onSelect?: (name:string)=>void }){
  const templates = ['Serene Wellness','Bookstera Clean Pro','Magazine Bold','Academic Gold Band','Minimal Botanical'];
  return (
    <div style={{padding:'1rem'}}>
      <h3 style={{marginBottom:8}}>Templates</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
        {templates.map(t=> (
          <div key={t} style={{background:'var(--surface)',padding:12,borderRadius:12,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{height:110,background:'linear-gradient(180deg,rgba(0,0,0,0.12),transparent)',borderRadius:8}} />
            <div style={{fontWeight:700}}>{t}</div>
            <div style={{display:'flex',gap:8,marginTop:6}}>
              <button onClick={()=>onSelect?.(t)} style={{padding:'6px 10px',borderRadius:8,background:'var(--accent)',border:'none'}}>Use</button>
              <button style={{padding:'6px 10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)'}}>Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
