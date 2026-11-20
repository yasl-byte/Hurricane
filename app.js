/* Hurricane Younes — logique de l'application */
'use strict';
const KEY = 'hurricane_younes_v1';
const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const DOWL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MEALS = { dej: { n: 'Déjeuner', h: '7 h – 12 h' }, din: { n: 'Dîner', h: '12 h – 18 h' }, sou: { n: 'Souper', h: '18 h – minuit' } };
const SESS = ['FB', 'PUSH', 'PULL', 'LEGS'];
const INT = { tech: 6, mod: 7.5, int: 9 };

/* ---------- utilitaires ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fr = (x, d = 0) => (+x || 0).toLocaleString('fr-BE', { maximumFractionDigits: d });
const sum = (a, k) => a.reduce((s, o) => s + (+o[k] || 0), 0);
const clone = o => JSON.parse(JSON.stringify(o));
const css = v => getComputedStyle(document.body).getPropertyValue(v).trim();
function iso(d) { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); }
function parse(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(s, n) { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
function dowIdx(s) { return (parse(s).getDay() + 6) % 7; }
function today() { return iso(new Date()); }
function monday(d) { return addDays(d, -dowIdx(d)); }
function dlabel(s) { const d = parse(s); return `${DOW[dowIdx(s)]}. ${d.getDate()} ${MOIS[d.getMonth()]}`; }
function dshort(s) { const d = parse(s); return `${d.getDate()} ${MOIS[d.getMonth()]}`; }
function daysBetween(a, b) { return Math.round((parse(b) - parse(a)) / 864e5); }
function hm(h) { const m = Math.round(((h % 24) + 24) % 24 * 60); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
function nowH() { const n = new Date(); return n.getHours() + n.getMinutes() / 60 + n.getSeconds() / 3600; }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2400); }
function dayIndex(d) { return Math.floor(parse(d) / 864e5); }

/* ---------- icônes ---------- */
const ICONS = {
  glove: '<path d="M8 3h6a5 5 0 0 1 5 5v3.5a6.5 6.5 0 0 1-6.5 6.5H9v3.5H5.5V15A4.5 4.5 0 0 1 3 11V8a5 5 0 0 1 5-5z"/><path d="M3.2 10.5c.8 1.6 2.4 2.5 4.3 2.5h3"/><path d="M9 18h6"/>',
  dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  moon: '<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10z"/><path d="M17 3.5l.6 1.4 1.4.6-1.4.6L17 7.5l-.6-1.4L15 5.5l1.4-.6z"/>',
  plate: '<circle cx="13" cy="12" r="6"/><circle cx="13" cy="12" r="3"/><path d="M3 4v5a1.5 1.5 0 0 0 3 0V4M4.5 9v11M22 4c-1.4 1-1.8 3-1.8 5s.4 3 1.8 3v8"/>',
  belt: '<path d="M2 9h5M17 9h5M2 15h5M17 15h5"/><rect x="7" y="5.5" width="10" height="13" rx="3"/><circle cx="12" cy="12" r="2.6"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/><path d="M12 3v2"/>',
  storm: '<path d="M21 5H9.5a5.5 5.5 0 0 0 0 11H14"/><path d="M18 9.5H10a2 2 0 0 0 0 4h6.5"/><path d="M4 19h11"/>'
};
const ic = (n, cls = 'ic') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${ICONS[n]}</svg>`;

/* ---------- état ---------- */
function defaults() {
  return {
    v: 1,
    profile: { setup: false, name: 'Younes', sex: 'h', age: 28, height: 179, weight: 89, bf: '', activity: 1.35, rate: 0.5, boxMin: 90, boxInt: 'mod', gymMin: 60, goalW: '', goalDate: '' },
    kcal: { mode: 'auto', recupMaint: true, muscu: 2700, boxe: 2900, repos: 2300, P: 195, F: 70 },
    week: [{ box: true, gym: null }, { box: false, gym: 'FB' }, { box: true, gym: null }, { box: false, gym: 'PULL' }, { box: true, gym: null }, { box: false, gym: 'LEGS' }, { box: false, gym: 'PUSH' }],
    program: clone(PROGRAM), weeks: {}, weekExt: {}, days: {}, weights: [], favs: clone(FOODS),
    supps: [
      { id: 'vitd', n: 'Vitamine D', dose: '1 gélule', when: 'Matin' },
      { id: 'crea', n: 'Créatine', dose: '5 g', when: 'Matin' },
      { id: 'omeg', n: 'Oméga 3', dose: '2 gélules', when: 'Avec un repas' },
      { id: 'magn', n: 'Magnésium', dose: '1 gélule', when: 'Soir' }
    ],
    reminder: { on: true, supp: 'crea', time: '08:30' },
    prayer: { method: 'MWL', asr: 1, city: 'both', adj: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 } },
    ui: { theme: 'ring', accent: '', font: 'affiche', size: 'm', radius: 'rond', density: 'confort', nav: 'bottom', bg: 'cordes',
      home: Object.keys(HOME_BLOCKS).map(id => ({ id, on: true })) }
  };
}
function load() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) { const o = JSON.parse(r), d = defaults(); for (const k of ['profile', 'kcal', 'reminder', 'prayer', 'ui']) o[k] = Object.assign(d[k], o[k] || {}); return Object.assign(d, o); }
  } catch (e) { }
  return defaults();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Sauvegarde impossible sur cet appareil'); } }
let S = load();
const UI = { tab: 'home', date: today(), gymSess: null, gymEdit: false, chk: {}, chkEdit: false, q: '', meal: null, statEx: null, verseOff: 0, open: {} };

function day(d) {
  if (!S.days[d]) S.days[d] = {};
  const x = S.days[d];
  x.food = x.food || []; x.supp = x.supp || {}; x.pray = x.pray || {};
  return x;
}
function peek(d) { return S.days[d] || {}; }

/* ---------- planning ---------- */
function wstat(d) { return S.weeks[monday(d)] || 'normal'; }
function basePlan(d) { const x = S.days[d]; return (x && x.ov) || S.week[dowIdx(d)]; }
function plan(d) { const p = basePlan(d); if (wstat(d) === 'report') return { box: p.box, gym: null, cancelled: !!p.gym }; return p; }
function dtype(p) { return p.box && p.gym ? 'double' : p.box ? 'boxe' : p.gym ? 'muscu' : 'repos'; }
const DTL = { double: '🥊 + 🏋️ Jour double', boxe: '🥊 Jour de boxe', muscu: '🏋️ Jour de muscu', repos: '😴 Jour de repos' };

/* ---------- énergie ---------- */
function maW(upTo) { const ws = S.weights.filter(w => w.d <= upTo); if (!ws.length) return null; const last = ws[ws.length - 1].d, from = addDays(last, -6); const sel = ws.filter(w => w.d >= from); return sel.reduce((a, w) => a + w.kg, 0) / sel.length; }
function curW(d) { return maW(d || today()) || +S.profile.weight || 80; }
function bmr(W) { const p = S.profile, bf = parseFloat(p.bf); if (bf > 0 && bf < 60) return 370 + 21.6 * W * (1 - bf / 100); return 10 * W + 6.25 * (+p.height) - 5 * (+p.age) + (p.sex === 'f' ? -161 : 5); }
function dayKcal(pl, W) { const p = S.profile; let k = bmr(W) * (+p.activity); if (pl.box) k += (INT[p.boxInt] - 1) * W * (+p.boxMin) / 60; if (pl.gym) k += 3.5 * W * (+p.gymMin) / 60 + 5 * W * 0.5; return k; }
function weekAvg(W) { return S.week.reduce((a, pl) => a + dayKcal(pl, W), 0) / 7; }
function deficit(W) { return Math.min((+S.profile.rate) / 100 * W * 7700 / 7, weekAvg(W) * 0.25); }
function autoTargets(d) {
  const pl = plan(d), W = curW(d), p = S.profile, ws = wstat(d);
  const maint = (ws !== 'normal' && S.kcal.recupMaint);
  let k = Math.round((dayKcal(pl, W) - (maint ? 0 : deficit(W))) / 10) * 10;
  const bf = parseFloat(p.bf);
  const P = Math.round(bf > 0 ? Math.min(2.6 * W * (1 - bf / 100), 240) : Math.min(2.2 * W, 230));
  const F = Math.round(Math.max(55, Math.min(100, 0.8 * W)));
  return { k, P, F, maint };
}
function targets(d) {
  const pl = plan(d), type = dtype(pl);
  let k, P, F, maint = false;
  if (S.kcal.mode === 'manuel') { const c = S.kcal; k = +(type === 'double' ? Math.max(c.muscu, c.boxe) + 200 : c[type]) || 2500; P = +c.P; F = +c.F; }
  else ({ k, P, F, maint } = autoTargets(d));
  let C = Math.round((k - P * 4 - F * 9) / 4); if (C < 60) { C = 60; k = P * 4 + F * 9 + C * 4; }
  return { k, P, F, C, type, maint };
}
function waterT(d) { const pl = plan(d), W = curW(d); return Math.round((W * 35 + (pl.box ? 700 : 0) + (pl.gym ? 500 : 0)) / 250) * 250; }

/* ---------- forme ---------- */
function hrBase(d) { const v = []; for (let i = 1; i <= 21; i++) { const x = S.days[addDays(d, -i)]; if (x && x.check && +x.check.hr) v.push(+x.check.hr); } if (v.length < 3) return null; v.sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; }
function rec(d) { const x = S.days[d]; if (!x || !x.check) return null; const c = x.check; let s = ((c.sleep + c.energy + c.legs + c.mood) / 4 - 1) / 4 * 100; if (+c.hours && c.hours < 6.5) s -= (6.5 - c.hours) * 8; const b = hrBase(d); if (+c.hr && b && c.hr - b > 3) s -= (c.hr - b - 3) * 4; return Math.max(0, Math.min(100, Math.round(s))); }
function light(sc) { return sc == null ? null : sc >= 70 ? 'vert' : sc >= 45 ? 'orange' : 'rouge'; }
const REC = {
  vert: { t: 'Feu vert', c: 'var(--ok)', m: 'Séance complète comme prévu, vise tes charges habituelles.' },
  orange: { t: 'Feu orange', c: 'var(--gold)', m: 'Garde les charges mais retire une série par exercice. En boxe, écoute ton corps et évite les échanges trop durs.' },
  rouge: { t: 'Feu rouge', c: 'var(--acc)', m: "Version allégée (2 séries, loin de l'échec) ou repos actif. Si ça dure, passe la semaine en récupération." }
};
function fatigueTrend(d) { let low = 0, n = 0; for (let i = 0; i < 7; i++) { const s = rec(addDays(d, -i)); if (s != null) { n++; if (s < 50) low++; } } return n >= 4 && low >= 3; }

/* ---------- muscu ---------- */
function allEx() { const o = {}; for (const s of SESS) for (const e of S.program[s].ex) o[e.id] = e; return o; }
function lastDone(d) { const ds = Object.keys(S.days).filter(k => k < d).sort().reverse(); for (const k of ds) { const g = S.days[k].gym; if (g && g.done) return g.s; } return null; }
function defSess(d) { const x = S.days[d]; if (x && x.gym) return x.gym.s; const p = plan(d); if (p.gym) return p.gym; const l = lastDone(d); return l ? SESS[(SESS.indexOf(l) + 1) % 4] : 'FB'; }
function lastFor(id, d) { const ds = Object.keys(S.days).filter(k => k < d).sort().reverse(); for (const k of ds) { const g = S.days[k].gym; if (g && g.ex && g.ex[id]) { const ok = g.ex[id].filter(s => s && s.ok && (+s.r)); if (ok.length) return { d: k, sets: ok }; } } return null; }
function isLight(d, g) { return wstat(d) === 'recup' || !!(g && g.light); }
function nSets(e, d, g) { return isLight(d, g) ? Math.min(2, e.sets) : e.sets; }
function gymProgress(d, s) {
  const g = peek(d).gym, P = S.program[s]; let tot = 2 + P.warm.length, done = 0;
  if (g && g.s === s) { if (g.cb) done++; if (g.ca) done++; done += P.warm.filter((_, i) => g.warm && g.warm[i]).length; }
  for (const e of P.ex) { const n = nSets(e, d, g); tot += n; if (g && g.s === s && g.ex && g.ex[e.id]) done += g.ex[e.id].slice(0, n).filter(z => z && z.ok).length; }
  return { tot, done, pct: Math.round(done / tot * 100) };
}
function e1rm(w, r) { return w * (1 + r / 30); }
function strengthSeries(id) { const out = []; for (const d of Object.keys(S.days).sort()) { const g = S.days[d].gym; if (g && g.ex && g.ex[id]) { let b = 0; for (const s of g.ex[id]) if (s && s.ok && +s.w && +s.r) b = Math.max(b, e1rm(+s.w, +s.r)); if (b) out.push({ d, y: b }); } } return out; }
function hint(e, last) {
  if (!last) return "Première fois : choisis une charge avec laquelle tu finis à 2 répétitions de l'échec.";
  const all = last.sets.length >= e.sets && last.sets.every(z => +z.r >= e.max); const w = Math.max(...last.sets.map(z => +z.w || 0));
  if (e.u === 'sec') return all ? 'Objectif atteint : ajoute 5 à 10 s ou un peu de charge.' : 'Même charge, vise le haut de la fourchette.';
  if (all) return w ? `Haut de fourchette atteint : tente ${fr(w + 2.5, 1)} kg.` : 'Haut de fourchette atteint : ajoute du lest ou ralentis le tempo.';
  return "Garde la charge, gagne des répétitions. En sèche, tenir, c'est gagner.";
}

/* ---------- prières (calcul astronomique) ---------- */
const dtr = d => d * Math.PI / 180, rtd = r => r * 180 / Math.PI;
const sn = d => Math.sin(dtr(d)), cs = d => Math.cos(dtr(d)), tn = d => Math.tan(dtr(d));
const asn = x => rtd(Math.asin(x)), acs = x => rtd(Math.acos(x)), at2 = (y, x) => rtd(Math.atan2(y, x)), act = x => rtd(Math.atan(1 / x));
const fixA = a => { a = a - 360 * Math.floor(a / 360); return a < 0 ? a + 360 : a; }, fixH = h => { h = h - 24 * Math.floor(h / 24); return h < 0 ? h + 24 : h; };
function julian(y, m, d) { if (m <= 2) { y--; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
function sunPos(jd) { const D = jd - 2451545.0, g = fixA(357.529 + 0.98560028 * D), q = fixA(280.459 + 0.98564736 * D), L = fixA(q + 1.915 * sn(g) + 0.020 * sn(2 * g)), e = 23.439 - 0.00000036 * D; const RA = fixH(at2(cs(e) * sn(L), cs(L)) / 15); return { decl: asn(sn(e) * sn(L)), eqt: q / 15 - RA }; }
const PT_CACHE = {};
function prayerTimes(ds, cityKey) {
  const ck = ds + cityKey + JSON.stringify(S.prayer); if (PT_CACHE[ck]) return PT_CACHE[ck];
  const { lat, lng } = CITIES[cityKey]; const M = PT_METHODS[S.prayer.method] || PT_METHODS.MWL;
  const [y, m, d] = ds.split('-').map(Number); const tz = -new Date(y, m - 1, d, 12).getTimezoneOffset() / 60;
  const jDate = julian(y, m, d) - lng / (15 * 24);
  const midDay = t => fixH(12 - sunPos(jDate + t).eqt);
  const angT = (a, t, ccw) => { const de = sunPos(jDate + t).decl, n = midDay(t); const x = acs((-sn(a) - sn(de) * sn(lat)) / (cs(de) * cs(lat))) / 15; return n + (ccw ? -x : x); };
  const asrT = (f, t) => { const de = sunPos(jDate + t).decl; return angT(-act(f + tn(Math.abs(lat - de))), t); };
  let T = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 };
  for (let i = 0; i < 2; i++) { const p = {}; for (const k in T) p[k] = T[k] / 24; T = { fajr: angT(M.fajr, p.fajr, true), sunrise: angT(0.833, p.sunrise, true), dhuhr: midDay(p.dhuhr), asr: asrT(+S.prayer.asr, p.asr), sunset: angT(0.833, p.sunset), isha: angT(M.isha, p.isha) }; }
  for (const k in T) T[k] += tz - lng / 15;
  const night = fixH(T.sunrise - T.sunset), fp = M.fajr / 60 * night, ip = M.isha / 60 * night;
  if (isNaN(T.fajr) || fixH(T.sunrise - T.fajr) > fp) T.fajr = T.sunrise - fp;
  if (isNaN(T.isha) || fixH(T.isha - T.sunset) > ip) T.isha = T.sunset + ip;
  T.dhuhr += 1 / 60; T.maghrib = T.sunset;
  const a = S.prayer.adj || {}; for (const k of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) T[k] += (+a[k] || 0) / 60;
  return (PT_CACHE[ck] = T);
}
function mainCity() { return S.prayer.city === 'cha' ? 'cha' : 'bxl'; }
function nextPrayer() { const t = today(), T = prayerTimes(t, mainCity()), h = nowH(); for (const p of PRAYERS) if (T[p.k] > h) return { p, h: T[p.k], d: t }; const T2 = prayerTimes(addDays(t, 1), mainCity()); return { p: PRAYERS[0], h: T2.fajr + 24, d: addDays(t, 1) }; }
function prayCount(d) { const x = peek(d).pray || {}; return PRAYERS.filter(p => x[p.k]).length; }

/* ---------- compléments & rappel ---------- */
function reminderDue() {
  const r = S.reminder; if (!r.on || UI.date !== today()) return null;
  const s = S.supps.find(z => z.id === r.supp); if (!s) return null;
  if (peek(today()).supp && peek(today()).supp[s.id]) return null;
  const [h, m] = (r.time || '08:30').split(':').map(Number); if (nowH() < h + m / 60) return null;
  return s;
}
function notifyCheck() {
  const s = reminderDue(); if (!s) return; const k = 'notif_' + today();
  try { if (localStorage.getItem(k)) return; } catch (e) { }
  if ('Notification' in window && Notification.permission === 'granted') {
    const body = `N'oublie pas ta ${s.n.toLowerCase()} (${s.dose}). La régularité fait tout.`;
    const show = () => { try { new Notification('Hurricane Younes 💊', { body, icon: 'icon-192.png' }); } catch (e) { } };
    if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(reg => reg.showNotification('Hurricane Younes 💊', { body, icon: 'icon-192.png', tag: 'crea' })).catch(show); else show();
    try { localStorage.setItem(k, '1'); } catch (e) { }
  }
}

