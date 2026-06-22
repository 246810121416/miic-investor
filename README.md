# MIIC Investor Signal Tool

A digital scoring tool for investors to evaluate startups at MIIC events using the Green / Yellow / Blue signal framework.

---

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Modern browser (Chrome, Firefox, Edge, Safari)

### Run Locally
```bash
npm install
npm start
# Open http://localhost:3000
```

### Development (auto-reload)
```bash
npm run dev
```

---

## File Structure

```
investor-tool/
├── index.html                  # Entry point (SPA)
├── server.js                   # Node.js/Express server
├── package.json
├── README.md
├── data/
│   └── scores.json             # Auto-created on first save (server-side)
└── src/
    ├── app.js                  # Router, session, navigation
    ├── styles/
    │   └── main.css            # All styles (dark theme, design tokens)
    ├── utils/
    │   ├── store.js            # Client-side data store (localStorage)
    │   └── rubric.js           # Green/Yellow/Blue rubric definitions
    └── pages/
        ├── login.js            # Login page (investor PIN + admin)
        ├── score.js            # 3-step scoring wizard
        ├── my-scores.js        # Investor's personal score history
        ├── dashboard.js        # Admin leaderboard & stats
        └── admin.js            # Investor & startup management
```

---

## Deploying to a Server

### Option A: DigitalOcean / VPS
```bash
# On your server:
git clone <your-repo> /var/www/miic-tool
cd /var/www/miic-tool
npm install --production

# With PM2 (process manager):
npm install -g pm2
pm2 start server.js --name miic-tool
pm2 save
pm2 startup

# Nginx config:
# proxy_pass http://localhost:3000;
```

### Option B: Railway / Render / Fly.io
- Connect GitHub repo
- Set start command: `npm start`
- Set PORT environment variable if needed

### Option C: Static hosting (Netlify/Vercel)
- The frontend works entirely in the browser with localStorage
- Just serve the root directory as a static site
- No backend needed for single-device use

---

## Production Checklist

- [ ] Change admin password in `src/utils/store.js`
- [ ] Update investor names/PINs/emails in `src/utils/store.js`  
- [ ] Update startup list in `src/utils/store.js`
- [ ] Enable HTTPS (required for QR code logins)
- [ ] For multi-device sync: connect `/api/scores` to a real database (Postgres or SQLite)
- [ ] Consider adding rate limiting (express-rate-limit) for the API

---

## QR Code Login

For event wristbands, generate QR codes linking to:
```
https://your-domain.com/#score
```

Investors scan → land on login page → enter name + PIN → start scoring.

Generate QR codes at: https://qr.io or https://qrcode-monkey.com

---

## Scoring Framework

| Signal | When | Action |
|--------|------|--------|
| 🟢 Green | Money coming in, Uganda-proven, founder has grit | Follow-up meeting in 2 weeks |
| 🟡 Yellow | Good idea, no proof yet | Watch & wait 3–6 months |
| 🔵 Blue | Not investment-ready, needs ecosystem support | Refer to Hive Colab / NSSF Hi-Innovator |

---

## Data Export

- **CSV**: Admin Dashboard → Export CSV
- **JSON**: Admin Manage → Export All Data  
- **PDF Summary**: Admin Dashboard → Summary PDF (browser print)
