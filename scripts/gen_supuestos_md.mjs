// Genera SUPUESTOS.md a partir de supuestos.json: cada número con fuente, URL, fecha de consulta y confianza.
import { readFileSync, writeFileSync } from 'node:fs';
const A = JSON.parse(readFileSync(new URL('../supuestos.json', import.meta.url)));
const F = A.fuentes;
const fecha = A._meta.fechaConsulta;
const fmt = (v, u) => {
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  if (Array.isArray(v)) return v.map(([t, r]) => (t >= 1e14 ? '∞' : '$' + t.toLocaleString('en-US')) + ': ' + +(r * 100).toFixed(3) + '%').join('; ');
  if (typeof v === 'string') return v;
  if (u === '%') return +(v * 100).toFixed(3) + '%';
  if (u === '$') return '$' + v.toLocaleString('en-US');
  return v + (u && !['n', 'x', 'opcion'].includes(u) ? ' ' + u : '');
};
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const rows = [];
const GROUPS = { general: 'General', personal: 'Situación personal', impuestos: 'Impuestos', retiro: 'Retiro', prestamos: 'Préstamos y PSLF', vivienda: 'Vivienda', ubicaciones: 'Ubicaciones', roles: 'Salarios por rol', tiempos: 'Tiempos y costos de enfermería', md: 'Camino MD' };
let out = `# SUPUESTOS

Todas las cifras del modelo, generadas automáticamente desde \`supuestos.json\` (archivo único de supuestos) con \`npm run supuestos-md\`.
Fecha de consulta de las fuentes: **${fecha}**. Montos en dólares nominales de 2026 salvo indicación.

**Leyenda de confianza:** **alta** = dato oficial publicado (IRS, BLS, FSMB, NRMP, ED); **media** = fuente secundaria confiable o agregador que cita una fuente oficial; **baja** = estimación con poca evidencia directa.
**⚠️ ESTIMADO** = no encontré el dato publicado exacto para tu caso; es un supuesto razonado (ver nota) y conviene ajustarlo con ofertas/listados reales.

## Datos clave investigados (resumen)

| Tema | Dato | Fuente |
|---|---|---|
| Match 2026, non-US IMGs | 56.4% global; 67.9% sin visa vs 54.4% con visa | [ECFMG](${F.ecfmg2026.url}), [desglose por visa (secundaria)](${F.visa2026.url}) |
| Medicina interna 2026 | 11,632 puestos, 95.2% llenos; non-US IMGs 32.1% de los puestos | [NRMP Results and Data 2026](${F.nrmp2026.url}) |
| Medicina familiar 2026 | 5,491 puestos, 83.6% llenos; 962 non-US IMGs | [NRMP](${F.nrmp2026.url}) |
| Charting Outcomes 2026 | Non-US IMGs: 41.5% hacen match en su especialidad preferida; Pediatría 68.5%; mediana Step 2 CK 248 (match) vs 242 | [NRMP Charting Outcomes](${F.nrmpCO2026.url}) |
| SOAP | IMGs obtuvieron 27.1% (~629) de los puestos SOAP; 146 preliminares de medicina | [AMA](${F.soapAMA.url}) |
| USMLE 2026/27 | Step 1 y Step 2 CK $695 c/u; Step 3 $955 | [FSMB](${F.usmleFees.url}) |
| Aprobación USMLE | IMGs 1ª vez: Step 1 ~72% (2025), Step 2 CK ~68% | [iatrox (secundaria)](${F.usmlePass.url}) |
| ERAS 2027 | 1–30 programas $11 c/u, 31+ $30 c/u por especialidad; transcript USMLE $70 | [AAMC](${F.eras2027.url}) |
| Residente PGY-1 (AAMC 2025) | Nacional $68,166; Sur $65,076; Noreste $74,994; Central $68,580; Oeste $77,649 | [MedSchoolCoach/AAMC](${F.aamcStipend.url}) |
| Internista / FM | Medscape 2026: internistas $307k; FM ~$288k | [Weatherby](${F.medscapeIM.url}), [PoF](${F.medscapeFM.url}) |
| Locums hospitalista | $130–175/h (Barton); postings ~$200/h | [Barton](${F.locums.url}) |
| RN (BLS mayo 2025) | Mediana $97,550; media $101,420 | [BLS OOH](${F.blsRN.url}) |
| CRNA (BLS mayo 2025) | Mediana $236,590 | [Becker's](${F.crnaBLS.url}) |
| NP (BLS mayo 2025) | Mediana $132,300; PMHNP ~$145k | [Becker's](${F.npBLS.url}), [Barton](${F.pmhnp.url}) |
| Travel nurse oct-2026 | ~$2,216/sem promedio (Vivian) | [Dreambound](${F.travel.url}) |
| Impuestos 2026 | Deducción estándar $16,100; brackets 10–37% | [IRS vía Accounting Today](${F.irs2026.url}) |
| Límites 2026 | SS $184,500; 403b $24,500; IRA $7,500 | [Mayer Brown](${F.limites2026.url}) |
| Préstamos posgrado 2026-27 | 8.07%; tope $20,500/año y $100k (posgrado), $50k/$200k (profesional); fin de Grad PLUS | [ED](${F.loans2026.url}), [UVU](${F.loanCaps.url}) |
| PSLF/RAP 2026 | RAP 1–10% del AGI, califica para PSLF (120 pagos) | [Tate Law](${F.pslf2026.url}) |
| Hipoteca | Freddie Mac 30 años 7.32% (22-oct-2026) | [FRED](${F.freddie.url}) |
| Seguro de vivienda 2026 | FL $8,471/año; TX $4,582; nacional $2,872 | [Insurance.com](${F.insurance.url}) |
| Vías alternativas de licencia | FL: práctica activa 2 de los últimos 4 años; TX DOCTOR Act: residencia extranjera + 5 años de práctica + oferta | [FL Statutes](${F.flPath.url}), [Texas Tribune](${F.txDoctor.url}), [Niskanen](${F.statesIMG.url}) |

## Todas las variables
`;
function walk(node, path, title) {
  if (node && typeof node === 'object' && 'v' in node) {
    const f = F[node.f] || {};
    rows.push(`| \`${path}\` | ${esc(node.l)} | ${esc(fmt(node.v, node.u))} | ${f.url ? `[${esc(f.t)}](${f.url})` : esc(f.t || '')} | ${fecha} | ${node.c || ''} | ${node.e ? '⚠️ ESTIMADO' : ''} | ${esc(node.n || '')} |`);
    return;
  }
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [k, ch] of Object.entries(node)) {
      if (typeof ch === 'object') walk(ch, path + '.' + k);
    }
  }
}
for (const [g, t] of Object.entries(GROUPS)) {
  out += `\n### ${t}\n\n| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |\n|---|---|---|---|---|---|---|---|\n`;
  rows.length = 0;
  if (g === 'ubicaciones') {
    for (const [lk, L] of Object.entries(A.ubicaciones)) {
      rows.push(`| **${L.nombre}** | Licencia: ${esc(L.compacta)} | | | | | | ${esc(L.notas)} |`);
      walk(L, 'ubicaciones.' + lk);
    }
  } else walk(A[g], g);
  out += rows.join('\n') + '\n';
}
out += `\n### Escenarios\n\n| Ajuste | Pesimista | Base | Optimista |\n|---|---|---|---|\n`;
for (const k of Object.keys(A.escenarios.base)) out += `| ${k} | ${A.escenarios.pesimista[k]} | ${A.escenarios.base[k]} | ${A.escenarios.optimista[k]} |\n`;
out += `\nsalarios/gastos = multiplicadores; retorno, inflación, apreciación, tasaHipoteca, probMatch, probExamenes = puntos que se suman; retraso = años que se suman al inicio de Step 1, CRNA y NP. Todos ⚠️ ESTIMADOS.\n`;
out += `\n## Fuentes\n\n| Id | Fuente | URL |\n|---|---|---|\n` + Object.entries(F).map(([k, f]) => `| ${k} | ${esc(f.t)} | ${f.url || '—'} |`).join('\n') + '\n';
writeFileSync(new URL('../SUPUESTOS.md', import.meta.url), out);
console.log('SUPUESTOS.md generado');