/* ---------- progression ---------- */
function progress() {
  const ds = Object.keys(S.days).sort().filter(d => d <= today());
  let gym = 0, box = 0, prot = 0, chk = 0, water = 0, prayDays = 0, prayN = 0, crea = 0;
  const st = { prot: [0, 0], water: [0, 0], pray: [0, 0], crea: [0, 0] }; let prev = null; const weeks = {};
  const bump = (k, ok, consec, d) => { if (!ok && d === today()) return; if (ok) { st[k][0] = consec && st[k][0] ? st[k][0] + 1 : 1; } else st[k][0] = 0; st[k][1] = Math.max(st[k][1], st[k][0]); };
  for (const d of ds) {
    const x = S.days[d], consec = prev && addDays(prev, 1) === d, mon = monday(d);
    weeks[mon] = weeks[mon] || { g: 0, b: 0 };
    if (x.gym && x.gym.done) { gym++; weeks[mon].g++; }
    if (x.boxDone) { box++; weeks[mon].b++; }
    if (x.check) chk++;
    const t = targets(d); const f = x.food || [];
    const ph = f.length && sum(f, 'p') >= t.P * 0.9; if (ph) prot++; bump('prot', ph, consec, d);
    const wh = (x.water || 0) >= waterT(d); if (wh) water++; bump('water', wh, consec, d);
    const pc = prayCount(d); prayN += pc; if (pc === 5) prayDays++; bump('pray', pc === 5, consec, d);
    const cr = !!(x.supp && x.supp[S.reminder.supp]); if (cr) crea++; bump('crea', cr, consec, d);
    prev = d;
  }
  let fullWeek = false; for (const k in weeks) { const pl = S.week; const ng = pl.filter(w => w.gym).length, nb = pl.filter(w => w.box).length; if (weeks[k].g >= ng && weeks[k].b >= nb && ng + nb > 0) fullWeek = true; }
  const pts = gym * 20 + box * 12 + prot * 5 + chk * 3 + water * 3 + prayN * 2 + prayDays * 5 + crea * 2 + S.weights.length * 2;
  let lost = 0; if (S.weights.length >= 2) { const first = S.weights[0]; const f = S.weights.filter(w => w.d <= addDays(first.d, 6)); lost = f.reduce((s, w) => s + w.kg, 0) / f.length - maW(today()); }
  let force = false; const ex1 = S.program.LEGS.ex.find(e => e.id === 'lg2') || S.program.FB.ex[0];
  if (ex1) { const s1 = strengthSeries(ex1.id); if (s1.length >= 3 && daysBetween(s1[0].d, s1[s1.length - 1].d) >= 28) force = s1[s1.length - 1].y >= s1[0].y * 0.97; }
  const B = [
    ['🥊', 'Premier round', '1re séance', gym + box >= 1], ['🔥', 'Semaine complète', 'toutes les séances', fullWeek], ['🏋️', '10 séances muscu', 'séances clôturées', gym >= 10],
    ['🏆', '30 séances muscu', 'séances clôturées', gym >= 30], ['🌙', 'Prières ×7', '7 jours complets', st.pray[1] >= 7], ['💊', 'Créatine ×14', '14 jours de suite', st.crea[1] >= 14],
    ['🍗', 'Protéines ×7', '7 jours de suite', st.prot[1] >= 7], ['💧', 'Hydraté ×7', '7 jours de suite', st.water[1] >= 7], ['🧭', "À l'écoute", '14 check-in', chk >= 14],
    ['📉', '−2 kg', 'moyenne 7 j', lost >= 2], ['🥇', '−5 kg', 'moyenne 7 j', lost >= 5], ['🛡️', 'Force intacte', 'squat tenu 4 sem.', force]];
  let lv = 0; for (let i = 0; i < LEVELS.length; i++) if (pts >= LEVELS[i][0]) lv = i; const nx = LEVELS[lv + 1];
  return { pts, gym, box, prot, chk, water, prayDays, crea, B, name: LEVELS[lv][1], next: nx ? nx[0] : null, cur: LEVELS[lv][0], lost, st };
}

