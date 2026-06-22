import Store from '../utils/store.js';
import SIGNALS from '../utils/rubric.js';
import { showToast } from '../app.js';

export function renderDashboard() {
  const stats = Store.getAllStats();
  const startupData = Store.startups.map(s => ({
    ...s,
    ...Store.getStartupStats(s.id)
  })).sort((a, b) => (b.green * 3 + b.yellow * 2 + b.blue) - (a.green * 3 + a.yellow * 2 + a.blue));

  return `
  <div class="container-wide" style="padding:28px 24px">
    <div class="flex items-center justify-between mb-24" style="flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-family:var(--font-display);font-weight:700;font-size:1.4rem">MIIC Signal Dashboard</h1>
        <p class="text-sm text-secondary mt-4">Live aggregated investor signals — ${new Date().toLocaleDateString('en-UG', { dateStyle: 'long' })}</p>
      </div>
      <div class="flex gap-8">
        <button class="btn btn-secondary btn-sm" onclick="exportCSV()">Export CSV</button>
        <button class="btn btn-primary btn-sm" onclick="generatePDF()">Summary PDF</button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card stat-total">
        <div class="stat-number">${stats.totalScores}</div>
        <div class="stat-label">Total Scores</div>
      </div>
      <div class="stat-card stat-green">
        <div class="stat-number">${stats.green}</div>
        <div class="stat-label">Green Signals</div>
      </div>
      <div class="stat-card stat-yellow">
        <div class="stat-number">${stats.yellow}</div>
        <div class="stat-label">Yellow Signals</div>
      </div>
      <div class="stat-card stat-blue">
        <div class="stat-number">${stats.blue}</div>
        <div class="stat-label">Blue Signals</div>
      </div>
    </div>

    <!-- Startup Leaderboard -->
    <div class="table-wrap mb-24">
      <div class="table-header">
        <div class="table-title">Startup Signal Leaderboard</div>
        <div class="flex gap-8">
          <input type="text" placeholder="Filter…" class="form-control" style="width:160px;padding:6px 10px;font-size:0.8rem" oninput="filterTable(this.value)" id="table-filter">
        </div>
      </div>
      <div style="overflow-x:auto">
        <table id="startup-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Startup</th>
              <th>Sector</th>
              <th>Signals</th>
              <th>Top Picks</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${startupData.map((s, i) => `
            <tr data-name="${s.name.toLowerCase()}" data-sector="${s.sector.toLowerCase()}">
              <td style="color:var(--text-muted);font-weight:700">${i + 1}</td>
              <td>
                <div class="startup-name-cell">${s.name}</div>
                <div class="startup-sector">${s.ask}</div>
              </td>
              <td><span class="badge badge-neutral">${s.sector}</span></td>
              <td>
                <div class="signal-counts">
                  <span class="signal-pill signal-pill-green">${s.green}</span>
                  <span class="signal-pill signal-pill-yellow">${s.yellow}</span>
                  <span class="signal-pill signal-pill-blue">${s.blue}</span>
                </div>
              </td>
              <td>${s.topPicks > 0 ? `<span class="top-pick-star">★</span> ${s.topPicks}` : '<span style="color:var(--text-muted)">—</span>'}</td>
              <td>
                ${s.notes.length > 0
                  ? `<button class="btn btn-secondary btn-sm" onclick="showNotes(${s.id})">View ${s.notes.length}</button>`
                  : '<span style="color:var(--text-muted);font-size:0.8rem">None</span>'}
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="showScoreDetail(${s.id})">Detail</button>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        ${startupData.every(s => s.total === 0) ? `
        <div class="empty-state">
          <div class="icon">—</div>
          <p>No scores have been submitted yet. Investors will see this data populate in real time.</p>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Investor Coverage -->
    <div class="table-wrap">
      <div class="table-header">
        <div class="table-title">Investor Coverage</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Investor</th>
            <th>Startups Scored</th>
            <th>Green</th>
            <th>Yellow</th>
            <th>Blue</th>
            <th>Top Pick</th>
          </tr>
        </thead>
        <tbody>
          ${Store.investors.map(inv => {
            const myScores = Store.scores.filter(s => s.investorId === inv.id);
            const topPick = myScores.find(s => s.topPick);
            const topPickStartup = topPick ? Store.getStartup(topPick.startupId) : null;
            return `
            <tr>
              <td><div style="font-weight:600">${inv.name}</div><div style="font-size:0.75rem;color:var(--text-secondary)">${inv.email}</div></td>
              <td><strong>${myScores.length}</strong> / ${Store.startups.length}</td>
              <td style="color:var(--green);font-weight:700">${myScores.filter(s => s.signal === 'green').length}</td>
              <td style="color:var(--yellow);font-weight:700">${myScores.filter(s => s.signal === 'yellow').length}</td>
              <td style="color:var(--red);font-weight:700">${myScores.filter(s => s.signal === 'blue').length}</td>
              <td>${topPickStartup ? `<span style="font-size:0.8rem">★ ${topPickStartup.name}</span>` : '<span style="color:var(--text-muted)">—</span>'}</td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Notes Modal -->
  <div class="modal-overlay" id="notes-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="modal-startup-name">Investor Notes</div>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div id="modal-notes-content"></div>
    </div>
  </div>

  <!-- Detail Modal -->
  <div class="modal-overlay" id="detail-modal">
    <div class="modal" style="max-width:560px">
      <div class="modal-header">
        <div class="modal-title" id="detail-startup-name">Score Detail</div>
        <button class="modal-close" onclick="closeDetailModal()">&times;</button>
      </div>
      <div id="detail-content"></div>
    </div>
  </div>
  `;
}

export function initDashboard() {
  window.filterTable = (q) => {
    const query = q.toLowerCase();
    document.querySelectorAll('#startup-table tbody tr').forEach(row => {
      const match = row.dataset.name?.includes(query) || row.dataset.sector?.includes(query);
      row.style.display = match ? '' : 'none';
    });
  };

  window.showNotes = (startupId) => {
    const startup = Store.getStartup(startupId);
    const scores = Store.scores.filter(s => s.startupId === parseInt(startupId) && s.notes);
    document.getElementById('modal-startup-name').textContent = startup.name + ' — Notes';
    document.getElementById('modal-notes-content').innerHTML = scores.map(s => {
      const inv = Store.getInvestor(s.investorId);
      const sig = SIGNALS[s.signal];
      return `
      <div style="padding:12px 0;border-bottom:1px solid var(--border-subtle)">
        <div class="flex items-center gap-8 mb-4">
          <span class="badge badge-${s.signal}">● ${sig.label}</span>
          <span class="text-xs text-secondary">${inv?.name || 'Investor'}</span>
        </div>
        <div class="text-sm">${s.notes}</div>
      </div>
      `;
    }).join('') || '<p class="text-sm text-muted">No notes for this startup.</p>';
    document.getElementById('notes-modal').classList.add('open');
  };

  window.showScoreDetail = (startupId) => {
    const startup = Store.getStartup(startupId);
    const scores = Store.scores.filter(s => s.startupId === parseInt(startupId));
    document.getElementById('detail-startup-name').textContent = startup.name;

    const criteriaAvg = {};
    ['rev','unit','founder','market','regulatory','returnPath'].forEach(key => {
      const vals = scores.map(s => s.criteria?.[key]).filter(v => v);
      criteriaAvg[key] = vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—';
    });

    document.getElementById('detail-content').innerHTML = `
      <div style="margin-bottom:16px">
        <div class="text-xs text-secondary">${startup.sector} · ${startup.ask}</div>
        <div class="text-sm mt-4">${startup.description}</div>
      </div>
      <div class="criteria-grid" style="grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
        ${['rev','unit','founder','market','regulatory','returnPath'].map(key => {
          const label = SIGNALS.green.criteria[key]?.title;
          const avg = criteriaAvg[key];
          const color = avg === '—' ? 'var(--text-muted)' : avg >= 2.5 ? 'var(--green)' : avg >= 1.5 ? 'var(--yellow)' : 'var(--danger)';
          return `
          <div style="text-align:center;background:var(--surface-2);border-radius:var(--radius-sm);padding:10px">
            <div style="font-size:1.4rem;font-weight:700;color:${color}">${avg}</div>
            <div style="font-size:0.65rem;color:var(--text-secondary);margin-top:2px;text-transform:uppercase;letter-spacing:0.04em">${label}</div>
          </div>
          `;
        }).join('')}
      </div>
      ${scores.length === 0 ? '<p class="text-sm text-muted text-center">No scores yet.</p>' : ''}
      <div style="max-height:200px;overflow-y:auto">
        ${scores.map(s => {
          const inv = Store.getInvestor(s.investorId);
          const sig = SIGNALS[s.signal];
          return `
          <div style="padding:8px 0;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;gap:8px">
            <div>
              <span class="badge badge-${s.signal} " style="margin-right:6px">● ${sig.label}</span>
              <span class="text-sm">${inv?.name || '—'}</span>
              ${s.topPick ? ' <span style="color:var(--yellow-dark)">&#9733;</span>' : ''}
              ${s.notes ? `<div class="text-xs text-muted mt-2">${s.notes}</div>` : ''}
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
    document.getElementById('detail-modal').classList.add('open');
  };

  window.closeModal = () => document.getElementById('notes-modal').classList.remove('open');
  window.closeDetailModal = () => document.getElementById('detail-modal').classList.remove('open');

  window.exportCSV = () => {
    const rows = [['Startup', 'Sector', 'Ask', 'Green', 'Yellow', 'Blue', 'Top Picks', 'Total', 'Notes']];
    Store.startups.forEach(s => {
      const stats = Store.getStartupStats(s.id);
      rows.push([s.name, s.sector, s.ask, stats.green, stats.yellow, stats.blue, stats.topPicks, stats.total, stats.notes.join(' | ')]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'miic-signals.csv'; a.click();
    showToast('CSV exported.', 'success');
  };

  window.generatePDF = () => {
    // Open print dialog — browser will render as PDF
    showToast('Opening print dialog for PDF.', 'success');
    setTimeout(() => window.print(), 300);
  };
}
