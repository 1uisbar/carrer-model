/* Interfaz del dashboard. Depende de Chart (Chart.js), CareerModel (engine) y SUPUESTOS_DEFAULT. */
(function () {
  'use strict';
  const E = window.CareerModel;
  const DEF = window.SUPUESTOS_DEFAULT;
  const LS_KEY = 'carrerModel.v1';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ------------------------------------------------------------------ estado
  const state = {
    A: clone(DEF), edits: {}, loc: 'dfw', esc: 'base', viv: null, real: false, llc: false,
    tab: 'resumen', hidden: [], focus: 'crna', sensPath: 'crna', ganttPath: 'md_match1',
  };
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (!s) return;
      for (const k of ['loc', 'esc', 'viv', 'real', 'llc', 'tab', 'hidden', 'focus', 'sensPath', 'ganttPath']) if (s[k] !== undefined) state[k] = s[k];
      state.edits = s.edits || {};
      for (const [p, v] of Object.entries(state.edits)) { try { setAt(state.A, p, v); } catch (e) { delete state.edits[p]; } }
    } catch (e) { /* almacenamiento no disponible */ }
  }
  function saveState() {
    try {
      const s = {}; for (const k of ['loc', 'esc', 'viv', 'real', 'llc', 'tab', 'hidden', 'focus', 'sensPath', 'ganttPath', 'edits']) s[k] = state[k];
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch (e) { /* ignorar */ }
  }
  function getAt(o, path) { return path.split('.').reduce((a, k) => a[k], o); }
  function setAt(o, path, v) {
    const ks = path.split('.'); let x = o;
    for (let i = 0; i < ks.length - 1; i++) x = x[ks[i]];
    const last = ks[ks.length - 1];
    if (x[last] && typeof x[last] === 'object' && !Array.isArray(x[last]) && 'v' in x[last]) x[last].v = v; else x[last] = v;
  }
  function leafValue(path) { const n = getAt(state.A, path); return n && typeof n === 'object' && 'v' in n ? n.v : n; }
  function defaultValue(path) { const n = getAt(DEF, path); return n && typeof n === 'object' && 'v' in n ? n.v : n; }
  function edit(path, v) {
    setAt(state.A, path, v);
    if (JSON.stringify(v) === JSON.stringify(defaultValue(path))) delete state.edits[path]; else state.edits[path] = v;
    saveState(); schedule();
  }

  // ------------------------------------------------------------------ formato
  const nf0 = new Intl.NumberFormat('es-US', { maximumFractionDigits: 0 });
  function money(v, opt = {}) {
    if (v == null || !isFinite(v)) return '—';
    const s = v < 0 ? '−' : ''; const a = Math.abs(v);
    if (opt.full) return s + '$' + nf0.format(a);
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(a >= 1e7 ? 1 : 2) + 'M';
    if (a >= 1e4) return s + '$' + Math.round(a / 1e3) + 'k';
    if (a >= 1e3) return s + '$' + (a / 1e3).toFixed(1) + 'k';
    return s + '$' + Math.round(a);
  }
  const pct = (v, d = 0) => (v == null ? '—' : (v * 100).toFixed(d) + '%');
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function dateLbl(y) { if (y == null) return '—'; const yr = Math.floor(y + 1e-9); const m = Math.min(11, Math.round((y - yr) * 12)); return MESES[m] + ' ' + yr; }
  const yr = (y) => (y == null ? '—' : String(y));
  function fmtUnit(v, u) {
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    switch (u) {
      case '%': return pct(v, Math.abs(v) < 0.1 && v !== 0 ? 2 : 1);
      case '$': return money(v, { full: Math.abs(v) < 1e6 });
      case '$/h': return '$' + v + '/h';
      case '$/sem': return '$' + nf0.format(v) + '/sem';
      case 'año': return Number.isInteger(v) ? String(v) : dateLbl(v);
      case 'años': return (Math.round(v * 100) / 100) + ' años' + (v < 1 ? ' (' + Math.round(v * 12) + ' m)' : '');
      case 'x': return '×' + v;
      default: return v + (u && u !== 'n' ? ' ' + u : '');
    }
  }

  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

  // ------------------------------------------------------------------ cálculo
  let R = null; // resultados actuales
  function params(extra = {}) {
    return E.buildParams(state.A, Object.assign({ loc: state.loc, escenario: state.esc, vivienda: state.viv, llc: state.llc }, extra));
  }
  function compute() {
    const P = params();
    const results = E.runAll(P);
    const mc = E.monteCarloMD(P, Math.min(5000, Math.max(100, P.md.montecarloN)), 20261027);
    const defl = (y) => Math.pow(1 + P.g.inf, y + 1 - E.BASE_YEAR);
    // pseudo-camino: MD valor esperado (media Monte Carlo)
    const ev = {
      id: 'md_ev', nombre: 'B★ · MD valor esperado (Monte Carlo)', color: '#111827', grupo: 'md', dashed: true,
      rows: mc.years.map((y, k) => ({ year: y, nw: mc.mean[k], nwReal: mc.mean[k] / defl(y) })),
      summary: { nw5: mc.mean[4], nw10: mc.mean[9], nw20: mc.mean[mc.mean.length - 1], nw20Real: mc.mean[mc.mean.length - 1] / defl(mc.years[mc.years.length - 1]),
        buyYear: mc.medianBuy, payoffYear: null, maxDebt: null, yearsLowIncome: null, avgNet: null, attending: mc.medianAttend },
    };
    R = { P, results, mc, ev, defl, byId: Object.fromEntries(results.map(r => [r.id, r])) };
  }
  let timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(() => { compute(); render(); }, 120); }

  const val = (row, key) => (state.real ? row[key] / R.defl(row.year) : row[key]);

  // ------------------------------------------------------------------ gráficos
  const charts = {};
  function chart(id, cfg) {
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
    const el = document.getElementById(id);
    if (!el || typeof Chart === 'undefined') return null;
    const ink = cssVar('--muted'), line = cssVar('--line');
    Chart.defaults.color = ink; Chart.defaults.borderColor = line;
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    charts[id] = new Chart(el, cfg);
    return charts[id];
  }
  const moneyTick = (v) => money(v);
  function lineCfg(datasets, yTitle) {
    return {
      type: 'line', data: { labels: R.results[0].rows.map(r => r.year), datasets },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { itemSort: (a, b) => b.parsed.y - a.parsed.y, callbacks: { label: (c) => c.dataset.label + ': ' + money(c.parsed.y) } },
        },
        scales: { y: { ticks: { callback: moneyTick }, title: { display: !!yTitle, text: yTitle } }, x: { ticks: { maxRotation: 0, autoSkipPadding: 8 } } },
        elements: { point: { radius: 0, hitRadius: 6 }, line: { borderWidth: 2, tension: 0.15 } },
      },
    };
  }
  function visibleResults(includeEv = true) {
    const out = R.results.filter(r => !state.hidden.includes(r.id));
    if (includeEv && !state.hidden.includes('md_ev')) out.push(R.ev);
    return out;
  }
  function dsFor(results, key) {
    return results.filter(r => r.rows[0][key] !== undefined).map(r => ({
      label: r.nombre, data: r.rows.map(row => val(row, key)), borderColor: r.color, backgroundColor: r.color,
      borderDash: r.dashed ? [6, 4] : undefined, borderWidth: r.id === state.focus ? 3.5 : 2,
    }));
  }

  // ------------------------------------------------------------------ controles superiores
  function initControls() {
    const sl = $('#selLoc');
    sl.innerHTML = Object.entries(DEF.ubicaciones).map(([k, L]) => `<option value="${k}">${esc(L.nombre)}</option>`).join('');
    sl.value = state.loc;
    sl.onchange = () => { state.loc = sl.value; saveState(); renderSliders(); schedule(); };
    const sh = $('#selHouse');
    const opts = DEF.vivienda.configuracion.opciones;
    sh.innerHTML = Object.entries(opts).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('');
    sh.value = state.viv || leafValue('vivienda.configuracion');
    sh.onchange = () => { state.viv = sh.value; saveState(); renderSliders(); schedule(); };
    const seg = (id, cur, fn) => {
      const el = $(id);
      $$('button', el).forEach(b => { b.classList.toggle('on', b.dataset.v === cur()); b.onclick = () => { fn(b.dataset.v); $$('button', el).forEach(x => x.classList.toggle('on', x === b)); saveState(); schedule(); }; });
    };
    seg('#segScen', () => state.esc, v => { state.esc = v; });
    seg('#segReal', () => (state.real ? 'real' : 'nom'), v => { state.real = v === 'real'; });
    seg('#segLlc', () => (state.llc ? 'on' : 'off'), v => { state.llc = v === 'on'; });
    $$('#tabs button').forEach(b => { b.onclick = () => setTab(b.dataset.tab); });
    document.addEventListener('click', (e) => { const a = e.target.closest('[data-goto]'); if (a) { e.preventDefault(); setTab(a.dataset.goto); } });
    $('#toggleSide').onclick = () => {
      const side = $('#side'); side.classList.toggle('collapsed');
      const c = side.classList.contains('collapsed'); $('#toggleSide').textContent = c ? 'Mostrar' : 'Ocultar'; $('#toggleSide').setAttribute('aria-expanded', String(!c));
    };
    if (window.matchMedia('(max-width: 1000px)').matches) { $('#side').classList.add('collapsed'); $('#toggleSide').textContent = 'Mostrar'; }
    $('#btnResetKeys').onclick = () => { if (confirm('¿Restablecer todas las variables a los valores por defecto?')) resetAll(); };
    const top = document.querySelector('header.top');
    const fixNav = () => { $('#tabs').style.top = (getComputedStyle(top).position === 'sticky' ? top.offsetHeight : 0) + 'px'; };
    window.addEventListener('resize', fixNav); fixNav();
  }
  function resetAll() {
    state.A = clone(DEF); state.edits = {}; saveState(); renderSliders(); schedule();
  }
  function setTab(t) {
    state.tab = t; saveState();
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    $$('#main > section').forEach(s => { s.hidden = s.dataset.panel !== t; });
    render();
    window.scrollTo({ top: 0 });
  }

  // ------------------------------------------------------------------ deslizadores clave
  function collectLeaves(node, path = '', out = []) {
    if (node == null || typeof node !== 'object') return out;
    if (Array.isArray(node)) return out;
    if ('v' in node && 'l' in node) { out.push({ path, node }); return out; }
    for (const k of Object.keys(node)) {
      if (k === 'fuentes' || k === '_meta') continue;
      collectLeaves(node[k], path ? path + '.' + k : k, out);
    }
    return out;
  }
  function sliderHTML(path, node, labelOverride) {
    const v = node.v;
    if (typeof v === 'boolean') {
      return `<div class="slider"><div class="row"><span>${esc(labelOverride || node.l)}</span>
        <select data-path="${path}" data-kind="bool"><option value="1"${v ? ' selected' : ''}>Sí</option><option value="0"${!v ? ' selected' : ''}>No</option></select></div></div>`;
    }
    return `<div class="slider"><div class="row"><span>${esc(labelOverride || node.l)}</span><b data-out="${path}">${esc(fmtUnit(v, node.u))}</b></div>
      <input type="range" data-path="${path}" min="${node.min}" max="${node.max}" step="${node.step}" value="${v}" aria-label="${esc(node.l)}"></div>`;
  }
  function renderSliders() {
    const leaves = collectLeaves(state.A).filter(x => x.node.k);
    const cfg = state.viv || leafValue('vivienda.configuracion');
    const pricePath = `ubicaciones.${state.loc}.precios.${cfg}`;
    const priceNode = getAt(state.A, pricePath);
    let html = sliderHTML(pricePath, priceNode, `Precio vivienda (${DEF.vivienda.configuracion.opciones[cfg].split(' (')[0]}, ${DEF.ubicaciones[state.loc].nombre})`);
    html += leaves.map(({ path, node }) => sliderHTML(path, node)).join('');
    const box = $('#sliders'); box.innerHTML = html;
    $$('input[type=range]', box).forEach(inp => {
      inp.oninput = () => {
        const p = inp.dataset.path, n = getAt(state.A, p), v = parseFloat(inp.value);
        $(`[data-out="${p}"]`, box).textContent = fmtUnit(v, n.u);
        edit(p, v);
      };
    });
    $$('select[data-kind=bool]', box).forEach(s => { s.onchange = () => edit(s.dataset.path, s.value === '1'); });
  }

  // ------------------------------------------------------------------ pestañas
  function render() {
    if (!R) return;
    const fn = { resumen: renderResumen, timeline: renderTimeline, graficos: renderGraficos, vivienda: renderVivienda,
      ubicaciones: renderUbicaciones, md: renderMD, sensibilidad: renderSens, supuestos: renderSupuestos, notas: renderNotas }[state.tab];
    const el = $(`section[data-panel="${state.tab}"]`);
    if (fn) fn(el);
  }

  function pathOptions(sel, includeEv = true) {
    const all = R.results.map(r => [r.id, r.nombre]);
    if (includeEv) all.push(['md_ev', R.ev.nombre]);
    return all.map(([id, n]) => `<option value="${id}"${id === sel ? ' selected' : ''}>${esc(n)}</option>`).join('');
  }
  function allWithEv() { return [...R.results, R.ev]; }
  function getRes(id) { return id === 'md_ev' ? R.ev : R.byId[id]; }

  // ---------- Resumen
  let sortKey = 'nw20', sortDir = -1;
  function renderResumen(el) {
    const res = allWithEv();
    const nwKey = state.real ? 'nw20Real' : 'nw20';
    const sorted = res.slice().sort((a, b) => (b.summary[nwKey] ?? -1e18) - (a.summary[nwKey] ?? -1e18));
    const best = sorted[0];
    const nursing = sorted.filter(r => r.grupo === 'enf');
    const bestN = nursing[0];
    const buyers = R.results.filter(r => r.summary.buyYear).sort((a, b) => a.summary.buyYear - b.summary.buyYear || (a.summary.payoffYear || 9999) - (b.summary.payoffYear || 9999));
    const payers = R.results.filter(r => r.summary.payoffYear).sort((a, b) => a.summary.payoffYear - b.summary.payoffYear);
    const L = R.P.loc;
    const cfgName = DEF.vivienda.configuracion.opciones[R.P.vivienda.configuracion];
    const dollars = state.real ? 'dólares de 2026' : 'dólares nominales';
    const rows = res.map(r => ({ r, s: r.summary }));
    const keyOf = (x, k) => {
      const s = x.s;
      switch (k) {
        case 'nombre': return x.r.nombre;
        case 'nw10': return state.real ? (s.nw10 != null ? s.nw10 / R.defl(2036) : null) : s.nw10;
        case 'nw20': return state.real ? s.nw20Real : s.nw20;
        default: return s[k];
      }
    };
    rows.sort((a, b) => {
      const va = keyOf(a, sortKey), vb = keyOf(b, sortKey);
      if (va == null && vb == null) return 0; if (va == null) return 1; if (vb == null) return -1;
      return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * sortDir;
    });
    const th = (k, l) => `<th class="sortable" data-sort="${k}">${l}${sortKey === k ? (sortDir < 0 ? ' ▾' : ' ▴') : ''}</th>`;
    const cross = E.crossovers(allWithEv().map(r => ({ id: r.id, nombre: r.nombre, rows: r.rows.map(x => ({ year: x.year, nw: x.nw })) })));
    const ids = allWithEv().map(r => r.id);
    const fi = Math.max(0, ids.indexOf(state.focus));
    const focusR = allWithEv()[fi];
    const leaders = E.leaders(allWithEv());
    const leadChanges = leaders.filter((l, i) => i === 0 || l.id !== leaders[i - 1].id);

    el.innerHTML = `
      <div class="card">
        <h2>Resumen · ${esc(L.nombre)} · ${esc(cfgName.split(' (')[0])} · escenario ${esc(state.esc)}</h2>
        <div class="kpis">
          <div class="kpi"><div class="l">Mayor patrimonio a 20 años</div><div class="v">${money(best.summary[nwKey])}</div><div class="l">${esc(best.nombre)}</div></div>
          <div class="kpi"><div class="l">Mejor camino de enfermería (sin depender del Match)</div><div class="v">${money(bestN.summary[nwKey])}</div><div class="l">${esc(bestN.nombre)}</div></div>
          <div class="kpi"><div class="l">MD valor esperado (Monte Carlo, n=${R.mc.n})</div><div class="v">${money(R.ev.summary[nwKey])}</div><div class="l">Prob. de llegar a attending: <b>${pct(R.mc.pAttending)}</b></div></div>
          <div class="kpi"><div class="l">Compra más temprana de la vivienda</div><div class="v">${buyers.length ? buyers[0].summary.buyYear : 'Ninguno'}</div><div class="l">${buyers.length ? esc(buyers[0].nombre) : 'ningún camino la compra en 20 años con estos supuestos'}</div></div>
          <div class="kpi"><div class="l">Vivienda pagada más temprano</div><div class="v">${payers.length ? payers[0].summary.payoffYear : '—'}</div><div class="l">${payers.length ? esc(payers[0].nombre) : 'ningún camino la termina de pagar en 20 años'}</div></div>
        </div>
        ${!L.cercaFamilia ? `<p class="note warn">En ${esc(L.nombre)} la vivienda multigeneracional implica que tu mamá y tu tía se muden desde DFW.</p>` : ''}
      </div>
      <div class="card">
        <h2>Comparación de caminos <small class="muted">${dollars} · clic en encabezados para ordenar · clic en una fila para enfocarla</small></h2>
        <div class="tablewrap"><table id="tblSum"><thead><tr>
          ${th('nombre', 'Camino')}${th('nw10', 'Patrimonio año 10')}${th('nw20', 'Patrimonio año 20')}${th('buyYear', 'Compra vivienda')}${th('payoffYear', 'Vivienda pagada')}
          ${th('maxDebt', 'Deuda máx.')}${th('yearsLowIncome', 'Años ingreso bajo')}${th('avgNet', 'Ingreso neto prom.')}${th('attending', 'Attending')}
        </tr></thead><tbody>
          ${rows.map(({ r, s }) => `<tr data-id="${r.id}" class="${r.id === state.focus ? 'focus' : ''}" style="cursor:pointer">
            <td><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</td>
            <td class="num">${money(keyOf({ r, s }, 'nw10'))}</td><td class="num"><b>${money(keyOf({ r, s }, 'nw20'))}</b></td>
            <td class="num" title="${esc(s.buyBlocker ? 'Bloqueo: ' + s.buyBlocker : '')}">${s.buyYear || (r.id === 'md_ev' ? '—' : '<span class="bad">no</span>')}</td>
            <td class="num">${yr(s.payoffYear)}</td><td class="num">${money(s.maxDebt)}</td><td class="num">${s.yearsLowIncome ?? '—'}</td>
            <td class="num">${money(state.real || s.avgNet == null ? s.avgNet : s.avgNet)}</td><td class="num">${s.attending ? dateLbl(s.attending) : '—'}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="muted">“no” = no se compra la vivienda elegida en 20 años (pasa el cursor para ver si falla el enganche o la relación cuota/ingreso). Ingreso bajo = años con ingreso bruto &lt; $30k de 2026. Deuda máx. incluye hipoteca.</p>
      </div>
      <div class="grid2">
        <div class="card">
          <h2>Punto de cruce <select id="selFocus">${pathOptions(state.focus)}</select></h2>
          <p class="muted">Año desde el cual <b>${esc(focusR.nombre)}</b> supera en patrimonio a cada camino (y se mantiene arriba hasta el año 20).</p>
          <div class="tablewrap"><table><tbody>
            ${allWithEv().map((r, j) => j === fi ? '' : `<tr><td><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</td>
              <td class="num">${cross[fi][j] === 'siempre' ? '<span class="good">desde el inicio</span>' : cross[fi][j] ? '<b>' + cross[fi][j] + '</b>' : (cross[j][fi] ? '<span class="bad">nunca</span> <small class="muted">(él te supera ' + (cross[j][fi] === 'siempre' ? 'siempre' : 'desde ' + cross[j][fi]) + ')</small>' : '<span class="warn">se cruzan varias veces</span>')}</td></tr>`).join('')}
          </tbody></table></div>
        </div>
        <div class="card">
          <h2>¿Quién va primero en patrimonio cada año?</h2>
          <div class="tablewrap"><table><thead><tr><th>Desde</th><th>Líder</th><th>Patrimonio</th></tr></thead><tbody>
            ${leadChanges.map(l => `<tr><td>${l.year}</td><td style="text-align:left">${esc(l.nombre)}</td><td class="num">${money(l.value)}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="muted">Los caminos MD empiezan con patrimonio negativo (años sin sueldo, exámenes, residencia) y suelen tomar la delantera unos años después de ser attending, si hay Match.</p>
        </div>
      </div>`;
    $$('#tblSum th.sortable', el).forEach(h => { h.onclick = () => { const k = h.dataset.sort; if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = k === 'nombre' || k === 'buyYear' || k === 'payoffYear' || k === 'maxDebt' || k === 'yearsLowIncome' ? 1 : -1; } renderResumen(el); }; });
    $$('#tblSum tbody tr', el).forEach(tr => { tr.onclick = () => { state.focus = tr.dataset.id; saveState(); renderResumen(el); }; });
    $('#selFocus', el).onchange = (e) => { state.focus = e.target.value; saveState(); renderResumen(el); };
  }

  // ---------- Timeline (Gantt)
  const CAT_LBL = { trabajo: 'Trabajo enfermería/otro', estudioTrabajo: 'Trabajo + estudio', estudio: 'Estudio/examen sin ingreso', travel: 'Travel nurse', residencia: 'Residencia médica', attending: 'Médico attending' };
  function renderTimeline(el) {
    const t0 = R.P.general.anioInicio, t1 = t0 + R.P.general.horizonte;
    const span = t1 - t0;
    const xp = (t) => ((Math.min(t1, Math.max(t0, t)) - t0) / span) * 100;
    const ticks = []; for (let y = t0; y <= t1; y += 2) ticks.push(y);
    const rowsHtml = R.results.filter(r => !state.hidden.includes(r.id)).map(r => {
      const segs = r.path.phases.filter(p => p.cat !== 'extra' && p.to > t0 && p.from < t1).map(p =>
        `<div class="g-seg ${p.cat}" style="left:${xp(p.from)}%;width:${Math.max(0.3, xp(p.to) - xp(p.from))}%" title="${esc(p.lbl)}: ${dateLbl(p.from)} – ${dateLbl(Math.min(p.to, t1))}"></div>`).join('');
      const ms = (r.path.events || []).filter(e => !e.hidden && e.at >= t0 && e.at < t1).map(e =>
        `<button class="g-ms ${e.bad ? 'bad' : e.key ? 'key' : ''}" style="left:${xp(e.at)}%" data-info="${esc(r.nombre + ' — ' + e.lbl + ' (' + dateLbl(e.at) + ')' + (e.cost ? ' · costo ' + money(e.cost) : ''))}" aria-label="${esc(e.lbl)}"></button>`).join('');
      const house = r.summary.buyYear ? `<span class="g-house" style="left:${xp(r.summary.buyYear)}%" title="Compra vivienda">🏠</span>` : '';
      const paid = r.summary.payoffYear ? `<span class="g-house" style="left:${xp(r.summary.payoffYear + 1)}%" title="Vivienda pagada">🔑</span>` : '';
      return `<div class="g-row"><div class="lbl" title="${esc(r.nombre)}"><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</div>
        <div class="g-track">${segs}${ms}${house}${paid}</div></div>`;
    }).join('');
    el.innerHTML = `
      <div class="card">
        <h2>Timeline por camino (Gantt)</h2>
        <div class="gantt">
          <div class="g-axis"><div class="lbl-sp"></div><div class="ticks">${ticks.map(y => `<span style="left:${xp(y)}%">${y}</span>`).join('')}</div></div>
          ${rowsHtml}
        </div>
        <div class="legend">${Object.entries(CAT_LBL).map(([k, l]) => `<span><i style="background:var(--c-${k})"></i>${l}</span>`).join('')}
          <span><i style="background:var(--accent);transform:rotate(45deg);width:9px;height:9px"></i>Hito clave</span><span><i style="background:var(--bad);transform:rotate(45deg);width:9px;height:9px"></i>Revés</span><span>🏠 compra · 🔑 pagada</span></div>
        <div id="gDetail" class="muted">Toca un rombo para ver el hito y su costo.</div>
        <p class="muted">Caminos ocultos en “Gráficos” también se ocultan aquí. Fechas editables en Supuestos → Tiempos / MD.</p>
      </div>
      <div class="card">
        <h2>Conflicto de tiempo: horas por semana <select id="selGantt">${pathOptions(state.ganttPath, false)}</select></h2>
        <div class="chart-box"><canvas id="cHours"></canvas></div>
        <p class="muted">Promedio anual de horas de trabajo + estudio por semana. Más de ~60 h sostenidas es una señal de riesgo de agotamiento y de reprobar. Estudiar para el USMLE mientras haces bedside de 12 h nocturnas es la combinación más dura; el default asume que sigues en case management (horario diurno).</p>
      </div>`;
    $$('.g-ms', el).forEach(b => { b.onclick = () => { $('#gDetail').textContent = b.dataset.info; }; });
    $('#selGantt', el).onchange = (e) => { state.ganttPath = e.target.value; saveState(); renderTimeline(el); };
    const r = R.byId[state.ganttPath] || R.results[0];
    chart('cHours', {
      type: 'bar', data: { labels: r.rows.map(x => x.year), datasets: [
        { label: 'Trabajo', data: r.rows.map(x => Math.round(x.workH)), backgroundColor: cssVar('--c-trabajo') },
        { label: 'Estudio', data: r.rows.map(x => Math.round(x.studyH)), backgroundColor: cssVar('--c-estudioTrabajo') }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: 'h/semana' } } },
        plugins: { legend: { position: 'bottom' } } },
    });
  }

  // ---------- Gráficos
  function chipsHTML() {
    return `<div class="chips" id="chips">${allWithEv().map(r => `<span class="chip ${state.hidden.includes(r.id) ? 'off' : ''}" data-id="${r.id}"><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</span>`).join('')}
      <span class="chip" data-act="all">Mostrar todos</span><span class="chip" data-act="few">Solo principales</span></div>`;
  }
  function bindChips(el, rerender) {
    $$('#chips .chip', el).forEach(c => {
      c.onclick = () => {
        if (c.dataset.act === 'all') state.hidden = [];
        else if (c.dataset.act === 'few') state.hidden = allWithEv().map(r => r.id).filter(id => !['cdi', 'icu', 'icu_travel', 'crna', 'pmhnp', 'md_match1', 'md_ev', 'md_fallo'].includes(id));
        else { const id = c.dataset.id; state.hidden = state.hidden.includes(id) ? state.hidden.filter(x => x !== id) : [...state.hidden, id]; }
        saveState(); rerender();
      };
    });
  }
  function renderGraficos(el) {
    el.innerHTML = `
      <div class="card"><h2>Caminos visibles</h2>${chipsHTML()}<p class="muted">La línea discontinua negra es el valor esperado del camino MD según la simulación Monte Carlo (pondera match, SOAP, reintentos y plan B).</p></div>
      <div class="grid2">
        <div class="card"><h2>Patrimonio neto año por año</h2><div class="chart-box tall"><canvas id="cNw"></canvas></div></div>
        <div class="card"><h2>Ingreso neto anual (después de impuestos)</h2><div class="chart-box tall"><canvas id="cNet"></canvas></div></div>
        <div class="card"><h2>Deuda total (incluye hipoteca)</h2><div class="chart-box tall"><canvas id="cDebt"></canvas></div></div>
        <div class="card"><h2>Flujo de caja acumulado</h2><div class="chart-box tall"><canvas id="cCf"></canvas></div><p class="muted">Suma de lo que sobra (o falta) cada año después de gastos, vivienda, deudas y estudios, antes del gasto discrecional.</p></div>
      </div>`;
    bindChips(el, () => renderGraficos(el));
    const vis = visibleResults(true);
    chart('cNw', lineCfg(dsFor(vis, 'nw')));
    const visNoEv = visibleResults(false);
    chart('cNet', lineCfg(dsFor(visNoEv, 'net')));
    chart('cDebt', lineCfg(dsFor(visNoEv, 'debt')));
    chart('cCf', lineCfg(dsFor(visNoEv, 'cumCF')));
  }

  // ---------- Vivienda
  function renderVivienda(el) {
    const P = R.P, L = P.loc;
    const cfgs = Object.keys(DEF.vivienda.configuracion.opciones);
    const quotes = cfgs.map(c => ({ c, q: E.housingQuote(P, c, 2026) }));
    const matrix = cfgs.map(c => ({ c, res: E.runAll(P, { vivienda: c }) }));
    const curCfg = P.vivienda.configuracion;
    const locs = Object.keys(DEF.ubicaciones);
    const byLoc = locs.map(l => ({ l, res: E.runAll(params({ loc: l })) }));
    const cell = (s) => s.buyYear ? `<b>${s.buyYear}</b> → ${s.payoffYear ? '<span class="good">' + s.payoffYear + '</span>' : '<span class="muted">sin pagar</span>'}` : `<span class="bad" title="${esc(s.buyBlocker || '')}">no viable</span>`;
    el.innerHTML = `
      <div class="card">
        <h2>Costos por configuración · ${esc(L.nombre)} (precios 2026)</h2>
        <div class="tablewrap"><table><thead><tr><th>Configuración</th><th>Precio</th><th>Enganche ${pct(P.vivienda.enganchePct)}</th><th>Cierre</th><th>Hipoteca P&amp;I /mes</th><th>Impuesto /mes</th><th>Seguro /mes</th><th>PMI /mes</th><th>Mantenim. /mes</th><th>Renta recibida /mes</th><th>Costo neto /mes</th><th>Ingreso bruto necesario*</th></tr></thead><tbody>
          ${quotes.map(({ c, q }) => `<tr class="${c === curCfg ? 'focus' : ''}"><td>${esc(DEF.vivienda.configuracion.opciones[c])}${q.adu ? ' <small class="muted">(+ADU ' + money(q.adu) + ' después)</small>' : ''}</td>
            <td class="num">${money(q.price)}</td><td class="num">${money(q.down)}</td><td class="num">${money(q.closing)}</td><td class="num">${money(q.pmt, { full: true })}</td>
            <td class="num">${money(q.tax, { full: true })}</td><td class="num">${money(q.ins, { full: true })}</td><td class="num">${money(q.pmi, { full: true })}</td><td class="num">${money(q.maint, { full: true })}</td>
            <td class="num">${money(q.rentIncome, { full: true })}</td><td class="num"><b>${money(q.totalMonthly, { full: true })}</b></td>
            <td class="num">${money(12 * Math.max(0, q.piti - 0.75 * q.rentIncome) / P.vivienda.dtiMax)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="muted">Tasa ${pct(P.g.mortRate, 2)} a ${P.vivienda.plazoHipoteca} años; seguro ${pct(L.seguroPct, 2)} del valor/año (sube ${pct(P.vivienda.inflacionSeguro)} al año); impuesto predial ${pct(L.impuestoPropPct, 2)}. *Ingreso bruto anual para que la cuota (PITI − 75% de rentas) quede en ${pct(P.vivienda.dtiMax)} del ingreso, sin contar el aporte familiar.</p>
        ${L.estado === 'FL' ? '<p class="note warn">Florida: el seguro (viento/huracán) es el costo que más ha subido; no incluye seguro de inundación, que en zonas costeras de Miami-Dade puede sumar miles al año.</p>' : ''}
        ${L.estado === 'TX' ? '<p class="note">Texas: sin impuesto sobre la renta, pero el predial (~2%) es alto. La exención homestead lo reduce algo en tu unidad, no en la de tu mamá/tía (salvo que ellas sean copropietarias y tengan su propia exención por edad).</p>' : ''}
      </div>
      <div class="card">
        <h2>Año de compra → año de pago total · por camino y configuración (${esc(L.nombre)})</h2>
        <div class="tablewrap"><table><thead><tr><th>Camino</th>${cfgs.map(c => `<th>${esc(DEF.vivienda.configuracion.opciones[c].split(' (')[0])}</th>`).join('')}</tr></thead><tbody>
          ${R.results.map((r, i) => `<tr><td><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</td>${matrix.map(m => `<td class="num">${cell(m.res[i].summary)}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>
        <p class="muted">Regla de compra: ahorro ≥ enganche + cierre + ${R.P.general.reservaMeses} meses de gastos, y (cuota + deudas − 75% de rentas − 75% del aporte familiar) ≤ ${pct(P.vivienda.dtiMax)} del ingreso bruto mensual, sin estar estudiando a tiempo completo. Tras comprar, ${pct(P.vivienda.prepagoPct)} del ahorro anual se usa para prepagar.</p>
        <p class="note">¿Ninguna opción viable en enfermería? Prueba el deslizador <b>“Aporte mensual de mamá/tía”</b>: si ellas pagan, por ejemplo, $1,000–1,500/mes por su unidad (con contrato), el banco puede contar el 75% como ingreso y la vivienda se paga mucho antes.</p>
      </div>
      <div class="card">
        <h2>${esc(DEF.vivienda.configuracion.opciones[curCfg].split(' (')[0])}: compra → pago por ubicación</h2>
        <div class="tablewrap"><table><thead><tr><th>Camino</th>${locs.map(l => `<th>${esc(DEF.ubicaciones[l].nombre)}</th>`).join('')}</tr></thead><tbody>
          ${R.results.map((r, i) => `<tr><td><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</td>${byLoc.map(b => `<td class="num">${cell(b.res[i].summary)}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>
      </div>`;
  }

  // ---------- Ubicaciones
  function renderUbicaciones(el) {
    const locs = Object.keys(DEF.ubicaciones);
    const runs = locs.map(l => { const P = params({ loc: l }); return { l, P, res: E.runAll(P), mc: E.monteCarloMD(P, 300, 99) }; });
    const taxOf = (P) => { const t = E.computeTaxes({ w2: 100000, stipend: 0, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1); return t.state; };
    const cfg = R.P.vivienda.configuracion;
    el.innerHTML = `
      <div class="card">
        <h2>Comparación de ubicaciones</h2>
        <div class="tablewrap"><table><thead><tr><th>Concepto</th>${runs.map(x => `<th>${esc(x.P.loc.nombre)}</th>`).join('')}</tr></thead><tbody>
          <tr><td>Salario RN promedio (2026, est.)</td>${runs.map(x => `<td class="num">${money(101420 * x.P.loc.factorRN)}</td>`).join('')}</tr>
          <tr><td>Tu salario case manager FT</td>${runs.map(x => `<td class="num">${money(E.roleSalary(x.P, 'cm', 2026))}</td>`).join('')}</tr>
          <tr><td>Salario PGY-1 (2026)</td>${runs.map(x => `<td class="num">${money(x.P.loc.residentePGY1)}</td>`).join('')}</tr>
          <tr><td>Hospitalista attending (2026)</td>${runs.map(x => `<td class="num">${money(E.roleSalary(x.P, 'hospitalista', 2026))}</td>`).join('')}</tr>
          <tr><td>Impuesto estatal+local sobre $100k</td>${runs.map(x => `<td class="num">${money(taxOf(x.P), { full: true })}</td>`).join('')}</tr>
          <tr><td>Gastos de vida/año (sin vivienda)</td>${runs.map(x => `<td class="num">${money(x.P.loc.gastosVida)}</td>`).join('')}</tr>
          <tr><td>Renta 1 hab./mes</td>${runs.map(x => `<td class="num">${money(x.P.loc.rentaMensual, { full: true })}</td>`).join('')}</tr>
          <tr><td>Precio ${esc(DEF.vivienda.configuracion.opciones[cfg].split(' (')[0])}</td>${runs.map(x => `<td class="num">${money(x.P.loc.precios[cfg])}</td>`).join('')}</tr>
          <tr><td>Costo neto mensual vivienda (2026)</td>${runs.map(x => `<td class="num">${money(E.housingQuote(x.P, cfg, 2026).totalMonthly, { full: true })}</td>`).join('')}</tr>
          <tr><td>Seguro / predial (% valor)</td>${runs.map(x => `<td class="num">${pct(x.P.loc.seguroPct, 1)} / ${pct(x.P.loc.impuestoPropPct, 1)}</td>`).join('')}</tr>
          <tr><td>Facilidad de match IMG (si te limitas a la región)</td>${runs.map(x => `<td class="num">×${x.P.loc.factorMatch}</td>`).join('')}</tr>
          <tr><td>Cerca de mamá y tía</td>${runs.map(x => `<td class="num">${x.P.loc.cercaFamilia ? '<span class="good">Sí</span>' : 'No'}</td>`).join('')}</tr>
          <tr><td class="wrap">Licencia RN compacta</td>${runs.map(x => `<td class="wrap" style="text-align:left;font-size:12px">${esc(x.P.loc.compacta)}</td>`).join('')}</tr>
          <tr><td class="wrap">Notas</td>${runs.map(x => `<td class="wrap" style="text-align:left;font-size:12px">${esc(x.P.loc.notas)}</td>`).join('')}</tr>
        </tbody></table></div>
      </div>
      <div class="card">
        <h2>Patrimonio a 20 años por camino y ubicación <small class="muted">(compra/pago de ${esc(DEF.vivienda.configuracion.opciones[cfg].split(' (')[0])})</small></h2>
        <div class="tablewrap"><table><thead><tr><th>Camino</th>${runs.map(x => `<th>${esc(x.P.loc.nombre)}</th>`).join('')}</tr></thead><tbody>
          ${R.results.map((r, i) => {
            const vals = runs.map(x => x.res[i].summary[state.real ? 'nw20Real' : 'nw20']);
            const mx = Math.max(...vals);
            return `<tr><td><span class="dot" style="background:${r.color}"></span>${esc(r.nombre)}</td>${runs.map((x, j) => `<td class="num">${vals[j] === mx ? '<b class="good">' + money(vals[j]) + '</b>' : money(vals[j])}<br><small class="muted">🏠 ${yr(x.res[i].summary.buyYear)}</small></td>`).join('')}</tr>`;
          }).join('')}
          <tr><td>B★ · MD valor esperado</td>${runs.map(x => `<td class="num">${money(x.mc.mean[x.mc.mean.length - 1])}</td>`).join('')}</tr>
        </tbody></table></div>
        <p class="muted">En verde, la mejor ubicación para cada camino. El MD valor esperado usa n=300 por ubicación.</p>
      </div>`;
  }

  // ---------- MD Monte Carlo
  function renderMD(el) {
    const mc = R.mc, P = R.P, M = P.md;
    const pM = E.matchProb(P, 0);
    const finals = mc.finals.slice().sort((a, b) => a - b);
    const bins = 20, lo = finals[0], hi = finals[finals.length - 1], w = (hi - lo) / bins || 1;
    const hist = Array(bins).fill(0); finals.forEach(v => { hist[Math.min(bins - 1, Math.floor((v - lo) / w))]++; });
    const attYears = {}; mc.attendYears.forEach(y => { const k = Math.floor(y); attYears[k] = (attYears[k] || 0) + 1; });
    const cmp = ['crna', 'icu', 'cdi', 'pmhnp'].map(id => R.byId[id]);
    const pBeat = (id) => mc.finals.filter(v => v > R.byId[id].summary.nw20).length / mc.n;
    el.innerHTML = `
      <div class="card">
        <h2>Simulación Monte Carlo del camino MD (n=${mc.n})</h2>
        <div class="kpis">
          <div class="kpi"><div class="l">Prob. de llegar a attending</div><div class="v">${pct(mc.pAttending)}</div><div class="l">Plan B (CDI) en ${pct(mc.pFallback)} de los casos</div></div>
          <div class="kpi"><div class="l">Match al primer intento</div><div class="v">${pct(mc.pFirstMatch)}</div><div class="l">Prob. Main Match usada: ${pct(pM)} ${M.abiertoMudarse ? '(abierto a mudarte)' : '(solo tu región)'}</div></div>
          <div class="kpi"><div class="l">Pasó por SOAP / solo preliminar</div><div class="v">${pct(mc.pSoap)} / ${pct(mc.pPrelim)}</div><div class="l">Puestos preliminares no garantizan categórico</div></div>
          <div class="kpi"><div class="l">Año mediano como attending</div><div class="v">${mc.medianAttend ? dateLbl(mc.medianAttend) : '—'}</div><div class="l">entre quienes lo logran</div></div>
          <div class="kpi"><div class="l">Patrimonio año 20: P10 / mediana / P90</div><div class="v">${money(mc.p10[mc.p10.length - 1])} / ${money(mc.p50[mc.p50.length - 1])} / ${money(mc.p90[mc.p90.length - 1])}</div><div class="l">media ${money(mc.mean[mc.mean.length - 1])}</div></div>
          <div class="kpi"><div class="l">Prob. de que el MD supere a…</div><div class="v" style="font-size:14px">${cmp.map(r => esc(r.nombre.split(' · ')[1]) + ': <b>' + pct(pBeat(r.id)) + '</b>').join('<br>')}</div></div>
        </div>
      </div>
      <div class="grid2">
        <div class="card"><h2>Abanico de patrimonio MD vs. enfermería</h2><div class="chart-box tall"><canvas id="cFan"></canvas></div></div>
        <div class="card"><h2>Distribución del patrimonio en el año 20</h2><div class="chart-box tall"><canvas id="cHist"></canvas></div></div>
        <div class="card"><h2>¿En qué año llegas a attending?</h2><div class="chart-box"><canvas id="cAtt"></canvas></div></div>
        <div class="card">
          <h2>Árbol de decisión modelado</h2>
          <ol style="padding-left:18px;margin:0">
            <li>Step 1 (${dateLbl(M.step1Fecha + P.g.retraso)}): aprueba con ${pct(Math.min(0.99, M.probStep1 + (P.S.probExamenes || 0)))}; cada reprobada = +${M.retrasoReprobar} años y × ${M.factorMatchSiReprueba} a la prob. de match. 3 reprobadas → plan B.</li>
            <li>Step 2 CK (+${M.step2Gap} años): ${pct(Math.min(0.99, M.probStep2 + (P.S.probExamenes || 0)))} por intento. Luego OET + Pathway ECFMG y USCE (${Math.round(M.usceDuracion * 12)} meses).</li>
            <li>ERAS en septiembre → Main Match en marzo: <b>${pct(pM)}</b>.</li>
            <li>Si no: SOAP ${pct(M.probSoap)} (de eso ${pct(M.soapCategoricoPct)} categórico, resto preliminar).</li>
            <li>Solo preliminar: 1 año de PGY-1 y reaplicar; categórico después con ${pct(M.probMatchTrasPrelim)}. Si no → plan B.</li>
            <li>Sin puesto: reintento al año siguiente con ${pct(M.probMatchReintento)} (máx. ${M.intentosMax} ciclos) → si no, plan B: CDI aprovechando el MD.</li>
            <li>Residencia ${M.residenciaAnios} años → attending (${M.especialidad === 'fm' ? 'medicina familiar' : 'hospitalista'}) + ${M.locumsTurnosMes} turnos locum/mes vía S-corp.</li>
          </ol>
        </div>
      </div>
      <div class="card">
        <h2>¿Por qué la probabilidad de match es ${pct(M.probMatch)} y no 68%?</h2>
        <p>En el Match 2026, los IMGs no estadounidenses <b>sin necesidad de visa</b> hicieron match en ~67.9% (vs 54.4% con visa; 56.4% global). Tu perfil tiene a favor la ciudadanía/residencia, el inglés/español y años de experiencia clínica en EE. UU. como RN. En contra: ~8–9 años desde la graduación al momento del Match 2029 (muchos programas filtran &gt;5 años), sin práctica médica reciente y sin cartas de médicos estadounidenses todavía. Por eso el default es ${pct(M.probMatch)} con rango razonable 25–60%. Una nota alta en Step 2 CK (≥250), USCE con cartas fuertes y aplicar a 100+ programas IM/FM amigables con IMGs (NY, NJ, MI, OH, PA, rurales) la empujan hacia arriba. Está marcado como <b>estimado</b>.</p>
      </div>
      <div class="card">
        <h2>Vías alternativas de licencia sin residencia en EE. UU.: ¿aplican a ti?</h2>
        <div class="tablewrap"><table class="wraptbl"><thead><tr><th>Estado</th><th style="text-align:left">Requisito clave</th><th style="text-align:left">¿Aplica?</th></tr></thead><tbody>
          <tr><td>Florida (SB 7016 de 2024, cap. 458)</td><td class="wrap" style="text-align:left">Práctica médica activa con licencia en otro país ≥2 de los últimos 4 años (o posgrado aprobado en el último año), ECFMG, oferta de empleo en FL; licencia restringida supervisada.</td><td class="wrap" style="text-align:left"><span class="bad">No hoy.</span> No has ejercido como médico en los últimos años.</td></tr>
          <tr><td>Texas (HB 2038, “DOCTOR Act”, reglas ene-2026)</td><td class="wrap" style="text-align:left">Licencia provisional para médicos con residencia completada fuera de EE. UU., ~5 años de práctica, examen USMLE, oferta de empleo. También “Physician Graduate License” para egresados sin match (detalles aún no confirmados).</td><td class="wrap" style="text-align:left"><span class="bad">No</span> para la provisional. <span class="warn">Vigilar</span> la Physician Graduate License: si exige Step 1+2 y graduación reciente, podría no aplicar por tu año de graduación.</td></tr>
          <tr><td>Tennessee, Virginia, Wisconsin, Idaho, Iowa, Illinois, Louisiana, Massachusetts, N. Carolina, W. Virginia y otros</td><td class="wrap" style="text-align:left">Casi todos exigen residencia/posgrado en el extranjero y/o 3–5 años de práctica reciente, ECFMG y oferta de empleo.</td><td class="wrap" style="text-align:left"><span class="bad">No</span> con tu historial actual.</td></tr>
          <tr><td>Missouri (assistant physician) y similares</td><td class="wrap" style="text-align:left">Steps 1 y 2 aprobados en ventana de años, acuerdo colaborativo con médico; ingreso ~similar a NP y sin vía clara a licencia plena.</td><td class="wrap" style="text-align:left"><span class="warn">Posible</span> tras aprobar los Steps, pero financieramente no supera a NP/CRNA. No se modela como camino aparte.</td></tr>
        </tbody></table></div>
        <p class="muted">Conclusión: ninguna vía alternativa es viable hoy para ti, porque todas buscan médicos con práctica reciente en el extranjero. Por eso no se modela como camino separado. Las leyes cambian rápido: revisa la junta médica de cada estado antes de decidir.</p>
      </div>`;
    const labels = mc.years;
    const ds = [
      { label: 'MD P90', data: mc.p90, borderColor: 'rgba(17,24,39,.25)', backgroundColor: 'rgba(100,116,139,.15)', fill: '+1', borderWidth: 1 },
      { label: 'MD P10', data: mc.p10, borderColor: 'rgba(17,24,39,.25)', borderWidth: 1 },
      { label: 'MD mediana', data: mc.p50, borderColor: '#334155', borderDash: [3, 3] },
      { label: 'MD media', data: mc.mean, borderColor: '#111827', borderDash: [6, 4], borderWidth: 3 },
      ...cmp.map(r => ({ label: r.nombre, data: r.rows.map(x => x.nw), borderColor: r.color })),
    ];
    if (state.real) ds.forEach(d => { d.data = d.data.map((v, k) => v / R.defl(labels[k])); });
    const cfg = lineCfg(ds); cfg.data.labels = labels; cfg.options.plugins.legend = { display: true, position: 'bottom', labels: { boxWidth: 12 } };
    chart('cFan', cfg);
    chart('cHist', { type: 'bar', data: { labels: hist.map((_, i) => money(lo + w * (i + 0.5))), datasets: [{ label: 'Simulaciones', data: hist, backgroundColor: '#64748b' }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 60, autoSkip: true } }, y: { title: { display: true, text: 'n' } } } } });
    const ay = Object.keys(attYears).sort();
    chart('cAtt', { type: 'bar', data: { labels: [...ay, 'Nunca'], datasets: [{ label: '% de simulaciones', data: [...ay.map(k => 100 * attYears[k] / mc.n), 100 * mc.pFallback], backgroundColor: [...ay.map(() => '#10b981'), '#ef4444'] }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.y.toFixed(1) + '%' } } }, scales: { y: { ticks: { callback: v => v + '%' } } } } });
  }

  // ---------- Sensibilidad (tornado)
  function renderSens(el) {
    el.innerHTML = `<div class="card"><h2>Sensibilidad (tornado) <select id="selSens">${pathOptions(state.sensPath)}</select></h2>
      <p class="muted">Cambio en el patrimonio del año 20 al mover cada variable entre un valor desfavorable y uno favorable (todo lo demás constante). Arriba, las que más mueven el resultado.</p>
      <div class="chart-box tall" style="height:520px"><canvas id="cTor"></canvas></div><div id="torNote" class="muted"></div></div>`;
    $('#selSens', el).onchange = (e) => { state.sensPath = e.target.value; saveState(); renderSens(el); };
    const t = E.tornado(R.P, state.sensPath, { mcN: 200 });
    const vars = t.vars.filter(v => v.swing > 1);
    chart('cTor', {
      type: 'bar',
      data: { labels: vars.map(v => v.lbl), datasets: [
        { label: 'Valor desfavorable', data: vars.map(v => [0, v.low - t.base]), backgroundColor: '#ef4444' },
        { label: 'Valor favorable', data: vars.map(v => [0, v.high - t.base]), backgroundColor: '#10b981' }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
        scales: { x: { stacked: false, ticks: { callback: moneyTick }, title: { display: true, text: 'Δ patrimonio año 20 vs base ' + money(t.base) } }, y: { stacked: true, ticks: { autoSkip: false } } },
        plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + money(c.raw[1]) + ' (→ ' + money(t.base + c.raw[1]) + ')' } } } },
    });
    $('#torNote').textContent = 'Base: ' + money(t.base) + '. Variables sin efecto en este camino se omiten.';
  }

  // ---------- Supuestos (todas las variables)
  const GROUPS = [
    ['general', 'General'], ['personal', 'Tu situación actual'], ['impuestos', 'Impuestos'], ['retiro', 'Retiro'], ['prestamos', 'Préstamos y PSLF'],
    ['vivienda', 'Vivienda'], ['configVivienda', 'Configuraciones de vivienda'], ['ubicaciones', 'Ubicaciones'], ['roles', 'Salarios por rol'],
    ['tiempos', 'Tiempos y costos de enfermería'], ['md', 'Camino MD'], ['escenarios', 'Escenarios (ajustes)'],
  ];
  let filterText = '', onlyChanged = false;
  function leafRow(path, node, label) {
    const isLeaf = node && typeof node === 'object' && 'v' in node;
    const v = isLeaf ? node.v : node;
    const u = isLeaf ? node.u : '';
    const changed = Object.prototype.hasOwnProperty.call(state.edits, path);
    let input;
    if (typeof v === 'boolean') input = `<select data-p="${path}" data-k="bool"><option value="1"${v ? ' selected' : ''}>Sí</option><option value="0"${!v ? ' selected' : ''}>No</option></select>`;
    else if (isLeaf && node.opciones) input = `<select data-p="${path}" data-k="opt">${Object.entries(node.opciones).map(([k, l]) => `<option value="${k}"${k === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    else if (Array.isArray(v)) input = `<input type="text" data-p="${path}" data-k="json" value="${esc(JSON.stringify(v))}">`;
    else if (u === '%') input = `<input type="number" data-p="${path}" data-k="pct" step="any" value="${+(v * 100).toFixed(4)}">`;
    else input = `<input type="number" data-p="${path}" data-k="num" step="any" value="${v}">`;
    const f = isLeaf && node.f ? DEF.fuentes[node.f] : null;
    const meta = isLeaf ? `<div class="meta">${u ? '<span class="pill">' + esc(u === '%' ? '% (escribe 7 para 7%)' : u) + '</span>' : ''}
      ${node.c ? '<span class="pill ' + node.c + '">confianza ' + node.c + '</span>' : ''}${node.e ? '<span class="pill est">estimado</span>' : ''}
      ${f ? (f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.t)}</a>` : esc(f.t)) : ''}
      ${node.n ? '<span>· ' + esc(node.n) + '</span>' : ''}${changed ? ' <span class="pill" style="color:var(--accent)">modificado (default ' + esc(fmtUnit(defaultValue(path), u)) + ')</span>' : ''}</div>` : '';
    return `<div class="arow ${changed ? 'changed' : ''}" data-search="${esc((label + ' ' + path + ' ' + (node && node.n || '')).toLowerCase())}"><label for="in-${path}">${esc(label)}</label>${input.replace('data-p=', `id="in-${path}" data-p=`)}${meta}</div>`;
  }
  function groupRows(node, path, labelPrefix = '') {
    let html = '';
    if (node == null || typeof node !== 'object') return html;
    for (const [k, ch] of Object.entries(node)) {
      const p = path + '.' + k;
      if (typeof ch === 'number' || typeof ch === 'boolean') html += leafRow(p, ch, labelPrefix + k);
      else if (ch && typeof ch === 'object' && 'v' in ch) html += leafRow(p, ch, labelPrefix + (ch.l || k));
      else if (ch && typeof ch === 'object' && !Array.isArray(ch)) html += groupRows(ch, p, labelPrefix + (path.startsWith('roles') || path.startsWith('escenarios') || path.startsWith('configVivienda') ? k + ' · ' : ''));
    }
    return html;
  }
  function renderSupuestos(el) {
    const n = Object.keys(state.edits).length;
    el.innerHTML = `<div class="card">
      <h2>Todas las variables <small class="muted">${n} modificada(s)</small></h2>
      <div class="toolbar">
        <input type="text" id="aSearch" placeholder="Buscar variable…" value="${esc(filterText)}" style="flex:1 1 200px">
        <label style="display:flex;align-items:center;gap:4px"><input type="checkbox" id="aOnly" ${onlyChanged ? 'checked' : ''}> Solo modificadas</label>
        <button id="aExport">Exportar supuestos.json</button>
        <label class="chip" style="padding:6px 10px">Importar JSON<input type="file" id="aImport" accept=".json,application/json" hidden></label>
        <button id="aReset">Restablecer</button>
      </div>
      <p class="muted">Los cambios se guardan en este navegador. “Exportar” descarga un <code>supuestos.json</code> completo con tus valores; reemplaza el del repositorio para hacerlos permanentes (y para regenerar el Excel).</p>
      ${GROUPS.map(([k, l]) => {
        let body;
        if (k === 'ubicaciones') {
          body = Object.entries(state.A.ubicaciones).map(([lk, L]) => `<details class="assump-group" style="margin:8px" ${lk === state.loc ? 'open' : ''}><summary>${esc(L.nombre)}${lk === state.loc ? ' (seleccionada)' : ''}</summary>${groupRows(L, 'ubicaciones.' + lk)}</details>`).join('');
        } else body = groupRows(state.A[k], k);
        return `<details class="assump-group" ${filterText || onlyChanged || k === 'personal' ? 'open' : ''}><summary>${l}</summary>${body}</details>`;
      }).join('')}
    </div>`;
    const applyFilter = () => {
      $$('.arow', el).forEach(r => {
        const okT = !filterText || r.dataset.search.includes(filterText.toLowerCase());
        const okC = !onlyChanged || r.classList.contains('changed');
        r.style.display = okT && okC ? '' : 'none';
      });
    };
    applyFilter();
    $('#aSearch', el).oninput = (e) => { filterText = e.target.value; $$('details.assump-group', el).forEach(d => { d.open = true; }); applyFilter(); };
    $('#aOnly', el).onchange = (e) => { onlyChanged = e.target.checked; $$('details.assump-group', el).forEach(d => { d.open = true; }); applyFilter(); };
    $$('[data-p]', el).forEach(inp => {
      inp.onchange = () => {
        const p = inp.dataset.p; let v;
        try {
          switch (inp.dataset.k) {
            case 'bool': v = inp.value === '1'; break;
            case 'opt': v = inp.value; break;
            case 'json': v = JSON.parse(inp.value); break;
            case 'pct': v = parseFloat(inp.value) / 100; break;
            default: v = parseFloat(inp.value);
          }
          if (typeof v === 'number' && !isFinite(v)) throw new Error('número inválido');
        } catch (e) { alert('Valor inválido: ' + e.message); return; }
        edit(p, v);
        if (p === 'vivienda.configuracion') { state.viv = v; $('#selHouse').value = v; }
        const row = inp.closest('.arow'); row.classList.toggle('changed', Object.prototype.hasOwnProperty.call(state.edits, p));
        renderSliders();
      };
    });
    $('#aExport', el).onclick = () => {
      const blob = new Blob([JSON.stringify(state.A, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'supuestos.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#aImport', el).onchange = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const leaves = collectLeaves(DEF);
        state.A = clone(DEF); state.edits = {};
        for (const { path } of leaves) {
          try { const n = getAt(data, path); const v = n && typeof n === 'object' && 'v' in n ? n.v : n; if (v !== undefined && JSON.stringify(v) !== JSON.stringify(defaultValue(path))) { setAt(state.A, path, v); state.edits[path] = v; } } catch (er) { /* ruta ausente */ }
        }
        for (const [sk, sv] of Object.entries(data.escenarios || {})) for (const [k, v] of Object.entries(sv)) { const p = 'escenarios.' + sk + '.' + k; if (typeof v === 'number' && v !== defaultValue(p)) { setAt(state.A, p, v); state.edits[p] = v; } }
        saveState(); renderSliders(); compute(); render();
      } catch (er) { alert('No se pudo importar: ' + er.message); }
    };
    $('#aReset', el).onclick = () => { if (confirm('¿Restablecer todas las variables?')) { resetAll(); } };
  }

  // ---------- Notas
  function renderNotas(el) {
    const S = DEF.escenarios;
    el.innerHTML = `<div class="card">
      <h2>Cómo funciona el modelo</h2>
      <ul>
        <li><b>Simulación anual</b> 2027–2046. Cada camino es una secuencia de etapas con fechas (p. ej. sept-2027 = 2027.67); cada etapa aporta a cada año según la fracción del año que ocupa.</li>
        <li><b>Ingresos</b>: salario base nacional 2026 × factor de la ubicación × aumentos anuales. Tu salario de case manager se calibra con tu tarifa actual ($/h). Travel nurse separa la parte gravable de los stipends libres de impuestos.</li>
        <li><b>Impuestos</b>: brackets federales 2026 (indexados con la inflación), deducción estándar, FICA con tope del Seguro Social y Medicare adicional, impuesto estatal/municipal por ubicación, autoempleo para la LLC/tutoría, y S-corp para locums (salario razonable + distribución, QBI con eliminación para SSTB).</li>
        <li><b>Ahorro</b>: lo que sobra tras gastos de vida, vivienda, deudas y estudios se reparte: ${pct(DEF.general.tasaAhorro.v)} ahorro (Roth → prepago de hipoteca → inversiones) y el resto gasto discrecional. Déficits: primero ahorros, luego préstamos estudiantiles (si estudias; federal hasta el tope de 2026 y el resto privado) o deuda de consumo.</li>
        <li><b>Préstamos</b>: diferidos durante estudios (los intereses se capitalizan). En empleo sin fines de lucro con PSLF activo se paga con RAP (1–10% del AGI) y se condona el saldo federal tras 120 pagos; si no, plan estándar a ${DEF.prestamos.plazoAnios.v} años.</li>
        <li><b>Vivienda</b>: se compra en el primer año en que hay enganche + cierre + reserva y la cuota cabe en el DTI máximo. Antes, pagas renta. Después, se prepaga la hipoteca con parte del ahorro.</li>
        <li><b>Patrimonio neto</b> = efectivo/inversiones + retiro (403b/Roth) + valor de la vivienda − hipoteca − préstamos − deuda de consumo − IRS.</li>
        <li><b>Monte Carlo MD</b>: sortea aprobar/reprobar Steps, Match, SOAP (categórico/preliminar), reintentos y plan B; además ruido en el salario attending (±10%) y en el retorno.</li>
      </ul>
      <h3>Escenarios</h3>
      <div class="tablewrap"><table><thead><tr><th>Ajuste</th><th>Pesimista</th><th>Base</th><th>Optimista</th></tr></thead><tbody>
        ${Object.keys(S.base).map(k => `<tr><td>${k}</td><td class="num">${S.pesimista[k]}</td><td class="num">${S.base[k]}</td><td class="num">${S.optimista[k]}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="muted">salarios y gastos son multiplicadores; retorno, inflación, apreciación, tasaHipoteca, probMatch y probExamenes se suman (puntos); retraso suma años al inicio de Step 1, CRNA y NP. Editables en Supuestos → Escenarios.</p>
      <h3>Limitaciones honestas</h3>
      <ul>
        <li>Muchos números son <b>estimados</b> (marcados en Supuestos y en SUPUESTOS.md): precios de dúplex, gastos de vida, probabilidades de match/SOAP para tu perfil.</li>
        <li>No modela: seguro médico/beneficios distintos por empleador, impuestos sobre ganancias de inversión, cambios de leyes, ingresos de pareja, ni el costo de que tu mamá/tía se muden.</li>
        <li>La residencia puede caer en otra ciudad; el modelo usa el salario de residente de la ubicación elegida.</li>
        <li>No es asesoría financiera, legal ni migratoria. Verifica requisitos de licencias y programas directamente.</li>
      </ul>
    </div>`;
  }

  // ------------------------------------------------------------------ inicio
  loadState();
  initControls();
  renderSliders();
  compute();
  setTab(state.tab);
  window.__app = { state, get R() { return R; }, render, compute };
})();
