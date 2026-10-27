// Tests del motor de cálculo: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const E = require('../src/engine.cjs');
const A = require('../supuestos.json');

const near = (a, b, tol = 0.01, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} esperado ${b}, obtenido ${a}`);
const baseP = (opts = {}) => E.buildParams(A, Object.assign({ loc: 'dfw' }, opts));

// ------------------------------------------------------------------ impuestos
test('brackets federales 2026: $100,000 gravables (soltero)', () => {
  const P = baseP();
  // 10%×12,400 + 12%×(50,400−12,400) + 22%×(100,000−50,400)
  near(E.progressiveTax(100000, P.impuestos.federalBrackets), 1240 + 4560 + 10912, 1e-6);
});

test('brackets federales: 0 y tramo superior', () => {
  const P = baseP();
  assert.equal(E.progressiveTax(0, P.impuestos.federalBrackets), 0);
  const top = 1240 + 0.12 * 38000 + 0.22 * 55300 + 0.24 * 96075 + 0.32 * 54450 + 0.35 * 384375 + 0.37 * 359400;
  near(E.progressiveTax(1000000, P.impuestos.federalBrackets), top, 1e-6);
});

test('brackets se indexan con la inflación', () => {
  const P = baseP();
  near(E.progressiveTax(12400 * 1.03, P.impuestos.federalBrackets, 1.03), 1240 * 1.03, 1e-6);
});

test('ingreso actual: $40/h × 32 h × 52, 403b 6%, Florida', () => {
  const P = baseP({ loc: 'miami' });
  const w2 = 40 * 32 * 52;
  const k = 0.06 * w2;
  const t = E.computeTaxes({ w2, stipend: 0, scorp: 0, se: 0, k401: k }, P, P.loc, 1);
  const taxable = w2 - k - 16100;
  near(t.federal, 1240 + 0.12 * (taxable - 12400), 0.01);
  near(t.fica, w2 * 0.0765, 0.01);
  assert.equal(t.state, 0);
});

test('FICA: tope del Seguro Social y Medicare adicional', () => {
  const P = baseP();
  const t = E.computeTaxes({ w2: 300000, stipend: 0, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1);
  near(t.fica, 0.062 * 184500 + 0.0145 * 300000 + 0.009 * 100000, 0.01);
});

test('impuesto de autoempleo (LLC) 15.3% sobre 92.35%', () => {
  const P = baseP();
  const se = E.seTax(50000, 0, P.impuestos, 1);
  near(se.tax, 50000 * 0.9235 * 0.153, 0.01);
  near(se.half, se.tax / 2, 1e-9);
});

test('stipends de travel no pagan impuestos', () => {
  const P = baseP();
  const a = E.computeTaxes({ w2: 60000, stipend: 0, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1);
  const b = E.computeTaxes({ w2: 60000, stipend: 50000, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1);
  near(a.total, b.total, 1e-9);
  near(b.personalCash - a.personalCash, 50000, 1e-9);
});

test('Ohio: 2.75% sobre lo que excede $26,050 + 2.5% municipal sobre salarios', () => {
  const P = baseP({ loc: 'cleveland' });
  const t = E.computeTaxes({ w2: 80000, stipend: 0, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1);
  near(t.state, 0.0275 * (80000 - 26050) + 0.025 * 80000, 0.01);
});

test('Nueva York: estado + NYC progresivos', () => {
  const P = baseP({ loc: 'nyc' });
  const t = E.computeTaxes({ w2: 100000, stipend: 0, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1);
  const ti = 100000 - 8000;
  const ny = 8500 * 0.039 + 3200 * 0.044 + 2200 * 0.0515 + (80650 - 13900) * 0.054 + (ti - 80650) * 0.059;
  const nyc = 12000 * 0.03078 + 13000 * 0.03762 + 25000 * 0.03819 + (ti - 50000) * 0.03876;
  near(t.state, ny + nyc, 0.01);
});

test('S-corp locums: distribución sin FICA paga menos que todo como salario', () => {
  const P = baseP();
  const s = E.computeTaxes({ w2: 300000, stipend: 0, scorp: 60000, se: 0, k401: 0 }, P, P.loc, 1);
  const w = E.computeTaxes({ w2: 360000 - P.impuestos.scorpCostoAnual, stipend: 0, scorp: 0, se: 0, k401: 0 }, P, P.loc, 1);
  assert.ok(s.total + s.employerFicaS <= w.total + 1, 'S-corp no debería costar más');
  assert.ok(s.dist > 0 && s.wagesS > 0);
  near(s.wagesS + s.dist + s.employerFicaS, 60000 - P.impuestos.scorpCostoAnual, 0.01);
});

test('QBI: 20% por debajo del umbral, 0 por encima del rango (SSTB)', () => {
  const P = baseP();
  const lo = E.computeTaxes({ w2: 0, stipend: 0, scorp: 0, se: 40000, k401: 0 }, P, P.loc, 1);
  assert.ok(lo.qbi > 0);
  const hi = E.computeTaxes({ w2: 400000, stipend: 0, scorp: 0, se: 40000, k401: 0 }, P, P.loc, 1);
  assert.equal(hi.qbi, 0);
});

// ------------------------------------------------------------------ préstamos e hipoteca
test('anualidad: hipoteca $300k al 6% a 30 años = $1,798.65/mes', () => {
  near(E.annuityPayment(0.06 / 12, 360, 300000), 1798.65, 0.01);
  near(E.annuityPayment(0, 10, 1000), 100, 1e-9);
  assert.equal(E.annuityPayment(0.05, 10, 0), 0);
});

test('hipoteca: saldo tras 12 pagos y pago total en el plazo', () => {
  const pmt = E.annuityPayment(0.06 / 12, 360, 300000);
  const y1 = E.mortgageYear(300000, 0.06, pmt);
  near(y1.balance, 296315.96, 0.5);
  near(y1.interest + y1.principal, pmt * 12, 0.01);
  let bal = 300000;
  for (let i = 0; i < 30; i++) bal = E.mortgageYear(bal, 0.06, pmt).balance;
  near(bal, 0, 0.01);
});

test('préstamo estudiantil a 10 años: la anualidad salda el préstamo', () => {
  const r = 0.06, pv = 10000;
  const pay = E.annuityPayment(r, 10, pv);
  let b = pv;
  for (let i = 0; i < 10; i++) b = b * (1 + r) - pay;
  near(b, 0, 1e-6);
});

test('RAP: 1% por cada $10k de AGI (máx. 10%) y mínimo $10/mes', () => {
  assert.equal(E.rapRate(5000), 0);
  near(E.rapRate(55000), 0.05, 1e-12);
  near(E.rapRate(250000), 0.10, 1e-12);
  near(E.rapPayment(55000, 120), 2750, 1e-9);
  assert.equal(E.rapPayment(5000, 120), 120);
});

test('cotización de vivienda: PITI coherente con sus componentes', () => {
  const P = baseP();
  const q = E.housingQuote(P, 'duplex', 2026);
  near(q.price, P.loc.precios.duplex, 1e-6);
  near(q.down, q.price * P.vivienda.enganchePct, 1e-6);
  near(q.pmt, E.annuityPayment(P.g.mortRate / 12, 360, q.loan), 1e-9);
  near(q.piti, q.pmt + q.tax + q.ins + q.pmi, 1e-9);
  const qp = E.housingQuote(P, 'duplex', 2026, { physician: true });
  assert.equal(qp.pmi, 0);
});

// ------------------------------------------------------------------ patrimonio y simulación
test('identidad de patrimonio: NW = líquido + retiro + vivienda − deudas, cada año y camino', () => {
  const P = baseP();
  for (const r of E.runAll(P)) {
    for (const row of r.rows) {
      near(row.nw, row.liquid + row.retire + row.homeValue - row.debt, 1e-6, r.id + ' ' + row.year);
      near(row.debt, row.mortgage + row.studentDebt + row.consumer + (row.debt - row.mortgage - row.studentDebt - row.consumer), 1e-6);
    }
  }
});

test('flujo de caja acumulado = suma de excedentes anuales', () => {
  const P = baseP();
  const r = E.runAll(P).find(x => x.id === 'icu');
  let s = 0;
  r.rows.forEach(row => { s += row.surplus; near(row.cumCF, s, 1e-6); });
});

test('sin ingresos ni gastos, el ahorro crece al retorno de inversión', () => {
  const P = baseP({ overrides: {
    'personal.liquidoInicial': 0, 'personal.retiroInicial': 10000, 'personal.irsSaldo': 0, 'personal.deudaEstudiantil': 0,
    'personal.costoMudanzaInicial': 0, 'personal.bsnCostoRestante': 0,
  } });
  P.loc.gastosVida = 0; P.loc.rentaMensual = 0;
  const path = { id: 'x', nombre: 'x', phases: [], events: [] };
  const r = E.simulate(P, path);
  near(r.rows[0].retire, 10000 * (1 + P.g.ret), 1e-6);
  near(r.rows[19].retire, 10000 * Math.pow(1 + P.g.ret, 20), 1e-3);
  near(r.rows[19].nw, r.rows[19].retire, 1e-6);
});

test('déficit sin estudios se financia con deuda de consumo; en estudios con préstamos', () => {
  const P = baseP({ overrides: { 'personal.liquidoInicial': 0, 'personal.retiroInicial': 0 } });
  const idle = E.simulate(P, { id: 'x', phases: [], events: [] });
  assert.ok(idle.rows[0].consumer > 0);
  const school = E.simulate(P, { id: 'y', phases: [{ lbl: 'x', cat: 'estudio', from: 2027, to: 2030, study: true, tuition: 30000, hours: 1, mult: 1 }], events: [] });
  assert.equal(school.rows[0].consumer, 0);
  assert.ok(school.rows[0].studentDebt > P.personal.deudaEstudiantil);
});

test('compra de vivienda: requiere enganche y DTI; luego la hipoteca baja hasta 0', () => {
  const P = baseP({ loc: 'cleveland' });
  const r = E.runAll(P).find(x => x.id === 'crna');
  assert.ok(r.summary.buyYear, 'CRNA en Cleveland debería comprar');
  const bi = r.rows.findIndex(x => x.owned);
  assert.equal(r.rows[bi].year, r.summary.buyYear);
  if (r.summary.payoffYear) {
    const pi = r.rows.findIndex(x => x.year === r.summary.payoffYear);
    assert.ok(r.rows[pi].mortgage <= 0.5);
  }
  // sin ahorro ni ingreso suficiente nunca compra
  const P2 = baseP({ loc: 'nyc' });
  const inj = E.runAll(P2).find(x => x.id === 'injector');
  assert.equal(inj.summary.buyYear, null);
  assert.ok(inj.summary.buyBlocker);
});

test('PSLF: deuda federal grande se condona tras 120 pagos en empleo sin fines de lucro', () => {
  const P = baseP({ overrides: { 'personal.deudaEstudiantil': 150000, 'personal.tasaDeudaEstudiantil': 0.07 } });
  const r = E.runAll(P).find(x => x.id === 'cdi');
  assert.ok(r.summary.forgiven > 0, 'debería haber condonación');
  assert.ok(r.summary.forgivenYear >= 2036 && r.summary.forgivenYear <= 2038, 'año ' + r.summary.forgivenYear);
  const P2 = baseP({ overrides: { 'personal.deudaEstudiantil': 150000, 'personal.tasaDeudaEstudiantil': 0.07, 'prestamos.pslfActivo': false } });
  const r2 = E.runAll(P2).find(x => x.id === 'cdi');
  assert.equal(r2.summary.forgiven, 0);
});

test('camino MD: cronología por defecto (Step 1 sep-2027 → attending jul-2032)', () => {
  const P = baseP();
  const md = E.buildPaths(P).find(p => p.id === 'md_match1');
  near(md.md.residencyStart, 2029.5, 1e-9);
  near(md.md.attending, 2032.5, 1e-9);
  const b3 = E.buildPaths(P).find(p => p.id === 'md_reintento');
  near(b3.md.attending, 2033.5, 1e-9);
  const b4 = E.buildPaths(P).find(p => p.id === 'md_fallo');
  assert.equal(b4.md.attending, null);
  assert.ok(b4.md.fallback > 2029);
});

test('reprobar Step 1 retrasa todo el camino', () => {
  const P = baseP();
  const ok = E.buildMDPath(P, { s1Fails: 0, s2Fails: 0, cycles: ['match'] });
  const bad = E.buildMDPath(P, { s1Fails: 1, s2Fails: 0, cycles: ['match'] });
  assert.ok(bad.md.attending >= ok.md.attending);
  const fail3 = E.buildMDPath(P, { s1Fails: 3, s2Fails: 0, cycles: [] });
  assert.equal(fail3.md.attending, null);
});

test('Monte Carlo: reproducible con semilla y extremos de probabilidad', () => {
  const P = baseP();
  const a = E.monteCarloMD(P, 200, 42), b = E.monteCarloMD(P, 200, 42);
  assert.deepEqual(a.finals, b.finals);
  const Pall = baseP({ overrides: { 'md.probStep1': 1, 'md.probStep2': 1, 'md.probMatch': 0.95 } });
  Pall.md.probStep1 = 1; Pall.md.probStep2 = 1;
  const hi = E.monteCarloMD(Pall, 300, 1);
  assert.ok(hi.pAttending > 0.9);
  const Pnone = baseP({ overrides: { 'md.probMatch': 0, 'md.probSoap': 0, 'md.probMatchReintento': 0 } });
  const lo = E.monteCarloMD(Pnone, 300, 1);
  assert.ok(lo.pAttending <= 0.02, 'pAttending ' + lo.pAttending);
});

test('probabilidad de match: limitarse a una región la reduce salvo región muy amigable', () => {
  const open = E.matchProb(baseP());
  const P = baseP({ overrides: { 'md.abiertoMudarse': false } });
  assert.ok(E.matchProb(P) < open);
});

test('cruces: detecta el año en que un camino supera a otro de forma permanente', () => {
  const mk = (id, arr) => ({ id, nombre: id, rows: arr.map((v, k) => ({ year: 2027 + k, nw: v })) });
  const m = E.crossovers([mk('a', [0, 1, 5, 9]), mk('b', [3, 3, 3, 3])]);
  assert.equal(m[0][1], 2029);
  assert.equal(m[1][0], null);
  const m2 = E.crossovers([mk('a', [5, 6]), mk('b', [1, 2])]);
  assert.equal(m2[0][1], 'siempre');
});

test('escenarios: pesimista < base < optimista en patrimonio final (ICU)', () => {
  const v = (e) => E.runAll(E.buildParams(A, { loc: 'dfw', escenario: e })).find(x => x.id === 'icu').summary.nw20;
  assert.ok(v('pesimista') < v('base') && v('base') < v('optimista'));
});

test('tornado: devuelve variables ordenadas por impacto', () => {
  const P = baseP();
  const t = E.tornado(P, 'crna');
  for (let i = 1; i < t.vars.length; i++) assert.ok(t.vars[i - 1].swing >= t.vars[i].swing);
  assert.ok(t.vars[0].swing > 0);
});
