// Genera dashboard.html (un solo archivo, funciona offline) a partir de src/ y supuestos.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const safe = (s) => s.replace(/<\/script/gi, '<\\/script');

const parts = {
  '/*__CSS__*/': read('src/styles.css'),
  '/*__CHARTJS__*/': safe(read('node_modules/chart.js/dist/chart.umd.js')),
  '/*__ENGINE__*/': safe(read('src/engine.cjs')),
  '/*__SUPUESTOS__*/': safe(JSON.stringify(JSON.parse(read('supuestos.json')))),
  '/*__UI__*/': safe(read('src/ui.js')),
};
let html = read('src/template.html');
for (const [k, v] of Object.entries(parts)) {
  if (!html.includes(k)) throw new Error('Falta marcador ' + k);
  html = html.split(k).join(v);
}
writeFileSync(join(root, 'dashboard.html'), html);
console.log('dashboard.html generado (' + Math.round(html.length / 1024) + ' KB)');