/* ---------- composants visuels ---------- */
function ring(v, max, size, stroke, color, label, sub, ls = 22) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = Math.max(0, Math.min(1, max ? v / max : 0)), over = max && v > max * 1.05;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="rg"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="rbg" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="rfg" stroke-width="${stroke}" transform="rotate(-90 ${size / 2} ${size / 2})" style="stroke:${over ? 'var(--acc)' : color};stroke-dasharray:${c};stroke-dashoffset:${c * (1 - p)}"/>${label != null ? `<text x="50%" y="${size / 2 + (sub ? 2 : ls / 3)}" class="rv" font-size="${ls}">${label}</text>` : ''}${sub ? `<text x="50%" y="${size / 2 + ls * 0.85}" class="rs" font-size="${Math.max(9, ls * 0.45)}">${sub}</text>` : ''}</svg>`;
}
function nutRings(d, big = 132) {
  const t = targets(d), f = peek(d).food || []; const k = sum(f, 'k');
  const mini = (l, v, tt, col) => `<div class="mini">${ring(v, tt, 64, 7, col, Math.round(v), null, 15)}<b>${l}</b><span class="mut">/ ${tt} g</span></div>`;
  return `<div class="rings">${ring(k, t.k, big, 12, 'var(--gold)', fr(Math.max(0, t.k - k)), k > t.k ? 'kcal en trop' : 'kcal restantes', 26)}<div class="minis">${mini('Protéines', sum(f, 'p'), t.P, 'var(--acc)')}${mini('Glucides', sum(f, 'g'), t.C, 'var(--gold)')}${mini('Lipides', sum(f, 'l'), t.F, 'var(--blue)')}</div></div>
  <div class="xs mut" style="margin-top:8px">Objectif ${fr(t.k)} kcal${t.maint ? ' (maintenance : semaine allégée)' : ''}${S.kcal.mode === 'manuel' ? ' · réglage manuel' : ''} · ${fr(k)} consommées</div>`;
}
function weekStrip(d) {
  const mon = monday(d); let h = '<div class="strip">';
  for (let i = 0; i < 7; i++) {
    const k = addDays(mon, i), p = plan(k), x = peek(k); const gd = x.gym && x.gym.done, bd = x.boxDone;
    const full = (!p.gym || gd) && (!p.box || bd) && (p.gym || p.box);
    const lab = p.gym ? S.program[p.gym].name : p.box ? 'Boxe' : (p.cancelled ? 'Reporté' : 'Repos');
    h += `<div class="sd ${k === d ? 'cur' : ''} ${full ? 'done' : ''} ${!p.gym && !p.box ? 'off' : ''}" data-a="go" data-v="${k}"><b>${DOW[i]}</b><span class="t">${p.box ? '🥊' : ''}${p.gym ? S.program[p.gym].icon : ''}${!p.box && !p.gym ? '😴' : ''}</span><span class="l">${esc(lab)}</span></div>`;
  }
  return h + '</div>';
}
function factOfDay(list, d, off = 0) { return list[((dayIndex(d) + off) % list.length + list.length) % list.length]; }
function boxFact(d) { // tourne seulement sur les jours de boxe
  let n = 0; const start = '2026-01-05'; for (let k = start; k < d; k = addDays(k, 1)) if (S.week[dowIdx(k)].box) n++;
  return BOX_FACTS[n % BOX_FACTS.length];
}

/* ---------- rendu ---------- */
function applyTheme() {
  const u = S.ui; let th = u.theme; if (th === 'auto') th = matchMedia('(prefers-color-scheme: light)').matches ? 'clair' : 'ring';
  const b = document.body; Object.assign(b.dataset, { theme: th, font: u.font, size: u.size, radius: u.radius, density: u.density, nav: u.nav, bg: u.bg });
  if (u.accent) b.style.setProperty('--acc', u.accent); else b.style.removeProperty('--acc');
  const nav = $('#tabs'); if (u.nav === 'top') $('header').appendChild(nav); else document.body.insertBefore(nav, $('#modal'));
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = css('--bg') || '#0f1115';
}
function render() {
  $('#dlab').textContent = (UI.date === today() ? "Aujourd'hui · " : '') + dlabel(UI.date);
  $('#dtoday').style.visibility = UI.date === today() ? 'hidden' : 'visible';
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === UI.tab));
  $('.dnav').style.display = UI.tab === 'set' ? 'none' : 'flex';
  $('#view').innerHTML = ({ home: vHome, gym: vGym, pray: vPray, food: vFood, stats: vStats, set: vSet })[UI.tab]();
  if (UI.tab === 'stats') drawCharts();
}

/* --- Jour --- */
function vHome() {
  const d = UI.date; const out = [];
  const rs = reminderDue(); if (rs) out.push(`<div class="remind" data-a="supp" data-v="${rs.id}"><span class="tk"></span><span style="flex:1">💊 Rappel : ${esc(rs.n)} (${esc(rs.dose)}) pas encore prise aujourd'hui</span><span>Cocher</span></div>`);
  for (const b of S.ui.home) { if (!b.on) continue; const f = HOME[b.id]; if (f) { const h = f(d); if (h) out.push(h); } }
  return out.join('');
}
const HOME = {
  jour(d) {
    const p = plan(d), t = targets(d), x = peek(d), ws = wstat(d);
    const desc = [p.gym ? `Séance ${S.program[p.gym].name} ${S.program[p.gym].icon} (+ 30 min de cardio)` : null, p.box ? 'Boxe au club' : null].filter(Boolean).join(' · ') || (p.cancelled ? 'Séance reportée : récupère.' : 'Repos complet : marche, mobilité, sommeil.');
    const WS = { normal: 'Semaine normale', recup: '🔋 Semaine de récupération', report: '⏭️ Semaine reportée' };
    return `<div class="card"><div class="row sp"><span class="badge">${DTL[t.type]}</span><button class="chip" data-a="ovEdit">Modifier ce jour</button></div>
    <div class="sm" style="margin:10px 0">${desc}${x.ov ? ' <span class="mut">(modifié)</span>' : ''}</div>${weekStrip(d)}
    <div class="wstat"><span class="${ws === 'normal' ? 'mut' : ''}"><b>${WS[ws]}</b></span><button class="chip" data-a="weekM">Gérer la semaine</button></div></div>`;
  },
  boxe(d) {
    const p = plan(d); if (!p.box) return '';
    const f = boxFact(d), x = peek(d), nm = S.profile.name || 'champion';
    return `<div class="card boxday"><div class="big">🥊 Bonne séance de boxe, ${esc(nm)} !</div><div class="sm" style="margin-top:6px">Ce soir, c'est le club qui s'occupe de toi. Hydrate-toi bien et mange des glucides 1 à 3 h avant.</div>
    <div class="ci ${x.boxDone ? 'ok' : ''}" data-a="boxDone" style="margin-top:8px"><span class="tk ${x.boxDone ? 'on' : ''}">${x.boxDone ? '✓' : ''}</span><span class="tt">Séance de boxe faite</span></div></div>
    <div class="card fact"><h3>🥊 Le saviez-vous ?</h3><div class="sm">${esc(f[0])}</div><a class="yt" style="margin-top:8px" href="${GG(f[1])}" target="_blank" rel="noopener">En savoir plus ↗</a></div>`;
  },
  priere(d) {
    const x = peek(d).pray || {}; const T = prayerTimes(d, mainCity()); const n = prayCount(d);
    let nx = ''; if (d === today()) { const np = nextPrayer(); nx = `<div class="sm">Prochaine : <b>${np.p.n}</b> à ${hm(np.h)} <span class="mut" id="cd">(${cdTxt(np.h)})</span></div>`; }
    return `<div class="card"><div class="row sp"><h3 style="margin:0">🌙 Prières · ${CITIES[mainCity()].n}</h3><span class="badge">${n}/5</span></div>${nx}
    <div class="row" style="margin-top:10px;gap:6px">${PRAYERS.map(p => `<button class="chip ${x[p.k] ? 'on' : ''}" data-a="pray" data-v="${p.k}" style="flex:1;padding:8px 4px">${x[p.k] ? '✓ ' : ''}${p.n}<br><span class="xs">${hm(T[p.k])}</span></button>`).join('')}</div></div>`;
  },
  forme(d) {
    const x = peek(d); const sc = rec(d), lt = light(sc); let h = `<div class="card"><h3>🔋 Jauge de forme</h3>`;
    if (x.check && !UI.chkEdit) {
      const r = REC[lt]; h += `<div class="row" style="gap:14px;flex-wrap:nowrap">${ring(sc, 100, 92, 10, r.c, sc, '/100', 24)}<div><b style="color:${r.c}">${r.t}</b><div class="xs mut">sommeil ${x.check.sleep}/5${x.check.hours ? ' (' + fr(x.check.hours, 1) + ' h)' : ''} · énergie ${x.check.energy}/5 · jambes ${x.check.legs}/5 · moral ${x.check.mood}/5${x.check.hr ? ' · FC ' + x.check.hr : ''}</div></div></div>
      <div class="light" style="border-color:color-mix(in srgb,${r.c} 45%,transparent);background:color-mix(in srgb,${r.c} 12%,transparent)">${r.m}</div><button class="btn ghost full" style="margin-top:8px" data-a="chkRedo">Refaire le check-in</button>`;
    } else {
      const c = UI.chk; const Q = [['sleep', 'Sommeil'], ['energy', 'Énergie'], ['legs', 'Jambes fraîches'], ['mood', 'Envie / moral']];
      h += `<div class="xs mut">1 = au fond du trou · 5 = au top. 20 secondes chaque matin.</div>` + Q.map(([k, l]) => `<div class="ck"><div class="lab">${l}</div><div class="opts">${[1, 2, 3, 4, 5].map(n => `<button class="${c[k] === n ? 'on' : ''}" data-a="chk" data-v="${k}|${n}">${n}</button>`).join('')}</div></div>`).join('') +
        `<div class="grid2"><label>Heures de sommeil<input id="chkh" type="number" step="0.5" inputmode="decimal" placeholder="ex. 7.5" value="${c.hours || ''}"></label><label>FC au réveil (option)<input id="chkhr" type="number" inputmode="numeric" placeholder="bpm" value="${c.hr || ''}"></label></div><button class="btn pri" data-a="chkSave">Valider</button>`;
    }
    if (fatigueTrend(d)) h += `<div class="alert red">⚠️ <b>Fatigue accumulée</b> sur plusieurs jours. <button class="chip" data-a="weekSet" data-v="recup">Passer la semaine en récupération</button></div>`;
    return h + '</div>';
  },
  assiette(d) { return `<div class="card"><div class="row sp"><h3 style="margin:0">🍽️ Assiette</h3><button class="chip" data-a="tab" data-v="food">Ajouter</button></div><div style="margin-top:10px">${nutRings(d, 118)}</div></div>`; },
  supps(d) {
    const x = peek(d).supp || {};
    return `<div class="card"><h3>💊 Compléments</h3>${S.supps.map(s => `<div class="ci ${x[s.id] ? 'ok' : ''}" data-a="supp" data-v="${s.id}"><span class="tk ${x[s.id] ? 'on' : ''}">${x[s.id] ? '✓' : ''}</span><span class="tt">${esc(s.n)} <span class="mut xs">${esc(s.dose)} · ${esc(s.when)}</span></span>${s.id === S.reminder.supp && S.reminder.on ? '<span class="xs mut">⏰ ' + esc(S.reminder.time) + '</span>' : ''}</div>`).join('') || '<div class="mut sm">Aucun complément. Ajoute-les dans les réglages.</div>'}</div>`;
  },
  verset(d) { const v = factOfDay(VERSES, d, UI.verseOff); return `<div class="card verse"><div class="row sp"><h3 style="margin:0">📖 Le verset du jour</h3><span class="row" style="gap:4px"><button class="ib" data-a="vPrev">‹</button><button class="ib" data-a="vNext">›</button></span></div><div class="vt" style="margin-top:10px">« ${esc(v.t)} »</div><div class="vr">${esc(v.r)} · traduction libre du sens</div></div>`; },
  todo(d) {
    const p = plan(d), t = targets(d), x = peek(d), f = x.food || [];
    const items = [[!!x.check, 'Check-in forme', 'home'], p.gym ? [!!(x.gym && x.gym.done), 'Séance ' + S.program[p.gym].name + ' clôturée', 'gym'] : null, p.box ? [!!x.boxDone, 'Boxe au club', 'home'] : null,
      [prayCount(d) === 5, `Prières (${prayCount(d)}/5)`, 'pray'], [S.supps.length && S.supps.every(s => x.supp && x.supp[s.id]), 'Compléments', 'home'],
      [f.length && sum(f, 'p') >= t.P * 0.9, `Protéines ≥ ${Math.round(t.P * 0.9)} g`, 'food'], [(x.water || 0) >= waterT(d), `Eau ${fr(waterT(d) / 1000, 2)} L`, 'food'], [S.weights.some(w => w.d === d), 'Pesée (au réveil, à jeun)', 'stats']].filter(Boolean);
    const n = items.filter(i => i[0]).length;
    return `<div class="card"><div class="row sp"><h3 style="margin:0">✅ Au programme</h3><span class="badge">${n}/${items.length}</span></div><div style="margin-top:6px">${items.map(([ok, l, tab]) => `<div class="todo ${ok ? 'ok' : ''}" data-a="tab" data-v="${tab}"><div class="tk">${ok ? '✓' : ''}</div><div class="tt">${l}</div><span class="mut">›</span></div>`).join('')}</div></div>`;
  },
  niveau() {
    const pr = progress(); const pc = pr.next ? Math.round((pr.pts - pr.cur) / (pr.next - pr.cur) * 100) : 100;
    return `<div class="card"><div class="row sp"><b>🏅 ${pr.name}</b><span class="mut sm">${fr(pr.pts)} pts${pr.next ? ' · palier suivant ' + fr(pr.next) : ''}</span></div><div class="lvl"><div style="width:${pc}%"></div></div><div class="xs mut" style="margin-top:6px">${esc(factOfDay(FIT_FACTS, UI.date))}</div></div>`;
  }
};
function cdTxt(h) { const m = Math.max(0, Math.round((h - nowH()) * 60)); return m >= 60 ? `dans ${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : `dans ${m} min`; }

/* --- Muscu --- */
function vGym() {
  const d = UI.date, x = peek(d), pl = plan(d); const s = UI.gymSess || defSess(d); const P = S.program[s]; const g0 = x.gym; const g = g0 && g0.s === s ? g0 : null;
  const sc = rec(d), lt = light(sc), ws = wstat(d); const lightOn = isLight(d, g) || (!g && lt === 'rouge');
  let h = '';
  if (!pl.gym) h += `<div class="alert">${pl.box ? "🥊 Aujourd'hui c'est boxe au club : pas de muscu prévue." : pl.cancelled ? '⏭️ Semaine reportée : pas de muscu prévue.' : '😴 Jour de repos.'} Tu peux quand même ouvrir une séance ci-dessous.</div>`;
  if (ws === 'recup') h += `<div class="alert green">🔋 Semaine de récupération : 2 séries par exercice, charges −15 % environ, loin de l'échec. Le cardio reste léger.</div>`;
  const pg = gymProgress(d, s);
  h += `<div class="card"><div class="sel">${SESS.map(k => `<button class="chip ${k === s ? 'on' : ''}" data-a="gs" data-v="${k}">${S.program[k].icon} ${esc(S.program[k].name)}</button>`).join('')}</div>
  <div class="row" style="margin-top:10px;flex-wrap:nowrap;gap:12px">${ring(pg.done, pg.tot, 74, 8, 'var(--ok)', pg.pct + '%', null, 17)}<div><div class="ttl" style="font-size:18px">${esc(P.name)}</div><div class="sm mut">${esc(P.focus)}</div><div class="xs mut" style="margin-top:2px">${pl.gym === s ? 'Prévue aujourd\'hui' : pl.gym ? 'Prévue aujourd\'hui : ' + esc(S.program[pl.gym].name) : ''}</div></div></div>`;
  if (lt && lt !== 'vert' && ws !== 'recup') h += `<div class="alert ${lt === 'rouge' ? 'red' : ''}">Jauge ${REC[lt].t.toLowerCase()} (${sc}) : ${lt === 'rouge' ? 'version allégée conseillée.' : 'retire une série par exercice, garde les charges.'}</div>`;
  h += `<div class="row sp" style="margin-top:8px">${ws === 'recup' ? '<span class="xs mut">Version allégée imposée par la semaine</span>' : `<label class="tog"><input type="checkbox" data-c="glight" ${lightOn ? 'checked' : ''}> Version allégée</label>`}<button class="chip" data-a="gEdit">${UI.gymEdit ? '✓ Terminer' : '✏️ Modifier la séance'}</button></div></div>`;
  if (UI.gymEdit) return h + editProgram(s);
  if (g0 && g0.s !== s && (g0.done || Object.keys(g0.ex || {}).length)) h += `<div class="alert">Une séance ${esc(S.program[g0.s].name)} est déjà en cours ce jour-là. Changer de séance repartira de zéro.</div>`;
  const cb = !!(g && g.cb), ca = !!(g && g.ca);
  h += `<div class="sec">1 · Cardio d'avant-séance</div><div class="blk ${cb ? 'alldone' : ''}"><div class="ci ${cb ? 'ok' : ''}" data-a="gck" data-v="cb"><span class="tk ${cb ? 'on' : ''}">${cb ? '✓' : ''}</span><span class="tt"><b>15 min de cardio</b><br><span class="xs mut">${CARDIO_BEFORE}</span></span></div></div>`;
  const wd = P.warm.filter((_, i) => g && g.warm && g.warm[i]).length;
  h += `<div class="sec">2 · Échauffement (${wd}/${P.warm.length})</div><div class="blk ${wd === P.warm.length ? 'alldone' : ''}">${P.warm.map((w, i) => { const ok = !!(g && g.warm && g.warm[i]); return `<div class="ci ${ok ? 'ok' : ''}" data-a="gck" data-v="w${i}"><span class="tk ${ok ? 'on' : ''}">${ok ? '✓' : ''}</span><span class="tt">${esc(w)}</span></div>`; }).join('')}</div>`;
  h += `<div class="sec">3 · Exercices</div>`;
  for (const e of P.ex) {
    const last = lastFor(e.id, d); const log = (g && g.ex && g.ex[e.id]) || []; const n = nSets(e, d, { light: lightOn }); const u = e.u === 'sec' ? 's' : 'reps';
    const done = log.slice(0, n).filter(z => z && z.ok).length >= n;
    h += `<div class="blk ${done ? 'alldone' : ''}"><div class="en">${esc(e.n)}</div><div class="et">${n} × ${e.min}${e.max !== e.min ? '–' + e.max : ''} ${u}${e.side ? ' ' + esc(e.side) : ''} · ${lightOn ? 'RIR 3' : 'RIR 1–2'}</div>
    <div class="why"><b>Utilité :</b> ${esc(e.why)}</div><a class="yt" href="${YT(e.yt || e.n)}" target="_blank" rel="noopener">▶ Voir le mouvement sur YouTube</a>
    <div class="last">${last ? `📅 Dernière fois, le ${dlabel(last.d)} : ${last.sets.map(z => (+z.w ? fr(z.w, 1) + ' kg × ' : '') + z.r).join(' · ')}<br><b>${hint(e, last)}</b>` : hint(e, null)}${lightOn && last ? '<br><span class="mut">Version allégée : environ −15 % sur la charge.</span>' : ''}</div>
    <div class="setrow xs mut"><div></div><div class="n">${e.u === 'sec' ? 'charge (kg)' : 'kg'}</div><div class="n">${u}</div><div></div></div>`;
    for (let i = 0; i < n; i++) {
      const z = log[i] || {}; const lz = last ? (last.sets[i] || last.sets[last.sets.length - 1]) : {};
      h += `<div class="setrow"><div class="n">${i + 1}</div><input class="w" type="number" step="0.5" inputmode="decimal" placeholder="${esc(lz.w || '')}" value="${esc(z.w || '')}" data-c="set" data-id="${e.id}" data-i="${i}" data-k="w"><input class="r" type="number" inputmode="numeric" placeholder="${esc(lz.r || '')}" value="${esc(z.r || '')}" data-c="set" data-id="${e.id}" data-i="${i}" data-k="r"><button class="okb ${z.ok ? 'on' : ''}" data-a="gset" data-v="${e.id}|${i}">✓</button></div>`;
    }
    h += `</div>`;
  }
  h += `<div class="sec">4 · Cardio de fin</div><div class="blk ${ca ? 'alldone' : ''}"><div class="ci ${ca ? 'ok' : ''}" data-a="gck" data-v="ca"><span class="tk ${ca ? 'on' : ''}">${ca ? '✓' : ''}</span><span class="tt"><b>15 min de cardio</b><br><span class="xs mut">${CARDIO_AFTER}</span></span></div></div>`;
  h += `<div class="card" style="margin-top:12px"><h3>Ressenti de la séance (option)</h3><div class="xs mut" style="margin-bottom:6px">1 = promenade · 10 = impossible d'en faire plus</div><div class="rpe">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `<button class="${g && g.rpe === n ? 'on' : ''}" data-a="gRpe" data-v="${n}">${n}</button>`).join('')}</div>
  ${g && g.done ? `<div class="alert green" style="margin-top:10px">✓ Séance clôturée. Bravo, champion.</div><button class="btn ghost full" data-a="celebGym">Revoir l'animation 🎉</button>` : `<div class="xs mut" style="margin-top:10px">La séance se clôture automatiquement quand tout est coché (${pg.done}/${pg.tot}).</div>`}</div>`;
  return h;
}
function editProgram(s) {
  const P = S.program[s];
  return `<div class="card"><h3>Modifier la séance ${esc(P.name)}</h3><label>Nom de la séance<input value="${esc(P.name)}" data-c="pname" data-s="${s}"></label><label>Objectif<input value="${esc(P.focus)}" data-c="pfocus" data-s="${s}"></label>
  <label>Échauffement (une étape par ligne)</label><textarea rows="5" data-c="pwarm" data-s="${s}">${esc(P.warm.join('\n'))}</textarea>
  <div class="sec">Exercices</div>${P.ex.map((e, i) => `<div class="edx"><div class="row sp"><b class="sm">${i + 1}. ${esc(e.n)}</b><span class="row" style="gap:4px"><button class="ib" data-a="exUp" data-v="${e.id}">↑</button><button class="ib" data-a="exDel" data-v="${e.id}">✕</button></span></div>
   <label>Nom<input value="${esc(e.n)}" data-c="ex" data-id="${e.id}" data-k="n"></label>
   <div class="grid3"><label>Séries<input type="number" value="${e.sets}" data-c="ex" data-id="${e.id}" data-k="sets"></label><label>Min<input type="number" value="${e.min}" data-c="ex" data-id="${e.id}" data-k="min"></label><label>Max<input type="number" value="${e.max}" data-c="ex" data-id="${e.id}" data-k="max"></label></div>
   <div class="grid2"><label>Unité<select data-c="ex" data-id="${e.id}" data-k="u"><option value="reps"${e.u === 'reps' ? ' selected' : ''}>Répétitions</option><option value="sec"${e.u === 'sec' ? ' selected' : ''}>Secondes</option></select></label><label>Précision<input value="${esc(e.side || '')}" placeholder="par bras…" data-c="ex" data-id="${e.id}" data-k="side"></label></div>
   <label>Utilité<input value="${esc(e.why)}" data-c="ex" data-id="${e.id}" data-k="why"></label><label>Recherche YouTube<input value="${esc(e.yt || '')}" data-c="ex" data-id="${e.id}" data-k="yt"></label></div>`).join('')}
  <div class="row"><button class="btn" style="flex:1" data-a="exAdd">+ Ajouter un exercice</button><button class="btn ghost danger" style="flex:1" data-a="pRestore">Programme d'origine</button></div></div>`;
}

