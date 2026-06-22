import Store from './utils/store.js';
import { renderLogin, initLogin } from './pages/login.js';
import { renderScore, initScore } from './pages/score.js';
import { renderMyScores, initMyScores } from './pages/my-scores.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderAdmin, initAdmin } from './pages/admin.js';

// ===== SESSION =====
export function getUser() {
  try { return JSON.parse(sessionStorage.getItem('miic_user')); } catch { return null; }
}

function logout() {
  sessionStorage.removeItem('miic_user');
  navigate('login');
}

// ===== TOAST =====
export function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

// ===== NAV =====
const INVESTOR_NAV = [
  { id: 'score', label: 'Score' },
  { id: 'my-scores', label: 'My Scores' },
];
const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'admin', label: 'Manage' },
];

function buildNav(user, currentPage) {
  const links = user.role === 'admin' ? ADMIN_NAV : INVESTOR_NAV;
  return `
  <nav class="nav">
    <div class="nav-brand">
      <img src="public/miic_logo.png" alt="MIIC" />
    </div>
    <div class="nav-links">
      ${links.map(l => `
        <button class="nav-link${currentPage === l.id ? ' active' : ''}" onclick="window.navigate('${l.id}')">
          <span>${l.label}</span>
        </button>
      `).join('')}
      <button class="nav-link signout" onclick="window.doLogout()">Sign out</button>
    </div>
  </nav>
  `;
}

// ===== ROUTER =====
const PAGE_RENDERERS = {
  login: { render: renderLogin, init: initLogin, auth: false },
  score: { render: renderScore, init: initScore, auth: true, role: 'investor' },
  'my-scores': { render: renderMyScores, init: initMyScores, auth: true, role: 'investor' },
  dashboard: { render: renderDashboard, init: initDashboard, auth: true, role: 'admin' },
  admin: { render: renderAdmin, init: initAdmin, auth: true, role: 'admin' },
};

export function navigate(pageId) {
  const user = getUser();
  const page = PAGE_RENDERERS[pageId];

  if (!page) { navigate('login'); return; }

  // Auth guard
  if (page.auth && !user) { navigate('login'); return; }
  if (page.role && user && user.role !== page.role) {
    navigate(user.role === 'admin' ? 'dashboard' : 'score'); return;
  }

  const app = document.getElementById('app');
  const nav = user && page.auth ? buildNav(user, pageId) : '';

  app.innerHTML = nav + `<div id="main-content">${page.render()}</div>` + `<div id="toast-container" class="toast-container"></div>`;

  // Init page
  if (page.init) page.init();

  // Update URL hash without triggering reload
  history.replaceState(null, '', `#${pageId}`);
}

// ===== BOOT =====
window.navigate = navigate;
window.doLogout = logout;

document.addEventListener('DOMContentLoaded', () => {
  Store.load();

  const user = getUser();
  const hash = location.hash.replace('#', '') || '';
  const validPages = Object.keys(PAGE_RENDERERS);

  if (!user) {
    navigate('login');
  } else if (validPages.includes(hash)) {
    navigate(hash);
  } else {
    navigate(user.role === 'admin' ? 'dashboard' : 'score');
  }
});
