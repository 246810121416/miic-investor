import Store from '../utils/store.js';
import SIGNALS, { CRITERIA_KEYS } from '../utils/rubric.js';
import { showToast, navigate, getUser } from '../app.js';

let state = {
  step: 1, // 1=select startup, 2=signal+criteria, 3=notes+submit
  startupId: null,
  signal: null,
  criteria: {},
  notes: '',
  topPick: false,
  rubricOpen: false,
};

export function renderScore() {
  return `
  <div class="score-header">
    <div class="container">
      <h1>Score a Startup</h1>
      <p>Rate each startup right after your conversation. Takes under 2 minutes.</p>
      <div class="progress-indicator" id="progress-indicator">
        ${renderProgress()}
      </div>
    </div>
  </div>
  <div class="container" style="padding-bottom:60px">
    <div id="score-step-content">
      ${renderStep()}
    </div>
  </div>
  `;
}

function renderProgress() {
  const steps = ['Select Startup', 'Signal & Criteria', 'Notes & Submit'];
  return steps.map((label, i) => {
    const n = i + 1;
    const isDone = n < state.step;
    const isActive = n === state.step;
    return `
      ${i > 0 ? `<div class="step-line ${isDone ? 'done' : ''}"></div>` : ''}
      <div class="step-dot ${isDone ? 'done' : isActive ? 'active' : ''}" title="${label}">
        ${isDone ? '✓' : n}
      </div>
    `;
  }).join('');
}

function renderStep() {
  if (state.step === 1) return renderStep1();
  if (state.step === 2) return renderStep2();
  if (state.step === 3) return renderStep3();
  if (state.step === 4) return renderSuccess();
  return '';
}

function renderStep1() {
  const user = getUser();
  const scoredIds = Store.scores.filter(s => s.investorId === user.id).map(s => s.startupId);

  return `
  <div class="card mt-24">
    <div class="section-title">Which startup did you just speak with?</div>
    <p class="text-sm text-secondary mb-16">
      Pick the startup from the list below. Startups you've already scored are marked.
    </p>

    <div class="form-group">
      <input type="text" class="form-control" id="startup-search" placeholder="Search by name or sector…" oninput="filterStartups(this.value)" />
    </div>

    <div id="startup-list" style="max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);">
      ${Store.startups.map(s => {
        const done = scoredIds.includes(s.id);
        return `
        <div class="startup-row ${done ? 'scored' : ''}" onclick="selectStartup(${s.id})"
          style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border-subtle);cursor:pointer;transition:var(--transition);"
          onmouseenter="this.style.background='var(--surface-2)'" onmouseleave="this.style.background=''"
          data-name="${s.name.toLowerCase()}" data-sector="${s.sector.toLowerCase()}">
          <div>
            <div style="font-weight:600;font-size:0.9rem">${s.name}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${s.sector} · ${s.ask}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${s.description}</div>
          </div>
          <div style="flex-shrink:0;margin-left:12px">
            ${done ? '<span class="badge badge-green">✓ Scored</span>' : '<span style="color:var(--text-muted);font-size:0.8rem">Select →</span>'}
          </div>
        </div>
        `;
      }).join('')}
    </div>
  </div>
  `;
}

