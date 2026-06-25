import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { renderAllCharts } from './server/chartRenderer';
import { renderHTMLToPDF } from './server/pdfRenderer';
import { buildPitchDeckHTML } from './server/pitchDeckTemplate';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// We need both JSON and raw body (for Paystack webhook signature validation)
app.use((req, res, next) => {
  // small middleware to capture raw body for webhook route
  let data = '';
  req.on('data', chunk => { data += chunk; });
  req.on('end', () => { (req as any).rawBody = data; });
  next();
});
app.use(express.json({ limit: '6mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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

// Payment init/verify using Paystack API (test keys ok)
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
  try {
    if (!PAYSTACK_SECRET) {
      // Fallback to simulated verify for dev when secret not present
      if (!reference.startsWith('RM-')) return res.status(400).json({ success:false });
      const users = loadUsers(); const u = users.find((x:any)=>x.id===userId);
      if (u) { if (tier === 'lifetime') u.isUnlocked = true; if (tier === 'design') u.isDesignStudioUnlocked = true; if (tier === 'iwrite') u.isIWriteProUnlocked = true; u.paymentRef = reference; saveUsers(users); }
      return res.json({ success: true, tier, simulated: true });
    }

    // Verify with Paystack API
    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });
    const data = await resp.json();
    if (data.status && data.data && data.data.status === 'success'){
      // If metadata contains userId/tier prefer that, otherwise use provided
      const metadata = data.data.metadata || {};
      const uid = metadata.userId || userId;
      const tr = metadata.tier || tier;
      const users = loadUsers(); const u = users.find((x:any)=>x.id===uid);
      if (u) {
        if (tr === 'lifetime') u.isUnlocked = true;
        if (tr === 'design') u.isDesignStudioUnlocked = true;
        if (tr === 'iwrite') u.isIWriteProUnlocked = true;
        u.paymentRef = reference; u.paymentDate = new Date().toISOString();
        saveUsers(users);
      }
      return res.json({ success: true, tier: tr, data });
    }
    return res.status(400).json({ success: false, data });
  } catch (err:any) { console.error('Paystack verify error', err); res.status(500).json({ error: err.message }); }
});

// Paystack webhook receiver with HMAC verification
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), (req:any, res:any) => {
  const raw = req.body; // Buffer
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    if (PAYSTACK_SECRET) {
      const hmac = crypto.createHmac('sha512', PAYSTACK_SECRET).update(raw).digest('hex');
      if (hmac !== signature) { console.warn('Invalid webhook signature'); return res.status(401).send('invalid signature'); }
    }
    const event = JSON.parse(raw.toString());
    if (event.event === 'charge.success'){
      const { metadata, reference } = event.data || {};
      const { userId, tier } = metadata || {};
      if (userId) {
        const users = loadUsers(); const u = users.find((x:any)=>x.id===userId);
        if (u) {
          if (tier === 'lifetime') u.isUnlocked = true;
          if (tier === 'design') u.isDesignStudioUnlocked = true;
          if (tier === 'iwrite') u.isIWriteProUnlocked = true;
          u.paymentRef = reference; u.paymentDate = new Date().toISOString(); saveUsers(users);
        }
      }
    }
    res.sendStatus(200);
  } catch (err:any) { console.error('webhook error', err); res.status(500).send('error'); }
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
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename="cover.pdf"');
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
