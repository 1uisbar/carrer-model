/*
 * Motor del modelo financiero y de carrera.
 * Funciona en el navegador (window.CareerModel) y en Node (require).
 * Simulación ANUAL (2027 → 2027+horizonte-1). Las etapas tienen fechas decimales
 * (p. ej. 2027.67 = sept-2027) y aportan a cada año según su fracción de traslape.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CareerModel = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const BASE_YEAR = 2026; // año de referencia de todos los montos

  // ---------------------------------------------------------------- utilidades
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const overlap = (a, b, c, d) => Math.max(0, Math.min(b, d) - Math.max(a, c));

  /** Lee .v de cada hoja del árbol de supuestos (deja intactos los objetos sin .v). */
  function values(node) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) return node;
    if (Object.prototype.hasOwnProperty.call(node, 'v')) return node.v;
    const out = {};
    for (const k of Object.keys(node)) out[k] = values(node[k]);
    return out;
  }

  /** Impuesto progresivo. brackets = [[hasta, tasa], ...]; idx escala los umbrales. */
  function progressiveTax(income, brackets, idx = 1) {
    let tax = 0, prev = 0;
    for (const [upTo, rate] of brackets) {
      const top = upTo * idx;
      if (income <= prev) break;
      tax += (Math.min(income, top) - prev) * rate;
      prev = top;
    }
    return tax;
  }

  /** Pago periódico de una anualidad (préstamo amortizable). */
  function annuityPayment(rate, n, pv) {
    if (pv <= 0 || n <= 0) return 0;
    if (Math.abs(rate) < 1e-12) return pv / n;
    return (pv * rate) / (1 - Math.pow(1 + rate, -n));
  }

  /** Simula 12 meses de una hipoteca. Devuelve {balance, interest, principal, paid}. */
  function mortgageYear(balance, annualRate, monthlyPayment) {
    let interest = 0, principal = 0;
    const r = annualRate / 12;
    for (let m = 0; m < 12 && balance > 1e-6; m++) {
      const i = balance * r;
      const p = Math.min(monthlyPayment - i, balance);
      interest += i; principal += p; balance -= p;
    }
    return { balance: Math.max(0, balance), interest, principal, paid: interest + principal };
  }

  /** Tasa RAP (Repayment Assistance Plan, OBBBA 2025) según AGI: 1% por cada $10k, máx 10%. */
  function rapRate(agi) {
    if (agi < 10000) return 0;
    return Math.min(0.10, Math.floor(agi / 10000) / 100);
  }
  function rapPayment(agi, minAnnual) {
    return Math.max(minAnnual, rapRate(agi) * agi);
  }

  /** FICA de empleado sobre salarios W-2 (incluye Medicare adicional). */
  function ficaEmployee(wages, T, idx, otherSeWages = 0) {
    const ss = T.ssTasa * Math.min(wages, T.ssTope * idx);
    const med = T.medicareTasa * wages;
    const addl = T.medicareAdicional * Math.max(0, wages + otherSeWages - T.medicareUmbral);
    return ss + med + addl;
  }

  /** Impuesto de autoempleo (Schedule SE). Devuelve {tax, half}. */
  function seTax(netSe, w2Wages, T, idx) {
    if (netSe <= 0) return { tax: 0, half: 0 };
    const base = netSe * 0.9235;
    const ssRoom = Math.max(0, T.ssTope * idx - w2Wages);
    const ss = 2 * T.ssTasa * Math.min(base, ssRoom);
    const med = 2 * T.medicareTasa * base;
    return { tax: ss + med, half: (ss + med) / 2 };
  }

  /** Impuestos totales de un año. Entradas en dólares nominales. */
  function computeTaxes(inc, P, loc, idx) {
    const T = P.impuestos;
    // S-corp (locums / director médico): salario razonable + distribución.
    let wagesS = 0, dist = 0, employerFicaS = 0, scorpNet = 0;
    if (inc.scorp > 0) {
      scorpNet = Math.max(0, inc.scorp - T.scorpCostoAnual * idx);
      wagesS = scorpNet * T.scorpSalarioPct / (1 + T.ssTasa + T.medicareTasa);
      const ssRoom = Math.max(0, T.ssTope * idx - inc.w2);
      employerFicaS = T.ssTasa * Math.min(wagesS, ssRoom) + T.medicareTasa * wagesS;
      dist = scorpNet - wagesS - employerFicaS;
    }
    const allWages = inc.w2 + wagesS;
    const se = seTax(inc.se, allWages, T, idx);
    const fica = (T.ssTasa * Math.min(allWages, T.ssTope * idx)) + T.medicareTasa * allWages +
      T.medicareAdicional * Math.max(0, allWages + inc.se * 0.9235 - T.medicareUmbral);
    // empleado + parte "empleador" del S-corp pagada por la empresa
    const agi = Math.max(0, inc.w2 - inc.k401 + wagesS + dist + inc.se - se.half);
    const ti0 = Math.max(0, agi - T.deduccionEstandar * idx);
    const qbiIncome = Math.max(0, dist + inc.se - se.half);
    const ratio = clamp(1 - (ti0 - T.qbiUmbral * idx) / (T.qbiRango * idx), 0, 1);
    const qbi = Math.min(0.2 * qbiIncome * ratio, 0.2 * ti0);
    const taxable = Math.max(0, ti0 - qbi);
    const federal = progressiveTax(taxable, T.federalBrackets, idx);
    let state = 0;
    if (loc.impuesto === 'oh') {
      state = T.ohTasa * Math.max(0, agi - T.ohExento * idx) + T.ohMunicipal * allWages;
    } else if (loc.impuesto === 'ny') {
      const nyTi = Math.max(0, agi - T.nyDeduccion * idx);
      state = progressiveTax(nyTi, T.nyBrackets, idx);
      if (loc.nyc) state += progressiveTax(nyTi, T.nycBrackets, idx);
    }
    const personalCash = inc.w2 + inc.stipend + wagesS + dist + inc.se; // antes de impuestos personales
    const total = federal + state + fica + se.tax;
    return { federal, state, fica, seTax: se.tax, employerFicaS, total, agi, taxable, qbi, wagesS, dist, personalCash };
  }

  // ------------------------------------------------------------- parámetros
  /**
   * Convierte el árbol de supuestos + selecciones en parámetros planos.
   * opts: {loc, escenario, vivienda, overrides: {ruta.a.valor: x}}
   */
  function buildParams(A, opts = {}) {
    const raw = values(A);
    const P = JSON.parse(JSON.stringify(raw));
    P.fuentes = undefined;
    P.locId = opts.loc || 'miami';
    P.loc = P.ubicaciones[P.locId];
    P.locs = P.ubicaciones;
    P.escenarioId = opts.escenario || 'base';
    const S = P.escenarios[P.escenarioId];
    P.S = S;
    if (opts.vivienda) P.vivienda.configuracion = opts.vivienda;
    if (opts.llc !== undefined) P.personal.llcActivo = opts.llc;
    // aplica escenario a parámetros globales
    P.g = {
      inf: P.general.inflacion + S.inflacion,
      ret: P.general.retornoInversion + S.retorno,
      cashRet: P.general.retornoEfectivo,
      appr: P.vivienda.apreciacion + S.apreciacion,
      mortRate: Math.max(0.01, P.vivienda.tasaHipoteca + S.tasaHipoteca),
      salMult: S.salarios,
      gastosMult: S.gastos,
      retraso: S.retraso,
    };
    if (opts.overrides) applyOverrides(P, opts.overrides);
    return P;
  }

  function applyOverrides(P, ov) {
    for (const [path, val] of Object.entries(ov)) {
      const keys = path.split('.');
      let o = P;
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
      o[keys[keys.length - 1]] = typeof val === 'function' ? val(o[keys[keys.length - 1]]) : val;
    }
  }

  /** Factor regional por grupo salarial. */
  function regionFactor(P, group) {
    const L = P.loc;
    switch (group) {
      case 'rn': return L.factorRN;
      case 'remoto': return 1 + (L.factorRN - 1) * 0.5;
      case 'crna': return 1 + (L.factorRN - 1) * 0.5;
      case 'md': return L.factorMD;
      default: return 1;
    }
  }

  /** Salario anual de tiempo completo de un rol en el año Y (nominal). */
  function roleSalary(P, role, Y) {
    const t = Y - BASE_YEAR;
    if (role === 'cm') {
      const miamiF = P.locs.miami.factorRN;
      const base = P.personal.tarifaHora * 2080 * (P.loc.factorRN / miamiF);
      return base * Math.pow(1 + P.roles.cm.aumento, t) * P.g.salMult;
    }
    if (role === 'residente') {
      return P.loc.residentePGY1 * Math.pow(1 + P.g.inf + 0.005, t) * P.g.salMult;
    }
    const R = P.roles[role];
    return R.base * regionFactor(P, R.grupo) * Math.pow(1 + R.aumento, t) * P.g.salMult;
  }

  // ------------------------------------------------------------- caminos
  const COLORS = {
    cm_ur: '#64748b', icu: '#2563eb', icu_travel: '#0891b2', cdi: '#7c3aed', manager: '#9333ea',
    educador: '#a855f7', injector: '#db2777', crna: '#dc2626', icu_travel_crna: '#ea580c',
    fnp: '#16a34a', pmhnp: '#059669', md_match1: '#0f172a', md_soap_prelim: '#475569',
    md_reintento: '#78716c', md_fallo: '#a16207',
  };

  function P_(lbl, cat, from, to, extra = {}) {
    return Object.assign({ lbl, cat, from, to, hours: 1, mult: 1, pslf: false, match: false, study: false, wH: 0, sH: 0 }, extra);
  }

  /** Etapa inicial: case manager actual (Mount Sinai, sin fines de lucro, match 403b). */
  function cmPhases(P, until, opts = {}) {
    const out = [];
    const t0 = P.general.anioInicio;
    const B = P.personal.bsnFin;
    const h = opts.hours != null ? opts.hours : P.personal.horasSemana / 40;
    const wH = h * 40;
    const sH = opts.sH || 0;
    const cat = opts.cat || (sH > 0 ? 'estudioTrabajo' : 'trabajo');
    const lbl = opts.lbl || 'Case manager RN';
    if (until <= t0) return out;
    if (B > t0 && B < until) {
      out.push(P_(lbl + ' (cursando BSN)', cat, t0, B, { role: 'cm', hours: h, pslf: true, match: true, wH, sH }));
      out.push(P_(lbl + ' (BSN)', cat, B, until, { role: 'cm', hours: h, mult: 1 + P.personal.bsnAumento, pslf: true, match: true, wH, sH }));
    } else {
      const mult = B <= t0 ? 1 + P.personal.bsnAumento : 1;
      out.push(P_(lbl, cat, t0, until, { role: 'cm', hours: h, mult, pslf: true, match: true, wH, sH }));
    }
    return out;
  }

  function cdiPhases(P, from, end, lbl = 'CDI / clinical liaison') {
    const c = P.tiempos.cdiCertAumento;
    return [
      P_(lbl, 'trabajo', from, from + 2, { role: 'cdi', pslf: true, match: true, wH: 40 }),
      P_(lbl + ' (CCDS)', 'trabajo', from + 2, from + 6, { role: 'cdi', mult: 1 + c, pslf: true, match: true, wH: 40 }),
      P_(lbl + ' (lead/senior)', 'trabajo', from + 6, end, { role: 'cdi', mult: (1 + c) * (1 + c), pslf: true, match: true, wH: 40 }),
    ];
  }

  function icuStart(P) { return P.personal.bsnFin + P.tiempos.bedsideInicioLag; }

  function bsnEvents(P) {
    return [{ lbl: 'Graduación RN-BSN', at: P.personal.bsnFin, cost: 0 },
      { lbl: 'Matrícula restante BSN', at: P.general.anioInicio, cost: P.personal.bsnCostoRestante, hidden: true }];
  }

  function buildNursingPaths(P) {
    const T = P.tiempos;
    const t0 = P.general.anioInicio;
    const END = t0 + P.general.horizonte + 1;
    const B = P.personal.bsnFin;
    const iS = icuStart(P);
    const icuEnd = iS + T.icuAnios;
    const paths = [];
    const icuPh = (from, to) => [
      P_('ICU (programa de transición, años 1-2)', 'trabajo', from, Math.min(to, from + 2), { role: 'icuNuevo', bonus: T.bonoFirmaICU, pslf: true, match: true, wH: 36 }),
    ].concat(to > from + 2 ? [P_('ICU experimentado', 'trabajo', from + 2, to, { role: 'icuExp', pslf: true, match: true, wH: 36 })] : []);

    paths.push({ id: 'cm_ur', nombre: 'A1 · Case mgmt → UR payer-side (remoto)', grupo: 'enf',
      phases: [...cmPhases(P, B + 0.5), P_('Utilization review / payer-side (CVS/Aetna)', 'trabajo', B + 0.5, END, { role: 'ur', match: true, wH: 40 })],
      events: [...bsnEvents(P), { lbl: 'Empieza UR payer-side', at: B + 0.5, cost: 0 }] });

    paths.push({ id: 'icu', nombre: 'A2 · Bedside ICU (residencia RN experimentado)', grupo: 'enf',
      phases: [...cmPhases(P, iS), ...icuPh(iS, END)],
      events: [...bsnEvents(P), { lbl: 'Entra a ICU', at: iS, cost: 0 }] });

    const trEnd = icuEnd + T.travelAnios;
    paths.push({ id: 'icu_travel', nombre: 'A3 · ICU → Travel nurse', grupo: 'enf',
      phases: [...cmPhases(P, iS), ...icuPh(iS, icuEnd),
        P_('Travel nurse ICU', 'travel', icuEnd, trEnd, { role: 'travel', wH: 36 }),
        P_('ICU staff experimentado', 'trabajo', trEnd, END, { role: 'icuExp', pslf: true, match: true, wH: 36 })],
      events: [...bsnEvents(P), { lbl: 'Entra a ICU', at: iS, cost: 0 }, { lbl: 'Primer contrato travel', at: icuEnd, cost: 0 }] });

    paths.push({ id: 'cdi', nombre: 'A4 · CDI / informática (valora tu MD)', grupo: 'enf',
      phases: [...cmPhases(P, B), ...cdiPhases(P, B, END)],
      events: [...bsnEvents(P), { lbl: 'Certificación CCDS', at: B + 2, cost: 1000 }] });

    const chEnd = icuEnd + 1.5;
    paths.push({ id: 'manager', nombre: 'A5 · ICU → charge → nurse manager', grupo: 'enf',
      phases: [...cmPhases(P, iS), ...icuPh(iS, icuEnd),
        P_('Charge nurse + MSN liderazgo', 'estudioTrabajo', icuEnd, chEnd, { role: 'icuExp', mult: 1.08, pslf: true, match: true, tuition: T.msnLiderazgoCosto, wH: 36, sH: 10 }),
        P_('Nurse manager', 'trabajo', chEnd, END, { role: 'manager', pslf: true, match: true, wH: 45 })],
      events: [...bsnEvents(P), { lbl: 'Nurse manager', at: chEnd, cost: 0 }] });

    const edStart = icuEnd + 1;
    paths.push({ id: 'educador', nombre: 'A5b · ICU → educador clínico', grupo: 'enf',
      phases: [...cmPhases(P, iS), ...icuPh(iS, icuEnd),
        P_('ICU + MSN educación', 'estudioTrabajo', icuEnd, edStart, { role: 'icuExp', pslf: true, match: true, tuition: T.msnLiderazgoCosto, wH: 36, sH: 10 }),
        P_('Educador clínico', 'trabajo', edStart, END, { role: 'educador', pslf: true, match: true, wH: 40 })],
      events: [...bsnEvents(P), { lbl: 'Educador clínico', at: edStart, cost: 0 }] });

    const inj = B + 0.25;
    paths.push({ id: 'injector', nombre: 'A6 · Nurse injector / estética', grupo: 'enf',
      phases: [...cmPhases(P, inj),
        P_('Injector (año 1, construyendo clientela)', 'trabajo', inj, inj + 1, { role: 'injector', mult: 0.7, wH: 40 }),
        P_('Injector (año 2)', 'trabajo', inj + 1, inj + 2, { role: 'injector', mult: 0.85, wH: 40 }),
        P_('Injector establecido', 'trabajo', inj + 2, END, { role: 'injector', wH: 40 })],
      events: [...bsnEvents(P), { lbl: 'Curso de inyecciones', at: inj - 0.1, cost: T.injectorCurso }] });

    const crnaPath = (id, nombre, withTravel) => {
      const schoolStart = icuEnd + Math.max(T.crnaLagAplicacion, withTravel ? 1 : 0) + P.g.retraso;
      const schoolEnd = schoolStart + T.crnaDuracion;
      const ph = [...cmPhases(P, iS), ...icuPh(iS, withTravel ? icuEnd : schoolStart)];
      if (withTravel) ph.push(P_('Travel ICU mientras aplicas', 'travel', icuEnd, schoolStart, { role: 'travel', wH: 36 }));
      ph.push(P_('DNP-CRNA (sin trabajar)', 'estudio', schoolStart, schoolEnd, { tuition: T.crnaMatricula, study: true, wH: 0, sH: 60 }));
      ph.push(P_('CRNA', 'trabajo', schoolEnd, END, { role: 'crna', pslf: T.crnaPslf, match: true, wH: 40 }));
      return { id, nombre, grupo: 'enf', phases: ph,
        events: [...bsnEvents(P), { lbl: 'Entra a ICU', at: iS, cost: 0 }, { lbl: 'CCRN + aplicaciones CRNA', at: schoolStart - 0.6, cost: 1500 },
          { lbl: 'Inicia DNP-CRNA', at: schoolStart, cost: 0 }, { lbl: 'Certificación NBCRNA', at: schoolEnd, cost: 1285 }] };
    };
    paths.push(crnaPath('crna', 'A7 · ICU → CRNA', false));
    paths.push(crnaPath('icu_travel_crna', 'A7b · ICU → Travel → CRNA', true));

    const npPath = (id, nombre, role) => {
      const s = Math.max(T.npInicio, B) + P.g.retraso;
      const e = s + T.npDuracion;
      return { id, nombre, grupo: 'enf',
        phases: [...cmPhases(P, s),
          P_('Case manager + MSN-NP part-time', 'estudioTrabajo', s, e, { role: 'cm', hours: T.npHorasTrabajo, mult: 1 + P.personal.bsnAumento, pslf: true, match: true, tuition: T.npMatricula, study: true, wH: T.npHorasTrabajo * 40, sH: 18 }),
          P_(role === 'fnp' ? 'FNP (año 1)' : 'PMHNP (año 1)', 'trabajo', e, e + 1, { role, mult: 0.92, pslf: true, match: true, wH: 40 }),
          P_(role === 'fnp' ? 'FNP' : 'PMHNP', 'trabajo', e + 1, END, { role, pslf: true, match: true, wH: 40 })],
        events: [...bsnEvents(P), { lbl: 'Inicia MSN-NP', at: s, cost: 0 }, { lbl: 'Certificación NP (AANP/ANCC)', at: e, cost: 500 }] };
    };
    paths.push(npPath('fnp', 'A8 · NP familiar (FNP)', 'fnp'));
    paths.push(npPath('pmhnp', 'A8b · NP psiquiátrico (PMHNP)', 'pmhnp'));
    return paths;
  }

  /**
   * Construye las etapas del camino MD según un "resultado":
   * {s1Fails, s2Fails, cycles: ['match'|'soapCat'|'soapPrelim'|'none', ...], salNoise}
   */
  function buildMDPath(P, outcome, meta = {}) {
    const M = P.md;
    const t0 = P.general.anioInicio;
    const END = t0 + P.general.horizonte + 1;
    const d = M.retrasoReprobar;
    const phases = [], events = [...bsnEvents(P)];
    const studyH = M.horasEstudioSemana;
    const hStudy = M.horasTrabajoEstudiando / 40;
    let result = { attending: null, fallback: null, residencyStart: null };
    let tutorFrom = null;

    const S1 = M.step1Fecha + P.g.retraso + Math.min(outcome.s1Fails, 2) * d;
    const ded1 = S1 - M.dedicadoStep1;
    const fallbackFrom = (from, why) => {
      phases.push(...cdiPhases(P, from, END, 'CDI (plan B, tras ' + why + ')'));
      result.fallback = from;
    };
    const workSeg = (from, to, opts) => {
      if (to <= from) return;
      const seg = cmPhases(P, to, opts).map(p => Object.assign(p, { from: Math.max(p.from, from) })).filter(p => p.to > p.from);
      phases.push(...seg);
    };

    workSeg(t0, ded1, { hours: hStudy, sH: studyH, lbl: 'Case manager + estudio USMLE' });
    phases.push(P_('Estudio dedicado Step 1 (sin sueldo)', 'estudio', ded1, S1, { wH: 0, sH: 50 }));
    for (let i = 0; i < Math.min(outcome.s1Fails, 2); i++) events.push({ lbl: 'Step 1 reprobado', at: M.step1Fecha + P.g.retraso + i * d, cost: M.costoStep1, bad: true });
    events.push({ lbl: 'Step 1', at: S1, cost: M.costoStep1 + M.costoPrepUSMLE, key: true });
    if (outcome.s1Fails >= 3) {
      workSeg(S1, S1 + 0.25, {});
      fallbackFrom(S1 + 0.25, 'reprobar Step 1');
      return finishMD();
    }
    const S2 = S1 + M.step2Gap + Math.min(outcome.s2Fails, 2) * d;
    const ded2 = S2 - M.dedicadoStep2;
    workSeg(S1, ded2, { hours: hStudy, sH: studyH, lbl: 'Case manager + estudio Step 2 CK' });
    phases.push(P_('Estudio dedicado Step 2 CK (sin sueldo)', 'estudio', ded2, S2, { wH: 0, sH: 50 }));
    for (let i = 0; i < Math.min(outcome.s2Fails, 2); i++) events.push({ lbl: 'Step 2 CK reprobado', at: S1 + M.step2Gap + i * d, cost: M.costoStep2, bad: true });
    events.push({ lbl: 'Step 2 CK + ECFMG/OET', at: S2, cost: M.costoStep2 + M.costoECFMG, key: true });
    if (outcome.s2Fails >= 3) {
      workSeg(S2, S2 + 0.25, {});
      fallbackFrom(S2 + 0.25, 'reprobar Step 2');
      return finishMD();
    }
    const usceEnd = S2 + M.usceDuracion;
    phases.push(P_('USCE (observership/externship)', 'estudio', S2, usceEnd, { tuition: M.usceCostoMes * 12 * M.usceDuracion, wH: 0, sH: 50 }));
    let Yr = Math.floor(usceEnd);
    if (usceEnd > Yr + 0.70) Yr += 1;
    let cursor = usceEnd;
    tutorFrom = S2;
    let k = 0;
    let cycles = outcome.cycles.slice();
    let resStart = null, prelimDone = false;
    while (k < cycles.length) {
      const eras = Yr + k + 0.70, match = Yr + k + 1.21, july = Yr + k + 1.5;
      events.push({ lbl: 'ERAS' + (k ? ' (reintento)' : ''), at: eras, cost: M.costoERAS + M.costoEntrevistas, key: k === 0 });
      const r = cycles[k];
      if (r === 'match' || r === 'soapCat') {
        if (!prelimDone) workSeg(cursor, july, { lbl: 'Case manager (temporada de entrevistas)' });
        events.push({ lbl: r === 'match' ? 'Match ✔' : 'SOAP categórico ✔', at: match, cost: 0, key: true });
        resStart = july; break;
      }
      if (r === 'soapPrelim') {
        if (!prelimDone) workSeg(cursor, july, { lbl: 'Case manager (temporada de entrevistas)' });
        events.push({ lbl: 'SOAP: solo año preliminar', at: match, cost: 0, bad: true });
        phases.push(P_('Residencia preliminar PGY-1', 'residencia', july, july + 1, { role: 'residente', pslf: M.residentePslf, wH: 70 }));
        events.push({ lbl: 'Mudanza (prelim)', at: july, cost: M.costoMudanza });
        prelimDone = true; cursor = july + 1;
        k++; continue;
      }
      // 'none'
      events.push({ lbl: 'Sin match', at: match, cost: 0, bad: true });
      if (prelimDone) {
        // tras el prelim sin puesto categórico: vuelve a enfermería
        if (k + 1 >= cycles.length) { fallbackFrom(cursor, 'año preliminar sin categórico'); return finishMD(); }
        workSeg(cursor, Yr + k + 2.5, { lbl: 'Case manager (reintento)' }); cursor = Yr + k + 2.5; prelimDone = false;
      } else {
        if (k + 1 >= cycles.length) { workSeg(cursor, match + 0.1, {}); fallbackFrom(match + 0.1, 'no match'); return finishMD(); }
        workSeg(cursor, july, { lbl: 'Case manager (reintento)' }); cursor = july;
      }
      k++;
    }
    if (resStart == null) { fallbackFrom(cursor, 'no match'); return finishMD(); }
    // residencia categórica
    let pgyStart = resStart, pgy = 1;
    if (M.creditoPrelim && prelimDone) { pgy = 2; events.push({ lbl: 'Prelim cuenta como PGY-1', at: resStart, cost: 0 }); }
    if (!(M.creditoPrelim && prelimDone)) events.push({ lbl: 'Mudanza a residencia', at: resStart, cost: M.costoMudanza });
    const years = M.residenciaAnios;
    for (let i = pgy; i <= years; i++) {
      const f = pgyStart + (i - pgy);
      phases.push(P_('Residencia PGY-' + i, 'residencia', f, f + 1, { role: 'residente', mult: Math.pow(1 + P.roles.residente.aumento, i - 1), pslf: M.residentePslf, wH: 70 }));
    }
    const att = pgyStart + (years - pgy + 1);
    result.attending = att; result.residencyStart = resStart;
    events.push({ lbl: 'Step 3 + licencia + boards', at: att - 0.5, cost: M.costoLicencia });
    events.push({ lbl: 'Attending', at: att, cost: 0, key: true });
    const spec = M.especialidad === 'fm' ? 'fm' : 'hospitalista';
    phases.push(P_(spec === 'fm' ? 'Attending medicina familiar' : 'Attending hospitalista', 'attending', att, END,
      { role: spec, mult: outcome.salNoise || 1, bonus: M.bonoFirmaAttending, pslf: M.residentePslf, match: true, wH: 45, attending: true }));
    if (M.locumsTurnosMes > 0) phases.push(P_('Locums vía S-corp', 'extra', att + 1, END, { scorp: 'locums', wH: M.locumsTurnosMes * 12 * 12 / 52 }));
    if (M.directorMedico > 0) phases.push(P_('Medical director', 'extra', att + 2, END, { scorp: 'director', wH: 4 }));
    if (M.tutoria > 0) phases.push(P_('Tutoría médica', 'extra', tutorFrom, att, { se: 'tutoria', wH: 5 }));
    return finishMD();

    function finishMD() {
      if (M.tutoria > 0 && result.attending == null) phases.push(P_('Tutoría médica', 'extra', tutorFrom || S1, END, { se: 'tutoria', wH: 5 }));
      phases.sort((a, b) => a.from - b.from);
      return Object.assign({ grupo: 'md', phases, events, md: result }, meta);
    }
  }

  function buildMDPaths(P) {
    return [
      buildMDPath(P, { s1Fails: 0, s2Fails: 0, cycles: ['match'] }, { id: 'md_match1', nombre: 'B1 · MD: match al primer intento' }),
      buildMDPath(P, { s1Fails: 0, s2Fails: 0, cycles: ['soapPrelim', 'match'] }, { id: 'md_soap_prelim', nombre: 'B2 · MD: SOAP preliminar → categórico' }),
      buildMDPath(P, { s1Fails: 0, s2Fails: 0, cycles: ['none', 'match'] }, { id: 'md_reintento', nombre: 'B3 · MD: no match → match al reintento' }),
      buildMDPath(P, { s1Fails: 0, s2Fails: 0, cycles: Array(Math.max(1, P.md.intentosMax)).fill('none') }, { id: 'md_fallo', nombre: 'B4 · MD: nunca hace match → vuelve a CDI' }),
    ];
  }

  function buildPaths(P) {
    const all = [...buildNursingPaths(P), ...buildMDPaths(P)];
    for (const p of all) p.color = COLORS[p.id] || '#334155';
    return all;
  }

  // ------------------------------------------------------------- simulación
  function housingConfig(P, cfgId) {
    const L = P.loc;
    const cfg = cfgId || P.vivienda.configuracion;
    const price = L.precios[cfg];
    const units = (P.configVivienda[cfg] || {}).unidadesRentadas || 0;
    return { id: cfg, basePrice: price, units, adu: cfg === 'casaAdu' ? L.precios.aduCosto : 0 };
  }

  /** PITI y costos de la vivienda en un año de compra (para tablas). */
  function housingQuote(P, cfgId, Y, opts = {}) {
    const H = P.vivienda, L = P.loc;
    const hc = housingConfig(P, cfgId);
    const t = Y - BASE_YEAR;
    const price = hc.basePrice * Math.pow(1 + P.g.appr, t);
    const downPct = opts.physician ? 0.05 : H.enganchePct;
    const down = price * downPct;
    const loan = price - down;
    const pmt = annuityPayment(P.g.mortRate / 12, H.plazoHipoteca * 12, loan);
    const tax = price * L.impuestoPropPct / 12;
    const ins = hc.basePrice * L.seguroPct * Math.pow(1 + H.inflacionSeguro, t) / 12;
    const pmi = (!opts.physician && downPct < 0.2) ? loan * H.pmiTasa / 12 : 0;
    const maint = price * H.mantenimientoPct / 12;
    const rent = hc.units * L.rentaUnidad * Math.pow(1 + P.g.inf, t) * (1 - H.vacancia);
    return { price, down, closing: price * H.cierrePct, loan, pmt, tax, ins, pmi, maint, rentIncome: rent,
      piti: pmt + tax + ins + pmi, totalMonthly: pmt + tax + ins + pmi + maint - rent * (1 - H.gestionPct), units: hc.units, adu: hc.adu };
  }

  function simulate(P, path, opts = {}) {
    const g = P.g, H = P.vivienda, L = P.loc, Pe = P.personal, Lo = P.prestamos;
    const t0 = P.general.anioInicio, N = P.general.horizonte;
    const hc = housingConfig(P, opts.vivienda);
    const retOverride = opts.retNoise || 0;
    const st = {
      liquid: Pe.liquidoInicial, retire: Pe.retiroInicial, irs: Pe.irsSaldo,
      fed: Pe.deudaEsFederal ? Pe.deudaEstudiantil : 0, fedRate: Pe.tasaDeudaEstudiantil, fedYears: 0, fedAgg: 0,
      priv: Pe.deudaEsFederal ? 0 : Pe.deudaEstudiantil, privRate: Pe.deudaEsFederal ? Lo.tasaPrivada : Pe.tasaDeudaEstudiantil, privYears: 0,
      consumer: 0, blocker: null, pslfMonths: 0, forgiven: 0, forgivenYear: null,
      owned: false, value: 0, mort: 0, mortPmt: 0, origPrice: 0, pmiOn: false, buyYear: null, payoffYear: null,
      adu: 0, aduPmt: 0, aduBuilt: false, cumCF: 0,
    };
    const rows = [];
    const ev = path.events || [];
    const movingCost = P.locId !== 'miami' ? Pe.costoMudanzaInicial : 0;
    for (let i = 0; i < N; i++) {
      const Y = t0 + i, Y1 = Y + 1, t = Y - BASE_YEAR;
      const fI = Math.pow(1 + g.inf, t);
      const r = g.ret + retOverride;
      // ---- ingresos por etapas
      let w2 = 0, w2Match = 0, stipend = 0, scorp = 0, se = 0, tuition = 0, studyFrac = 0, pslfFrac = 0, travelFrac = 0;
      let attending = false, labels = [], workH = 0, studyH = 0;
      for (const ph of path.phases) {
        const ov = overlap(ph.from, ph.to, Y, Y1);
        if (ov <= 0) continue;
        if (ph.cat !== 'extra') labels.push(ph.lbl);
        workH += ov * (ph.wH || 0); studyH += ov * (ph.sH || 0);
        if (ph.role === 'travel') {
          const R = P.roles.travel;
          const gross = R.base * P.tiempos.travelSemanas * Math.pow(1 + R.aumento, t) * g.salMult;
          stipend += ov * gross * P.tiempos.travelStipendPct;
          w2 += ov * gross * (1 - P.tiempos.travelStipendPct);
          travelFrac += ov;
        } else if (ph.role) {
          const sal = roleSalary(P, ph.role, Y) * ph.hours * ph.mult;
          w2 += ov * sal;
          if (ph.match) w2Match += ov * sal;
        }
        if (ph.bonus && ph.from >= Y && ph.from < Y1) w2 += ph.bonus * g.salMult;
        if (ph.tuition) tuition += ph.tuition * fI * ov / (ph.to - ph.from);
        if (ph.study) studyFrac += ov;
        if (ph.pslf) pslfFrac += ov;
        if (ph.attending) attending = true;
        if (ph.scorp === 'locums') {
          const R = P.roles.hospitalista;
          scorp += ov * P.md.locumsTurnosMes * 12 * 12 * P.md.locumsTarifa * Math.pow(1 + R.aumento, t) * g.salMult;
        }
        if (ph.scorp === 'director') scorp += ov * P.md.directorMedico * fI;
        if (ph.se === 'tutoria') se += ov * P.md.tutoria * fI;
      }
      if (Pe.llcActivo) se += Pe.llcNeto * Math.pow(1 + Pe.llcCrecimiento, i);
      let eventCost = 0;
      for (const e of ev) if (e.at >= Y && e.at < Y1) eventCost += (e.cost || 0) * fI;
      if (i === 0) eventCost += movingCost;
      // ---- retiro
      const k401 = Math.min(Pe.aporte403bPct * w2, P.retiro.limite403b * fI);
      const employer = Math.min(Pe.aporte403bPct, Pe.match403bPct) * w2Match;
      // ---- impuestos
      const tx = computeTaxes({ w2, stipend, scorp, se, k401 }, P, L, fI);
      const gross = w2 + stipend + scorp + se;
      const take = tx.personalCash - tx.total - k401; // efectivo neto en mano
      // ---- vivienda: ¿compra al inicio del año?
      const living = L.gastosVida * fI * g.gastosMult;
      if (!st.owned && Y >= H.anioMinCompra && studyFrac < 0.5 && gross > 0) {
        const physician = attending && H.prestamoMedico;
        const q = housingQuote(P, hc.id, Y, { physician });
        const need = q.down + q.closing + (P.general.reservaMeses / 12) * living;
        const incomeM = (w2 + scorp + se + 0.5 * stipend) / 12;
        const famCredit = ['duplex', 'multi', 'dosCasas'].includes(hc.id) ? 0.75 * Pe.aporteFamiliaMensual : 0;
        const otherDebtM = (Math.min(st.irs, Pe.irsPagoMensual * 12) + annuityPayment(st.fedRate, Math.max(1, Lo.plazoAnios - st.fedYears), st.fed) +
          annuityPayment(st.privRate, Math.max(1, Lo.plazoAnios - st.privYears), st.priv)) / 12;
        const housingM = q.piti - 0.75 * q.rentIncome - famCredit + otherDebtM;
        const okCash = st.liquid >= need, okDti = housingM <= H.dtiMax * incomeM;
        if (!okCash || !okDti) st.blocker = !okCash && !okDti ? 'enganche y DTI' : !okCash ? 'enganche' : 'DTI (cuota vs ingreso)';
        if (okCash && okDti) {
          st.liquid -= q.down + q.closing;
          st.owned = true; st.value = q.price; st.mort = q.loan; st.mortPmt = q.pmt; st.origPrice = q.price;
          st.pmiOn = q.pmi > 0; st.buyYear = Y;
        }
      }
      let housing = 0, rentIncome = 0, mortInterest = 0, mortPrincipal = 0, rent = 0;
      if (st.owned) {
        if (hc.adu && !st.aduBuilt && Y >= st.buyYear + H.aduRetrasoAnios) {
          const cost = hc.adu * fI;
          st.adu = cost; st.aduPmt = annuityPayment((g.mortRate + 0.005) / 12, 180, cost);
          st.value += cost; st.aduBuilt = true;
        }
        const m = mortgageYear(st.mort, g.mortRate, st.mortPmt);
        mortInterest = m.interest; mortPrincipal = m.principal;
        st.mort = m.balance;
        let aduPaid = 0;
        if (st.adu > 0) { const a = mortgageYear(st.adu, g.mortRate + 0.005, st.aduPmt); st.adu = a.balance; aduPaid = a.paid; }
        const ins = hc.basePrice * L.seguroPct * Math.pow(1 + H.inflacionSeguro, t) * (st.aduBuilt ? 1 + hc.adu / hc.basePrice : 1);
        const ptax = st.value * L.impuestoPropPct;
        const maint = st.value * H.mantenimientoPct;
        const pmi = st.pmiOn && st.mort > 0.8 * st.origPrice ? (st.origPrice * (1 - H.enganchePct)) * H.pmiTasa : 0;
        if (st.mort <= 0.8 * st.origPrice) st.pmiOn = false;
        rentIncome = hc.units * L.rentaUnidad * 12 * fI * (1 - H.vacancia) * (1 - H.gestionPct);
        housing = m.paid + aduPaid + ins + ptax + maint + pmi;
      } else {
        rent = L.rentaMensual * 12 * fI;
        housing = rent;
      }
      const family = st.owned ? Pe.aporteFamiliaMensual * 12 : 0;
      // ---- deudas
      let irsPay = Math.min(st.irs, Pe.irsPagoMensual * 12); st.irs -= irsPay;
      let fedPay = 0, privPay = 0;
      const inSchool = studyFrac >= 0.5;
      if (st.fed > 0) {
        const interest = st.fed * st.fedRate;
        if (inSchool) st.fed += interest;
        else if (Lo.pslfActivo && pslfFrac >= 0.5) {
          fedPay = Math.min(st.fed + interest, rapPayment(tx.agi, Lo.rapPagoMinimoAnual));
          const principalRed = Math.max(fedPay - interest, Math.min(600, fedPay));
          st.fed = Math.max(0, st.fed - principalRed);
          st.pslfMonths += 12 * Math.min(1, pslfFrac);
          if (st.pslfMonths >= Lo.pslfPagos && st.fed > 0) { st.forgiven += st.fed; st.forgivenYear = Y; st.fed = 0; }
        } else {
          const n = Math.max(1, Lo.plazoAnios - st.fedYears);
          fedPay = annuityPayment(st.fedRate, n, st.fed);
          st.fed = Math.max(0, st.fed * (1 + st.fedRate) - fedPay);
          st.fedYears++;
        }
      }
      if (st.priv > 0) {
        if (inSchool) st.priv *= 1 + st.privRate;
        else {
          const n = Math.max(1, Lo.plazoAnios - st.privYears);
          privPay = annuityPayment(st.privRate, n, st.priv);
          st.priv = Math.max(0, st.priv * (1 + st.privRate) - privPay);
          st.privYears++;
        }
      }
      st.consumer *= 1 + P.general.tasaDeudaConsumo;
      // ---- flujo de caja
      const travelExtra = travelFrac * 12 * P.tiempos.travelGastoExtraMes * fI;
      const outflow = living + travelExtra + housing + irsPay + fedPay + privPay + tuition + eventCost - rentIncome - family;
      const surplus = take - outflow;
      st.cumCF += surplus;
      // Antes de comprar, la parte del ahorro destinada al enganche está en efectivo (HYSA);
      // el resto se invierte. Tras comprar, todo el ahorro líquido se invierte.
      const L0 = st.liquid;
      let liquidRate = r;
      if (!st.owned) {
        const q = housingQuote(P, hc.id, Y, {});
        const target = q.down + q.closing + (P.general.reservaMeses / 12) * living;
        const cashShare = L0 > 0 ? Math.min(1, target / L0) : 1;
        liquidRate = cashShare * g.cashRet + (1 - cashShare) * r;
      }
      let flow = 0, discretionary = 0, roth = 0, prepay = 0, newFed = 0, newPriv = 0, newConsumer = 0;
      if (surplus >= 0) {
        let s = surplus;
        const pc = Math.min(st.consumer, s); st.consumer -= pc; s -= pc;
        discretionary = (1 - P.general.tasaAhorro) * s;
        let inv = s - discretionary;
        roth = Math.min(Pe.rothAnual, inv); inv -= roth;
        if (st.owned && (st.mort > 0 || st.adu > 0)) {
          prepay = Math.min(H.prepagoPct * inv, st.mort + st.adu);
          const toMort = Math.min(prepay, st.mort);
          st.mort -= toMort; st.adu -= prepay - toMort;
          inv -= prepay;
        }
        flow = inv;
      } else {
        let d = -surplus;
        const fromL = Math.min(Math.max(0, L0), d); d -= fromL; flow = -fromL;
        if (d > 0) {
          if (studyFrac > 0) {
            const cap = Math.min(Lo.topeAnualPosgrado * Math.min(1, studyFrac), Math.max(0, Lo.topeTotalPosgrado - st.fedAgg));
            newFed = Math.min(d, cap); d -= newFed;
            if (newFed > 0) {
              st.fedRate = (st.fed * st.fedRate + newFed * Lo.tasaFederalPosgrado) / (st.fed + newFed);
              st.fed += newFed; st.fedAgg += newFed; st.fedYears = 0;
            }
            if (d > 0) { st.privRate = (st.priv * st.privRate + d * Lo.tasaPrivada) / (st.priv + d); st.priv += d; newPriv = d; st.privYears = 0; d = 0; }
          } else { st.consumer += d; newConsumer = d; d = 0; }
        }
      }
      st.liquid = L0 * (1 + liquidRate) + flow * (1 + liquidRate / 2);
      st.retire = st.retire * (1 + r) + (k401 + employer + roth) * (1 + r / 2);
      if (st.owned) st.value *= 1 + g.appr;
      if (st.owned && st.payoffYear == null && st.mort <= 0.5 && st.adu <= 0.5 && (!hc.adu || st.aduBuilt)) st.payoffYear = Y;
      const debt = st.mort + st.adu + st.fed + st.priv + st.consumer + st.irs;
      const studentDebt = st.fed + st.priv;
      const nw = st.liquid + st.retire + st.value - debt;
      const defl = Math.pow(1 + g.inf, Y1 - BASE_YEAR);
      rows.push({
        year: Y, gross, w2, stipend, scorp, se, taxes: tx.total + tx.employerFicaS, federal: tx.federal, state: tx.state, fica: tx.fica + tx.seTax,
        k401, employer, net: tx.personalCash - tx.total, take, living, housing, rent, rentIncome, tuition, eventCost,
        debtPay: irsPay + fedPay + privPay, surplus, discretionary, cumCF: st.cumCF,
        liquid: st.liquid, retire: st.retire, homeValue: st.value, mortgage: st.mort + st.adu, studentDebt, consumer: st.consumer,
        debt, nw, nwReal: nw / defl, owned: st.owned, prepay, newLoans: newFed + newPriv, newConsumer,
        workH, studyH, labels, pslfMonths: st.pslfMonths, agi: tx.agi,
      });
    }
    const last = rows[rows.length - 1];
    const at = (k) => rows[Math.min(rows.length - 1, k - 1)].nw;
    return {
      id: path.id, nombre: path.nombre, color: path.color, grupo: path.grupo, rows,
      summary: {
        nw5: at(5), nw10: at(10), nw20: last.nw, nw20Real: last.nwReal, buyYear: st.buyYear, payoffYear: st.payoffYear,
        buyBlocker: st.owned ? null : (st.blocker || 'sin ingreso'),
        maxDebt: Math.max(...rows.map(x => x.debt)), maxStudentDebt: Math.max(...rows.map(x => x.studentDebt)),
        yearsLowIncome: rows.filter(x => x.gross < 30000 * Math.pow(1 + g.inf, x.year - BASE_YEAR)).length,
        totalTaxes: rows.reduce((s, x) => s + x.taxes, 0), forgiven: st.forgiven, forgivenYear: st.forgivenYear,
        attending: path.md ? path.md.attending : null, fallback: path.md ? path.md.fallback : null,
        avgNet: rows.reduce((s, x) => s + x.net, 0) / rows.length,
      },
    };
  }

  function runAll(P, opts = {}) {
    const paths = buildPaths(P);
    return paths.map(p => Object.assign(simulate(P, p, opts), { path: p }));
  }

  // ------------------------------------------------------------- análisis
  /** Matriz de cruce: m[i][j] = primer año desde el cual i > j hasta el final (o 'siempre'/null). */
  function crossovers(results, key = 'nw') {
    const n = results.length;
    const m = [];
    for (let i = 0; i < n; i++) {
      m.push([]);
      for (let j = 0; j < n; j++) {
        if (i === j) { m[i].push(null); continue; }
        const a = results[i].rows, b = results[j].rows;
        let year = null;
        for (let k = a.length - 1; k >= 0; k--) {
          if (a[k][key] > b[k][key]) year = a[k].year; else break;
        }
        m[i].push(year === a[0].year ? 'siempre' : year);
      }
    }
    return m;
  }

  function leaders(results, key = 'nw') {
    const years = results[0].rows.map(r => r.year);
    return years.map((y, k) => {
      let best = null;
      for (const r of results) if (!best || r.rows[k][key] > best.rows[k][key]) best = r;
      return { year: y, id: best.id, nombre: best.nombre, value: best.rows[k][key] };
    });
  }

  // RNG determinista
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(rng) {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /** Probabilidad efectiva de match en el Main Match. */
  function matchProb(P, fails = 0) {
    const M = P.md;
    let p = M.probMatch + P.S.probMatch;
    if (!M.abiertoMudarse) p = p * P.loc.factorMatch * 0.75;
    p *= Math.pow(M.factorMatchSiReprueba, fails);
    return clamp(p, 0.01, 0.95);
  }

  /** Muestra un resultado aleatorio del camino MD. */
  function sampleMDOutcome(P, rng) {
    const M = P.md;
    const pe = P.S.probExamenes || 0;
    const p1 = clamp(M.probStep1 + pe, 0.05, 0.99), p2 = clamp(M.probStep2 + pe, 0.05, 0.99);
    let s1Fails = 0; while (s1Fails < 3 && rng() > p1) s1Fails++;
    let s2Fails = 0; if (s1Fails < 3) while (s2Fails < 3 && rng() > p2) s2Fails++;
    const fails = Math.min(s1Fails, 3) + Math.min(s2Fails, 3);
    const cycles = [];
    if (s1Fails < 3 && s2Fails < 3) {
      const pM = matchProb(P, fails);
      const soap = () => (rng() < M.probSoap ? (rng() < M.soapCategoricoPct ? 'soapCat' : 'soapPrelim') : 'none');
      let attempts = 0, done = false, afterPrelim = false;
      while (!done && attempts < M.intentosMax + (afterPrelim ? 1 : 0)) {
        let res;
        if (afterPrelim) res = rng() < clamp(M.probMatchTrasPrelim * Math.pow(M.factorMatchSiReprueba, fails), 0, 0.99) ? 'match' : 'none';
        else if (attempts === 0) res = rng() < pM ? 'match' : soap();
        else res = rng() < clamp(M.probMatchReintento * Math.pow(M.factorMatchSiReprueba, fails) + P.S.probMatch, 0.01, 0.95) ? 'match' : soap();
        cycles.push(res);
        attempts++;
        if (res === 'match' || res === 'soapCat') done = true;
        else if (res === 'soapPrelim') afterPrelim = true;
        else if (afterPrelim) done = true; // prelim sin categórico → plan B
      }
    }
    if (!cycles.length) cycles.push('none');
    const salNoise = clamp(1 + 0.1 * normal(rng), 0.7, 1.3);
    return { s1Fails, s2Fails, cycles, salNoise };
  }

  function monteCarloMD(P, n, seed = 12345, opts = {}) {
    const rng = mulberry32(seed);
    const N = P.general.horizonte;
    const nwByYear = Array.from({ length: N }, () => []);
    const finals = [], attendYears = [], buyYears = [];
    let attendCount = 0, fallbackCount = 0, prelimCount = 0, soapCount = 0, firstMatch = 0;
    for (let s = 0; s < n; s++) {
      const out = sampleMDOutcome(P, rng);
      const retNoise = 0.012 * normal(rng);
      const path = buildMDPath(P, out, { id: 'mc', nombre: 'MC' });
      const r = simulate(P, path, { retNoise, vivienda: opts.vivienda });
      r.rows.forEach((row, k) => nwByYear[k].push(row.nw));
      finals.push(r.summary.nw20);
      buyYears.push(r.summary.buyYear);
      if (path.md.attending != null) { attendCount++; attendYears.push(path.md.attending); } else fallbackCount++;
      if (out.cycles[0] === 'match') firstMatch++;
      if (out.cycles.includes('soapPrelim')) prelimCount++;
      if (out.cycles.includes('soapCat') || out.cycles.includes('soapPrelim')) soapCount++;
    }
    const pct = (arr, q) => { const a = arr.slice().sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(q * a.length))]; };
    const years = Array.from({ length: N }, (_, k) => P.general.anioInicio + k);
    return {
      n, years,
      mean: nwByYear.map(a => a.reduce((s, x) => s + x, 0) / a.length),
      p10: nwByYear.map(a => pct(a, 0.10)), p50: nwByYear.map(a => pct(a, 0.5)), p90: nwByYear.map(a => pct(a, 0.9)),
      finals, pAttending: attendCount / n, pFallback: fallbackCount / n, pFirstMatch: firstMatch / n,
      pPrelim: prelimCount / n, pSoap: soapCount / n,
      attendYears, medianAttend: attendYears.length ? pct(attendYears, 0.5) : null,
      buyYears, pBuy: buyYears.filter(x => x != null).length / n,
      medianBuy: buyYears.filter(x => x != null).length ? pct(buyYears.filter(x => x != null), 0.5) : null,
      matchProbEff: matchProb(P, 0),
    };
  }

  /** Variables del tornado: [etiqueta, ruta, bajo, alto] con funciones relativas. */
  const TORNADO_VARS = [
    ['Salarios (todos) ±10%', 'g.salMult', v => v * 0.9, v => v * 1.1],
    ['Retorno inversión ±2 pp', 'g.ret', v => v - 0.02, v => v + 0.02],
    ['Inflación ±1 pp', 'g.inf', v => v + 0.01, v => v - 0.01],
    ['Tasa hipoteca ±1.5 pp', 'g.mortRate', v => v + 0.015, v => v - 0.015],
    ['Apreciación vivienda ±2 pp', 'g.appr', v => v - 0.02, v => v + 0.02],
    ['Precio vivienda ±20%', 'loc.precios', v => scaleObj(v, 1.2), v => scaleObj(v, 0.8)],
    ['Gastos de vida ±15%', 'g.gastosMult', v => v * 1.15, v => v * 0.85],
    ['Tasa de ahorro ±15 pp', 'general.tasaAhorro', v => clamp(v - 0.15, 0, 1), v => clamp(v + 0.15, 0, 1)],
    ['Seguro de vivienda ±50%', 'loc.seguroPct', v => v * 1.5, v => v * 0.5],
    ['% prepago hipoteca ±30 pp', 'vivienda.prepagoPct', v => clamp(v - 0.3, 0, 1), v => clamp(v + 0.3, 0, 1)],
    ['Salario hospitalista/FM ±15%', 'roles', v => scaleRoles(v, ['hospitalista', 'fm'], 0.85), v => scaleRoles(v, ['hospitalista', 'fm'], 1.15)],
    ['Prob. de match ±15 pp', 'md.probMatch', v => clamp(v - 0.15, 0.01, 0.95), v => clamp(v + 0.15, 0.01, 0.95)],
    ['Retraso MD/CRNA +1 año', 'g.retraso', v => v + 1, v => v],
    ['Matrícula CRNA ±40%', 'tiempos.crnaMatricula', v => v * 1.4, v => v * 0.6],
    ['Salario CRNA ±15%', 'roles', v => scaleRoles(v, ['crna'], 0.85), v => scaleRoles(v, ['crna'], 1.15)],
    ['Pago travel ±20%', 'roles', v => scaleRoles(v, ['travel'], 0.8), v => scaleRoles(v, ['travel'], 1.2)],
    ['Turnos locum 0 ↔ 4/mes', 'md.locumsTurnosMes', v => 0, v => 4],
  ];
  function scaleObj(o, f) { const r = {}; for (const k in o) r[k] = o[k] * f; return r; }
  function scaleRoles(R, ids, f) {
    const r = JSON.parse(JSON.stringify(R));
    for (const id of ids) r[id].base *= f;
    return r;
  }

  /** Valor objetivo (patrimonio año final) de un camino; para 'md_ev' usa Monte Carlo. */
  function targetValue(P, pathId, opts = {}) {
    if (pathId === 'md_ev') {
      const mc = monteCarloMD(P, opts.mcN || 300, opts.seed || 777, opts);
      return mc.mean[mc.mean.length - 1];
    }
    const path = buildPaths(P).find(p => p.id === pathId);
    return simulate(P, path, opts).summary.nw20;
  }

  function tornado(P, pathId, opts = {}) {
    const base = targetValue(P, pathId, opts);
    const out = [];
    for (const [lbl, path, lo, hi] of TORNADO_VARS) {
      const mk = (fn) => {
        const Q = JSON.parse(JSON.stringify(P));
        Q.loc = Q.ubicaciones[Q.locId]; Q.locs = Q.ubicaciones;
        applyOverrides(Q, { [path]: fn });
        return targetValue(Q, pathId, opts);
      };
      const vLo = mk(lo), vHi = mk(hi);
      out.push({ lbl, low: vLo, high: vHi, swing: Math.abs(vHi - vLo) });
    }
    out.sort((a, b) => b.swing - a.swing);
    return { base, vars: out };
  }

  return {
    BASE_YEAR, values, progressiveTax, annuityPayment, mortgageYear, rapRate, rapPayment, ficaEmployee, seTax,
    computeTaxes, buildParams, applyOverrides, roleSalary, buildPaths, buildMDPath, simulate, runAll,
    housingQuote, housingConfig, crossovers, leaders, monteCarloMD, sampleMDOutcome, matchProb, tornado, mulberry32,
    TORNADO_VARS, COLORS, overlap,
  };
});