/* --- Prière --- */
function vPray() {
  const d = UI.date, x = peek(d).pray || {}; const n = prayCount(d); const city = S.prayer.city;
  const cols = city === 'both' ? ['bxl', 'cha'] : [mainCity()];
  const TT = {}; for (const c of cols) TT[c] = prayerTimes(d, c);
  let h = `<div class="card"><div class="row" style="flex-wrap:nowrap;gap:14px">${ring(n, 5, 92, 10, 'var(--ok)', n + '/5', 'prières', 22)}<div class="nextp" style="flex:1">`;
  let nxk = null;
  if (d === today()) { const np = nextPrayer(); nxk = np.d === d ? np.p.k : null; h += `<div class="xs mut">Prochaine prière · ${CITIES[mainCity()].n}</div><div class="big">${np.p.n} ${hm(np.h)}</div><div class="sm mut" id="cd">${cdTxt(np.h)}</div>`; }
  else h += `<div class="big" style="font-size:22px">${dlabel(d)}</div>`;
  h += `</div></div></div>`;
  h += `<div class="card"><table class="pt"><tr><th>Prière</th>${cols.map(c => `<th>${CITIES[c].n}</th>`).join('')}<th>Faite</th></tr>`;
  PRAYERS.forEach((p, i) => {
    h += `<tr class="${p.k === nxk ? 'nx' : ''}"><td><b>${p.n}</b><span class="ar">${p.a}</span></td>${cols.map(c => `<td>${hm(TT[c][p.k])}</td>`).join('')}<td><button class="tk ${x[p.k] ? 'on' : ''}" style="margin:auto" data-a="pray" data-v="${p.k}">${x[p.k] ? '✓' : ''}</button></td></tr>`;
    if (i === 0) h += `<tr class="sun"><td>Chourouq ☀️</td>${cols.map(c => `<td>${hm(TT[c].sunrise)}</td>`).join('')}<td></td></tr>`;
  });
  h += `</table><div class="xs mut" style="margin-top:8px">Calcul : ${esc(PT_METHODS[S.prayer.method].n)}, Asr ${+S.prayer.asr === 2 ? 'hanafite' : 'standard'}. Ajuste les minutes dans les réglages pour coller au calendrier de ta mosquée.</div></div>`;
  h += HOME.verset(d);
  // 7 derniers jours
  h += `<div class="card"><h3>7 derniers jours</h3><div class="strip">${[6, 5, 4, 3, 2, 1, 0].map(i => { const k = addDays(d, -i), c = prayCount(k); return `<div class="sd ${c === 5 ? 'done' : ''} ${k === d ? 'cur' : ''}" data-a="go" data-v="${k}"><b>${DOW[dowIdx(k)]}</b><span class="t">${c === 5 ? '🌙' : c}</span><span class="l">/5</span></div>`; }).join('')}</div></div>`;
  return h;
}

/* --- Assiette --- */
function mealNow() { const h = new Date().getHours(); return h >= 7 && h < 12 ? 'dej' : h >= 12 && h < 18 ? 'din' : h >= 18 ? 'sou' : 'dej'; }
function vFood() {
  const d = UI.date, x = peek(d); const food = x.food || []; const wt = waterT(d), wv = x.water || 0; const pl = plan(d);
  if (!UI.meal) UI.meal = d === today() ? mealNow() : 'din';
  let h = `<div class="card">${nutRings(d, 132)}</div>`;
  h += `<div class="card"><h3>Ajouter un aliment</h3><div class="sel">${Object.entries(MEALS).map(([k, m]) => `<button class="chip ${UI.meal === k ? 'on' : ''}" data-a="meal" data-v="${k}">${m.n}</button>`).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn" style="flex:1" data-a="fFree">✍️ Saisie manuelle</button><button class="btn" style="flex:1" data-a="fScan">📷 Code-barres</button><button class="btn" data-a="fCopy" title="Copier les repas d'hier">⧉ Hier</button></div>
  <label>Chercher dans mes aliments</label><input id="fq" placeholder="poulet, riz, skyr…" value="${esc(UI.q)}" data-i="fq" autocomplete="off"><div class="res" id="fres">${foodRes()}</div></div>`;
  for (const [k, m] of Object.entries(MEALS)) {
    const items = food.map((f, i) => ({ f, i })).filter(o => (o.f.m || 'din') === k); const kc = items.reduce((s, o) => s + (+o.f.k || 0), 0);
    h += `<div class="card meal"><h3>${m.n} <small>${m.h} · ${fr(kc)} kcal</small></h3>`;
    if (k === 'dej') {
      h += `<label class="tog" style="margin:4px 0 8px"><input type="checkbox" data-c="skipDej" ${x.skipDej ? 'checked' : ''}> Sauter le déjeuner</label>`;
      if (x.skipDej) h += `<div class="alert ${pl.gym || pl.box ? 'red' : ''}">⚠️ C'est ton choix, mais le petit déjeuner reste important : c'est ton carburant. Sans lui, tu soulèveras moins lourd et tu récupéreras moins bien.${pl.gym || pl.box ? ' <b>Aujourd\'hui tu t\'entraînes : ne fais pas ta séance à jeun.</b> Prends au minimum une collation 1 à 2 h avant (banane + skyr, ou un shake).' : ''}</div>`;
    }
    h += items.length ? items.map(({ f, i }) => `<div class="fi"><div class="fn">${esc(f.n)}${f.q ? ` <span class="mut">${f.q} g</span>` : ''}<div class="fm">${fr(f.k)} kcal · P ${fr(f.p, 1)} · G ${fr(f.g, 1)} · L ${fr(f.l, 1)}</div></div><button class="x" data-a="fDel" data-v="${i}">✕</button></div>`).join('') : `<div class="mut sm">${k === 'dej' && x.skipDej ? 'Déjeuner sauté.' : 'Rien pour l\'instant.'}</div>`;
    h += `<button class="btn ghost full" style="margin-top:8px" data-a="mealAdd" data-v="${k}">+ Ajouter au ${m.n.toLowerCase()}</button></div>`;
  }
  h += `<div class="card"><div class="row sp"><h3 style="margin:0">💧 Hydratation</h3><span class="sm">${fr(wv / 1000, 2)} / ${fr(wt / 1000, 2)} L</span></div><div class="water">${Array.from({ length: wt / 250 }, (_, i) => `<i class="${i < wv / 250 ? 'f' : ''}"></i>`).join('')}</div><div class="row"><button class="btn" style="flex:1" data-a="wat" data-v="-1">− 25 cl</button><button class="btn gold" style="flex:2" data-a="wat" data-v="1">+ 25 cl</button></div></div>`;
  const t = targets(d);
  h += `<div class="card fact"><div class="sm">🎯 <b>Astuce</b> : ${t.type === 'repos' ? 'jour de repos : les glucides baissent, les protéines restent identiques.' : "place une bonne part des glucides 1 à 3 h avant l'entraînement, et des protéines après."} Vise 3 à 5 prises d'environ ${Math.round(t.P / 4)} g de protéines.</div></div>`;
  return h;
}
function foodRes() {
  const q = UI.q.trim().toLowerCase(); let list = S.favs.map((f, i) => ({ f, i }));
  if (q) list = list.filter(o => o.f.n.toLowerCase().includes(q));
  else { const cnt = {}; for (const k in S.days) for (const f of (S.days[k].food || [])) cnt[f.n] = (cnt[f.n] || 0) + 1; list.sort((a, b) => (cnt[b.f.n] || 0) - (cnt[a.f.n] || 0)); list = list.slice(0, 8); }
  if (!list.length) return '<div class="mut sm" style="padding:8px 0">Aucun résultat : utilise la saisie manuelle ou le scanner.</div>';
  return list.map(({ f, i }) => `<div class="fi" data-a="fFav" data-v="${i}" style="cursor:pointer"><div class="fn">${esc(f.n)}<div class="fm">pour 100 g : ${fr(f.k)} kcal · P ${fr(f.p, 1)} · G ${fr(f.g, 1)} · L ${fr(f.l, 1)}</div></div><span class="chip">+</span></div>`).join('');
}

