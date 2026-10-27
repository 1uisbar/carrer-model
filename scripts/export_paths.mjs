// Exporta las etapas/hitos de cada camino y los resultados del motor (para el Excel y su test de paridad).
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const E = require('../src/engine.cjs');
const A = require('../supuestos.json');

const P = E.buildParams(A, { loc: 'dfw' });
const paths = E.buildPaths(P).map(p => ({ id: p.id, nombre: p.nombre, phases: p.phases, events: p.events }));
const results = {};
for (const loc of Object.keys(A.ubicaciones)) {
  for (const esc of ['base', 'pesimista', 'optimista']) {
    const Q = E.buildParams(A, { loc, escenario: esc });
    results[loc + '|' + esc] = Object.fromEntries(E.runAll(Q).map(r => [r.id, { nw: r.rows.map(x => x.nw), buyYear: r.summary.buyYear, payoffYear: r.summary.payoffYear }]));
  }
}
for (const cfg of ['casaAdu', 'multi', 'inlaw']) {
  const Q = E.buildParams(A, { loc: 'dfw', escenario: 'base', vivienda: cfg });
  results['dfw|base|' + cfg] = Object.fromEntries(E.runAll(Q).map(r => [r.id, { nw: r.rows.map(x => x.nw), buyYear: r.summary.buyYear, payoffYear: r.summary.payoffYear }]));
}
writeFileSync(new URL('../excel/paths_default.json', import.meta.url), JSON.stringify({ paths, results }, null, 1));
console.log('excel/paths_default.json:', paths.length, 'caminos');
