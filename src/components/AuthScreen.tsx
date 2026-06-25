import React, { useEffect, useRef } from 'react';

export default function AuthScreen({ open=false, onClose=()=>{}, onAuthSuccess=()=>{} }:{ open?:boolean; onClose?:()=>void; onAuthSuccess?:()=>void }){
  const dialogRef = useRef<HTMLDivElement|null>(null);

  useEffect(()=>{
    function onKey(e:KeyboardEvent){ if (e.key === 'Escape') onClose(); }
    if (open) { document.addEventListener('keydown', onKey); dialogRef.current?.querySelector('input')?.focus(); }
    return ()=> document.removeEventListener('keydown', onKey);
  },[open]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Sign in" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.6)'}}>
      <div ref={dialogRef} style={{width:'min(720px,92%)',background:'var(--bg)',padding:20,borderRadius:12}}>
        <h3>Sign in</h3>
        <p style={{color:'var(--muted)'}}>Demo auth for local development. Use any email and password.</p>
        <label style={{display:'block',marginTop:8}}>Email
          <input style={{width:'100%',padding:8,marginTop:6,borderRadius:8}} aria-label="Email" />
        </label>
        <label style={{display:'block',marginTop:8}}>Password
          <input type="password" style={{width:'100%',padding:8,marginTop:6,borderRadius:8}} aria-label="Password" />
        </label>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn" onClick={()=>{ onAuthSuccess(); }}>Sign in</button>
          <button onClick={onClose} style={{padding:'8px 12px',borderRadius:8}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