/* --- Progrès --- */
function vStats() {
  const d = UI.date; const pr = progress();
  let h = `<div class="card"><h3>⚖️ Pesée</h3><div class="row"><input id="wkg" type="number" step="0.1" inputmode="decimal" placeholder="kg" style="flex:1" value="${(S.weights.find(w => w.d === d) || {}).kg || ''}"><button class="btn gold" data-a="wSave">Enregistrer (${dshort(d)})</button></div>
  <canvas id="cw"></canvas><div class="xs mut">Points : pesées · ligne : moyenne sur 7 jours (la seule qui compte).</div>${rateMsg()}${goalMsg()}</div>`;
  const ex = allEx(); const withData = Object.keys(ex).filter(id => strengthSeries(id).length); if (!UI.statEx || !ex[UI.statEx]) UI.statEx = withData[0] || 'lg2';
  h += `<div class="card"><h3>🛡️ Force : le muscle tient-il ?</h3><select data-c="statEx">${SESS.map(s => `<optgroup label="${esc(S.program[s].name)}">${S.program[s].ex.map(e => `<option value="${e.id}"${e.id === UI.statEx ? ' selected' : ''}>${esc(e.n)}${withData.includes(e.id) ? '' : ' (pas de données)'}</option>`).join('')}</optgroup>`).join('')}</select><canvas id="cs"></canvas><div class="xs mut">1RM estimé (formule d'Epley) sur la meilleure série validée. Une courbe stable en sèche = muscle conservé.</div>${strMsg()}</div>`;
  h += `<div class="card"><h3>📊 Séances par semaine</h3><canvas id="cl"></canvas><div class="xs mut">Rouge : muscu clôturée · or : boxe.</div></div>`;
  // prières
  let pRows = ''; const N = 30; for (const p of PRAYERS) { let c = 0; for (let i = 0; i < N; i++) if ((peek(addDays(today(), -i)).pray || {})[p.k]) c++; pRows += `<div class="mini">${ring(c, N, 58, 6, 'var(--ok)', Math.round(c / N * 100) + '%', null, 13)}<b>${p.n}</b></div>`; }
  h += `<div class="card"><h3>🌙 Prières (30 jours)</h3><div class="minis" style="grid-template-columns:repeat(5,1fr)">${pRows}</div><div class="xs mut" style="margin-top:8px">Série en cours de journées complètes : ${pr.st.pray[0]} · record : ${pr.st.pray[1]}</div></div>`;
  // nutrition & compléments
  let kc = 0, kt = 0, nd = 0, pd = 0; for (let i = 1; i <= 7; i++) { const k = addDays(today(), -i), f = peek(k).food || []; if (f.length) { nd++; kc += sum(f, 'k'); kt += targets(k).k; if (sum(f, 'p') >= targets(k).P * 0.9) pd++; } }
  let sup = 0, supT = 0; for (let i = 0; i < 14; i++) { const x = peek(addDays(today(), -i)).supp || {}; for (const s of S.supps) { supT++; if (x[s.id]) sup++; } }
  h += `<div class="card"><h3>🍽️ Nutrition & compléments</h3><div class="kpi"><div><b>${nd ? fr(kc / nd) : '–'}</b><span class="xs mut">kcal/j (7 j)</span></div><div><b>${nd ? fr(kt / nd) : '–'}</b><span class="xs mut">objectif moyen</span></div><div><b>${pd}/${nd || 0}</b><span class="xs mut">jours protéines OK</span></div></div>
  <div class="kpi" style="margin-top:8px"><div><b>${supT ? Math.round(sup / supT * 100) : 0} %</b><span class="xs mut">compléments (14 j)</span></div><div><b>${pr.st.crea[0]}</b><span class="xs mut">jours créatine d'affilée</span></div><div><b>${pr.st.water[0]}</b><span class="xs mut">jours hydraté d'affilée</span></div></div></div>`;
  h += `<div class="card"><h3>🔋 Forme & sommeil (14 jours)</h3><canvas id="cr"></canvas><div class="xs mut">Vert : score de forme · bleu : heures de sommeil (×10).</div></div>`;
  h += `<div class="card"><h3>🏅 ${pr.name} · ${fr(pr.pts)} pts</h3><div class="kpi" style="margin-bottom:10px"><div><b>${pr.gym}</b><span class="xs mut">séances muscu</span></div><div><b>${pr.box}</b><span class="xs mut">séances boxe</span></div><div><b>${pr.prayDays}</b><span class="xs mut">jours 5/5 prières</span></div></div>
  <div class="bdg">${pr.B.map(([i, t, s, ok]) => `<div class="bd ${ok ? '' : 'no'}"><div class="i">${i}</div><b>${t}</b><div class="mut">${s}</div></div>`).join('')}</div></div>`;
  if (S.weights.length) h += `<div class="card"><h3>Historique des pesées</h3>${S.weights.slice().reverse().slice(0, 20).map(w => `<div class="fi"><div class="fn">${dlabel(w.d)}</div><b>${fr(w.kg, 1)} kg</b><button class="x" data-a="wDel" data-v="${w.d}">✕</button></div>`).join('')}</div>`;
  return h;
}
function rateMsg() {
  if (S.weights.length < 4) return '<div class="alert">Pèse-toi 3 à 7 fois par semaine, au réveil et à jeun, pour obtenir une tendance fiable.</div>';
  const t = today(); const now = maW(t); const ref = S.weights.filter(w => w.d <= addDays(t, -14)).length ? addDays(t, -14) : S.weights[0].d; const past = maW(ref); if (!now || !past) return '';
  const span = Math.max(7, daysBetween(ref, t)); const perWk = (past - now) / span * 7; const pct = perWk / now * 100; const tg = +S.profile.rate;
  let cls = 'green', m = `Bon rythme : −${fr(perWk, 2)} kg/sem (${fr(pct, 2)} %). Continue.`;
  if (pct > tg * 1.6 && pct > 0.9) { cls = 'red'; m = `Trop rapide : −${fr(perWk, 2)} kg/sem (${fr(pct, 2)} %). Risque pour le muscle : ajoute environ 150 kcal de glucides par jour.`; }
  else if (pct < tg * 0.4) { cls = ''; m = `Ça stagne : ${perWk >= 0 ? '−' : '+'}${fr(Math.abs(perWk), 2)} kg/sem. Vérifie la précision des pesées d'aliments, puis retire environ 100 kcal par jour si ça dure 2 semaines.`; }
  return `<div class="alert ${cls}">${m}</div>`;
}
function goalMsg() {
  const p = S.profile; if (!+p.goalW) return ''; const now = maW(today()) || +p.weight; const left = now - p.goalW;
  return `<div class="xs mut" style="margin-top:6px">🎯 Objectif ${fr(p.goalW, 1)} kg${p.goalDate ? ' pour le ' + dlabel(p.goalDate) : ''} · reste ${fr(Math.max(0, left), 1)} kg</div>`;
}
function strMsg() {
  const s = strengthSeries(UI.statEx); if (s.length < 2) return ''; const a = s[0].y, b = s[s.length - 1].y; const pct = (b - a) / a * 100;
  return pct >= -3 ? `<div class="alert green">Force ${pct >= 0 ? 'en hausse' : 'stable'} (${pct >= 0 ? '+' : ''}${fr(pct, 1)} %) : le muscle est préservé. 👊</div>` : `<div class="alert red">Force en baisse (${fr(pct, 1)} %). Vérifie protéines, sommeil et taille du déficit ; une semaine de récupération peut aider.</div>`;
}

/* --- Réglages --- */
function sec(id, title, body) { return `<details class="set" data-sec="${id}" ${UI.open[id] ? 'open' : ''}><summary>${title}</summary><div class="in">${body}</div></details>`; }
function inp(path, label, type = 'number', extra = '') { const v = getPath(path); return `<label>${label}<input type="${type}" ${type === 'number' ? 'inputmode="decimal" step="any"' : ''} value="${esc(v)}" data-c="p" data-k="${path}" data-t="${type === 'number' ? 'n' : 's'}" ${extra}></label>`; }
function sel(path, label, opts) { const v = String(getPath(path)); return `<label>${label}<select data-c="p" data-k="${path}" data-t="${typeof getPath(path) === 'number' ? 'n' : 's'}">${Object.entries(opts).map(([k, l]) => `<option value="${k}"${k === v ? ' selected' : ''}>${l}</option>`).join('')}</select></label>`; }
function getPath(p) { return p.split('.').reduce((o, k) => o == null ? o : o[k], S); }
function setPath(p, v) { const ks = p.split('.'); let o = S; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = v; }
function vSet() {
  const W = curW(), a = autoTargets(today());
  const avg = weekAvg(W), def = deficit(W); const nb = S.week.filter(w => w.box).length, ng = S.week.filter(w => w.gym).length, rest = S.week.filter(w => !w.box && !w.gym).length;
  let h = `<div class="card"><div class="row sp"><h3 style="margin:0">${ic('bell')} Réglages</h3><button class="chip" data-a="tab" data-v="home">Fermer</button></div></div>`;
  h += sec('profil', '👤 Profil & objectif', `<div class="grid2">${inp('profile.name', 'Prénom', 'text')}${sel('profile.sex', 'Sexe', { h: 'Homme', f: 'Femme' })}${inp('profile.age', 'Âge')}${inp('profile.height', 'Taille (cm)')}${inp('profile.weight', 'Poids de départ (kg)')}${inp('profile.bf', '% de masse grasse (option)', 'text')}${inp('profile.goalW', 'Poids objectif (kg)')}${inp('profile.goalDate', 'Date objectif', 'date')}</div>
   ${sel('profile.activity', 'Activité en dehors du sport', { '1.25': 'Sédentaire (bureau, peu de pas)', '1.35': 'Modérée (6 000 à 9 000 pas)', '1.5': 'Active (métier physique)' })}
   ${sel('profile.rate', 'Rythme de sèche', { '0.5': 'Doux : 0,5 % du poids / semaine (recommandé)', '0.75': 'Soutenu : 0,75 %/sem', '1': 'Rapide : 1 %/sem (risqué pour le muscle)' })}`);
  h += sec('kcal', '🔥 Calories & macros', `${sel('kcal.mode', 'Mode de calcul', { auto: 'Automatique (calculé selon le profil et le jour)', manuel: 'Manuel (je fixe mes chiffres)' })}
   ${S.kcal.mode === 'manuel' ? `<div class="grid3">${inp('kcal.muscu', 'kcal muscu')}${inp('kcal.boxe', 'kcal boxe')}${inp('kcal.repos', 'kcal repos')}</div><div class="grid2">${inp('kcal.P', 'Protéines (g)')}${inp('kcal.F', 'Lipides (g)')}</div><div class="xs mut">Les glucides sont calculés avec le reste. Les jours doubles prennent le plus haut + 200 kcal.</div>` : ''}
   <div class="sum">Calcul automatique actuel : dépense moyenne ≈ <b>${fr(avg)} kcal/j</b>, déficit ≈ <b>${fr(def)} kcal/j</b>, perte visée ≈ <b>${fr(def * 7 / 7700, 2)} kg/sem</b>.<br>Protéines ${a.P} g · lipides ${a.F} g · glucides selon le jour.<br>Exemple : muscu ${fr(Math.round((dayKcal({ gym: 'FB' }, W) - def) / 10) * 10)} kcal · boxe ${fr(Math.round((dayKcal({ box: true }, W) - def) / 10) * 10)} kcal · repos ${fr(Math.round((dayKcal({}, W) - def) / 10) * 10)} kcal.</div>
   <label class="tog" style="margin-top:10px"><input type="checkbox" data-c="pb" data-k="kcal.recupMaint" ${S.kcal.recupMaint ? 'checked' : ''}> Manger à maintenance pendant une semaine de récupération ou reportée</label>`);
  h += sec('semaine', '📅 Semaine type', `${S.week.map((w, i) => `<div class="wkr"><b>${DOWL[i]}</b><label class="tog"><input type="checkbox" data-c="wb" data-i="${i}" ${w.box ? 'checked' : ''}>🥊</label><select data-c="wg" data-i="${i}"><option value="">Pas de muscu</option>${SESS.map(s => `<option value="${s}"${w.gym === s ? ' selected' : ''}>${S.program[s].icon} ${esc(S.program[s].name)}</option>`).join('')}</select></div>`).join('')}
   <div class="grid3">${inp('profile.boxMin', 'Boxe (min)')}${sel('profile.boxInt', 'Intensité boxe', { tech: 'Technique', mod: 'Mixte', int: 'Intense' })}${inp('profile.gymMin', 'Muscu (min)')}</div>
   <div class="sum">${nb} boxe + ${ng} muscu = <b>${nb + ng} séances</b> · ${rest} jour(s) de repos complet${rest === 0 ? '<div class="alert">Aucun jour de repos complet : surveille la jauge de forme et n\'hésite pas à passer une semaine en récupération.</div>' : ''}${ng < 2 ? '<div class="alert red">Moins de 2 séances de muscu : le signal pour garder le muscle devient faible en sèche.</div>' : ''}</div>`);
  h += sec('supps', '💊 Compléments & rappel', `${S.supps.map(s => `<div class="edx"><div class="grid2"><label>Nom<input value="${esc(s.n)}" data-c="sp" data-id="${s.id}" data-k="n"></label><label>Dose<input value="${esc(s.dose)}" data-c="sp" data-id="${s.id}" data-k="dose"></label></div><div class="row" style="flex-wrap:nowrap"><label style="flex:1">Moment<select data-c="sp" data-id="${s.id}" data-k="when">${['Matin', 'Midi', 'Soir', 'Au coucher', 'Avec un repas', 'Après la séance'].map(o => `<option${o === s.when ? ' selected' : ''}>${o}</option>`).join('')}</select></label><button class="x" style="margin-top:22px" data-a="spDel" data-v="${s.id}">✕</button></div></div>`).join('')}
   <button class="btn full" data-a="spAdd">+ Ajouter un complément</button>
   <div class="sec">Rappel quotidien</div><label class="tog"><input type="checkbox" data-c="pb" data-k="reminder.on" ${S.reminder.on ? 'checked' : ''}> Activer le rappel</label>
   <div class="grid2"><label>Complément<select data-c="p" data-k="reminder.supp" data-t="s">${S.supps.map(s => `<option value="${s.id}"${s.id === S.reminder.supp ? ' selected' : ''}>${esc(s.n)}</option>`).join('')}</select></label>${inp('reminder.time', 'Heure', 'time')}</div>
   <div class="xs mut" style="margin:6px 0">Dans l'appli, un bandeau s'affiche tant que ce n'est pas coché. Pour être prévenu même appli fermée, ajoute le rappel à l'agenda du téléphone.</div>
   <div class="row"><button class="btn" style="flex:1" data-a="notif">🔔 Notifications</button><button class="btn gold" style="flex:1" data-a="ics">📅 Ajouter à l'agenda</button></div>`);
  h += sec('priere', '🌙 Prière', `${sel('prayer.city', 'Villes affichées', { both: 'Bruxelles et Charleroi', bxl: 'Bruxelles', cha: 'Charleroi' })}${sel('prayer.method', 'Méthode de calcul', Object.fromEntries(Object.entries(PT_METHODS).map(([k, m]) => [k, m.n])))}${sel('prayer.asr', 'Asr', { '1': 'Standard (Malikite, Chafiite, Hanbalite)', '2': 'Hanafite' })}
   <div class="sec">Ajustements (minutes, + ou −)</div><div class="grid3">${PRAYERS.map(p => inp('prayer.adj.' + p.k, p.n)).join('')}</div><div class="xs mut">Compare une fois avec le calendrier de ta mosquée et corrige l'écart ici.</div>`);
  h += sec('apparence', '🎨 Apparence & mise en page', `<div class="themes">${Object.entries(THEMES).map(([k, l]) => { const sw = { auto: 'linear-gradient(135deg,#0f1115 50%,#f2f3f6 50%)', ring: 'linear-gradient(135deg,#0f1115 60%,#e63946 60%)', champion: 'linear-gradient(135deg,#0b0b0a 60%,#d4a537 60%)', clair: 'linear-gradient(135deg,#fff 60%,#d62839 60%)', vintage: 'linear-gradient(135deg,#efe6d2 60%,#b3261e 60%)', bleu: 'linear-gradient(135deg,#0a1424 60%,#3fa7ff 60%)', rouge: 'linear-gradient(135deg,#17070a 60%,#ff3b3b 60%)' }[k]; return `<div class="th ${S.ui.theme === k ? 'on' : ''}" data-a="theme" data-v="${k}"><i style="background:${sw}"></i>${l}</div>`; }).join('')}</div>
   <div class="row" style="flex-wrap:nowrap;margin-top:6px"><label style="flex:1">Couleur d'accent<input type="color" value="${S.ui.accent || '#e63946'}" data-c="accent"></label><button class="btn ghost" style="margin-top:24px" data-a="accReset">Par défaut</button></div>
   <div class="grid2">${sel('ui.font', 'Police des titres', { affiche: 'Affiche de combat (Bebas)', oswald: 'Ring (Oswald)', moderne: 'Moderne', arrondie: 'Arrondie', classique: 'Classique' })}${sel('ui.size', 'Taille du texte', { s: 'Petite', m: 'Normale', l: 'Grande', xl: 'Très grande' })}
   ${sel('ui.radius', 'Coins', { carre: 'Carrés', rond: 'Arrondis', tres: 'Très arrondis' })}${sel('ui.density', 'Densité', { compact: 'Compacte', confort: 'Confort', aere: 'Aérée' })}
   ${sel('ui.nav', 'Barre de navigation', { bottom: 'En bas', top: 'En haut' })}${sel('ui.bg', 'Motif de fond', { aucun: 'Aucun', cordes: 'Cordes du ring', toile: 'Toile du ring' })}</div>
   <div class="sec">Écran « Jour » : ordre et blocs affichés</div>${S.ui.home.map((b, i) => `<div class="hb"><input type="checkbox" data-c="hb" data-i="${i}" ${b.on ? 'checked' : ''}><span>${HOME_BLOCKS[b.id]}</span><button class="ib" data-a="hbUp" data-v="${i}">↑</button><button class="ib" data-a="hbDn" data-v="${i}">↓</button></div>`).join('')}`);
  h += sec('donnees', '💾 Données', `<div class="xs mut">Tout est enregistré sur ce téléphone. Exporte régulièrement : si le navigateur est vidé, les données partent avec.</div><div class="row" style="margin-top:8px"><button class="btn" style="flex:1" data-a="exp">⬇️ Exporter</button><button class="btn" style="flex:1" data-a="imp">⬆️ Importer</button></div><button class="btn ghost danger full" style="margin-top:8px" data-a="reset">Tout effacer</button>`);
  return h;
}

