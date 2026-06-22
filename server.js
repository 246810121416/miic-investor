/**
 * MIIC Investor Signal Tool — Express Server
 * 
 * Run: npm install && node server.js
 * Or:  npm run dev (with nodemon)
 *
 * For production: use pm2, nginx reverse proxy, and a real DB (Postgres/SQLite)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Simple in-memory store for demo — replace with real DB in production
// The frontend uses localStorage, so this server mainly serves static files
// and provides optional API endpoints for multi-device persistence

const DATA_FILE = path.join(__dirname, 'data', 'scores.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {}
  return { scores: [], investors: [], startups: [] };
}

function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== API ROUTES (optional backend persistence) =====

// GET all scores
app.get('/api/scores', (req, res) => {
  const data = loadData();
  res.json(data.scores);
});

// POST a new score
app.post('/api/scores', (req, res) => {
  const data = loadData();
  const score = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  const existing = data.scores.findIndex(s => s.investorId === score.investorId && s.startupId === score.startupId);
  if (existing >= 0) data.scores[existing] = score;
  else data.scores.push(score);
  saveData(data);
  res.json({ ok: true, score });
});

// GET dashboard stats
app.get('/api/stats', (req, res) => {
  const data = loadData();
  const stats = {
    total: data.scores.length,
    green: data.scores.filter(s => s.signal === 'green').length,
    yellow: data.scores.filter(s => s.signal === 'yellow').length,
    blue: data.scores.filter(s => s.signal === 'blue').length,
  };
  res.json(stats);
});

// Export data as JSON
app.get('/api/export', (req, res) => {
  const data = loadData();
  res.setHeader('Content-Disposition', 'attachment; filename="miic-export.json"');
  res.json(data);
});

// ===== CATCH-ALL (SPA routing) =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🟢 MIIC Signal Tool running at http://localhost:${PORT}\n`);
  console.log('   Admin login:    admin@miic.ug / miic2024');
  console.log('   Investor login: Select name + PIN (see data/investors)\n');
});
