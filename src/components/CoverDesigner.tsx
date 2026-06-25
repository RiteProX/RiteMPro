import React, { useState } from 'react';

export default function CoverDesigner(){
  const [title, setTitle] = useState('My Great Book');
  const [author, setAuthor] = useState('Author Name');
  const previewHtml = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;font-family:Inter,Arial;background:linear-gradient(180deg,#07121a,#09202a);color:#fff;display:flex;align-items:center;justify-content:center;height:720px} .card{padding:40px;text-align:center}</style></head><body><div class="card"><h1>${title}</h1><p>${author}</p></div></body></html>`;

  const exportCover = async ()=>{
    const r = await fetch('/api/cover/export', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ html: previewHtml }) });
    if (!r.ok){ alert('Export failed'); return; }
    const blob = await r.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'cover.png'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section style={{padding:16}}>
      <h3>Cover Designer</h3>
      <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:720}}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
        <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Author" />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={exportCover}>Export Cover PNG</button>
        </div>
        <div style={{marginTop:12,borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.04)'}}>
          <iframe title="preview" srcDoc={previewHtml} style={{width:'100%',height:280,border:0}} />
        </div>
      </div>
    </section>
  );
}
