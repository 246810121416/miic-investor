import Store from '../utils/store.js';
import SIGNALS from '../utils/rubric.js';
import { getUser, navigate } from '../app.js';

export function renderMyScores() {
  const user = getUser();
  const myScores = Store.scores.filter(s => s.investorId === user.id);

  if (myScores.length === 0) {
    return `
    <div class="container" style="padding:40px 20px">
      <div class="flex items-center justify-between mb-24">
        <h2 style="font-family:var(--font-display);font-weight:700">My Scores</h2>
        <button class="btn btn-primary" onclick="window.navigate('score')">Score a Startup →</button>
      </div>
      <div class="empty-state">
        <div class="icon">—</div>
        <p>You haven't scored any startups yet.<br>Head back to start scoring.</p>
      </div>
    </div>
    `;
  }

  return `
  <div class="container" style="padding:32px 20px">
    <div class="flex items-center justify-between mb-24" style="flex-wrap:wrap;gap:12px">
      <div>
        <h2 style="font-family:var(--font-display);font-weight:700;font-size:1.3rem">My Scores</h2>
        <p class="text-sm text-secondary mt-4">${myScores.length} of ${Store.startups.length} startups scored</p>
      </div>
      <button class="btn btn-primary" onclick="window.navigate('score')">+ Score Another</button>
    </div>

    <!-- Summary pills -->
    <div class="flex gap-8 mb-24" style="flex-wrap:wrap">
      ${Object.values(SIGNALS).map(sig => {
        const count = myScores.filter(s => s.signal === sig.id).length;
        return `<span class="badge badge-${sig.id}">● ${sig.label}: ${count}</span>`;
      }).join('')}
      ${myScores.some(s => s.topPick) ? `<span class="badge" style="background:var(--yellow-tint);border-color:var(--yellow);color:var(--yellow)">Top pick selected</span>` : ''}
    </div>

    <div style="display:flex;flex-direction:column;gap:12px">
      ${myScores.map(score => {
        const startup = Store.getStartup(score.startupId);
        const sig = SIGNALS[score.signal];
        if (!startup || !sig) return '';
        const ratedCount = Object.values(score.criteria || {}).filter(v => v !== null && v !== undefined).length;
        return `
        <div class="card" style="border-left:3px solid ${sig.color}">
          <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:8px">
            <div>
              <div style="font-weight:700;font-family:var(--font-display)">${startup.name}</div>
              <div class="text-xs text-secondary mt-4">${startup.sector} · ${startup.ask}</div>
            </div>
            <div class="flex gap-8 items-center">
              ${score.topPick ? '<span class="badge" style="background:var(--yellow-tint);color:var(--yellow-dark);border:1px solid var(--yellow-border)">Top pick</span>' : ''}
              <span class="badge badge-${sig.id}">● ${sig.label}</span>
            </div>
          </div>
          ${score.notes ? `<div class="mt-12 text-sm text-secondary" style="background:var(--surface-2);padding:8px 12px;border-radius:var(--radius-sm)">${score.notes}</div>` : ''}
          ${ratedCount > 0 ? `
          <div class="flex gap-8 mt-12" style="flex-wrap:wrap">
            ${Object.entries(score.criteria || {}).filter(([,v]) => v).map(([k, v]) => {
              const label = SIGNALS.green.criteria[k]?.title || k;
              const colors = ['', 'var(--danger)', 'var(--yellow)', 'var(--green)'];
              return `<span style="font-size:0.72rem;padding:2px 8px;border-radius:10px;background:var(--surface-2);color:${colors[v] || 'var(--text-muted)'};border:1px solid var(--border)">${label}: ${v}</span>`;
            }).join('')}
          </div>
          ` : ''}
          <div class="text-xs text-muted mt-8">${new Date(score.createdAt).toLocaleString()}</div>
        </div>
        `;
      }).join('')}
    </div>
  </div>
  `;
}

export function initMyScores() {
  window.navigate = navigate;
}
