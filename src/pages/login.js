import Store from '../utils/store.js';
import { showToast, navigate } from '../app.js';

export function renderLogin() {
  return `
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-logo">
        <img src="public/miic_logo.png" alt="MIIC Logo" />
        <p>Investor Signal Tool — Startup Event 2025</p>
      </div>

      <div class="login-tabs">
        <button class="login-tab active" id="tab-investor" onclick="switchTab('investor')">
          Investor Login
        </button>
        <button class="login-tab" id="tab-admin" onclick="switchTab('admin')">
          Admin
        </button>
      </div>

      <!-- Investor Login -->
      <div id="form-investor" class="card">
        <p class="text-sm text-secondary mb-16" style="line-height:1.5">
          Select your name and enter your PIN to start scoring startups. Your PIN was shared at registration.
        </p>

        <div class="form-group">
          <label class="form-label">Your Name</label>
          <select class="form-control" id="investor-select">
            <option value="">— Select your name —</option>
            ${Store.investors.map(i => `<option value="${i.id}">${i.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">PIN</label>
          <input type="password" class="form-control" id="investor-pin"
            placeholder="4-digit PIN" maxlength="4" inputmode="numeric" />
        </div>

        <button class="btn btn-primary btn-full btn-lg" onclick="loginInvestor()">
          Start Scoring →
        </button>

        <p class="text-xs text-muted mt-12" style="text-align:center">
          Don't have a PIN? Ask the MIIC team at the registration desk.
        </p>
      </div>

      <!-- Admin Login -->
      <div id="form-admin" class="card hidden">
        <p class="text-sm text-secondary mb-16">MIIC team admin access only.</p>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" id="admin-email" placeholder="admin@miic.ug" />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" id="admin-password" placeholder="Password" />
        </div>

        <button class="btn btn-primary btn-full btn-lg" onclick="loginAdmin()">
          Access Dashboard →
        </button>
      </div>

      <p class="text-xs text-muted mt-16" style="text-align:center">
        © ${new Date().getFullYear()} Makerere Innovation and Incubation Center
      </p>
    </div>
  </div>
  `;
}

export function initLogin() {
  window.switchTab = (tab) => {
    document.getElementById('tab-investor').classList.toggle('active', tab === 'investor');
    document.getElementById('tab-admin').classList.toggle('active', tab === 'admin');
    document.getElementById('form-investor').classList.toggle('hidden', tab !== 'investor');
    document.getElementById('form-admin').classList.toggle('hidden', tab !== 'admin');
  };

  window.loginInvestor = () => {
    const id = parseInt(document.getElementById('investor-select').value);
    const pin = document.getElementById('investor-pin').value.trim();
    if (!id) { showToast('Please select your name.', 'error'); return; }
    if (!pin) { showToast('Please enter your PIN.', 'error'); return; }
    const investor = Store.investors.find(i => i.id === id && i.pin === pin);
    if (!investor) { showToast('Incorrect PIN. Please try again.', 'error'); return; }
    sessionStorage.setItem('miic_user', JSON.stringify({ ...investor, role: 'investor' }));
    navigate('score');
  };

  window.loginAdmin = () => {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const admin = Store.admins.find(a => a.email === email && a.password === password);
    if (!admin) { showToast('Invalid credentials.', 'error'); return; }
    sessionStorage.setItem('miic_user', JSON.stringify({ ...admin, role: 'admin' }));
    navigate('dashboard');
  };
}
