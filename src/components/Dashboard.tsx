import React from 'react';

export default function Dashboard(){
  // Responsive grid of cards
  const demos = new Array(6).fill(0).map((_,i)=>({id:i,title:`Project ${i+1}`, type: i%2===0?'ebook':'pitch', updated: '2026-06-25'}));
  return (
    <section style={{padding:'1rem'}}>
      <h2 style={{fontSize:20,marginBottom:12}}>Your Works</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        {demos.map(d=> (
          <article key={d.id} style={{background:'var(--surface)',padding:12,borderRadius:12}}>
            <div style={{fontWeight:700}}>{d.title}</div>
            <div style={{fontSize:12,color:'var(--muted)'}}>{d.type} • Last edited {d.updated}</div>
            <div style={{marginTop:8,display:'flex',gap:8}}>
              <button style={{padding:'6px 10px',borderRadius:8,border:'none',background:'var(--accent)'}}>Open</button>
              <button style={{padding:'6px 10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)'}}>Export</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
