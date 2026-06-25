import React, { useState } from 'react';

export default function ExportPanel(){
  const [status, setStatus] = useState<string>('');
  const startPayment = async (tier='lifetime')=>{
    setStatus('Initializing...');
    const resp = await fetch('/api/payment/initialize', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: 'demo-user', tier }) });
    const j = await resp.json();
    if (j.reference){
      // Simulate opening Paystack - in production load Paystack inline script and call
      setStatus('Simulating payment popup...');
      // Simulate successful payment after 1.2s
      setTimeout(async ()=>{
        setStatus('Verifying...');
        const v = await fetch('/api/payment/verify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reference: j.reference, userId: 'demo-user', tier }) });
        const r = await v.json();
        if (r.success) setStatus('Payment success! License activated.'); else setStatus('Payment failed.');
      }, 1200);
    } else setStatus('Failed to initialize payment');
  };

  const generateSamplePitch = async ()=>{
    setStatus('Generating sample pitch PDF...');
    const sample = { companyName: 'Acme Labs', pitchTitle: '$500K Pitch Deck', aboutIntro: 'We make widgets.', teamMembers: [{name:'Alice'}] };
    const r = await fetch('/api/pitch/generate-pdf', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ deck: sample }) });
    if (!r.ok){ setStatus('PDF generation failed'); return; }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sample-pitch.pdf'; a.click(); URL.revokeObjectURL(url);
    setStatus('Download started');
  };

  return (
    <section style={{padding:16}}>
      <h3>Export & Payment</h3>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
        <button onClick={()=>startPayment('lifetime')} className="btn">Buy Lifetime ($49)</button>
        <button onClick={()=>startPayment('design')} className="btn" style={{background:'#7C4DFF'}}>Buy Design ($29)</button>
        <button onClick={generateSamplePitch} className="btn" style={{background:'#FFC600',color:'#07121a'}}>Generate Sample Pitch PDF</button>
      </div>
      <p style={{marginTop:12,color:'var(--muted)'}}>{status}</p>
    </section>
  );
}
