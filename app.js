/* ============================================================
   GYMTRACK — app.js
   Fully local — localStorage JSON · No backend · No account
   Export/Import sync between devices
   ============================================================ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CONFIG = {
  AUTH_USER:    'omar',
  AUTH_PASS:    'omar12345',
  TARGET_KCAL:  1750,
  TDEE:         2050,
  PROTEIN_G:    150,
  START_WEIGHT: 75,
  SYNC_REMIND_DAYS: 7,  // remind to export after this many days
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. WORKOUT DATA (fixed sequence)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WORKOUTS = [
  {
    id: 'upper_a', label: 'Upper A',
    focus: 'Chest · Back · Biceps',
    color: '#2979FF', bg: 'rgba(41,121,255,0.14)', border: 'rgba(41,121,255,0.30)',
    kcal: 350,
    exercises: [
      { name: 'Barbell Bench Press',        sets: 4, reps: '8–10',      rest: '90s',   muscle: 'Chest',      yt: 'https://youtu.be/4Y2ZdHCOXok' },
      { name: 'Lat Pulldown',               sets: 4, reps: '10–12',     rest: '90s',   muscle: 'Back',       yt: 'https://youtu.be/SALxEARiMkw' },
      { name: 'Incline Dumbbell Press',     sets: 3, reps: '10–12',     rest: '75s',   muscle: 'Chest',      yt: 'https://youtu.be/8iPEnn-ltC8' },
      { name: 'Seated Cable Row',           sets: 3, reps: '10–12',     rest: '75s',   muscle: 'Back',       yt: 'https://youtu.be/GZbfZ033f74' },
      { name: 'Dumbbell Bicep Curl',        sets: 3, reps: '12–15',     rest: '60s',   muscle: 'Biceps',     yt: 'https://youtu.be/ykJmrZ5v0Oo' },
      { name: 'CARDIO: Incline Treadmill',  sets: 1, reps: '15–20 min', rest: '—',     muscle: 'Cardio',     yt: null, isCardio: true },
    ]
  },
  {
    id: 'lower_a', label: 'Lower A',
    focus: 'Quads · Hamstrings · Glutes · Calves',
    color: '#00C853', bg: 'rgba(0,200,83,0.14)', border: 'rgba(0,200,83,0.30)',
    kcal: 420,
    exercises: [
      { name: 'Barbell Back Squat',         sets: 4, reps: '8–10',      rest: '2 min', muscle: 'Quads',      yt: 'https://youtu.be/ultWZbUMPL8' },
      { name: 'Romanian Deadlift (RDL)',    sets: 3, reps: '10–12',     rest: '90s',   muscle: 'Hamstrings', yt: 'https://youtu.be/JCXUYuzwNrM' },
      { name: 'Leg Press',                  sets: 3, reps: '12',         rest: '90s',   muscle: 'Quads',      yt: 'https://youtu.be/IZxyjW7MPJQ' },
      { name: 'Leg Curl',                   sets: 3, reps: '12–15',     rest: '60s',   muscle: 'Hamstrings', yt: 'https://youtu.be/s-MtznN7WQE' },
      { name: 'Standing Calf Raises',       sets: 3, reps: '15–20',     rest: '60s',   muscle: 'Calves',     yt: 'https://youtu.be/-M4-G8p1fCI' },
      { name: 'CARDIO: Bike / HIIT Sprints',sets: 1, reps: '15 min',    rest: '—',     muscle: 'Cardio',     yt: null, isCardio: true },
    ]
  },
  {
    id: 'upper_b', label: 'Upper B',
    focus: 'Shoulders · Triceps · Upper Back',
    color: '#F5C518', bg: 'rgba(245,197,24,0.14)', border: 'rgba(245,197,24,0.30)',
    kcal: 350,
    exercises: [
      { name: 'Overhead Barbell Press (OHP)',sets: 4, reps: '8–10',     rest: '90s',   muscle: 'Shoulders',  yt: 'https://youtu.be/2yjwXTZQDDI' },
      { name: 'Seated Cable Row',            sets: 4, reps: '10–12',    rest: '90s',   muscle: 'Back',       yt: 'https://youtu.be/GZbfZ033f74' },
      { name: 'Dumbbell Lateral Raise',      sets: 3, reps: '15',        rest: '60s',   muscle: 'Shoulders',  yt: 'https://youtu.be/3VcKaXpzqRo' },
      { name: 'Tricep Pushdown',             sets: 3, reps: '12–15',    rest: '60s',   muscle: 'Triceps',    yt: 'https://youtu.be/6Fzep104f0s' },
      { name: 'Face Pull',                   sets: 3, reps: '15',        rest: '60s',   muscle: 'Rear Delt',  yt: 'https://youtu.be/rep-qVOkqgk' },
      { name: 'CARDIO: Treadmill Walk LISS', sets: 1, reps: '15–20 min',rest: '—',     muscle: 'Cardio',     yt: null, isCardio: true },
    ]
  },
  {
    id: 'lower_b', label: 'Lower B',
    focus: 'Deadlift · Quads · Hamstrings · Core',
    color: '#FF9500', bg: 'rgba(255,149,0,0.14)', border: 'rgba(255,149,0,0.30)',
    kcal: 420,
    exercises: [
      { name: 'Conventional Deadlift',       sets: 4, reps: '5–6',      rest: '3 min', muscle: 'Posterior',  yt: 'https://youtu.be/op9kVnSso6Q' },
      { name: 'Goblet Squat / Hack Squat',   sets: 3, reps: '10–12',   rest: '90s',   muscle: 'Quads',      yt: 'https://youtu.be/DbFgADa2PL8' },
      { name: 'Walking Lunges',               sets: 3, reps: '12 each', rest: '75s',   muscle: 'Legs',       yt: 'https://youtu.be/L8fvypPrzzs' },
      { name: 'Leg Extension',                sets: 3, reps: '15',       rest: '60s',   muscle: 'Quads',      yt: 'https://youtu.be/YyvSfVjQeL0' },
      { name: 'Plank Hold',                   sets: 3, reps: '30–45 s', rest: '60s',   muscle: 'Core',       yt: null },
      { name: 'CARDIO: Rowing / Bike HIIT',   sets: 1, reps: '15 min',  rest: '—',     muscle: 'Cardio',     yt: null, isCardio: true },
    ]
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. LOCAL DATABASE (localStorage-backed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DB = {
  KEY: 'gymtrack_v1',

  _default() {
    return {
      version: 1,
      calorie_logs:      [],  // [{date, calories_consumed, notes}]
      workout_sessions:  [],  // [{date, workout_type, sequence_index, completed, exercises_data, calories_burned}]
      weight_logs:       [],  // [{id, date, weight_kg, notes}]
      app_state:         { next_sequence_index: 0 },
      last_export:       null,
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this._default();
      return { ...this._default(), ...JSON.parse(raw) };
    } catch { return this._default(); }
  },

  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); }
    catch (e) { console.error('LocalStorage save failed:', e); }
  },

  // ── Calorie Logs ──────────────────────────────────────────
  getCalorieLogs() {
    return this.load().calorie_logs
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  upsertCalorieLog(date, calories, notes = '') {
    const db  = this.load();
    const idx = db.calorie_logs.findIndex(l => l.date === date);
    const entry = { date, calories_consumed: calories, notes };
    if (idx >= 0) db.calorie_logs[idx] = entry;
    else db.calorie_logs.unshift(entry);
    this.save(db);
    return entry;
  },

  // ── Workout Sessions ──────────────────────────────────────
  getWorkoutSessions() {
    return this.load().workout_sessions
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  getSessionByDate(date) {
    return this.load().workout_sessions.find(s => s.date === date) || null;
  },

  upsertSession(payload) {
    const db  = this.load();
    const idx = db.workout_sessions.findIndex(s => s.date === payload.date);
    if (idx >= 0) db.workout_sessions[idx] = payload;
    else db.workout_sessions.unshift(payload);
    this.save(db);
    return payload;
  },

  deleteSession(date) {
    const db = this.load();
    db.workout_sessions = db.workout_sessions.filter(s => s.date !== date);
    this.save(db);
  },

  // ── Weight Logs ────────────────────────────────────────────
  getWeightLogs() {
    return this.load().weight_logs
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  insertWeight(date, weight_kg, notes = '') {
    const db = this.load();
    db.weight_logs.unshift({ id: Date.now(), date, weight_kg: +weight_kg, notes });
    this.save(db);
    return true;
  },

  // ── App State ──────────────────────────────────────────────
  getState(key) {
    return this.load().app_state[key] ?? null;
  },

  setState(key, value) {
    const db = this.load();
    db.app_state[key] = value;
    this.save(db);
  },

  // ── Export / Import ────────────────────────────────────────
  export() {
    const db = this.load();
    db.last_export    = new Date().toISOString();
    db.exported_from  = navigator.userAgent.includes('Mobile') ? 'phone' : 'pc';
    this.save(db);

    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `gymtrack_backup_${U.today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('✅ Backup exported! Transfer this file to your other device.', 'success', 5000);
    return db;
  },

  import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const incoming = JSON.parse(e.target.result);
          if (!incoming.version) throw new Error('Invalid file format');

          const current = this.load();

          // Merge: newer entry wins per date
          const mergeLogs = (cur, inc, key) => {
            const map = {};
            cur.forEach(l => map[l[key]] = l);
            inc.forEach(l => {
              if (!map[l[key]] || incoming.last_export > (current.last_export || '')) {
                map[l[key]] = l;
              }
            });
            return Object.values(map);
          };

          current.calorie_logs     = mergeLogs(current.calorie_logs, incoming.calorie_logs || [], 'date');
          current.workout_sessions = mergeLogs(current.workout_sessions, incoming.workout_sessions || [], 'date');

          // Weight logs: merge all unique IDs
          const wgtIds = new Set(current.weight_logs.map(w => w.id));
          (incoming.weight_logs || []).forEach(w => {
            if (!wgtIds.has(w.id)) current.weight_logs.push(w);
          });

          // App state: keep incoming sequence index if it's ahead
          const curSeq = parseInt(current.app_state.next_sequence_index ?? 0);
          const incSeq = parseInt(incoming.app_state?.next_sequence_index ?? 0);
          current.app_state.next_sequence_index = Math.max(curSeq, incSeq) % 4;

          this.save(current);
          resolve(current);
        } catch (err) { reject(err); }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  daysSinceExport() {
    const db = this.load();
    if (!db.last_export) return null;
    const diff = Date.now() - new Date(db.last_export).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. AUTH (simple local password)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Auth = {
  KEY: 'gymtrack_session_v1',
  login(u, p) {
    if (u.trim().toLowerCase() === CONFIG.AUTH_USER && p === CONFIG.AUTH_PASS) {
      localStorage.setItem(this.KEY, '1'); return true;
    }
    return false;
  },
  logout() { localStorage.removeItem(this.KEY); location.reload(); },
  ok()     { return localStorage.getItem(this.KEY) === '1'; },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const U = {
  today() { return new Date().toISOString().split('T')[0]; },
  fmt(d, opts = { weekday:'short', month:'short', day:'numeric' }) {
    if (!d) return '—';
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', opts);
  },
  fmtShort(d) { return this.fmt(d, { month:'numeric', day:'numeric' }); },
  weekStart(d = this.today()) {
    const dt = new Date(d + 'T12:00:00');
    dt.setDate(dt.getDate() - dt.getDay());
    return dt.toISOString().split('T')[0];
  },
  clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },
  pct(v, total)    { return this.clamp(Math.round((v / total) * 100), 0, 100); },
  greeting()       {
    const h = new Date().getHours();
    return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  },
  ytId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. TOAST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function toast(msg, type = 'info', ms = 3500) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const icons = { info:'ℹ️', success:'✅', warning:'⚠️', error:'❌' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('toast-visible')));
  setTimeout(() => {
    el.classList.remove('toast-visible');
    setTimeout(() => el.remove(), 400);
  }, ms);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. SYNC MANAGER (export / import panel)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SyncManager = {
  open() {
    document.getElementById('sync-overlay').classList.remove('hidden');
    document.getElementById('sync-panel').classList.remove('hidden');
    this._renderStatus();
  },
  close() {
    document.getElementById('sync-overlay').classList.add('hidden');
    document.getElementById('sync-panel').classList.add('hidden');
  },

  _renderStatus() {
    const days  = DB.daysSinceExport();
    const db    = DB.load();
    const badge = document.getElementById('sync-status');
    if (!badge) return;

    const device  = navigator.userAgent.includes('Mobile') ? '📱 Phone' : '💻 PC';
    const sessions = db.workout_sessions.length;
    const calLogs  = db.calorie_logs.length;
    const wgtLogs  = db.weight_logs.length;

    badge.innerHTML = `
      <div class="sync-device">${device} <span class="sync-device-badge">This Device</span></div>
      <div class="sync-counts">
        <span>💪 ${sessions} sessions</span>
        <span>🔥 ${calLogs} cal logs</span>
        <span>⚖️ ${wgtLogs} weight logs</span>
      </div>
      <div class="sync-last ${days !== null && days >= CONFIG.SYNC_REMIND_DAYS ? 'sync-due' : ''}">
        ${days === null
          ? '⚠️ Never exported — export your data now!'
          : days === 0 ? '✅ Exported today'
          : days >= CONFIG.SYNC_REMIND_DAYS
            ? `⚠️ Last export: ${days} days ago — sync overdue!`
            : `✅ Last export: ${days} day${days !== 1 ? 's' : ''} ago`}
      </div>
    `;
  },

  doExport() { DB.export(); this._renderStatus(); },

  async doImport(input) {
    const file = input.files?.[0];
    if (!file) return;
    try {
      await DB.import(file);
      await App.refreshAll();
      this._renderStatus();
      toast('✅ Data merged from backup!', 'success', 4000);
    } catch (e) {
      toast('❌ Import failed: ' + e.message, 'error');
    }
    input.value = '';
  },

  checkReminder() {
    const days = DB.daysSinceExport();
    if (days === null) {
      setTimeout(() => toast('📤 Tip: export your data regularly to sync between devices!', 'info', 6000), 3000);
    } else if (days >= CONFIG.SYNC_REMIND_DAYS) {
      setTimeout(() => toast(`⚠️ ${days} days since last export — time to sync!`, 'warning', 7000), 2000);
    }
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. IN-APP NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Notifications = {
  items: [],

  check(cals, wkouts, weights) {
    this.items = [];
    const today = U.today();
    const hour  = new Date().getHours();
    const ws    = U.weekStart();

    if (hour >= 18 && !cals.find(l => l.date === today)) {
      this.items.push({ id:'cal', icon:'🔥', title:'Log Your Calories',
        msg: "Haven't logged today's calories yet.", label:'Log now', tab:'calories' });
    }
    if (!weights.find(w => w.date >= ws)) {
      this.items.push({ id:'wgt', icon:'⚖️', title:'Weekly Weight Check-In',
        msg: "Log your weight to track this week's progress.", label:'Log weight', tab:'weight' });
    }
    const dow = new Date().getDay();
    if (dow >= 4 && !wkouts.find(s => s.date >= ws && s.completed)) {
      this.items.push({ id:'wkt', icon:'💪', title:'No Workouts This Week',
        msg: "You haven't completed a session yet this week.", label:'Start training', tab:'workout' });
    }
    const days = DB.daysSinceExport();
    if (days === null || days >= CONFIG.SYNC_REMIND_DAYS) {
      this.items.push({ id:'sync', icon:'📤', title:'Data Sync Reminder',
        msg: days === null ? 'Never exported your data yet.' : `${days} days since last export.`,
        label:'Open sync', tab:null, action:'sync' });
    }

    this._render(); this._badge();
  },

  _render() {
    const el = document.getElementById('notif-list');
    if (!el) return;
    el.innerHTML = this.items.length === 0
      ? '<p class="notif-empty">🎉 All caught up!</p>'
      : this.items.map(n => `
          <div class="notif-item">
            <div class="notif-item-icon">${n.icon}</div>
            <div class="notif-item-body">
              <div class="notif-item-title">${n.title}</div>
              <div class="notif-item-msg">${n.msg}</div>
              <button class="notif-action-btn"
                onclick="Notifications._act('${n.id}','${n.tab}','${n.action||''}')">
                ${n.label} →
              </button>
            </div>
          </div>`).join('');
  },

  _act(id, tab, action) {
    this.closePanel();
    if (action === 'sync') { SyncManager.open(); return; }
    if (tab) App.switchTab(tab);
  },

  _badge() {
    const b = document.getElementById('notif-badge');
    if (!b) return;
    b.textContent = this.items.length;
    b.classList.toggle('hidden', this.items.length === 0);
  },

  togglePanel() {
    const p = document.getElementById('notif-panel');
    const o = document.getElementById('notif-overlay');
    const hide = !p.classList.contains('hidden');
    p.classList.toggle('hidden', hide);
    o.classList.toggle('hidden', hide);
  },

  closePanel() {
    document.getElementById('notif-panel')?.classList.add('hidden');
    document.getElementById('notif-overlay')?.classList.add('hidden');
  },

  clearAll() { this.items = []; this._render(); this._badge(); this.closePanel(); },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. CHART DEFAULTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function chartDefaults() {
  Chart.defaults.color = '#666';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = '#1A1A1A';
  Chart.defaults.plugins.tooltip.borderColor = '#333';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = '#F5C518';
  Chart.defaults.plugins.tooltip.bodyColor = '#ccc';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Dashboard = {
  weightChart: null, calChart: null,

  render(cals, wkouts, weights, seqIdx) {
    const el = document.getElementById('dashboard-content');
    if (!el) return;

    const today      = U.today();
    const todayCal   = cals.find(l => l.date === today);
    const todayWkout = wkouts.find(s => s.date === today);
    const latestWgt  = weights[0];
    const ws         = U.weekStart();
    const weekWkouts = wkouts.filter(s => s.date >= ws && s.completed);

    const consumed = todayCal?.calories_consumed ?? 0;
    const burned   = todayWkout?.calories_burned  ?? 0;
    const net      = consumed - burned;
    const barPct   = U.pct(consumed, CONFIG.TARGET_KCAL);

    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d  = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const active = cals.some(l => l.date === ds) || wkouts.some(s => s.date === ds);
      if (active) streak++;
      else if (i > 0) break;
    }

    const wgt       = latestWgt ? latestWgt.weight_kg : CONFIG.START_WEIGHT;
    const wgtChange = weights.length >= 2
      ? (weights[0].weight_kg - weights[weights.length-1].weight_kg).toFixed(1) : null;
    const nw = WORKOUTS[seqIdx];

    el.innerHTML = `
      <div class="dash-greeting">
        <div>
          <div class="dash-title">Good ${U.greeting()}, Omar 👊</div>
          <div class="dash-date">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
        </div>
        <div class="dash-streak">
          <span class="streak-num">${streak}</span>
          <span class="streak-label">day streak 🔥</span>
        </div>
      </div>

      <div class="stats-grid" style="margin-bottom:10px">
        <div class="stat-card ${consumed > 0 ? 'stat-yellow' : ''}">
          <div class="stat-icon">🔥</div>
          <div class="stat-val">${consumed > 0 ? consumed.toLocaleString() : '—'}</div>
          <div class="stat-label">Calories Today</div>
          <div class="stat-sub">Target: ${CONFIG.TARGET_KCAL}</div>
        </div>
        <div class="stat-card ${todayWkout?.completed ? 'stat-green' : ''}">
          <div class="stat-icon">💪</div>
          <div class="stat-val">${weekWkouts.length}</div>
          <div class="stat-label">Sessions This Week</div>
          <div class="stat-sub">Goal: 4 per week</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚖️</div>
          <div class="stat-val">${wgt} <small style="font-size:14px;font-weight:600;color:var(--text-2)">kg</small></div>
          <div class="stat-label">Current Weight</div>
          <div class="stat-sub">${wgtChange ? `${wgtChange > 0 ? '+' : ''}${wgtChange} kg total` : 'Starting weight'}</div>
        </div>
        <div class="stat-card ${burned > 0 ? 'stat-blue' : ''}">
          <div class="stat-icon">⚡</div>
          <div class="stat-val">${burned > 0 ? burned : '—'}</div>
          <div class="stat-label">Burned Today</div>
          <div class="stat-sub">${burned > 0 ? 'From workout' : 'Rest day'}</div>
        </div>
      </div>

      <div class="section-header">Today's Summary</div>
      <div class="today-card">
        <div class="today-row">
          <div class="today-item">
            <div class="today-label">Consumed</div>
            <div class="today-value text-yellow">${consumed > 0 ? consumed + ' kcal' : 'Not logged'}</div>
          </div>
          <div class="today-sep">−</div>
          <div class="today-item">
            <div class="today-label">Burned</div>
            <div class="today-value text-green">${burned > 0 ? burned + ' kcal' : '0 kcal'}</div>
          </div>
          <div class="today-sep">=</div>
          <div class="today-item">
            <div class="today-label">Net</div>
            <div class="today-value ${consumed > 0 && net > CONFIG.TARGET_KCAL + 200 ? 'text-red' : ''}">${consumed > 0 ? net + ' kcal' : '—'}</div>
          </div>
        </div>
        <div class="cal-bar-wrap">
          <div class="cal-bar" style="width:${barPct}%"></div>
        </div>
        <div class="cal-bar-labels">
          <span>0</span>
          <span>${CONFIG.TARGET_KCAL} kcal target</span>
          <span>${CONFIG.TDEE}</span>
        </div>
      </div>

      <div class="section-header">Next Workout</div>
      <div class="next-workout-card" style="--wc:${nw.color}" onclick="App.switchTab('workout')">
        <div class="nw-badge" style="background:${nw.bg};color:${nw.color};border:1px solid ${nw.border}">${nw.label}</div>
        <div class="nw-focus">${nw.focus}</div>
        <div class="nw-meta">
          <span>🔥 ~${nw.kcal} kcal</span>
          <span>⏱ 55–65 min</span>
          <span>💪 ${nw.exercises.length - 1} exercises + cardio</span>
        </div>
        <div class="nw-cta" style="color:${nw.color}">Tap to start →</div>
      </div>

      <div class="section-header">This Week</div>
      <div class="week-grid" style="margin-bottom:16px">${this._weekGrid(cals, wkouts)}</div>

      ${weights.length >= 2 ? `
      <div class="section-header">Weight Trend</div>
      <div class="chart-card"><canvas id="dash-wgt-chart" height="110"></canvas></div>` : ''}

      ${cals.length >= 2 ? `
      <div class="section-header">7-Day Calories</div>
      <div class="chart-card"><canvas id="dash-cal-chart" height="110"></canvas></div>` : ''}
    `;

    if (weights.length >= 2) this._wgtChart(weights.slice(0,10).reverse());
    if (cals.length >= 2)    this._calChart(cals);
  },

  _weekGrid(cals, wkouts) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const today = new Date(); const base = new Date(today);
    base.setDate(today.getDate() - today.getDay());
    return days.map((day, i) => {
      const d   = new Date(base); d.setDate(base.getDate() + i);
      const ds  = d.toISOString().split('T')[0];
      const isToday  = ds === U.today();
      const isFuture = d > today;
      const hasCal   = cals.some(l => l.date === ds);
      const hasWk    = wkouts.some(s => s.date === ds && s.completed);
      let cls = '';
      if (hasWk && hasCal) cls = 'week-day-full';
      else if (hasWk)      cls = 'week-day-wkout';
      else if (hasCal)     cls = 'week-day-cal';
      return `<div class="week-day ${cls} ${isToday?'week-day-today':''} ${isFuture?'week-day-future':''}">
        <div class="wd-name">${day}</div>
        <div class="wd-dot"></div>
        ${hasWk  ? '<div class="wd-icon">💪</div>' : ''}
        ${hasCal ? '<div class="wd-icon">🔥</div>' : ''}
      </div>`;
    }).join('');
  },

  _wgtChart(data) {
    const ctx = document.getElementById('dash-wgt-chart');
    if (!ctx) return;
    if (this.weightChart) this.weightChart.destroy();
    this.weightChart = new Chart(ctx, {
      type: 'line',
      data: { labels: data.map(w => U.fmtShort(w.date)),
        datasets: [{ data: data.map(w => +w.weight_kg),
          borderColor:'#F5C518', backgroundColor:'rgba(245,197,24,0.08)',
          borderWidth:2, pointBackgroundColor:'#F5C518', pointRadius:4, tension:0.35, fill:true }]},
      options: { responsive:true, scales: { x:{grid:{display:false}}, y:{ticks:{callback:v=>v+'kg'}} } }
    });
  },

  _calChart(cals) {
    const ctx = document.getElementById('dash-cal-chart');
    if (!ctx) return;
    if (this.calChart) this.calChart.destroy();
    const labels = [], values = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-US',{weekday:'short'}));
      values.push(cals.find(l => l.date === ds)?.calories_consumed ?? 0);
    }
    const t = CONFIG.TARGET_KCAL;
    this.calChart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ data: values,
        backgroundColor: values.map(v => v === 0 ? 'rgba(255,255,255,0.04)'
          : Math.abs(v-t) < 200 ? 'rgba(245,197,24,0.75)' : 'rgba(255,59,48,0.65)'),
        borderRadius: 5 }]},
      options: { responsive:true, scales: { x:{grid:{display:false}}, y:{min:0} } }
    });
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. WORKOUT TRACKER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WorkoutTab = {
  session: null,

  async render(wkouts, seqIdx) {
    const el = document.getElementById('workout-content');
    if (!el) return;

    const today     = U.today();
    const todaySess = wkouts.find(s => s.date === today);

    if (todaySess && !this.session) {
      this.session = { ...todaySess };
      if (typeof this.session.exercises_data === 'string')
        this.session.exercises_data = JSON.parse(this.session.exercises_data);
    }

    const nw = WORKOUTS[seqIdx];

    el.innerHTML = `
      <div class="view-toggle-row">
        <button class="vt-btn vt-active">💪 Active Session</button>
        <button class="vt-btn" onclick="PlanView.show()">📋 Browse Plan</button>
      </div>

      <div class="section-header" style="margin-top:0">Workout Tracker</div>

      <div class="sequence-pills">
        ${WORKOUTS.map((w,i) => `
          <div class="seq-pill ${i===seqIdx?'seq-active':''}"
            style="background:${w.bg};color:${w.color};border:1px solid ${w.border}">
            ${i===seqIdx?'▶ ':''}${w.label}
          </div>`).join('')}
      </div>
      <p class="seq-hint">Fixed sequence — advances automatically after each completed session</p>

      ${this.session
        ? this._renderSession(seqIdx)
        : this._renderStart(nw, today, seqIdx)}
    `;

    document.getElementById('workout-date-input')?.addEventListener('change', e => {
      const lbl = document.getElementById('workout-date-label');
      if (lbl) lbl.textContent = U.fmt(e.target.value);
    });
  },

  _renderStart(w, today, seqIdx) {
    return `
      <div class="workout-start-card" style="border-top:2px solid ${w.color}">
        <div class="ws-header">
          <div>
            <div class="ws-label" style="color:${w.color}">${w.label}</div>
            <div class="ws-focus">${w.focus}</div>
          </div>
          <div class="ws-burn">🔥 ~${w.kcal} kcal</div>
        </div>
        <div class="ws-exercises">
          ${w.exercises.map(ex => `
            <div class="ws-ex-row">
              <span class="ws-ex-muscle">${ex.muscle}</span>
              <span class="ws-ex-name">${ex.name}</span>
              <span class="ws-ex-sets">${ex.sets}×${ex.reps}</span>
            </div>`).join('')}
        </div>
        <div class="ws-date-section">
          <span class="ws-date-label">Training Date</span>
          <div class="ws-date-row">
            <span id="workout-date-label">${U.fmt(today)}</span>
            <input type="date" id="workout-date-input" class="date-input" value="${today}" max="${today}">
          </div>
        </div>
        <button class="btn-primary btn-full" onclick="WorkoutTab.startSession(${seqIdx})">
          Start ${w.label} Training Session 💪
        </button>
      </div>`;
  },

  _renderSession(seqIdx) {
    const s  = this.session;
    const w  = WORKOUTS.find(x => x.id === s.workout_type) || WORKOUTS[seqIdx];
    const ed = Array.isArray(s.exercises_data) ? s.exercises_data : [];
    if (s.completed) return this._renderDone(s, w);

    const totalSets = w.exercises.reduce((a, ex) => a + ex.sets, 0);
    const doneSets  = ed.reduce((a, ex) => a + (ex.sets_done?.filter(Boolean).length ?? 0), 0);
    const pct       = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

    return `
      <div class="session-header">
        <div>
          <div class="session-badge" style="background:${w.bg};color:${w.color};border:1px solid ${w.border}">${w.label}</div>
          <div class="session-date">${U.fmt(s.date)}</div>
        </div>
        <div class="session-prog-ring">
          <div class="prog-num">${pct}%</div>
          <div class="prog-sub">DONE</div>
        </div>
      </div>
      <div class="session-prog-bar"><div class="session-prog-fill" id="sess-prog" style="width:${pct}%"></div></div>

      <div class="exercises-list" id="exercises-list">
        ${w.exercises.map((ex, ei) => {
          const exd  = ed[ei] || { sets_done: Array(ex.sets).fill(false) };
          const done = exd.sets_done?.every(Boolean);
          return `
            <div class="exercise-card ${done?'ex-done':''} ${ex.isCardio?'ex-cardio':''}" id="ex-${ei}">
              <div class="ex-header">
                <div class="ex-info">
                  <div class="ex-name ${done?'ex-name-done':''}">${ex.name}</div>
                  <div class="ex-meta-row">
                    <span class="ex-muscle-tag">${ex.muscle}</span>
                    <span class="ex-sets-info">${ex.sets} × ${ex.reps}</span>
                    <span class="ex-rest">Rest: ${ex.rest}</span>
                  </div>
                </div>
                ${ex.yt ? `<a href="${ex.yt}" target="_blank" rel="noopener" class="yt-btn">▶ Tutorial</a>` : ''}
              </div>
              <div class="sets-row">
                ${Array.from({length:ex.sets},(_,si) => {
                  const sd = exd.sets_done?.[si] ?? false;
                  return `<button class="set-btn ${sd?'set-done':''}" id="set-${ei}-${si}" onclick="WorkoutTab.toggleSet(${ei},${si})">
                    <span class="set-num">Set ${si+1}</span>
                    <span class="set-check">${sd?'✓':'○'}</span>
                  </button>`;
                }).join('')}
              </div>
              ${done ? '<div class="ex-done-badge">✓ Complete</div>' : ''}
            </div>`;
        }).join('')}
      </div>

      <div class="session-actions">
        <button class="btn-secondary" onclick="WorkoutTab.abandon()">Abandon</button>
        <button class="btn-primary ${pct<100?'btn-disabled':''}" id="complete-btn"
          onclick="WorkoutTab.complete()" ${pct<100?'disabled':''}>
          Complete Workout ✓
        </button>
      </div>
      <p class="session-hint">Mark all sets to unlock completion</p>`;
  },

  _renderDone(s, w) {
    return `
      <div class="completed-banner">
        <div class="completed-icon">🏆</div>
        <div class="completed-title">Session Complete!</div>
        <div class="completed-sub">${w.label} · ${U.fmt(s.date)}</div>
        <div class="completed-stats">
          <div><div class="cs-val text-orange">🔥 ${s.calories_burned}</div><div class="cs-label">kcal burned</div></div>
          <div><div class="cs-val text-yellow">💪 ${w.exercises.length - 1}</div><div class="cs-label">exercises</div></div>
          <div><div class="cs-val text-green">✓ All sets</div><div class="cs-label">completed</div></div>
        </div>
        <button class="btn-primary" onclick="WorkoutTab.newSession()">Log Another Day →</button>
      </div>`;
  },

  startSession(seqIdx) {
    const date = document.getElementById('workout-date-input')?.value || U.today();
    const w    = WORKOUTS[seqIdx];
    this.session = {
      date, workout_type: w.id, sequence_index: seqIdx, completed: false,
      exercises_data: w.exercises.map(ex => ({ name: ex.name, sets_done: Array(ex.sets).fill(false) })),
      calories_burned: w.kcal, started_at: new Date().toISOString(),
    };
    DB.upsertSession(this.session);
    App.refreshWkout();
    toast(`Started ${w.label}! Let's go! 💪`, 'success');
  },

  toggleSet(ei, si) {
    if (!this.session || this.session.completed) return;
    const ed = this.session.exercises_data;
    if (!ed[ei]) return;
    ed[ei].sets_done[si] = !ed[ei].sets_done[si];
    DB.upsertSession({ ...this.session });

    const btn = document.getElementById(`set-${ei}-${si}`);
    if (btn) {
      const done = ed[ei].sets_done[si];
      btn.classList.toggle('set-done', done);
      btn.querySelector('.set-check').textContent = done ? '✓' : '○';
    }

    const allDone = ed[ei].sets_done.every(Boolean);
    const card = document.getElementById(`ex-${ei}`);
    if (card) {
      card.classList.toggle('ex-done', allDone);
      card.querySelector('.ex-name')?.classList.toggle('ex-name-done', allDone);
      const badge = card.querySelector('.ex-done-badge');
      if (allDone && !badge) { const b = document.createElement('div'); b.className='ex-done-badge'; b.textContent='✓ Complete'; card.appendChild(b); }
      else if (!allDone && badge) badge.remove();
    }

    const w         = WORKOUTS.find(x => x.id === this.session.workout_type);
    const totalSets = w.exercises.reduce((a, ex) => a + ex.sets, 0);
    const doneSets  = ed.reduce((a, ex) => a + ex.sets_done.filter(Boolean).length, 0);
    const pct       = Math.round((doneSets / totalSets) * 100);

    const bar  = document.getElementById('sess-prog');
    if (bar)  bar.style.width = pct + '%';
    const prog = document.querySelector('.prog-num');
    if (prog) prog.textContent = pct + '%';
    const cBtn = document.getElementById('complete-btn');
    if (cBtn) { cBtn.disabled = pct < 100; cBtn.classList.toggle('btn-disabled', pct < 100); }
  },

  complete() {
    if (!this.session) return;
    this.session.completed    = true;
    this.session.completed_at = new Date().toISOString();
    DB.upsertSession(this.session);

    const newIdx = (this.session.sequence_index + 1) % 4;
    DB.setState('next_sequence_index', newIdx);
    App.state.seqIdx = newIdx;

    App.refreshAll();
    const w = WORKOUTS.find(x => x.id === this.session.workout_type);
    toast(`🏆 ${w.label} complete! +${this.session.calories_burned} kcal burned!`, 'success', 5000);
  },

  abandon() {
    if (!confirm('Abandon this session? Progress will be lost.')) return;
    const date = this.session.date;
    this.session = null;
    DB.deleteSession(date);
    App.state.wkouts = App.state.wkouts.filter(s => s.date !== date);
    App.refreshWkout();
  },

  newSession() { this.session = null; App.refreshWkout(); },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. PLAN VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PlanView = {
  day: 0,

  show(dayIdx) {
    this.day = dayIdx !== undefined ? dayIdx : App.state.seqIdx;
    this.render();
  },

  render() {
    const el = document.getElementById('workout-content');
    if (!el) return;
    const w = WORKOUTS[this.day];

    el.innerHTML = `
      <div class="view-toggle-row">
        <button class="vt-btn" onclick="App.refreshWkout()">💪 Active Session</button>
        <button class="vt-btn vt-active">📋 Browse Plan</button>
      </div>

      <div class="section-header" style="margin-top:0">Training Plan Reference</div>

      <div class="plan-day-tabs">
        ${WORKOUTS.map((wd,i) => `
          <button class="plan-day-btn ${i===this.day?'plan-day-active':''}"
            style="${i===this.day?`background:${wd.bg};color:${wd.color};border-color:${wd.border}`:''}"
            onclick="PlanView.show(${i})">${wd.label}
          </button>`).join('')}
      </div>

      <div class="plan-day-header" style="border-left:3px solid ${w.color}">
        <div class="pdh-label" style="color:${w.color}">${w.label}</div>
        <div class="pdh-focus">${w.focus}</div>
        <div class="pdh-meta">
          <span>🔥 ~${w.kcal} kcal</span>
          <span>⏱ 55–65 min</span>
          <span>💪 ${w.exercises.filter(e=>!e.isCardio).length} exercises + cardio</span>
        </div>
      </div>

      <div class="plan-exercises">
        ${w.exercises.map((ex,ei) => {
          const vid   = U.ytId(ex.yt);
          const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : null;
          return `
            <div class="plan-ex-card ${ex.isCardio?'plan-ex-cardio':''}">
              <div class="plan-ex-left"><div class="plan-ex-num">${ei+1}</div></div>
              ${thumb ? `
                <div class="plan-thumb-wrap">
                  <img class="plan-thumb" src="${thumb}" alt="${ex.name}" loading="lazy"
                    onerror="this.parentElement.style.display='none'">
                  <a href="${ex.yt}" target="_blank" rel="noopener" class="thumb-play">
                    <span class="thumb-play-icon">▶</span>
                  </a>
                </div>` : `
                <div class="plan-thumb-wrap plan-thumb-placeholder">
                  <span>${ex.isCardio?'🏃':'💪'}</span>
                </div>`}
              <div class="plan-ex-info">
                <div class="plan-ex-name">${ex.name}</div>
                <div class="plan-ex-meta-row">
                  <span class="ex-muscle-tag">${ex.muscle}</span>
                  <span class="ex-sets-info">${ex.sets} × ${ex.reps}</span>
                  <span class="ex-rest">Rest: ${ex.rest}</span>
                </div>
                ${ex.yt ? `
                  <a href="${ex.yt}" target="_blank" rel="noopener" class="yt-watch-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.6 12 21.6 12 21.6s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zm-13.5 8.5V8.3l8.2 3.6-8.2 3.6z"/>
                    </svg>
                    Watch Tutorial on YouTube
                  </a>` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>

      <div class="plan-note">
        📌 Progressive overload: each week, add 1 rep or 2.5–5 kg per lift. Track your numbers every session.
      </div>
    `;
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. CALORIES TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CalTab = {
  chart: null,

  render(cals, wkouts) {
    const el = document.getElementById('calories-content');
    if (!el) return;

    const today  = U.today();
    const tLog   = cals.find(l => l.date === today);
    const tWk    = wkouts.find(s => s.date === today && s.completed);
    const eaten  = tLog?.calories_consumed ?? 0;
    const burned = tWk?.calories_burned  ?? 0;
    const remain = CONFIG.TARGET_KCAL - eaten;
    const pct    = U.pct(eaten, CONFIG.TARGET_KCAL);
    const circum = 2 * Math.PI * 48;
    const ringVal= circum * (1 - pct / 100);

    el.innerHTML = `
      <div class="section-header" style="margin-top:0">Today's Calories</div>
      <div class="cal-ring-card">
        <div class="cal-ring-wrap">
          <svg class="cal-ring-svg" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
            <circle cx="60" cy="60" r="48" fill="none"
              stroke="${pct>=100?'#FF3B30':'#F5C518'}" stroke-width="10"
              stroke-dasharray="${circum}" stroke-dashoffset="${ringVal}"
              stroke-linecap="round" style="transition:stroke-dashoffset 0.7s ease"/>
          </svg>
          <div class="cal-ring-center">
            <div class="cal-ring-num">${eaten>0?eaten:'—'}</div>
            <div class="cal-ring-label">kcal eaten</div>
          </div>
        </div>
        <div class="cal-ring-stats">
          <div><div class="cal-s-val text-yellow">${CONFIG.TARGET_KCAL}</div><div class="cal-s-label">Target</div></div>
          <div><div class="cal-s-val ${remain>=0?'text-green':'text-red'}">${Math.abs(remain)}</div><div class="cal-s-label">${remain>=0?'Remaining':'Over'}</div></div>
          <div><div class="cal-s-val text-orange">${burned>0?burned:'—'}</div><div class="cal-s-label">Burned</div></div>
          <div><div class="cal-s-val">${eaten>0?eaten-burned:'—'}</div><div class="cal-s-label">Net kcal</div></div>
        </div>
      </div>

      <div class="section-header">Log Today's Calories</div>
      <div class="log-card">
        <p class="log-hint">Roughly how many calories did you eat today?</p>
        <div class="log-row">
          <input type="number" id="cal-input" class="big-input"
            placeholder="${tLog?tLog.calories_consumed:1750}"
            value="${tLog?tLog.calories_consumed:''}" min="0" max="10000">
          <span class="input-unit">kcal</span>
        </div>
        <input type="text" id="cal-notes" class="form-input"
          placeholder="Optional note (e.g. cheat day)..."
          value="${tLog?.notes||''}" style="margin-bottom:10px">
        <button class="btn-primary btn-full" onclick="CalTab.save()">
          ${tLog?'✏️ Update Today\'s Log':'💾 Save Calories'}
        </button>
        <div class="presets">
          <div class="preset-label">Quick entry</div>
          <div class="preset-btns">
            ${[1400,1600,1750,1900,2100,2300].map(v => `
              <button class="preset-btn ${tLog?.calories_consumed===v?'preset-active':''}"
                onclick="document.getElementById('cal-input').value=${v};
                         document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('preset-active'));
                         this.classList.add('preset-active')">${v}</button>`).join('')}
          </div>
        </div>
      </div>

      ${cals.length>=2 ? `
      <div class="section-header">14-Day History</div>
      <div class="chart-card"><canvas id="cal-hist-chart" height="130"></canvas></div>` : ''}

      <div class="section-header">Log History</div>
      <div class="history-list">
        ${cals.length===0 ? '<p class="empty-state">No logs yet. Start tracking!</p>'
          : cals.slice(0,20).map(l => {
              const wk = wkouts.find(s => s.date===l.date&&s.completed);
              const ok = Math.abs(l.calories_consumed - CONFIG.TARGET_KCAL) <= 200;
              return `<div class="history-item">
                <div class="history-date">${U.fmt(l.date)}</div>
                <div class="history-cals ${ok?'text-yellow':'text-red'}">${l.calories_consumed} kcal</div>
                ${wk?`<div class="history-wkout">💪 −${wk.calories_burned}</div>`:''}
              </div>`;
            }).join('')}
      </div>
    `;
    if (cals.length >= 2) this._chart(cals);
  },

  save() {
    const v = parseInt(document.getElementById('cal-input')?.value);
    const n = document.getElementById('cal-notes')?.value || '';
    if (!v || v < 1 || v > 10000) { toast('Enter a valid amount (1–10000 kcal)', 'error'); return; }
    DB.upsertCalorieLog(U.today(), v, n);
    App.refreshAll();
    toast(`✅ Logged ${v} kcal for today!`, 'success');
  },

  _chart(cals) {
    const ctx = document.getElementById('cal-hist-chart');
    if (!ctx) return;
    if (this.chart) this.chart.destroy();
    const labels = [], vals = [];
    for (let i=13; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const ds = d.toISOString().split('T')[0];
      labels.push(U.fmtShort(ds));
      vals.push(cals.find(l=>l.date===ds)?.calories_consumed ?? 0);
    }
    const t = CONFIG.TARGET_KCAL;
    this.chart = new Chart(ctx, {
      type:'bar',
      data:{ labels, datasets:[
        { data:vals, backgroundColor:vals.map(v=>v===0?'rgba(255,255,255,0.04)':Math.abs(v-t)<200?'rgba(245,197,24,0.75)':'rgba(255,59,48,0.65)'), borderRadius:4 },
        { data:Array(14).fill(t), type:'line', borderColor:'rgba(245,197,24,0.3)', borderDash:[4,4], borderWidth:1, pointRadius:0, fill:false }
      ]},
      options:{ responsive:true, scales:{ x:{grid:{display:false},ticks:{maxTicksLimit:7}}, y:{min:0} } }
    });
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14. CALENDAR TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CalendarTab = {
  year: new Date().getFullYear(), month: new Date().getMonth(),

  render(cals, wkouts) {
    const el = document.getElementById('calendar-content');
    if (!el) return;
    const totalWk     = wkouts.filter(s=>s.completed).length;
    const totalBurned = wkouts.filter(s=>s.completed).reduce((a,s)=>a+(s.calories_burned||0),0);

    el.innerHTML = `
      <div class="section-header" style="margin-top:0">Training Calendar</div>
      <div class="cal-legend">
        <span class="legend-item"><span class="legend-dot" style="background:#F5C518"></span>Trained + Logged</span>
        <span class="legend-item"><span class="legend-dot" style="background:#2979FF"></span>Trained only</span>
        <span class="legend-item"><span class="legend-dot" style="background:#00C853"></span>Calories logged</span>
      </div>
      <div class="calendar-wrap">
        <div class="cal-nav">
          <button class="cal-nav-btn" onclick="CalendarTab.prev()">‹</button>
          <span class="cal-month-label" id="cal-month-lbl"></span>
          <button class="cal-nav-btn" onclick="CalendarTab.next()">›</button>
        </div>
        <div class="cal-grid-header">
          ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<span>${d}</span>`).join('')}
        </div>
        <div class="cal-grid" id="cal-grid"></div>
      </div>
      <div class="section-header">All-Time Stats</div>
      <div class="stats-grid">
        <div class="stat-card stat-blue"><div class="stat-icon">💪</div><div class="stat-val">${totalWk}</div><div class="stat-label">Total Sessions</div></div>
        <div class="stat-card"><div class="stat-icon">🔥</div><div class="stat-val">${cals.length}</div><div class="stat-label">Days Logged</div></div>
        <div class="stat-card stat-yellow"><div class="stat-icon">⚡</div><div class="stat-val">${totalBurned.toLocaleString()}</div><div class="stat-label">kcal Burned Total</div></div>
        <div class="stat-card"><div class="stat-icon">⚖️</div><div class="stat-val">${DB.getWeightLogs().length}</div><div class="stat-label">Weight Entries</div></div>
      </div>
    `;
    this._renderMonth(cals, wkouts);
  },

  _renderMonth(cals, wkouts) {
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const lbl  = document.getElementById('cal-month-lbl');
    const grid = document.getElementById('cal-grid');
    if (!lbl || !grid) return;
    lbl.textContent = `${MONTHS[this.month]} ${this.year}`;
    const first = new Date(this.year, this.month, 1).getDay();
    const days  = new Date(this.year, this.month+1, 0).getDate();
    const today = U.today();
    let html = '<div></div>'.repeat(first);
    const emap = { upper_a:'💪', lower_a:'🦵', upper_b:'🏋️', lower_b:'🔥' };
    for (let d=1; d<=days; d++) {
      const ds = `${this.year}-${String(this.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday  = ds === today;
      const isFuture = ds > today;
      const hasWk    = wkouts.some(s=>s.date===ds&&s.completed);
      const hasCal   = cals.some(l=>l.date===ds);
      const wk       = wkouts.find(s=>s.date===ds&&s.completed);
      const dot      = (hasWk&&hasCal)?'dot-full':hasWk?'dot-wkout':hasCal?'dot-cal':'';
      html += `<div class="cal-day ${isToday?'cal-today':''} ${isFuture?'cal-future':''}">
        <span class="cal-day-num">${d}</span>
        ${dot?`<span class="cal-dot ${dot}"></span>`:''}
        ${wk?`<span class="cal-wk-badge">${emap[wk.workout_type]||'💪'}</span>`:''}
      </div>`;
    }
    grid.innerHTML = html;
  },

  prev() { this.month--; if(this.month<0){this.month=11;this.year--;} this._renderMonth(App.state.cals,App.state.wkouts); },
  next() { this.month++; if(this.month>11){this.month=0;this.year++;} this._renderMonth(App.state.cals,App.state.wkouts); },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15. WEIGHT TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WeightTab = {
  chart: null,

  render(weights) {
    const el = document.getElementById('weight-content');
    if (!el) return;
    const latest = weights[0];
    const oldest = weights[weights.length-1];
    const change = weights.length >= 2 ? (latest.weight_kg - oldest.weight_kg).toFixed(1) : null;

    el.innerHTML = `
      <div class="section-header" style="margin-top:0">Weight Tracker</div>
      <div class="weight-hero-card" style="margin-bottom:4px">
        <div class="weight-current">
          <div class="weight-val">${latest?latest.weight_kg:CONFIG.START_WEIGHT}</div>
          <div class="weight-unit">kg</div>
        </div>
        <div class="weight-meta">
          <div><div class="wm-label">Starting</div><div class="wm-val">${oldest?oldest.weight_kg+' kg':CONFIG.START_WEIGHT+' kg'}</div></div>
          <div><div class="wm-label">Total change</div><div class="wm-val ${change<0?'text-green':+change>0?'text-red':''}">${change!==null?(+change>0?'+':'')+change+' kg':'—'}</div></div>
          <div><div class="wm-label">Last logged</div><div class="wm-val">${latest?U.fmt(latest.date,{month:'short',day:'numeric'}):'Never'}</div></div>
        </div>
      </div>

      <div class="section-header">Log Weight</div>
      <div class="log-card">
        <p class="log-hint">Weigh yourself weekly, same time each week (morning, before food).</p>
        <div class="log-row">
          <input type="number" id="wgt-input" class="big-input"
            placeholder="${latest?latest.weight_kg:CONFIG.START_WEIGHT}" step="0.1" min="30" max="250">
          <span class="input-unit">kg</span>
        </div>
        <input type="date" id="wgt-date" class="form-input" value="${U.today()}" max="${U.today()}" style="margin-bottom:10px">
        <input type="text" id="wgt-notes" class="form-input" placeholder="Optional notes...">
        <button class="btn-primary btn-full" onclick="WeightTab.save()" style="margin-top:12px">💾 Save Weight Entry</button>
      </div>

      ${weights.length>=2 ? `
      <div class="section-header">Weight Trend</div>
      <div class="chart-card"><canvas id="wgt-chart" height="150"></canvas></div>`
      : '<p class="empty-state" style="margin-top:16px">Log at least 2 entries to see your trend.</p>'}

      <div class="section-header">History</div>
      <div class="history-list">
        ${weights.length===0 ? '<p class="empty-state">No entries yet.</p>'
          : weights.map((w,i) => {
              const prev = weights[i+1];
              const diff = prev ? (w.weight_kg - prev.weight_kg).toFixed(1) : null;
              return `<div class="history-item">
                <div class="history-date">${U.fmt(w.date)}</div>
                <div class="history-kg">${w.weight_kg} kg</div>
                ${diff!==null ? `<div class="history-diff ${diff<0?'text-green':+diff>0?'text-red':'text-muted'}">${+diff>0?'+':''}${diff} kg</div>` : '<div class="history-diff text-muted">—</div>'}
              </div>`;
            }).join('')}
      </div>
    `;
    if (weights.length >= 2) this._chart(weights.slice().reverse());
  },

  save() {
    const v = parseFloat(document.getElementById('wgt-input')?.value);
    const d = document.getElementById('wgt-date')?.value || U.today();
    const n = document.getElementById('wgt-notes')?.value || '';
    if (!v || v < 30 || v > 250) { toast('Enter a valid weight (30–250 kg)', 'error'); return; }
    DB.insertWeight(d, v, n);
    App.refreshAll();
    toast(`✅ Weight logged: ${v} kg`, 'success');
  },

  _chart(data) {
    const ctx = document.getElementById('wgt-chart');
    if (!ctx) return;
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, {
      type:'line',
      data:{ labels:data.map(w=>U.fmtShort(w.date)),
        datasets:[{ data:data.map(w=>+w.weight_kg), borderColor:'#F5C518',
          backgroundColor:'rgba(245,197,24,0.07)', borderWidth:2.5,
          pointBackgroundColor:'#F5C518', pointBorderColor:'#080808',
          pointBorderWidth:2, pointRadius:5, tension:0.3, fill:true }]},
      options:{ responsive:true, scales:{ x:{grid:{display:false}}, y:{ticks:{callback:v=>v+' kg'}} } }
    });
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16. MAIN APP CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const App = {
  tab: 'dashboard',
  state: { cals:[], wkouts:[], weights:[], seqIdx:0 },

  init() {
    chartDefaults();
    if (!Auth.ok()) { this._showLogin(); return; }
    this._launch();
  },

  _showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const u   = document.getElementById('username').value;
      const p   = document.getElementById('password').value;
      const err = document.getElementById('login-error');
      if (Auth.login(u, p)) { err.classList.add('hidden'); this._launch(); }
      else { err.classList.remove('hidden'); document.getElementById('password').value=''; document.getElementById('password').focus(); }
    });
  },

  _launch() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    this.loadData();
    this._renderTab();
    Notifications.check(this.state.cals, this.state.wkouts, this.state.weights);
    SyncManager.checkReminder();
  },

  loadData() {
    this.state.cals    = DB.getCalorieLogs();
    this.state.wkouts  = DB.getWorkoutSessions();
    this.state.weights = DB.getWeightLogs();
    this.state.seqIdx  = parseInt(DB.getState('next_sequence_index') ?? '0') % 4;
  },

  refreshAll() {
    this.loadData();
    this._renderTab();
    Notifications.check(this.state.cals, this.state.wkouts, this.state.weights);
  },

  refreshWkout() {
    this.loadData();
    WorkoutTab.render(this.state.wkouts, this.state.seqIdx);
  },

  _renderTab() {
    const { cals, wkouts, weights, seqIdx } = this.state;
    switch (this.tab) {
      case 'dashboard': Dashboard.render(cals, wkouts, weights, seqIdx); break;
      case 'workout':   WorkoutTab.render(wkouts, seqIdx); break;
      case 'calories':  CalTab.render(cals, wkouts); break;
      case 'calendar':  CalendarTab.render(cals, wkouts); break;
      case 'weight':    WeightTab.render(weights); break;
    }
  },

  switchTab(name) {
    if (this.tab === name) return;
    Notifications.closePanel();
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
    document.getElementById(`tab-${name}`)?.classList.add('active');
    document.getElementById(`nav-${name}`)?.classList.add('active');
    this.tab = name;
    this._renderTab();
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 17. GLOBAL HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function togglePassword() {
  const inp = document.getElementById('password');
  inp.type  = inp.type === 'password' ? 'text' : 'password';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 18. BOOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', () => App.init());