/* ---------- graphiques ---------- */
function prep(cv) { const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; cv.width = r.width * dpr; cv.height = r.height * dpr; const c = cv.getContext('2d'); c.scale(dpr, dpr); return { c, w: r.width, h: r.height }; }
function lineChart(id, series, opt = {}) {
  const cv = document.getElementById(id); if (!cv) return; const { c, w, h } = prep(cv); const pad = { l: 38, r: 10, t: 12, b: 22 }; const mut = css('--mut'), line = css('--line');
  const all = series.flatMap(s => s.pts); if (!all.length) { c.fillStyle = mut; c.font = '13px system-ui'; c.textAlign = 'center'; c.fillText('Pas encore de données', w / 2, h / 2); return; }
  const xs = all.map(p => p.x), ys = all.map(p => p.y); let x0 = Math.min(...xs), x1 = Math.max(...xs); if (x0 === x1) { x0 -= 1; x1 += 1; }
  let y0 = opt.ymin != null ? opt.ymin : Math.min(...ys), y1 = opt.ymax != null ? opt.ymax : Math.max(...ys); if (y0 === y1) { y0 -= 1; y1 += 1; } const yp = (y1 - y0) * 0.12; if (opt.ymin == null) y0 -= yp; if (opt.ymax == null) y1 += yp;
  const X = x => pad.l + (x - x0) / (x1 - x0) * (w - pad.l - pad.r), Y = y => h - pad.b - (y - y0) / (y1 - y0) * (h - pad.t - pad.b);
  c.strokeStyle = line; c.fillStyle = mut; c.font = '11px system-ui'; c.lineWidth = 1;
  for (let i = 0; i <= 3; i++) { const v = y0 + (y1 - y0) * i / 3, yy = Y(v); c.beginPath(); c.moveTo(pad.l, yy); c.lineTo(w - pad.r, yy); c.stroke(); c.textAlign = 'right'; c.fillText(fr(v, opt.dec || 0), pad.l - 5, yy + 4); }
  if (opt.xl) { c.textAlign = 'left'; c.fillText(opt.xl(x0), pad.l, h - 6); c.textAlign = 'right'; c.fillText(opt.xl(x1), w - pad.r, h - 6); }
  for (const s of series) {
    c.strokeStyle = s.color; c.fillStyle = s.color; c.lineWidth = s.lw || 2.5;
    if (s.line && s.pts.length) { c.beginPath(); s.pts.forEach((p, i) => i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y))); c.stroke(); }
    if (s.dots) for (const p of s.pts) { c.globalAlpha = s.alpha || 1; c.beginPath(); c.arc(X(p.x), Y(p.y), s.r || 3, 0, 7); c.fill(); c.globalAlpha = 1; }
  }
}
function barChart(id, labels, sets) {
  const cv = document.getElementById(id); if (!cv) return; const { c, w, h } = prep(cv); const pad = { l: 8, r: 8, t: 16, b: 22 };
  const tot = labels.map((_, i) => sets.reduce((s, st) => s + st.v[i], 0)); const mx = Math.max(1, ...tot); const bw = (w - pad.l - pad.r) / labels.length;
  labels.forEach((lab, i) => {
    let y = h - pad.b; for (const st of sets) { const bh = st.v[i] / mx * (h - pad.t - pad.b); if (bh > 0) { c.fillStyle = st.color; c.fillRect(pad.l + i * bw + 5, y - bh, bw - 10, bh); y -= bh; } }
    c.fillStyle = css('--mut'); c.font = '10px system-ui'; c.textAlign = 'center'; c.fillText(lab, pad.l + i * bw + bw / 2, h - 7);
    if (tot[i]) { c.fillStyle = css('--txt'); c.fillText(tot[i], pad.l + i * bw + bw / 2, y - 4); }
  });
}
function drawCharts() {
  const base = S.weights.length ? S.weights[0].d : today(); const xl = x => dshort(addDays(base, x));
  lineChart('cw', [{ pts: S.weights.map(w => ({ x: daysBetween(base, w.d), y: w.kg })), color: css('--mut'), dots: true, alpha: .6 }, { pts: S.weights.map(w => ({ x: daysBetween(base, w.d), y: maW(w.d) })), color: css('--gold'), line: true }], { dec: 1, xl });
  const ss = strengthSeries(UI.statEx); const sb = ss.length ? ss[0].d : today();
  lineChart('cs', [{ pts: ss.map(p => ({ x: daysBetween(sb, p.d), y: p.y })), color: css('--acc'), line: true, dots: true }], { dec: 0, xl: x => dshort(addDays(sb, x)) });
  const m = monday(today()); const lab = [], g = [], b = [];
  for (let i = 7; i >= 0; i--) { const k = addDays(m, -7 * i); lab.push(dshort(k)); let gg = 0, bb = 0; for (let j = 0; j < 7; j++) { const x = peek(addDays(k, j)); if (x.gym && x.gym.done) gg++; if (x.boxDone) bb++; } g.push(gg); b.push(bb); }
  barChart('cl', lab, [{ v: g, color: css('--acc') }, { v: b, color: css('--gold') }]);
  const rp = [], sl = []; const t = today(); for (let i = 13; i >= 0; i--) { const k = addDays(t, -i); const s = rec(k); if (s != null) rp.push({ x: 13 - i, y: s }); const c = peek(k).check; if (c && +c.hours) sl.push({ x: 13 - i, y: c.hours * 10 }); }
  lineChart('cr', [{ pts: rp, color: css('--ok'), line: true, dots: true }, { pts: sl, color: css('--blue'), dots: true, r: 3.5 }], { ymin: 0, ymax: 100, xl: x => dshort(addDays(t, x - 13)) });
}

/* ---------- célébration ---------- */
function bell(n = 1) { try { const ctx = bell.c || (bell.c = new (window.AudioContext || window.webkitAudioContext)()); for (let i = 0; i < n; i++) for (const [f, v] of [[880, .45], [1320, .2]]) { const t = ctx.currentTime + i * .45, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + 1.3); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 1.3); } } catch (e) { } }
function celebrate(title, sub) {
  const c = $('#celeb'); const img = c.querySelector('img'); img.src = ''; img.src = 'celebration.webp';
  c.querySelector('.ct').textContent = title; c.querySelector('.cs').textContent = sub; c.classList.remove('hidden'); bell(3); if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  clearTimeout(celebrate.t); celebrate.t = setTimeout(() => c.classList.add('hidden'), 9000);
}
$('#celeb').addEventListener('click', () => $('#celeb').classList.add('hidden'));

