import Store from '../utils/store.js';
import { showToast } from '../app.js';

export function renderAdmin() {
  return `
  <div class="container-wide" style="padding:28px 24px">
    <h1 style="font-family:var(--font-display);font-weight:700;font-size:1.4rem;margin-bottom:8px">Admin Management</h1>
    <p class="text-sm text-secondary mb-24">Manage investors and startups for this event.</p>

    <div class="admin-grid">

      <!-- INVESTORS -->
      <div class="card">
        <div class="section-title">Investors (${Store.investors.length})</div>
        <div id="investor-list">
          ${renderInvestorList()}
        </div>
        <hr class="divider">
        <div style="font-weight:600;font-size:0.85rem;margin-bottom:12px;margin-top:4px">Add Investor</div>
        <div class="form-group">
          <input class="form-control" id="new-inv-name" placeholder="Full name" />
        </div>
        <div class="form-group">
          <input class="form-control" id="new-inv-email" placeholder="Email" type="email" />
        </div>
        <div class="form-group" style="margin-bottom:0">
          <input class="form-control" id="new-inv-pin" placeholder="4-digit PIN" maxlength="4" inputmode="numeric" />
        </div>
        <button class="btn btn-primary btn-sm mt-12 btn-full" onclick="addInvestor()">Add Investor</button>
      </div>

      <!-- STARTUPS -->
      <div class="card">
        <div class="section-title">Startups (${Store.startups.length})</div>
        <div id="startup-admin-list" style="max-height:340px;overflow-y:auto">
          ${renderStartupList()}
        </div>
        <hr class="divider">
        <div style="font-weight:600;font-size:0.85rem;margin-bottom:12px;margin-top:4px">Add Startup</div>
        <div class="form-group">
          <input class="form-control" id="new-st-name" placeholder="Startup name" />
        </div>
        <div class="form-group">
          <input class="form-control" id="new-st-sector" placeholder="Sector (e.g. Fintech)" />
        </div>
        <div class="form-group">
          <input class="form-control" id="new-st-ask" placeholder="Funding ask (e.g. UGX 400M)" />
        </div>
        <div class="form-group" style="margin-bottom:0">
          <input class="form-control" id="new-st-desc" placeholder="One-line description" />
        </div>
        <button class="btn btn-primary btn-sm mt-12 btn-full" onclick="addStartup()">Add Startup</button>
      </div>
    </div>

    <!-- SCORES MANAGEMENT -->
    <div class="card mt-24">
      <div class="section-title">Data Management</div>
      <div class="flex gap-12" style="flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" onclick="exportAllData()">Export all data (JSON)</button>
        <button class="btn btn-danger btn-sm" onclick="confirmClearScores()">Clear all scores</button>
      </div>
      <p class="text-xs text-muted mt-12">Clearing scores is irreversible. Export first if you need a backup.</p>
    </div>
  </div>
  `;
}

function renderInvestorList() {
  return Store.investors.map(inv => `
  <div class="list-item">
    <div>
      <div class="list-item-name">${inv.name}</div>
      <div class="list-item-meta">${inv.email} · PIN: ${inv.pin}</div>
    </div>
    <button class="btn-icon" onclick="removeInvestor(${inv.id})" title="Remove">&times;</button>
  </div>
  `).join('') || '<p class="text-sm text-muted">No investors added yet.</p>';
}

function renderStartupList() {
  return Store.startups.map(s => `
  <div class="list-item">
    <div>
      <div class="list-item-name" style="font-size:0.85rem">${s.name}</div>
      <div class="list-item-meta">${s.sector} · ${s.ask}</div>
    </div>
    <button class="btn-icon" onclick="removeStartup(${s.id})" title="Remove">&times;</button>
  </div>
  `).join('');
}

export function initAdmin() {
  window.addInvestor = () => {
    const name = document.getElementById('new-inv-name').value.trim();
    const email = document.getElementById('new-inv-email').value.trim();
    const pin = document.getElementById('new-inv-pin').value.trim();
    if (!name || !email || !pin || pin.length !== 4) {
      showToast('Please fill all fields. PIN must be 4 digits.', 'error'); return;
    }
    Store.investors.push({ id: Date.now(), name, email, pin, role: 'investor' });
    Store.persist();
    document.getElementById('investor-list').innerHTML = renderInvestorList();
    ['new-inv-name','new-inv-email','new-inv-pin'].forEach(id => { document.getElementById(id).value = ''; });
    showToast(`${name} added!`, 'success');
  };

  window.removeInvestor = (id) => {
    if (!confirm('Remove this investor?')) return;
    Store.investors = Store.investors.filter(i => i.id !== id);
    Store.persist();
    document.getElementById('investor-list').innerHTML = renderInvestorList();
    showToast('Investor removed.', 'success');
  };

  window.addStartup = () => {
    const name = document.getElementById('new-st-name').value.trim();
    const sector = document.getElementById('new-st-sector').value.trim();
    const ask = document.getElementById('new-st-ask').value.trim();
    const description = document.getElementById('new-st-desc').value.trim();
    if (!name || !sector) { showToast('Name and sector are required.', 'error'); return; }
    Store.startups.push({ id: Date.now(), name, sector, ask: ask || 'TBD', description: description || '' });
    Store.persist();
    document.getElementById('startup-admin-list').innerHTML = renderStartupList();
    ['new-st-name','new-st-sector','new-st-ask','new-st-desc'].forEach(id => { document.getElementById(id).value = ''; });
    showToast(`${name} added!`, 'success');
  };

  window.removeStartup = (id) => {
    if (!confirm('Remove this startup? Any existing scores will remain but the startup will no longer appear in the list.')) return;
    Store.startups = Store.startups.filter(s => s.id !== id);
    Store.persist();
    document.getElementById('startup-admin-list').innerHTML = renderStartupList();
    showToast('Startup removed.', 'success');
  };

  window.exportAllData = () => {
    const data = { startups: Store.startups, investors: Store.investors, scores: Store.scores, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'miic-data-export.json'; a.click();
    showToast('Data exported!', 'success');
  };

  window.confirmClearScores = () => {
    if (!confirm('⚠️ This will permanently delete ALL scores. Are you sure?')) return;
    Store.scores = [];
    Store.persist();
    showToast('All scores cleared.', 'success');
  };
}