function renderStep2() {
  const startup = Store.getStartup(state.startupId);
  return `
  <div class="mt-24">
    <div class="card mb-16" style="border-left:3px solid var(--accent)">
      <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Scoring</div>
      <div style="font-family:var(--font-display);font-weight:700;font-size:1.1rem">${startup.name}</div>
      <div style="font-size:0.8rem;color:var(--text-secondary)">${startup.sector} · ${startup.ask} · ${startup.description}</div>
    </div>

    <!-- RUBRIC REFERENCE -->
    <button class="rubric-toggle" onclick="toggleRubric()">
      View scoring rubric (Green / Yellow / Blue guide)
      <span id="rubric-arrow">▼</span>
    </button>
    <div class="rubric-panel" id="rubric-panel">
      ${Object.values(SIGNALS).map(sig => `
        <div class="rubric-signal-block">
          <div class="rubric-signal-header">
            <span style="width:12px;height:12px;border-radius:50%;background:${sig.color};display:inline-block;box-shadow:0 0 8px ${sig.color}"></span>
            <span style="color:${sig.color}">${sig.label} — ${sig.subtitle}</span>
            <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-body);font-weight:400">(${sig.action})</span>
          </div>
          <div class="rubric-tags">
            ${sig.tagWhen.map(t => `<span class="rubric-tag">${t}</span>`).join('')}
          </div>
          <div class="rubric-criteria">
            ${Object.entries(sig.criteria).map(([k, c]) => `
              <div class="rubric-item">
                <strong>${c.title}</strong>
                <p>${c.main}</p>
                ${c.hint ? `<p style="color:var(--accent);font-size:0.65rem;margin-top:2px">${c.hint}</p>` : ''}
              </div>
            `).join('')}
          </div>
          <hr class="divider">
        </div>
      `).join('')}
    </div>

    <!-- SIGNAL SELECTOR -->
    <div class="card mb-16">
      <div class="section-title">Overall Signal</div>
      <p class="text-xs text-secondary mb-16">Based on your conversation, what is your overall read on this startup?</p>
      <div class="signal-grid">
        ${Object.values(SIGNALS).map(sig => `
          <div class="signal-card ${state.signal === sig.id ? `selected-${sig.id}` : ''}" onclick="selectSignal('${sig.id}')">
            <div class="signal-dot signal-dot-${sig.id}"></div>
            <div class="signal-label" style="color:${sig.color}">${sig.label}</div>
            <div class="signal-desc">${sig.subtitle} · ${sig.action}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- CRITERIA RATINGS -->
    <div class="card mb-16">
      <div class="section-title">Criteria Ratings</div>
      <p class="text-xs text-secondary mb-16">Rate each area on a 1–3 scale: <strong>1 = Weak</strong>, <strong>2 = Moderate</strong>, <strong>3 = Strong</strong>. You can skip any you didn't cover.</p>
      <div class="criteria-grid">
        ${CRITERIA_KEYS.map(key => {
          const c = SIGNALS.green.criteria[key]; // use green for labels (same keys)
          const val = state.criteria[key] || null;
          return `
          <div class="criterion-card">
            <div class="criterion-title">${c.title}</div>
            <div class="criterion-hint">${c.hint}</div>
            <div class="rating-btns">
              ${[1,2,3].map(n => `
                <button class="rating-btn ${val === n ? `active-${n}` : ''}" onclick="setCriteria('${key}', ${n})">
                  ${n}
                </button>
              `).join('')}
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="flex gap-12">
      <button class="btn btn-secondary" onclick="goStep(1)">← Back</button>
      <button class="btn btn-primary" style="flex:1" onclick="goStep(3)">Continue →</button>
    </div>
  </div>
  `;
}

function renderStep3() {
  const startup = Store.getStartup(state.startupId);
  const sig = SIGNALS[state.signal];
  return `
  <div class="mt-24">
    <div class="card mb-16" style="border-left:3px solid ${sig?.color || 'var(--accent)'}">
      <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Reviewing</div>
      <div style="font-family:var(--font-display);font-weight:700">${startup.name}</div>
      <div style="margin-top:8px">
        ${sig ? `<span class="badge badge-${sig.id}"><span style="width:8px;height:8px;border-radius:50%;background:${sig.color};display:inline-block"></span> ${sig.label} — ${sig.subtitle}</span>` : ''}
      </div>
    </div>

    ${sig ? `
    <div class="card mb-16" style="background:var(--surface-2)">
      <div class="text-xs text-secondary font-bold" style="text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px">Recommended next steps for ${sig.label}</div>
      ${sig.nextSteps.map(ns => `
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border-subtle);font-size:0.85rem">
          <span style="color:${sig.color}">→</span> ${ns}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="card mb-16">
      <div class="section-title">Follow-up Notes</div>
      <p class="text-xs text-secondary mb-12">Optional — capture any specific observation or action (150 characters max).</p>
      <textarea class="form-control" id="notes-field" placeholder="e.g. 'Ask about their unit economics on next call — impressive revenue but margins unclear'" maxlength="150" oninput="updateCharCount(this)">${state.notes}</textarea>
      <div class="char-count" id="char-count">${state.notes.length}/150</div>
    </div>

    <div class="card mb-16">
      <div class="flex items-center gap-12">
        <div style="flex:1">
          <div style="font-weight:600;font-size:0.95rem">Top pick of the day</div>
          <div class="text-xs text-secondary mt-4">Mark this as your single most exciting startup from the event. You can only pick one.</div>
        </div>
        <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer">
          <input type="checkbox" id="top-pick-toggle" ${state.topPick ? 'checked' : ''} onchange="toggleTopPick(this.checked)"
            style="opacity:0;width:0;height:0">
          <span id="toggle-track" style="position:absolute;inset:0;border-radius:13px;background:${state.topPick ? 'var(--yellow)' : 'var(--surface-3)'};transition:0.2s;border:2px solid ${state.topPick ? 'var(--yellow)' : 'var(--border)'}">
            <span style="position:absolute;top:2px;left:${state.topPick ? '22px' : '2px'};width:18px;height:18px;border-radius:50%;background:white;transition:0.2s"></span>
          </span>
        </label>
      </div>
    </div>

    <div class="flex gap-12">
      <button class="btn btn-secondary" onclick="goStep(2)">← Back</button>
      <button class="btn btn-primary btn-lg" style="flex:1" onclick="submitScore()" id="submit-btn">
        Submit Score ✓
      </button>
    </div>
  </div>
  `;
}

function renderSuccess() {
  const startup = Store.getStartup(state.startupId);
  const sig = SIGNALS[state.signal];
  return `
  <div class="success-wrap mt-32">
    <div class="success-check">✓</div>
    <h2>Score saved</h2>
    <p>Your <span style="color:${sig?.color};font-weight:700">${sig?.label}</span> signal for <strong>${startup?.name}</strong> has been recorded.</p>
    <div class="flex gap-12" style="justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary btn-lg" onclick="scoreAnother()">Score another startup</button>
      <button class="btn btn-secondary" onclick="viewMyScores()">View my scores</button>
    </div>
  </div>
  `;
}

export function initScore() {
  // Reset state
  state = { step: 1, startupId: null, signal: null, criteria: {}, notes: '', topPick: false, rubricOpen: false };

  window.filterStartups = (q) => {
    const query = q.toLowerCase();
    document.querySelectorAll('.startup-row').forEach(row => {
      const match = row.dataset.name.includes(query) || row.dataset.sector.includes(query);
      row.style.display = match ? '' : 'none';
    });
  };

  window.selectStartup = (id) => {
    state.startupId = id;
    goStep(2);
  };

  window.selectSignal = (sig) => {
    state.signal = sig;
    // Re-render signal cards without full re-render
    document.querySelectorAll('.signal-card').forEach(card => {
      card.className = 'signal-card';
    });
    const selected = document.querySelector(`.signal-card[onclick="selectSignal('${sig}')"]`);
    if (selected) selected.classList.add(`selected-${sig}`);
  };

  window.setCriteria = (key, val) => {
    state.criteria[key] = state.criteria[key] === val ? null : val;
    // Update UI
    const card = document.querySelector(`.criterion-card:has(button[onclick="setCriteria('${key}', ${val})"])`);
    if (card) {
      card.querySelectorAll('.rating-btn').forEach((btn, i) => {
        const n = i + 1;
        btn.className = `rating-btn${state.criteria[key] === n ? ` active-${n}` : ''}`;
      });
    }
  };

  window.toggleRubric = () => {
    state.rubricOpen = !state.rubricOpen;
    const panel = document.getElementById('rubric-panel');
    const arrow = document.getElementById('rubric-arrow');
    if (panel) panel.classList.toggle('open', state.rubricOpen);
    if (arrow) arrow.textContent = state.rubricOpen ? '▲' : '▼';
  };

  window.updateCharCount = (el) => {
    state.notes = el.value;
    const count = document.getElementById('char-count');
    if (count) {
      count.textContent = `${el.value.length}/150`;
      count.className = `char-count${el.value.length > 120 ? ' warn' : ''}`;
    }
  };

  window.toggleTopPick = (checked) => {
    const user = getUser();
    if (checked) {
      const existing = Store.scores.find(s => s.investorId === user.id && s.topPick);
      if (existing) {
        const prevStartup = Store.getStartup(existing.startupId);
        if (!confirm(`You already picked "${prevStartup?.name}" as your top pick. Replace it?`)) {
          document.getElementById('top-pick-toggle').checked = false;
          return;
        }
        existing.topPick = false;
        Store.persist();
      }
    }
    state.topPick = checked;
    const track = document.getElementById('toggle-track');
    if (track) {
      track.style.background = checked ? 'var(--yellow)' : 'var(--surface-3)';
      track.style.borderColor = checked ? 'var(--yellow)' : 'var(--border)';
      const knob = track.querySelector('span');
      if (knob) knob.style.left = checked ? '22px' : '2px';
    }
  };

  window.goStep = (step) => {
    if (step === 2 && !state.startupId) {
      showToast('Please select a startup first.', 'error');
      return;
    }
    if (step === 3 && !state.signal) {
      showToast('Please select a signal (Green / Yellow / Blue).', 'error');
      return;
    }
    state.step = step;
    const content = document.getElementById('score-step-content');
    const progress = document.getElementById('progress-indicator');
    if (content) content.innerHTML = renderStep();
    if (progress) progress.innerHTML = renderProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reinit listeners that need to be reattached
    if (step === 3) {
      const notesField = document.getElementById('notes-field');
      if (notesField) notesField.value = state.notes;
    }
  };

  window.submitScore = () => {
    const user = getUser();
    const btn = document.getElementById('submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

    Store.addScore({
      investorId: user.id,
      startupId: state.startupId,
      signal: state.signal,
      criteria: { ...state.criteria },
      notes: state.notes,
      topPick: state.topPick,
    });

    setTimeout(() => {
      state.step = 4;
      const content = document.getElementById('score-step-content');
      if (content) content.innerHTML = renderSuccess();
      showToast('Score saved!', 'success');
    }, 400);
  };

  window.scoreAnother = () => {
    state = { step: 1, startupId: null, signal: null, criteria: {}, notes: '', topPick: false, rubricOpen: false };
    const content = document.getElementById('score-step-content');
    const progress = document.getElementById('progress-indicator');
    if (content) content.innerHTML = renderStep1();
    if (progress) progress.innerHTML = renderProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.viewMyScores = () => navigate('my-scores');
}