/* ---------- modales ---------- */
let stream = null;
function openModal(html) { const m = $('#modal'); m.innerHTML = `<div class="sheet">${html}</div>`; m.classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').innerHTML = ''; if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && S.profile.setup) closeModal(); });

function onboard() {
  const p = S.profile;
  openModal(`<h2>🥊 Bienvenue, ${esc(p.name)} !</h2><p class="mut sm">Ton appli de sèche : muscu, boxe, assiette, prières et compléments. Vérifie ces infos pour calculer tes besoins (modifiables à tout moment dans les réglages 🔔).</p>
  <div class="grid2"><label>Prénom<input id="o_n" value="${esc(p.name)}"></label><label>Âge<input id="o_a" type="number" inputmode="numeric" value="${p.age}"></label><label>Taille (cm)<input id="o_h" type="number" value="${p.height}"></label><label>Poids actuel (kg)<input id="o_w" type="number" step="0.1" inputmode="decimal" value="${p.weight}"></label></div>
  <div class="sum">Semaine type : boxe lundi, mercredi, vendredi · Full body mardi · Pull jeudi · Legs samedi · Push dimanche. Chaque séance de muscu inclut l'échauffement et 2 × 15 min de cardio.</div>
  <button class="btn pri" data-a="onbOk">C'est parti 👊</button>`);
}
function ovModal() {
  const o = UI.ov, d = UI.date; const mon = monday(d);
  openModal(`<h2>${dlabel(d)}</h2><div class="mut sm">Change ce jour uniquement : les objectifs caloriques s'adaptent.</div>
  <label class="tog" style="margin:14px 0"><input type="checkbox" ${o.box ? 'checked' : ''} data-a="ovBox"> 🥊 Boxe au club</label>
  <div class="sel" style="flex-wrap:wrap">${[['', 'Pas de muscu'], ...SESS.map(s => [s, S.program[s].icon + ' ' + S.program[s].name])].map(([k, l]) => `<button class="chip ${(o.gym || '') === k ? 'on' : ''}" data-a="ovGym" data-v="${k}">${esc(l)}</button>`).join('')}</div>
  <button class="btn pri" data-a="ovSave">Appliquer</button>
  <div class="sec">Ou échanger ce jour avec…</div><div class="sel" style="flex-wrap:wrap">${[0, 1, 2, 3, 4, 5, 6].map(i => addDays(mon, i)).filter(k => k !== d).map(k => { const p = plan(k); return `<button class="chip" data-a="swap" data-v="${k}">${DOW[dowIdx(k)]} · ${p.gym ? esc(S.program[p.gym].name) : p.box ? 'Boxe' : 'Repos'}</button>`; }).join('')}</div>
  <button class="btn ghost full" style="margin-top:12px" data-a="ovCancel">Annuler la séance de ce jour</button><button class="btn ghost full" style="margin-top:8px" data-a="ovReset">Revenir à la semaine type</button>`);
}
function weekModal() {
  const mon = monday(UI.date), ws = wstat(UI.date);
  openModal(`<h2>Semaine du ${dshort(mon)}</h2><div class="mut sm">Trop crevé ? Allège ou décale la semaine, sans culpabiliser : la récupération fait partie du plan.</div>
  <div class="ci ${ws === 'normal' ? 'ok' : ''}" data-a="weekSet" data-v="normal" style="margin-top:12px"><span class="tk ${ws === 'normal' ? 'on' : ''}">${ws === 'normal' ? '✓' : ''}</span><span class="tt"><b>Semaine normale</b><br><span class="xs mut">Programme complet, déficit calorique.</span></span></div>
  <div class="ci ${ws === 'recup' ? 'ok' : ''}" data-a="weekSet" data-v="recup"><span class="tk ${ws === 'recup' ? 'on' : ''}">${ws === 'recup' ? '✓' : ''}</span><span class="tt"><b>🔋 Semaine de récupération</b><br><span class="xs mut">Mêmes séances mais 2 séries, charges −15 %, loin de l'échec.${S.kcal.recupMaint ? ' Calories à maintenance.' : ''}</span></span></div>
  <div class="ci ${ws === 'report' ? 'ok' : ''}" data-a="weekSet" data-v="report"><span class="tk ${ws === 'report' ? 'on' : ''}">${ws === 'report' ? '✓' : ''}</span><span class="tt"><b>⏭️ Reporter la semaine</b><br><span class="xs mut">Pas de muscu cette semaine (la boxe reste affichée).${+S.profile.goalW && S.profile.goalDate ? ' La date objectif recule de 7 jours.' : ''}${S.kcal.recupMaint ? ' Calories à maintenance.' : ''}</span></span></div>
  <button class="btn ghost full" style="margin-top:12px" data-a="closeM">Fermer</button>`);
}
function favModal(f, idx, isNew) {
  openModal(`<h2>${esc(f.n)}</h2><div class="xs mut">Pour 100 g : ${fr(f.k)} kcal · P ${fr(f.p, 1)} · G ${fr(f.g, 1)} · L ${fr(f.l, 1)}</div>
  <div class="sel" style="margin-top:10px">${Object.entries(MEALS).map(([k, m]) => `<button class="chip ${UI.meal === k ? 'on' : ''}" data-a="fMeal" data-v="${k}|${idx}">${m.n}</button>`).join('')}</div>
  <label>Quantité (g)<input id="fg" type="number" inputmode="decimal" value="${f.po || 100}"></label><div class="sum" id="fprev"></div>
  <button class="btn pri" data-a="fAddG" data-v="${idx}">Ajouter au ${MEALS[UI.meal].n.toLowerCase()}</button>${!isNew ? `<button class="btn ghost danger full" style="margin-top:8px" data-a="favDel" data-v="${idx}">Retirer de ma liste</button>` : ''}<button class="btn ghost full" style="margin-top:8px" data-a="closeM">Annuler</button>`);
  const up = () => { const g = parseFloat($('#fg').value) || 0, r = g / 100; $('#fprev').innerHTML = `<b>${fr(f.k * r)} kcal</b> · P ${fr(f.p * r, 1)} g · G ${fr(f.g * r, 1)} g · L ${fr(f.l * r, 1)} g`; };
  $('#fg').oninput = up; up(); setTimeout(() => { const i = $('#fg'); if (i) i.select(); }, 60);
}
function freeModal(pref) {
  const v = pref || {};
  openModal(`<h2>Saisie manuelle</h2><div class="sel">${Object.entries(MEALS).map(([k, m]) => `<button class="chip ${UI.meal === k ? 'on' : ''}" data-a="ffMeal" data-v="${k}">${m.n}</button>`).join('')}</div>
  <label>Nom<input id="ff_n" placeholder="ex. assiette cantine" value="${esc(v.n || '')}"></label>
  <div class="grid2"><label>Protéines (g)<input id="ff_p" type="number" inputmode="decimal" value="${v.p || ''}"></label><label>Glucides (g)<input id="ff_g" type="number" inputmode="decimal" value="${v.g || ''}"></label><label>Lipides (g)<input id="ff_l" type="number" inputmode="decimal" value="${v.l || ''}"></label><label>kcal (auto si vide)<input id="ff_k" type="number" inputmode="decimal" value="${v.k || ''}"></label></div>
  <label class="tog" style="margin-top:10px"><input type="checkbox" id="ff_100"> Ces valeurs sont pour 100 g</label><div id="ff_qw" style="display:none"><label>Quantité mangée (g)<input id="ff_q" type="number" inputmode="decimal" value="100"></label><label class="tog"><input type="checkbox" id="ff_fav" checked> Enregistrer dans mes aliments</label></div>
  <div id="ff_chk" class="sum"></div><button class="btn pri" data-a="fFreeSave">Ajouter</button><button class="btn ghost full" style="margin-top:8px" data-a="closeM">Annuler</button>`);
  const upd = () => {
    const n = id => parseFloat($(id).value) || 0; const p = n('#ff_p'), g = n('#ff_g'), l = n('#ff_l'), k = n('#ff_k'); const calc = Math.round(p * 4 + g * 4 + l * 9);
    $('#ff_qw').style.display = $('#ff_100').checked ? 'block' : 'none';
    let m = `Calcul : ${fr(p, 1)} × 4 + ${fr(g, 1)} × 4 + ${fr(l, 1)} × 9 = <b>${fr(calc)} kcal</b>`;
    if (k && calc && Math.abs(k - calc) / Math.max(k, calc) > 0.15) m += `<div class="alert red" style="margin-bottom:0">Incohérence : tu indiques ${fr(k)} kcal mais les macros donnent ${fr(calc)} kcal. Vérifie l'étiquette (fibres, alcools de sucre) ou <button class="chip" data-a="ffFix">utilise ${fr(calc)} kcal</button></div>`;
    else if (k && calc) m += ' · <span style="color:var(--ok)">cohérent ✓</span>';
    if ($('#ff_100').checked && p + g + l > 100) m += `<div class="alert red" style="margin-bottom:0">Pour 100 g, protéines + glucides + lipides ne peuvent pas dépasser 100 g.</div>`;
    if (upd.last !== m) { $('#ff_chk').innerHTML = m; upd.last = m; }
  };
  $('#modal').oninput = upd; $('#modal').onchange = null; upd();
}
function scanModal() {
  openModal(`<h2>Code-barres</h2><div class="sel" style="margin-bottom:8px">${Object.entries(MEALS).map(([k, m]) => `<button class="chip ${UI.meal === k ? 'on' : ''}" data-a="scMeal" data-v="${k}">${m.n}</button>`).join('')}</div><div id="scz"></div><label>Ou tape le code<input id="sc_c" inputmode="numeric" placeholder="ex. 3017620422003"></label><button class="btn pri" data-a="fCode">Chercher</button><div class="xs mut" style="margin-top:8px">Données : Open Food Facts (base collaborative : vérifie les valeurs).</div><button class="btn ghost full" style="margin-top:8px" data-a="closeM">Fermer</button>`);
  if ('BarcodeDetector' in window && navigator.mediaDevices) {
    $('#scz').innerHTML = '<video id="scv" playsinline muted></video>';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(st => {
      stream = st; const v = $('#scv'); if (!v) { st.getTracks().forEach(t => t.stop()); return; } v.srcObject = st; v.play();
      const det = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] }); const loop = () => { if (!stream) return; det.detect(v).then(c => { if (c.length) lookup(c[0].rawValue); else requestAnimationFrame(loop); }).catch(() => requestAnimationFrame(loop)); }; loop();
    }).catch(() => { $('#scz').innerHTML = '<div class="alert">Caméra indisponible : tape le code à la main.</div>'; });
  } else $('#scz').innerHTML = '<div class="alert">Scanner non pris en charge par ce navigateur (utilise Chrome sur Android) : tape le code à la main.</div>';
}
function lookup(code) {
  code = String(code).replace(/\D/g, ''); if (!code) return; if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } toast('Recherche…');
  fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_fr,brands,nutriments`).then(r => r.json()).then(j => {
    if (!j || j.status !== 1 || !j.product) throw 0; const p = j.product, n = p.nutriments || {};
    const f = { n: ((p.product_name_fr || p.product_name || 'Produit') + (p.brands ? ' – ' + p.brands.split(',')[0] : '')).slice(0, 60), k: Math.round(+n['energy-kcal_100g'] || (+n['energy_100g'] || 0) / 4.184), p: +n.proteins_100g || 0, g: +n.carbohydrates_100g || 0, l: +n.fat_100g || 0, po: 100 };
    const calc = f.p * 4 + f.g * 4 + f.l * 9; if (!f.k) f.k = Math.round(calc);
    S.favs.push(f); save(); favModal(f, S.favs.length - 1, true);
    if (calc && Math.abs(f.k - calc) / Math.max(f.k, calc) > 0.2) toast('Attention : kcal et macros peu cohérents dans la base');
  }).catch(() => toast('Produit introuvable : utilise la saisie manuelle'));
}

/* ---------- actions ---------- */
function gymInit() { const x = day(UI.date); const s = UI.gymSess || defSess(UI.date); if (!x.gym || (x.gym.s !== s)) x.gym = { s, ex: {}, warm: [], cb: false, ca: false, rpe: null, done: false, light: light(rec(UI.date)) === 'rouge' }; x.gym.warm = x.gym.warm || []; return x.gym; }
function checkGymDone() {
  const g = peek(UI.date).gym; if (!g) return; const pg = gymProgress(UI.date, g.s);
  if (pg.done >= pg.tot && !g.done) { g.done = true; save(); render(); celebrate('Séance clôturée !', `${S.program[g.s].name} terminée, cardio compris. +20 pts 💪`); return true; }
  if (pg.done < pg.tot && g.done) { g.done = false; }
  return false;
}
function hasGymData(g) { return g && (g.done || g.cb || g.ca || (g.warm || []).some(Boolean) || Object.values(g.ex || {}).some(a => a.some(z => z && (z.ok || z.w || z.r)))); }
const ACT = {
  tab: v => { UI.tab = v; UI.gymEdit = false; closeModal(); render(); scrollTo(0, 0); },
  go: v => { UI.date = v; UI.chk = {}; UI.chkEdit = false; UI.gymSess = null; UI.meal = null; render(); },
  dprev: () => ACT.go(addDays(UI.date, -1)), dnext: () => ACT.go(addDays(UI.date, 1)), dtoday: () => ACT.go(today()),
  settings: () => ACT.tab('set'), closeM: closeModal,
  onbOk: () => { const n = id => parseFloat($(id).value); const p = S.profile; p.name = $('#o_n').value.trim() || 'Younes'; p.age = n('#o_a') || p.age; p.height = n('#o_h') || p.height; p.weight = n('#o_w') || p.weight; p.setup = true; if (!S.weights.length) S.weights = [{ d: today(), kg: p.weight }]; save(); closeModal(); render(); toast(`En garde, ${p.name} 👊`); },
  ovEdit: () => { const p = basePlan(UI.date); UI.ov = { box: !!p.box, gym: p.gym || null }; ovModal(); },
  ovBox: () => { UI.ov.box = !UI.ov.box; ovModal(); }, ovGym: v => { UI.ov.gym = v || null; ovModal(); },
  ovSave: () => { day(UI.date).ov = UI.ov; save(); closeModal(); render(); toast('Jour modifié'); },
  ovCancel: () => { const p = basePlan(UI.date); day(UI.date).ov = { box: p.box, gym: null }; save(); closeModal(); render(); toast('Séance annulée pour ce jour'); },
  ovReset: () => { day(UI.date).ov = null; save(); closeModal(); render(); },
  swap: v => { const a = clone(basePlan(UI.date)), b = clone(basePlan(v)); day(UI.date).ov = b; day(v).ov = a; save(); closeModal(); render(); toast(`Échangé avec ${DOWL[dowIdx(v)].toLowerCase()}`); },
  weekM: weekModal,
  weekSet: v => {
    const mon = monday(UI.date), was = wstat(UI.date); const p = S.profile;
    if (was === 'report' && S.weekExt[mon] && p.goalDate) { p.goalDate = addDays(p.goalDate, -7); delete S.weekExt[mon]; }
    if (v === 'normal') delete S.weeks[mon]; else S.weeks[mon] = v;
    if (v === 'report' && p.goalDate && +p.goalW) { p.goalDate = addDays(p.goalDate, 7); S.weekExt[mon] = true; }
    save(); closeModal(); render(); toast({ normal: 'Semaine normale', recup: 'Semaine de récupération activée 🔋', report: 'Semaine reportée ⏭️' }[v]);
  },
  chk: v => { const [k, n] = v.split('|'); UI.chk[k] = +n; const hr = $('#chkhr'), hh = $('#chkh'); if (hr) UI.chk.hr = hr.value; if (hh) UI.chk.hours = hh.value; render(); },
  chkSave: () => { const c = UI.chk; if (!['sleep', 'energy', 'legs', 'mood'].every(k => c[k])) { toast('Réponds aux 4 questions'); return; } const hr = $('#chkhr'), hh = $('#chkh'); day(UI.date).check = { sleep: c.sleep, energy: c.energy, legs: c.legs, mood: c.mood, hr: hr && +hr.value || null, hours: hh && +hh.value || null }; UI.chk = {}; UI.chkEdit = false; save(); render(); toast('Check-in enregistré · +3 pts'); },
  chkRedo: () => { UI.chk = Object.assign({}, S.days[UI.date].check); UI.chkEdit = true; render(); },
  boxDone: () => { const x = day(UI.date); x.boxDone = !x.boxDone; save(); render(); if (x.boxDone) toast('Bien joué au club 🥊 +12 pts'); },
  pray: v => { const x = day(UI.date); x.pray[v] = !x.pray[v]; save(); render(); if (prayCount(UI.date) === 5 && !x.prayCel) { x.prayCel = true; save(); celebrate('Les 5 prières accomplies', 'Qu\'Allah les accepte. 🌙'); } },
  vPrev: () => { UI.verseOff--; render(); }, vNext: () => { UI.verseOff++; render(); },
  supp: v => { const x = day(UI.date); x.supp[v] = !x.supp[v]; save(); render(); },
  gs: v => { UI.gymSess = v; render(); },
  gck: v => { const g = gymInit(); if (v === 'cb' || v === 'ca') g[v] = !g[v]; else { const i = +v.slice(1); g.warm[i] = !g.warm[i]; } save(); if (!checkGymDone()) { save(); render(); } },
  gset: (v, t) => {
    const [id, i] = v.split('|'); const g = gymInit(); const row = t.closest('.setrow'); const w = row.querySelector('.w'), r = row.querySelector('.r');
    const arr = g.ex[id] = g.ex[id] || []; const z = arr[+i] = arr[+i] || {};
    if (!z.ok) { z.w = w.value || w.placeholder || ''; z.r = r.value || r.placeholder || ''; if (!z.r) { toast('Indique le nombre de répétitions'); return; } z.ok = true; } else z.ok = false;
    save(); if (!checkGymDone()) { save(); render(); }
  },
  gEdit: () => { UI.gymEdit = !UI.gymEdit; render(); },
  gRpe: v => { gymInit().rpe = +v; save(); render(); },
  celebGym: () => { const g = peek(UI.date).gym; celebrate('Séance clôturée !', g ? S.program[g.s].name + ' terminée 💪' : ''); },
  exDel: v => { const P = S.program[UI.gymSess || defSess(UI.date)]; if (confirm('Supprimer cet exercice ?')) { P.ex = P.ex.filter(e => e.id !== v); save(); render(); } },
  exUp: v => { const P = S.program[UI.gymSess || defSess(UI.date)]; const i = P.ex.findIndex(e => e.id === v); if (i > 0) { [P.ex[i - 1], P.ex[i]] = [P.ex[i], P.ex[i - 1]]; save(); render(); } },
  exAdd: () => { const P = S.program[UI.gymSess || defSess(UI.date)]; P.ex.push({ id: 'x' + Date.now().toString(36), n: 'Nouvel exercice', sets: 3, min: 8, max: 12, u: 'reps', side: '', why: 'À quoi sert cet exercice ?', yt: '' }); save(); render(); },
  pRestore: () => { const s = UI.gymSess || defSess(UI.date); if (confirm(`Rétablir la séance ${S.program[s].name} d'origine ?`)) { S.program[s] = clone(PROGRAM[s]); save(); render(); } },
  meal: v => { UI.meal = v; render(); },
  mealAdd: v => { UI.meal = v; render(); const q = $('#fq'); if (q) { q.scrollIntoView({ behavior: 'smooth', block: 'center' }); q.focus(); } },
  fFav: v => favModal(S.favs[+v], +v, false),
  fMeal: v => { const [k, i] = v.split('|'); UI.meal = k; const g = $('#fg').value; favModal(S.favs[+i], +i, false); $('#fg').value = g; $('#fg').oninput(); },
  fAddG: v => { const f = S.favs[+v]; const g = parseFloat($('#fg').value) || 0; if (!g) return; const r = g / 100; day(UI.date).food.push({ n: f.n, q: g, m: UI.meal, k: Math.round(f.k * r), p: +(f.p * r).toFixed(1), g: +(f.g * r).toFixed(1), l: +(f.l * r).toFixed(1) }); save(); closeModal(); UI.q = ''; render(); toast(`Ajouté au ${MEALS[UI.meal].n.toLowerCase()} : ${f.n}`); },
  favDel: v => { S.favs.splice(+v, 1); save(); closeModal(); render(); },
  fFree: () => freeModal(),
  ffMeal: v => { const keep = { n: $('#ff_n').value, p: $('#ff_p').value, g: $('#ff_g').value, l: $('#ff_l').value, k: $('#ff_k').value }; UI.meal = v; freeModal(keep); },
  ffFix: () => { const n = id => parseFloat($(id).value) || 0; $('#ff_k').value = Math.round(n('#ff_p') * 4 + n('#ff_g') * 4 + n('#ff_l') * 9); $('#modal').oninput(); },
  fFreeSave: () => {
    const n = id => parseFloat($(id).value) || 0; const p = n('#ff_p'), g = n('#ff_g'), l = n('#ff_l'); const k = n('#ff_k') || Math.round(p * 4 + g * 4 + l * 9); const name = $('#ff_n').value.trim() || 'Saisie manuelle';
    if (!k) { toast('Renseigne au moins une valeur'); return; }
    if ($('#ff_100').checked) { if (p + g + l > 100) { toast('Valeurs pour 100 g incohérentes'); return; } const q = n('#ff_q') || 100, r = q / 100; if ($('#ff_fav').checked) { S.favs.push({ n: name, k, p, g, l, po: q }); } day(UI.date).food.push({ n: name, q, m: UI.meal, k: Math.round(k * r), p: +(p * r).toFixed(1), g: +(g * r).toFixed(1), l: +(l * r).toFixed(1) }); }
    else day(UI.date).food.push({ n: name, m: UI.meal, k, p, g, l });
    save(); closeModal(); render(); toast(`Ajouté au ${MEALS[UI.meal].n.toLowerCase()}`);
  },
  fScan: scanModal, scMeal: v => { UI.meal = v; document.querySelectorAll('[data-a=scMeal]').forEach(b => b.classList.toggle('on', b.dataset.v === v)); }, fCode: () => lookup($('#sc_c').value),
  fCopy: () => { const y = peek(addDays(UI.date, -1)); if (!y.food || !y.food.length) { toast('Rien la veille'); return; } day(UI.date).food.push(...clone(y.food)); save(); render(); toast(y.food.length + ' aliment(s) copié(s)'); },
  fDel: v => { day(UI.date).food.splice(+v, 1); save(); render(); },
  wat: v => { const x = day(UI.date); x.water = Math.max(0, (x.water || 0) + 250 * v); save(); render(); },
  wSave: () => { const kg = parseFloat($('#wkg').value); if (!kg || kg < 30 || kg > 250) { toast('Poids invalide'); return; } S.weights = S.weights.filter(w => w.d !== UI.date); S.weights.push({ d: UI.date, kg }); S.weights.sort((a, b) => a.d < b.d ? -1 : 1); save(); render(); toast('Pesée enregistrée · +2 pts'); },
  wDel: v => { S.weights = S.weights.filter(w => w.d !== v); save(); render(); },
  spAdd: () => { S.supps.push({ id: 's' + Date.now().toString(36), n: 'Nouveau complément', dose: '', when: 'Matin' }); save(); render(); },
  spDel: v => { if (confirm('Supprimer ce complément ?')) { S.supps = S.supps.filter(s => s.id !== v); save(); render(); } },
  notif: () => { if (!('Notification' in window)) { toast('Notifications non prises en charge ici'); return; } Notification.requestPermission().then(p => { toast(p === 'granted' ? 'Notifications activées (appli ouverte ou en arrière-plan)' : 'Notifications refusées'); notifyCheck(); }); },
  ics: () => {
    const s = S.supps.find(z => z.id === S.reminder.supp) || { n: 'Créatine', dose: '5 g' }; const [hh, mm] = (S.reminder.time || '08:30').split(':'); const t = addDays(today(), 1).replace(/-/g, '');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hurricane Younes//FR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:rappel-${s.id}-${Date.now()}@hurricane-younes`, `DTSTAMP:${stamp}`, `DTSTART;TZID=Europe/Brussels:${t}T${hh}${mm}00`, 'DURATION:PT5M', 'RRULE:FREQ=DAILY', `SUMMARY:💊 ${s.n} (${s.dose})`, 'DESCRIPTION:Hurricane Younes : pense à cocher dans l\'appli.', 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', `DESCRIPTION:${s.n}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = `rappel-${s.n.toLowerCase().replace(/\s+/g, '-')}.ics`; document.body.appendChild(a); a.click(); a.remove(); toast('Ouvre le fichier pour l\'ajouter à ton agenda');
  },
  theme: v => { S.ui.theme = v; save(); applyTheme(); render(); },
  accReset: () => { S.ui.accent = ''; save(); applyTheme(); render(); },
  hbUp: v => { const i = +v, h = S.ui.home; if (i > 0) { [h[i - 1], h[i]] = [h[i], h[i - 1]]; save(); render(); } },
  hbDn: v => { const i = +v, h = S.ui.home; if (i < h.length - 1) { [h[i + 1], h[i]] = [h[i], h[i + 1]]; save(); render(); } },
  exp: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' })); a.download = `hurricane-younes-${today()}.json`; document.body.appendChild(a); a.click(); a.remove(); toast('Sauvegarde exportée'); },
  imp: () => $('#impf').click(),
  reset: () => { if (confirm("Effacer toutes les données ? Exporte d'abord une sauvegarde.")) { try { localStorage.removeItem(KEY); } catch (e) { } S = defaults(); applyTheme(); UI.tab = 'home'; render(); onboard(); } }
};

