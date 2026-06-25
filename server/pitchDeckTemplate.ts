export function buildPitchDeckHTML(data: any, chartImages: Record<string,string>){
  // Minimal multi-slide HTML using simple .slide sections sized 1280x720
  const theme = data.theme || { primaryColor: '#00FFC6', secondaryColor: '#7C4DFF', fontBody: 'Inter' };
  const safe = (s:any)=> (s? String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;') : '');
  const slides: string[] = [];

  // Cover
  slides.push(`
    <div class="slide cover">
      <div class="cover-inner">
        <h1>${safe(data.companyName || data.metadata?.title || 'Company')}</h1>
        <p>${safe(data.pitchTitle || data.metadata?.subtitle || '')}</p>
      </div>
    </div>
  `);

  // Problem / Market / Solution slides (simple)
  slides.push(`<div class="slide"><h2>Problem</h2><p>${safe(data.problemHeadline || '')}</p></div>`);
  slides.push(`<div class="slide"><h2>Market</h2><p>${safe(data.globalOpportunity || '')}</p></div>`);
  slides.push(`<div class="slide"><h2>Solution</h2><p>${safe(data.solutionHeadline || '')}</p></div>`);

  // Charts: embed any provided chart images
  for (const key of Object.keys(chartImages || {})){
    slides.push(`<div class="slide"><h2>${safe(key)}</h2><img src="${chartImages[key]}" style="max-width:100%;height:auto"/></div>`);
  }

  // Team / Contact
  slides.push(`<div class="slide"><h2>Team</h2><p>${safe((data.teamMembers && data.teamMembers.map((t:any)=>t.name).join(', ')) || '')}</p></div>`);
  slides.push(`<div class="slide"><h2>Contact</h2><p>${safe(data.contactEmail || '')}</p></div>`);

  const styles = `
    <style>
      @font-face{font-family:Inter;src:local('Inter'), local('Arial');}
      body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif}
      .slide{width:1280px;height:720px;box-sizing:border-box;padding:48px;display:flex;align-items:center;justify-content:center}
      .cover{background:${theme.primaryColor};color:#071217}
      .cover h1{font-size:56px;margin:0}
      h2{font-size:28px;margin-bottom:12px}
      p{font-size:18px;max-width:1100px}
    </style>
  `;

  const html = `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>${slides.join('\n')}</body></html>`;
  return html;
}
