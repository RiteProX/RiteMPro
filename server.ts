import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { renderAllCharts } from "./server/chartRenderer";
import { renderHTMLToPDF } from "./server/pdfRenderer";
import { buildPitchDeckHTML } from "./server/pitchDeckTemplate";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
app.use(express.json({limit: '4mb'}));

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const USERS_FILE = path.join(DATA_DIR, "users.json");

function loadUsers(){ if (!fs.existsSync(USERS_FILE)) return []; try { return JSON.parse(fs.readFileSync(USERS_FILE,'utf-8')); } catch { return []; } }
function saveUsers(u:any[]){ fs.writeFileSync(USERS_FILE, JSON.stringify(u,null,2),'utf-8'); }
function hashPassword(pass:string){ return crypto.createHash('sha256').update(pass + 'RitemastaSecuritySalt').digest('hex'); }

app.get('/api/ping', (req,res)=>res.json({ok:true,time:Date.now()}));

app.post('/api/auth/signup', (req,res)=>{
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'missing fields' });
  const users = loadUsers();
  if (users.find((u:any)=>u.email===email)) return res.status(400).json({ error: 'already exists' });
  const user = { id: crypto.randomUUID(), email, name, passwordHash: hashPassword(password), createdAt: new Date().toISOString(), isUnlocked: false };
  users.push(user); saveUsers(users);
  res.status(201).json({ success: true, user: { id: user.id, email: user.email, name: user.name, isUnlocked: user.isUnlocked } });
});

app.post('/api/auth/login', (req,res)=>{
  const { email, password } = req.body; if (!email || !password) return res.status(400).json({ error: 'missing' });
  const users = loadUsers();
  const u = users.find((x:any)=>x.email===email && x.passwordHash===hashPassword(password));
  if (!u) return res.status(401).json({ error: 'invalid' });
  res.json({ success: true, user: { id: u.id, email: u.email, name: u.name, isUnlocked: !!u.isUnlocked } });
});

// Payment init/verify
const PAYSTACK_PUBLIC = process.env.PAYSTACK_PUBLIC_KEY || '';
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

app.post('/api/payment/initialize', (req,res)=>{
  const { userId, tier } = req.body;
  const reference = 'RM-' + Date.now() + '-' + Math.random().toString(36).slice(2,8).toUpperCase();
  const amount = tier === 'design' ? 42930 : tier === 'iwrite' ? 57690 : 72450;
  res.json({ publicKey: PAYSTACK_PUBLIC, reference, amount, currency: 'GHS', tier, userId });
});

app.post('/api/payment/verify', async (req,res)=>{
  const { reference, userId, tier } = req.body;
  if (!reference || !userId) return res.status(400).json({ error: 'missing' });
  if (!reference.startsWith('RM-')) return res.status(400).json({ success:false });
  const users = loadUsers(); const u = users.find((x:any)=>x.id===userId);
  if (u) { if (tier === 'lifetime') u.isUnlocked = true; if (tier === 'design') u.isDesignStudioUnlocked = true; if (tier === 'iwrite') u.isIWriteProUnlocked = true; u.paymentRef = reference; saveUsers(users); }
  res.json({ success: true, tier });
});

// Pitch PDF generation endpoint
app.post('/api/pitch/generate-pdf', async (req,res)=>{
  const { deck } = req.body;
  if (!deck) return res.status(400).json({ error: 'missing deck' });
  try {
    const theme = deck.theme || { primaryColor: '#00FFC6', secondaryColor: '#7C4DFF', fontBody: 'Inter' };
    const charts = {
      problemChart: deck.problemChart,
      marketChart: deck.marketChart,
      businessModelChart: deck.businessModelChart,
      tractionChart: deck.tractionChart,
      gtmChart: deck.gtmChart,
      competitiveChart: deck.competitiveChart,
      timelineChart: deck.timelineChart,
      financialChart: deck.financialChart,
    };
    const chartImages = await renderAllCharts(charts, theme);
    const html = buildPitchDeckHTML(deck, chartImages);
    const pdfBuf = await renderHTMLToPDF(html);
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(deck.companyName||'pitch').replace(/[^a-z0-9]+/gi,'-')}-pitch.pdf"`);
    res.send(pdfBuf);
  } catch (err:any) { console.error(err); res.status(500).json({ error: err.message }); }
});

// Simple cover export (renders HTML to PNG via PDF -> image client can rasterize if needed)
app.post('/api/cover/export', async (req,res)=>{
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: 'missing html' });
  try {
    const pdf = await renderHTMLToPDF(html);
    res.setHeader('Content-Type','image/png');
    res.setHeader('Content-Disposition','attachment; filename="cover.png"');
    res.send(pdf);
  } catch (err:any) { res.status(500).json({ error: err.message }); }
});

// Static serve
if (process.env.NODE_ENV === 'production'){
  const dist = path.join(process.cwd(),'dist');
  app.use(express.static(dist));
  app.get('*',(req,res)=>res.sendFile(path.join(dist,'index.html')));
}

app.listen(PORT, '0.0.0.0', ()=>console.log(`Server running on port ${PORT}`));