document.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (!t) return; const f = ACT[t.dataset.a]; if (f) { if (t.tagName !== 'INPUT' && t.tagName !== 'A') e.preventDefault(); f(t.dataset.v, t, e); } });
document.addEventListener('change', e => {
  const t = e.target, c = t.dataset.c; if (!c) return;
  if (c === 'set') { const g = gymInit(); const arr = g.ex[t.dataset.id] = g.ex[t.dataset.id] || []; const z = arr[+t.dataset.i] = arr[+t.dataset.i] || {}; z[t.dataset.k] = t.value; save(); return; }
  if (c === 'glight') { const g = gymInit(); g.light = t.checked; save(); checkGymDone(); render(); return; }
  if (c === 'skipDej') { day(UI.date).skipDej = t.checked; save(); render(); return; }
  if (c === 'statEx') { UI.statEx = t.value; render(); return; }
  if (c === 'ex') { const e2 = allEx()[t.dataset.id]; const k = t.dataset.k; e2[k] = ['sets', 'min', 'max'].includes(k) ? Math.max(1, +t.value || 1) : t.value; save(); return; }
  if (c === 'pname' || c === 'pfocus') { S.program[t.dataset.s][c === 'pname' ? 'name' : 'focus'] = t.value; save(); return; }
  if (c === 'pwarm') { S.program[t.dataset.s].warm = t.value.split('\n').map(s => s.trim()).filter(Boolean); save(); return; }
  if (c === 'p') { let v = t.value; if (t.dataset.t === 'n') v = v === '' ? '' : +v; setPath(t.dataset.k, v); save(); if (t.dataset.k.startsWith('ui.')) applyTheme(); for (const k in PT_CACHE) delete PT_CACHE[k]; render(); return; }
  if (c === 'pb') { setPath(t.dataset.k, t.checked); save(); render(); return; }
  if (c === 'wb') { S.week[+t.dataset.i].box = t.checked; save(); render(); return; }
  if (c === 'wg') { S.week[+t.dataset.i].gym = t.value || null; save(); render(); return; }
  if (c === 'sp') { const s = S.supps.find(z => z.id === t.dataset.id); s[t.dataset.k] = t.value; save(); return; }
  if (c === 'accent') { S.ui.accent = t.value; save(); applyTheme(); render(); return; }
  if (c === 'hb') { S.ui.home[+t.dataset.i].on = t.checked; save(); return; }
});
document.addEventListener('input', e => { if (e.target.dataset.i === 'fq') { UI.q = e.target.value; $('#fres').innerHTML = foodRes(); } });
document.addEventListener('click', e => { const sm = e.target.closest('details[data-sec] > summary'); if (sm) { const d = sm.parentElement; UI.open[d.dataset.sec] = !d.open; } }, true);
document.addEventListener('toggle', e => { const d = e.target; if (d.dataset && d.dataset.sec) UI.open[d.dataset.sec] = d.open; }, true);
$('#impf').addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); if (!o.profile || !o.days) throw 0; localStorage.setItem(KEY, JSON.stringify(o)); S = load(); applyTheme(); render(); toast('Sauvegarde restaurée'); } catch (err) { toast('Fichier invalide'); } }; r.readAsText(f); e.target.value = ''; });

/* horloge : compte à rebours des prières, rappel créatine, changement de jour */
let lastDay = today();
setInterval(() => {
  if (today() !== lastDay) { if (UI.date === lastDay) UI.date = today(); lastDay = today(); render(); return; }
  const cd = $('#cd'); if (cd && UI.date === today()) { const np = nextPrayer(); const txt = cdTxt(np.h); cd.textContent = UI.tab === 'home' ? `(${txt})` : txt; if (np.h - nowH() < 0.01) render(); }
  notifyCheck();
}, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { if (today() !== lastDay) { UI.date = today(); lastDay = today(); } render(); notifyCheck(); } });
matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (S.ui.theme === 'auto') applyTheme(); });

$('.brand').insertAdjacentHTML('afterbegin', ic('storm'));
$('#setb').innerHTML = ic('bell');
[['home', 'glove', 'Jour'], ['gym', 'dumbbell', 'Muscu'], ['pray', 'moon', 'Prière'], ['food', 'plate', 'Assiette'], ['stats', 'belt', 'Progrès']].forEach(([v, i, l]) => $('#tabs').insertAdjacentHTML('beforeend', `<button data-a="tab" data-v="${v}">${ic(i)}${l}</button>`));
applyTheme(); render(); if (!S.profile.setup) onboard(); notifyCheck();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
