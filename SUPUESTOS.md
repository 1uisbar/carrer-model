# SUPUESTOS

Todas las cifras del modelo, generadas automáticamente desde `supuestos.json` (archivo único de supuestos) con `npm run supuestos-md`.
Fecha de consulta de las fuentes: **2026-10-27**. Montos en dólares nominales de 2026 salvo indicación.

**Leyenda de confianza:** **alta** = dato oficial publicado (IRS, BLS, FSMB, NRMP, ED); **media** = fuente secundaria confiable o agregador que cita una fuente oficial; **baja** = estimación con poca evidencia directa.
**⚠️ ESTIMADO** = no encontré el dato publicado exacto para tu caso; es un supuesto razonado (ver nota) y conviene ajustarlo con ofertas/listados reales.

## Datos clave investigados (resumen)

| Tema | Dato | Fuente |
|---|---|---|
| Match 2026, non-US IMGs | 56.4% global; 67.9% sin visa vs 54.4% con visa | [ECFMG](https://www.ecfmg.org/news/?p=5542), [desglose por visa (secundaria)](https://academically.com/blogs/img-match-rate-2026-can-indian-mbbs-doctors-actually-get-us-residency/) |
| Medicina interna 2026 | 11,632 puestos, 95.2% llenos; non-US IMGs 32.1% de los puestos | [NRMP Results and Data 2026](https://www.nrmp.org/wp-content/uploads/2026/05/Main_Match_Results_and_Data-2026.pdf) |
| Medicina familiar 2026 | 5,491 puestos, 83.6% llenos; 962 non-US IMGs | [NRMP](https://www.nrmp.org/wp-content/uploads/2026/05/Main_Match_Results_and_Data-2026.pdf) |
| Charting Outcomes 2026 | Non-US IMGs: 41.5% hacen match en su especialidad preferida; Pediatría 68.5%; mediana Step 2 CK 248 (match) vs 242 | [NRMP Charting Outcomes](https://www.nrmp.org/wp-content/uploads/2026/07/Non-US-IMG_Charting-Outcomes_FINAL.pdf) |
| SOAP | IMGs obtuvieron 27.1% (~629) de los puestos SOAP; 146 preliminares de medicina | [AMA](https://www.ama-assn.org/medical-students/preparing-residency/match-which-specialties-place-most-residents-through-soap) |
| USMLE 2026/27 | Step 1 y Step 2 CK $695 c/u; Step 3 $955 | [FSMB](https://www.fsmb.org/usmle/) |
| Aprobación USMLE | IMGs 1ª vez: Step 1 ~72% (2025), Step 2 CK ~68% | [iatrox (secundaria)](https://www.iatrox.com/blog/usmle-step-1-step-2-ck-pass-rates-difficulty-2026) |
| ERAS 2027 | 1–30 programas $11 c/u, 31+ $30 c/u por especialidad; transcript USMLE $70 | [AAMC](https://students-residents.aamc.org/applying-residencies-eras/publication-chapters/fees-2027-eras-season) |
| Residente PGY-1 (AAMC 2025) | Nacional $68,166; Sur $65,076; Noreste $74,994; Central $68,580; Oeste $77,649 | [MedSchoolCoach/AAMC](https://www.medschoolcoach.com/average-residency-salary) |
| Internista / FM | Medscape 2026: internistas $307k; FM ~$288k | [Weatherby](https://m.weatherbyhealthcare.com/blog/internal-medicine-salary-report), [PoF](https://www.physicianonfire.com/physician-salary-by-specialty/) |
| Locums hospitalista | $130–175/h (Barton); postings ~$200/h | [Barton](https://www.bartonassociates.com/salary-tool/physician/hospitalist/) |
| RN (BLS mayo 2025) | Mediana $97,550; media $101,420 | [BLS OOH](https://www.bls.gov/ooh/healthcare/registered-nurses.htm) |
| CRNA (BLS mayo 2025) | Mediana $236,590 | [Becker's](https://www.beckershospitalreview.com/compensation-issues/crna-median-pay-by-state/) |
| NP (BLS mayo 2025) | Mediana $132,300; PMHNP ~$145k | [Becker's](https://www.beckershospitalreview.com/compensation-issues/np-median-pay-by-state/), [Barton](https://www.bartonassociates.com/np-psychiatry-salary-guide/) |
| Travel nurse oct-2026 | ~$2,216/sem promedio (Vivian) | [Dreambound](https://dreambound.com/blog/travel-nurse-salary) |
| Impuestos 2026 | Deducción estándar $16,100; brackets 10–37% | [IRS vía Accounting Today](https://www.accountingtoday.com/news/irs-announces-inflation-adjustments-for-2026) |
| Límites 2026 | SS $184,500; 403b $24,500; IRA $7,500 | [Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) |
| Préstamos posgrado 2026-27 | 8.07%; tope $20,500/año y $100k (posgrado), $50k/$200k (profesional); fin de Grad PLUS | [ED](https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-04/interest-rates-federal-direct-loans-first-disbursed-between-july-1-2026-and-june-30-2027), [UVU](https://www.uvu.edu/financialaid/aid/graduate_professional_loan_changes_2026.html) |
| PSLF/RAP 2026 | RAP 1–10% del AGI, califica para PSLF (120 pagos) | [Tate Law](https://www.tateesq.com/learn/pslf-changes-2026) |
| Hipoteca | Freddie Mac 30 años 7.32% (22-oct-2026) | [FRED](https://fred.stlouisfed.org/series/MORTGAGE30US) |
| Seguro de vivienda 2026 | FL $8,471/año; TX $4,582; nacional $2,872 | [Insurance.com](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) |
| Vías alternativas de licencia | FL: práctica activa 2 de los últimos 4 años; TX DOCTOR Act: residencia extranjera + 5 años de práctica + oferta | [FL Statutes](https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0400-0499%2F0458%2F0458.html), [Texas Tribune](https://www.texastribune.org/2026/01/09/texas-foreign-doctors-recruiting-law/), [Niskanen](https://www.niskanencenter.org/implementing-new-licening-pathways-that-work-for-international-doctors-and-american-patients/) |

## Todas las variables

### General

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `general.anioInicio` | Primer año simulado | 2027 año | Parámetro de diseño del modelo | 2026-10-27 | alta |  | La simulación es anual de 2027 a 2046 (20 años). Saldo inicial = situación a oct-2026. |
| `general.horizonte` | Horizonte | 20 años | Parámetro de diseño del modelo | 2026-10-27 | alta |  |  |
| `general.edad` | Edad actual | 30 años | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  |  |
| `general.inflacion` | Inflación anual (gastos, brackets) | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | Supuesto de largo plazo; la Fed apunta a 2%, se usa 3% por prudencia. |
| `general.retornoInversion` | Retorno nominal de inversiones (403b/Roth/brokerage) | 7% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | Cartera mayormente en acciones; histórico S&P 500 ~10% nominal, se usa 7% conservador. |
| `general.retornoEfectivo` | Retorno de efectivo/HYSA (ahorro para enganche) | 3.5% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `general.tasaAhorro` | Tasa de ahorro del excedente (resto = gasto discrecional) | 75% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | De lo que sobra tras gastos básicos, vivienda, deudas y estudios, este % se ahorra/invierte. |
| `general.reservaMeses` | Fondo de emergencia exigido antes de comprar vivienda | 3 meses | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `general.tasaDeudaConsumo` | Tasa de deuda de consumo si hay déficit fuera de estudios | 12% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |

### Situación personal

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `personal.tarifaHora` | Tarifa actual Mount Sinai | 40 $/h | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  | Dato del usuario. |
| `personal.horasSemana` | Horas/semana actuales (~4 días) | 32 h | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  | Ingreso actual ≈ 40 × 32 × 52 = $66,560/año. |
| `personal.liquidoInicial` | Ahorro líquido inicial (HYSA + brokerage) | $8,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | Total declarado ~$13,000; el reparto líquido/retiro es estimado. |
| `personal.retiroInicial` | Retiro inicial (Roth IRA + 403b) | $5,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `personal.irsSaldo` | Plan de pagos IRS restante | $1,350 | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  |  |
| `personal.irsPagoMensual` | Pago mensual IRS | $150 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `personal.deudaEstudiantil` | Deuda estudiantil actual | $10,000 | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  |  |
| `personal.tasaDeudaEstudiantil` | Tasa deuda estudiantil actual | 6% | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | media |  |  |
| `personal.deudaEsFederal` | La deuda actual es federal (elegible PSLF/RAP) | Sí | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `personal.aporte403bPct` | Aporte propio al 403b/401k (% del salario W-2) | 6% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `personal.match403bPct` | Match del empleador (desde ene-2027) | 4% | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  | Dato del usuario para Mount Sinai; se aplica a empleos hospitalarios con match. |
| `personal.rothAnual` | Aporte anual a Roth IRA (si hay excedente) | $3,000 | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | media |  | Límite IRA 2026 = $7,500. Con ingresos altos se asume backdoor Roth. |
| `personal.bsnFin` | Graduación RN-BSN (South University) | 2027.5 año | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | media |  | Default: mediados de 2027. |
| `personal.bsnCostoRestante` | Matrícula restante del RN-BSN | $6,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `personal.bsnAumento` | Aumento salarial por BSN (case mgmt) | 4% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `personal.llcActivo` | Overlay: ingreso lateral Angelmar Group LLC | No | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | media |  |  |
| `personal.llcNeto` | Ganancia neta anual Angelmar LLC | $12,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO | Sujeta a impuesto de autoempleo (15.3%) e impuesto sobre la renta. |
| `personal.llcCrecimiento` | Crecimiento anual LLC | 5% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `personal.aporteFamiliaMensual` | Aporte mensual de mamá/tía a la vivienda | $0 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO | Si ellas aportan (p. ej. lo que hoy pagan de renta), acelera el pago. |
| `personal.costoMudanzaInicial` | Mudanza inicial si la ubicación no es Miami | $5,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |

### Impuestos

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `impuestos.federalBrackets` | Brackets federales 2026 (soltero) [hasta, tasa] | $12,400: 10%; $50,400: 12%; $105,700: 22%; $201,775: 24%; $256,225: 32%; $640,600: 35%; ∞: 37% | [IRS Rev. Proc. 2025-32 (brackets y deducción estándar 2026) vía Accounting Today](https://www.accountingtoday.com/news/irs-announces-inflation-adjustments-for-2026) | 2026-10-27 | alta |  | Se indexan con la inflación del modelo cada año. |
| `impuestos.deduccionEstandar` | Deducción estándar 2026 (soltero) | $16,100 | [IRS Rev. Proc. 2025-32 (brackets y deducción estándar 2026) vía Accounting Today](https://www.accountingtoday.com/news/irs-announces-inflation-adjustments-for-2026) | 2026-10-27 | alta |  |  |
| `impuestos.ssTasa` | Seguro Social (empleado) | 6.2% | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | alta |  |  |
| `impuestos.ssTope` | Tope salarial Seguro Social 2026 | $184,500 | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | alta |  |  |
| `impuestos.medicareTasa` | Medicare (empleado) | 1.45% | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | alta |  |  |
| `impuestos.medicareAdicional` | Medicare adicional (> $200k) | 0.9% | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | alta |  |  |
| `impuestos.medicareUmbral` | Umbral Medicare adicional (no indexado) | $200,000 | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | alta |  |  |
| `impuestos.qbiUmbral` | Umbral QBI (SSTB) soltero 2026 | $201,750 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | Médicos/enfermeros son 'SSTB': la deducción 20% QBI se elimina por encima del umbral + rango. |
| `impuestos.qbiRango` | Rango de eliminación QBI (OBBBA) | $75,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `impuestos.scorpSalarioPct` | S-corp locums: % pagado como salario razonable | 50% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | El resto es distribución sin FICA. El IRS exige salario 'razonable'. |
| `impuestos.scorpCostoAnual` | Costo anual S-corp (contador, nómina, franchise) | $3,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `impuestos.nyBrackets` | Brackets estado de NY (soltero, aprox. 2026) | $8,500: 3.9%; $11,700: 4.4%; $13,900: 5.15%; $80,650: 5.4%; $215,400: 5.9%; $1,077,550: 6.85%; $5,000,000: 9.65%; $25,000,000: 10.3%; ∞: 10.9% | [NY State/NYC tasas (aprox. 2026, verificar en tax.ny.gov)](https://www.countrytaxcalc.com/tax-guides/compare/new-york-vs-ohio/) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `impuestos.nyDeduccion` | Deducción estándar NY | $8,000 | [NY State/NYC tasas (aprox. 2026, verificar en tax.ny.gov)](https://www.countrytaxcalc.com/tax-guides/compare/new-york-vs-ohio/) | 2026-10-27 | media |  |  |
| `impuestos.nycBrackets` | Impuesto municipal NYC | $12,000: 3.078%; $25,000: 3.762%; $50,000: 3.819%; ∞: 3.876% | [NY State/NYC tasas (aprox. 2026, verificar en tax.ny.gov)](https://www.countrytaxcalc.com/tax-guides/compare/new-york-vs-ohio/) | 2026-10-27 | media |  |  |
| `impuestos.ohTasa` | Ohio tasa plana 2026 | 2.75% | [EY Tax News – Ohio tasa plana 2.75% desde 2026](https://taxnews.ey.com/news/2025-1744) | 2026-10-27 | alta |  |  |
| `impuestos.ohExento` | Ohio: ingreso exento | $26,050 | [EY Tax News – Ohio tasa plana 2.75% desde 2026](https://taxnews.ey.com/news/2025-1744) | 2026-10-27 | alta |  |  |
| `impuestos.ohMunicipal` | Impuesto municipal Cleveland (sobre salarios) | 2.5% | [EY Tax News – Ohio tasa plana 2.75% desde 2026](https://taxnews.ey.com/news/2025-1744) | 2026-10-27 | media |  |  |

### Retiro

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `retiro.limite403b` | Límite aporte 403b/401k 2026 | $24,500 | [Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown](https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments) | 2026-10-27 | alta |  |  |

### Préstamos y PSLF

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `prestamos.tasaFederalPosgrado` | Tasa federal posgrado 2026-27 | 8.07% | [ED – tasa Direct Unsubsidized posgrado 2026-27: 8.07%](https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-04/interest-rates-federal-direct-loans-first-disbursed-between-july-1-2026-and-june-30-2027) | 2026-10-27 | alta |  |  |
| `prestamos.tasaPrivada` | Tasa préstamo privado (excedente sobre tope federal) | 9.5% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `prestamos.topeAnualPosgrado` | Tope federal anual – posgrado (NP/CRNA) | $20,500 | [Límites préstamos desde 1-jul-2026: posgrado $20,500/año ($100k total); profesional $50k/año ($200k)](https://www.uvu.edu/financialaid/aid/graduate_professional_loan_changes_2026.html) | 2026-10-27 | alta |  | Grad PLUS eliminado para nuevos estudiantes desde 1-jul-2026. No está claro si el DNP-CRNA se clasificará como 'profesional' ($50k/año). |
| `prestamos.topeTotalPosgrado` | Tope federal acumulado – posgrado | $100,000 | [Límites préstamos desde 1-jul-2026: posgrado $20,500/año ($100k total); profesional $50k/año ($200k)](https://www.uvu.edu/financialaid/aid/graduate_professional_loan_changes_2026.html) | 2026-10-27 | alta |  |  |
| `prestamos.plazoAnios` | Plazo de repago estándar | 10 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  |  |
| `prestamos.pslfActivo` | Usar PSLF cuando el empleo es sin fines de lucro | Sí | [Cambios PSLF/RAP 2026 (OBBBA): RAP califica para PSLF, 1–10% del AGI](https://www.tateesq.com/learn/pslf-changes-2026) | 2026-10-27 | media |  |  |
| `prestamos.pslfPagos` | Pagos calificados requeridos para PSLF | 120 meses | [Cambios PSLF/RAP 2026 (OBBBA): RAP califica para PSLF, 1–10% del AGI](https://www.tateesq.com/learn/pslf-changes-2026) | 2026-10-27 | alta |  |  |
| `prestamos.rapPagoMinimoAnual` | Pago mínimo RAP ($10/mes) | $120 | [Cambios PSLF/RAP 2026 (OBBBA): RAP califica para PSLF, 1–10% del AGI](https://www.tateesq.com/learn/pslf-changes-2026) | 2026-10-27 | alta |  |  |

### Vivienda

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `vivienda.configuracion` | Configuración de vivienda | duplex | Parámetro de diseño del modelo | 2026-10-27 | alta |  |  |
| `vivienda.tasaHipoteca` | Tasa hipotecaria 30 años | 7% | [Freddie Mac PMMS – 30 años 7.32% (22-oct-2026)](https://fred.stlouisfed.org/series/MORTGAGE30US) | 2026-10-27 | media |  | Freddie Mac: 7.32% el 22-oct-2026; se usa 7.0% suponiendo leve baja. |
| `vivienda.plazoHipoteca` | Plazo hipoteca | 30 años | Parámetro de diseño del modelo | 2026-10-27 | alta |  |  |
| `vivienda.enganchePct` | Enganche | 10% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  | FHA permite 3.5% y Fannie Mae 5% en 2-4 unidades ocupadas por el dueño; 10% por defecto. |
| `vivienda.cierrePct` | Costos de cierre | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `vivienda.pmiTasa` | PMI anual si enganche < 20% | 0.6% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `vivienda.mantenimientoPct` | Mantenimiento anual (% del valor) | 1% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `vivienda.apreciacion` | Apreciación anual de vivienda | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `vivienda.inflacionSeguro` | Aumento anual del seguro de vivienda | 5% | [Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) | 2026-10-27 | media | ⚠️ ESTIMADO | TX +8.7% y FL +6.8% en 2026 según Insurance.com. |
| `vivienda.dtiMax` | Máximo (costo de vivienda + deudas) / ingreso bruto mensual | 43% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | Regla típica de aprobación: 43% de DTI total (FHA/Fannie con AUS puede llegar a ~45-50%). El aporte de mamá/tía cuenta al 75% si hay unidad separada con contrato. |
| `vivienda.prepagoPct` | % del ahorro anual destinado a prepagar hipoteca | 60% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  | Meta: vivienda pagada lo antes posible. |
| `vivienda.anioMinCompra` | Año más temprano de compra | 2027 año | Parámetro de diseño del modelo | 2026-10-27 | media |  |  |
| `vivienda.vacancia` | Vacancia en unidades rentadas | 8% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `vivienda.gestionPct` | Gestión/reparaciones de unidades rentadas (% renta) | 8% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `vivienda.aduRetrasoAnios` | Casa+ADU: años tras compra para construir ADU | 3 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `vivienda.prestamoMedico` | Usar 'physician loan' (5% enganche, sin PMI) al ser attending | Sí | Parámetro de diseño del modelo | 2026-10-27 | media |  |  |

### Ubicaciones

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| **Miami / Sur de Florida** | Licencia: Válida: FL es estado NLC. Ojo: viviendo en FL tu licencia multiestado debería ser de FL (estado de residencia primaria), no la de TX. | | | | | | Seguros muy caros; dúplex escasos y caros; mamá y tía tendrían que mudarse desde DFW. |
| `ubicaciones.miami.factorRN` | Factor salarial RN vs nacional | 0.937 | [RN Miami-Fort Lauderdale (BLS OEWS 2025 vía Hyring: media $94,990)](https://hyring.com/jobseeker-toolkit/salary/registered-nurse-salary-in-miami) | 2026-10-27 | media |  |  |
| `ubicaciones.miami.factorMD` | Factor salarial médico vs nacional | 0.97 | [Doximity Physician Compensation Report 2026](https://www.doximity.com/reports/physician-compensation-report/2026) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.residentePGY1` | Salario PGY-1 2026 | $67,400 | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media |  | AAMC 2025 región Sur $65,076 + ~3.5%. |
| `ubicaciones.miami.gastosVida` | Gastos de vida anuales (sin vivienda) | $31,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.rentaMensual` | Renta propia mensual antes de comprar (1 hab.) | $2,250 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.seguroPct` | Seguro de vivienda (% del valor/año) | 1.3% | [Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) | 2026-10-27 | media | ⚠️ ESTIMADO | Promedio FL $8,471; Miami-Dade más alto. Incluye viento/huracán; sin flood. |
| `ubicaciones.miami.impuestoPropPct` | Impuesto a la propiedad efectivo | 1.6% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.factorMatch` | Facilidad de match IMG si te limitas a la región | 0.85 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.precios.duplex` | Precio dúplex | $850,000 | [Miami-Dade unifamiliar mediana $692k (sep-2026, Echo Fine Properties)](https://www.echofineproperties.com/miami-dade-county-all-property-types-market-update-september-2026/) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.precios.inlaw` | Precio casa con in-law suite | $950,000 | [Miami-Dade unifamiliar mediana $692k (sep-2026, Echo Fine Properties)](https://www.echofineproperties.com/miami-dade-county-all-property-types-market-update-september-2026/) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.precios.dosCasas` | Precio dos casas pequeñas (total) | $1,150,000 | [Miami-Dade unifamiliar mediana $692k (sep-2026, Echo Fine Properties)](https://www.echofineproperties.com/miami-dade-county-all-property-types-market-update-september-2026/) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.precios.casaAdu` | Precio casa (sin ADU) | $700,000 | [Miami-Dade unifamiliar mediana $692k (sep-2026, Echo Fine Properties)](https://www.echofineproperties.com/miami-dade-county-all-property-types-market-update-september-2026/) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.precios.aduCosto` | Costo de construir ADU | $180,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.precios.multi` | Precio fourplex | $1,500,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.miami.rentaUnidad` | Renta mensual por unidad rentada (multifamiliar) | $2,300 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| **Dallas–Fort Worth** | Licencia: Válida: tu licencia compacta es de TX; al mudarte TX sería tu estado de residencia (lo ideal). | | | | | | Donde viven mamá y tía. Sin impuesto estatal; impuesto predial alto (~1.8–2.2%). |
| `ubicaciones.dfw.factorRN` | Factor salarial RN vs nacional | 0.976 | [RN DFW $101,420 / Houston $99,830 (allnurses, año BLS no claro); DFW 2024 mediana $98,740](https://allnurses.com/nursing-salaries/rn/texas/) | 2026-10-27 | media |  | ≈ $99,000 / $101,420. |
| `ubicaciones.dfw.factorMD` | Factor salarial médico vs nacional | 1.02 | [Doximity Physician Compensation Report 2026](https://www.doximity.com/reports/physician-compensation-report/2026) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.residentePGY1` | Salario PGY-1 2026 | $67,400 | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media |  |  |
| `ubicaciones.dfw.gastosVida` | Gastos de vida anuales (sin vivienda) | $28,500 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.rentaMensual` | Renta propia mensual antes de comprar (1 hab.) | $1,400 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.seguroPct` | Seguro de vivienda (% del valor/año) | 1.1% | [Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) | 2026-10-27 | media | ⚠️ ESTIMADO | Promedio TX $4,582 (granizo/viento). |
| `ubicaciones.dfw.impuestoPropPct` | Impuesto a la propiedad efectivo | 1.9% | [Impuesto predial efectivo Dallas 1.44–1.85%, Tarrant 1.54–1.80%](https://propertytaxalmanac.com/texas/) | 2026-10-27 | media |  |  |
| `ubicaciones.dfw.factorMatch` | Facilidad de match IMG si te limitas a la región | 0.9 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.precios.duplex` | Precio dúplex | $520,000 | [Dúplex DFW: nuevos Midlothian $699k; Fort Worth 2009 $525k (listados)](https://www.houzeo.com/homes/6525-greenway-rd-fort-worth-tx-76116/hzid_2e0709ab) | 2026-10-27 | media | ⚠️ ESTIMADO | Listados: $525k (FW, 2009) a $699k (nuevo, Midlothian). |
| `ubicaciones.dfw.precios.inlaw` | Precio casa con in-law suite | $560,000 | [DFW mediana ~$395k (Opendoor, may-2026); $439,990 (Follow Up Ace, jul-2026)](https://www.opendoor.com/articles/state-of-the-dfw-market) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.precios.dosCasas` | Precio dos casas pequeñas (total) | $640,000 | [DFW mediana ~$395k (Opendoor, may-2026); $439,990 (Follow Up Ace, jul-2026)](https://www.opendoor.com/articles/state-of-the-dfw-market) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.precios.casaAdu` | Precio casa (sin ADU) | $420,000 | [DFW mediana ~$395k (Opendoor, may-2026); $439,990 (Follow Up Ace, jul-2026)](https://www.opendoor.com/articles/state-of-the-dfw-market) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.precios.aduCosto` | Costo de construir ADU | $140,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.precios.multi` | Precio fourplex | $900,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.dfw.rentaUnidad` | Renta mensual por unidad rentada (multifamiliar) | $1,750 | [Dúplex DFW: nuevos Midlothian $699k; Fort Worth 2009 $525k (listados)](https://www.houzeo.com/homes/6525-greenway-rd-fort-worth-tx-76116/hzid_2e0709ab) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| **Houston** | Licencia: Válida: licencia compacta TX. | | | | | | TX sin impuesto estatal, Texas Medical Center (muchos programas y empleos RN), vivienda más barata que DFW; ~4 h de mamá y tía. Riesgo de huracán/inundación. |
| `ubicaciones.houston.factorRN` | Factor salarial RN vs nacional | 0.984 | [RN DFW $101,420 / Houston $99,830 (allnurses, año BLS no claro); DFW 2024 mediana $98,740](https://allnurses.com/nursing-salaries/rn/texas/) | 2026-10-27 | media |  |  |
| `ubicaciones.houston.factorMD` | Factor salarial médico vs nacional | 1.02 | [Doximity Physician Compensation Report 2026](https://www.doximity.com/reports/physician-compensation-report/2026) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.residentePGY1` | Salario PGY-1 2026 | $67,400 | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media |  |  |
| `ubicaciones.houston.gastosVida` | Gastos de vida anuales (sin vivienda) | $28,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.rentaMensual` | Renta propia mensual antes de comprar (1 hab.) | $1,300 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.seguroPct` | Seguro de vivienda (% del valor/año) | 1.2% | [Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.impuestoPropPct` | Impuesto a la propiedad efectivo | 2% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.factorMatch` | Facilidad de match IMG si te limitas a la región | 0.95 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.precios.duplex` | Precio dúplex | $460,000 | [Houston (HAR) mediana unifamiliar ~$345k (jun-2026)](https://www.harbertgroup.com/blog/1007/Houston+Real+Estate+Market+Update+June+2026%3A+Har+Mls+Data+And+What+It+Means) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.precios.inlaw` | Precio casa con in-law suite | $500,000 | [Houston (HAR) mediana unifamiliar ~$345k (jun-2026)](https://www.harbertgroup.com/blog/1007/Houston+Real+Estate+Market+Update+June+2026%3A+Har+Mls+Data+And+What+It+Means) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.precios.dosCasas` | Precio dos casas pequeñas (total) | $580,000 | [Houston (HAR) mediana unifamiliar ~$345k (jun-2026)](https://www.harbertgroup.com/blog/1007/Houston+Real+Estate+Market+Update+June+2026%3A+Har+Mls+Data+And+What+It+Means) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.precios.casaAdu` | Precio casa (sin ADU) | $380,000 | [Houston (HAR) mediana unifamiliar ~$345k (jun-2026)](https://www.harbertgroup.com/blog/1007/Houston+Real+Estate+Market+Update+June+2026%3A+Har+Mls+Data+And+What+It+Means) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.precios.aduCosto` | Costo de construir ADU | $130,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.precios.multi` | Precio fourplex | $800,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.houston.rentaUnidad` | Renta mensual por unidad rentada (multifamiliar) | $1,600 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| **Nueva York (Queens/Bronx)** | Licencia: NO válida: NY no pertenece al NLC. Necesitas licencia RN de NY por endoso (trámite de semanas). | | | | | | El estado con más puestos de IM para IMGs (37% non-US IMG). Salarios RN altos pero impuestos estatal+municipal y vivienda muy caros. |
| `ubicaciones.nyc.factorRN` | Factor salarial RN vs nacional | 1.179 | [RN New York-Newark-Jersey City (OEWS mayo 2025 vía Wagedex/Hyring: ~$119,600)](https://wagedex.com/jobs/registered-nurses/metro/new-york-newark-jersey-city-ny-nj) | 2026-10-27 | media |  |  |
| `ubicaciones.nyc.factorMD` | Factor salarial médico vs nacional | 0.93 | [Doximity Physician Compensation Report 2026](https://www.doximity.com/reports/physician-compensation-report/2026) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.residentePGY1` | Salario PGY-1 2026 | $80,000 | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media |  | AAMC 2025 Noreste $74,994; hospitales de NYC con contrato CIR pagan más. |
| `ubicaciones.nyc.gastosVida` | Gastos de vida anuales (sin vivienda) | $30,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.rentaMensual` | Renta propia mensual antes de comprar (1 hab.) | $2,600 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.seguroPct` | Seguro de vivienda (% del valor/año) | 0.3% | [Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.impuestoPropPct` | Impuesto a la propiedad efectivo | 0.9% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.factorMatch` | Facilidad de match IMG si te limitas a la región | 1.25 | [% de puestos IM PGY-1 2026 ocupados por non-US IMG por estado (NY 37.4%, NJ 42.4%, PA 33.4%)](https://www.residencyprogramslist.com/img-friendly-internal-medicine-in-new-york) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.precios.duplex` | Precio casa bifamiliar | $1,250,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.precios.inlaw` | Precio casa con in-law suite | $1,150,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.precios.dosCasas` | Precio dos casas pequeñas (total) | $1,900,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.precios.casaAdu` | Precio casa (sin ADU) | $950,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.precios.aduCosto` | Costo de construir ADU | $250,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.precios.multi` | Precio 3-4 familias | $1,800,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.nyc.rentaUnidad` | Renta mensual por unidad rentada (multifamiliar) | $2,600 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| **Cleveland / NE de Ohio** | Licencia: Válida: Ohio es miembro del NLC (implementado 2023). Al mudarte, Ohio sería tu estado de residencia. | | | | | | Vivienda muy barata, Cleveland Clinic/UH/MetroHealth, muchos programas comunitarios de IM amigables con IMGs en OH/MI/PA. Invierno duro, lejos de la familia. |
| `ubicaciones.cleveland.factorRN` | Factor salarial RN vs nacional | 0.868 | [RN Cleveland (OEWS mayo 2025 vía DegreeCalc: mediana $83,940)](https://degreecalc.com/major/nursing/cleveland-oh) | 2026-10-27 | media | ⚠️ ESTIMADO | Media estimada ~$88k a partir de mediana $83,940. |
| `ubicaciones.cleveland.factorMD` | Factor salarial médico vs nacional | 1.03 | [Doximity Physician Compensation Report 2026](https://www.doximity.com/reports/physician-compensation-report/2026) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.residentePGY1` | Salario PGY-1 2026 | $71,000 | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media |  | AAMC 2025 región Central $68,580 + ~3.5%. |
| `ubicaciones.cleveland.gastosVida` | Gastos de vida anuales (sin vivienda) | $25,500 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.rentaMensual` | Renta propia mensual antes de comprar (1 hab.) | $1,100 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.seguroPct` | Seguro de vivienda (% del valor/año) | 0.6% | [Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872](https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.impuestoPropPct` | Impuesto a la propiedad efectivo | 1.72% | [Cuyahoga County mediana venta ~$225k (Zillow jun-2026); ATTOM impuesto efectivo 1.72%](https://www.attomdata.com/data/us-real-estate/oh/cuyahoga-county) | 2026-10-27 | media |  |  |
| `ubicaciones.cleveland.factorMatch` | Facilidad de match IMG si te limitas a la región | 1.15 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.precios.duplex` | Precio dúplex ('up-down double') | $260,000 | [Cuyahoga County mediana venta ~$225k (Zillow jun-2026); ATTOM impuesto efectivo 1.72%](https://www.attomdata.com/data/us-real-estate/oh/cuyahoga-county) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.precios.inlaw` | Precio casa con in-law suite | $340,000 | [Cuyahoga County mediana venta ~$225k (Zillow jun-2026); ATTOM impuesto efectivo 1.72%](https://www.attomdata.com/data/us-real-estate/oh/cuyahoga-county) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.precios.dosCasas` | Precio dos casas pequeñas (total) | $400,000 | [Cuyahoga County mediana venta ~$225k (Zillow jun-2026); ATTOM impuesto efectivo 1.72%](https://www.attomdata.com/data/us-real-estate/oh/cuyahoga-county) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.precios.casaAdu` | Precio casa (sin ADU) | $240,000 | [Cuyahoga County mediana venta ~$225k (Zillow jun-2026); ATTOM impuesto efectivo 1.72%](https://www.attomdata.com/data/us-real-estate/oh/cuyahoga-county) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.precios.aduCosto` | Costo de construir ADU | $120,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.precios.multi` | Precio fourplex | $420,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `ubicaciones.cleveland.rentaUnidad` | Renta mensual por unidad rentada (multifamiliar) | $1,100 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |

### Salarios por rol

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `roles.cm.aumento` | Aumento anual case manager | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | El salario de case manager se calibra con tu tarifa actual ($/h × 2080) ajustada por el factor RN de la ubicación vs Miami. |
| `roles.ur.base` | Utilization review / payer-side remoto (CVS/Aetna) | $92,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `roles.ur.aumento` | Aumento anual UR | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.icuNuevo.base` | RN ICU años 1-2 (incl. diferencial nocturno) | $92,000 | [BLS OOH – Registered Nurses (mediana $97,550; media nacional $101,420, mayo 2025)](https://www.bls.gov/ooh/healthcare/registered-nurses.htm) | 2026-10-27 | media | ⚠️ ESTIMADO | ~0.85× media RN + ~8% diferencial nocturno/fines de semana. |
| `roles.icuNuevo.aumento` | Aumento anual RN bedside | 3.5% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.icuExp.base` | RN ICU con 3+ años (incl. diferenciales) | $108,000 | [BLS OOH – Registered Nurses (mediana $97,550; media nacional $101,420, mayo 2025)](https://www.bls.gov/ooh/healthcare/registered-nurses.htm) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.icuExp.aumento` | Aumento anual RN ICU experimentado | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.travel.base` | Travel ICU: pago semanal bruto (incl. stipends) | 2300 $/sem | [Travel nurse: promedio semanal ~$2,216 (Vivian, oct 2026), Aya $2,234](https://dreambound.com/blog/travel-nurse-salary) | 2026-10-27 | media |  |  |
| `roles.travel.aumento` | Aumento anual travel | 2% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `roles.cdi.base` | CDI specialist / clinical liaison / informática | $95,000 | [CDI Specialist: Payscale 2026 $84.6k; ACDIS 2023 ~$99k; postings $68k–$113k](https://payscale.com/research/US/Job=Clinical_Documentation_Specialist/Salary) | 2026-10-27 | media | ⚠️ ESTIMADO | El MD extranjero es muy valorado en CDI; muchos puestos aceptan MD sin bedside. |
| `roles.cdi.aumento` | Aumento anual CDI | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.manager.base` | Nurse manager | $120,000 | [Clinical Nurse Manager Payscale 2026 ~$102.7k; educador clínico Indeed ~$112k](https://www.payscale.com/research/US/Job=Clinical_Nurse_Manager/Salary/1645540c/Clinical-Education) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.manager.aumento` | Aumento anual manager | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.educador.base` | Educador clínico | $102,000 | [Clinical Nurse Manager Payscale 2026 ~$102.7k; educador clínico Indeed ~$112k](https://www.payscale.com/research/US/Job=Clinical_Nurse_Manager/Salary/1645540c/Clinical-Education) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.educador.aumento` | Aumento anual educador | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.injector.base` | Nurse injector (estética) ya establecido | $90,000 | [Aesthetic injector RN postings 2026 $75k–$125k (NakedMD)](https://apply.workable.com/nakedmd/jobs/view/EC42AEE17C.md) | 2026-10-27 | baja | ⚠️ ESTIMADO | Mucho componente de comisión; año 1 ~70% de esta cifra. |
| `roles.injector.aumento` | Aumento anual injector | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `roles.crna.base` | CRNA | $240,000 | [BLS mayo 2025 – CRNA mediana $236,590 (vía Becker's)](https://www.beckershospitalreview.com/compensation-issues/crna-median-pay-by-state/) | 2026-10-27 | alta |  | BLS mayo 2025 mediana $236,590. |
| `roles.crna.aumento` | Aumento anual CRNA | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.fnp.base` | NP familiar (FNP) | $128,000 | [BLS mayo 2025 – NP mediana $132,300 (vía Becker's)](https://www.beckershospitalreview.com/compensation-issues/np-median-pay-by-state/) | 2026-10-27 | media |  | BLS 2025 mediana NP $132,300; FNP recién graduado algo menos. |
| `roles.fnp.aumento` | Aumento anual FNP | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.pmhnp.base` | NP psiquiátrico (PMHNP) | $145,000 | [PMHNP ~$145k (AANP 2024 / Indeed 2026, vía Barton)](https://www.bartonassociates.com/np-psychiatry-salary-guide/) | 2026-10-27 | media |  |  |
| `roles.pmhnp.aumento` | Aumento anual PMHNP | 3% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.residente.base` | (Residente: ver salario PGY-1 por ubicación) | 1 | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media |  |  |
| `roles.residente.aumento` | Aumento por año de residencia (PGY2, PGY3) | 4% | [Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach)](https://www.medschoolcoach.com/average-residency-salary) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.hospitalista.base` | Hospitalista IM (attending) | $320,000 | [Medscape 2026 – internistas $307k (vía Weatherby)](https://m.weatherbyhealthcare.com/blog/internal-medicine-salary-report) | 2026-10-27 | media | ⚠️ ESTIMADO | Medscape 2026 internistas $307k; hospitalistas suelen ganar más que IM ambulatoria. |
| `roles.hospitalista.aumento` | Aumento anual attending | 2.5% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `roles.fm.base` | Medicina familiar (attending) | $288,000 | [Medicina familiar ~$288k (Medscape, vía Physician on FIRE)](https://www.physicianonfire.com/physician-salary-by-specialty/) | 2026-10-27 | media |  |  |
| `roles.fm.aumento` | Aumento anual FM | 2.5% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |

### Tiempos y costos de enfermería

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `tiempos.bedsideInicioLag` | Meses tras BSN para entrar a programa de transición ICU | 0.25 años | [Programas de transición/fellowship ICU para RN experimentados (CHI Memorial, CommonSpirit)](https://memorial.org/careers/nurse-fellowship) | 2026-10-27 | media | ⚠️ ESTIMADO | Muchos programas piden 1 año de experiencia aguda; algunos (p.ej. CHI Memorial) aceptan RN experimentados sin ICU. |
| `tiempos.icuAnios` | Años de ICU antes de travel/CRNA/charge | 2 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  |  |
| `tiempos.bonoFirmaICU` | Bono de firma ICU | $7,500 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `tiempos.travelAnios` | Años como travel nurse | 3 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  |  |
| `tiempos.travelSemanas` | Semanas trabajadas por año en travel | 46 sem | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `tiempos.travelStipendPct` | Porción libre de impuestos (stipends) | 45% | [Travel nurse: promedio semanal ~$2,216 (Vivian, oct 2026), Aya $2,234](https://dreambound.com/blog/travel-nurse-salary) | 2026-10-27 | media | ⚠️ ESTIMADO | Requiere 'tax home' real (p. ej. el dúplex en DFW). |
| `tiempos.travelGastoExtraMes` | Gasto extra mensual en travel (doble vivienda, viajes) | $1,200 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `tiempos.crnaLagAplicacion` | Tiempo extra de aplicación CRNA tras cumplir ICU | 0.5 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `tiempos.crnaDuracion` | Duración DNP-CRNA (sin trabajar) | 3 años | [Costo programas DNP-CRNA (Iowa $85.7k residente/$163.8k no residente; Duke $2,250/crédito; rango $60k–$100k+)](https://nursing.uiowa.edu/sites/nursing.uiowa.edu/files/2025-09/ANP_costs_estimates_2025.pdf) | 2026-10-27 | alta |  |  |
| `tiempos.crnaMatricula` | Matrícula + cuotas totales CRNA | $120,000 | [Costo programas DNP-CRNA (Iowa $85.7k residente/$163.8k no residente; Duke $2,250/crédito; rango $60k–$100k+)](https://nursing.uiowa.edu/sites/nursing.uiowa.edu/files/2025-09/ANP_costs_estimates_2025.pdf) | 2026-10-27 | media |  |  |
| `tiempos.crnaPslf` | CRNA trabaja en hospital sin fines de lucro (PSLF) | No | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `tiempos.npInicio` | Inicio MSN-NP part-time | 2028 año | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  |  |
| `tiempos.npDuracion` | Duración MSN-NP part-time | 3 años | [Costo MSN-FNP online part-time ($18k–$42k; Frontier ~$34.6k)](https://www.nursingprocess.org/online-part-time-fnp-programs.html) | 2026-10-27 | media |  |  |
| `tiempos.npMatricula` | Matrícula total MSN-NP | $38,000 | [Costo MSN-FNP online part-time ($18k–$42k; Frontier ~$34.6k)](https://www.nursingprocess.org/online-part-time-fnp-programs.html) | 2026-10-27 | media |  |  |
| `tiempos.npHorasTrabajo` | Fracción de jornada mientras estudias NP | 0.8 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `tiempos.msnLiderazgoCosto` | MSN liderazgo/educación (part-time) | $22,000 | [Costo MSN-FNP online part-time ($18k–$42k; Frontier ~$34.6k)](https://www.nursingprocess.org/online-part-time-fnp-programs.html) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `tiempos.injectorCurso` | Curso/certificación de inyecciones | $6,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `tiempos.cdiCertAumento` | Aumento CDI tras CCDS (año 2) y liderazgo (año 6) | 10% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |

### Camino MD

| Variable | Descripción | Valor | Fuente | Consulta | Confianza | Estimado | Nota |
|---|---|---|---|---|---|---|---|
| `md.step1Fecha` | Fecha Step 1 (sept 2027) | 2027.67 año | Dato proporcionado por ti (README del repositorio) | 2026-10-27 | alta |  |  |
| `md.step2Gap` | Meses entre Step 1 y Step 2 CK | 0.6 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.dedicadoStep1` | Estudio dedicado sin sueldo antes de Step 1 | 0.17 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO | ~2 meses. |
| `md.dedicadoStep2` | Estudio dedicado sin sueldo antes de Step 2 CK | 0.12 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.usceDuracion` | USCE (observership/externship) | 0.25 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.usceCostoMes` | Costo USCE por mes (programa + estancia) | $2,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.horasEstudioSemana` | Horas de estudio/semana mientras trabajas | 20 h | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.horasTrabajoEstudiando` | Horas de trabajo/semana mientras estudias USMLE | 32 h | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  | Reducir horas baja el ingreso pero mejora la probabilidad de aprobar. |
| `md.costoStep1` | Tarifa Step 1 | $695 | [FSMB – tarifas USMLE 2026/2027](https://www.fsmb.org/usmle/) | 2026-10-27 | alta |  |  |
| `md.costoStep2` | Tarifa Step 2 CK | $695 | [FSMB – tarifas USMLE 2026/2027](https://www.fsmb.org/usmle/) | 2026-10-27 | alta |  |  |
| `md.costoPrepUSMLE` | Material de estudio (UWorld, NBMEs, Amboss) | $3,500 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.costoECFMG` | ECFMG (Pathway $945 + OET Medicine ~$500) | $1,500 | [Pathways ECFMG 2027 ($945) y OET Medicine](https://thematchguy.com/pathways-ecfmg-certification/) | 2026-10-27 | media |  |  |
| `md.costoERAS` | ERAS (~100 programas IM/FM) + NRMP + transcript | $4,500 | [AAMC – tarifas ERAS 2027](https://students-residents.aamc.org/applying-residencies-eras/publication-chapters/fees-2027-eras-season) | 2026-10-27 | media |  | 1–30 programas $11 c/u; 31+ $30 c/u por especialidad; ~100 IM + 30 FM ≈ $3.8k + NRMP. |
| `md.costoEntrevistas` | Entrevistas (mayoría virtuales) + viaje a 1-2 | $1,500 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.costoMudanza` | Mudanza a la residencia | $6,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.costoLicencia` | Step 3 + licencia + DEA + board exam | $3,500 | [FSMB – tarifas USMLE 2026/2027](https://www.fsmb.org/usmle/) | 2026-10-27 | media | ⚠️ ESTIMADO |  |
| `md.probStep1` | Prob. aprobar Step 1 (cada intento) | 80% | [Tasas de aprobación USMLE IMGs (Step 1 ~72%, Step 2 CK ~68%)](https://www.iatrox.com/blog/usmle-step-1-step-2-ck-pass-rates-difficulty-2026) | 2026-10-27 | baja | ⚠️ ESTIMADO | IMGs primera vez ~72% (2025); se asume algo más por preparación estructurada. |
| `md.probStep2` | Prob. aprobar Step 2 CK (cada intento) | 80% | [Tasas de aprobación USMLE IMGs (Step 1 ~72%, Step 2 CK ~68%)](https://www.iatrox.com/blog/usmle-step-1-step-2-ck-pass-rates-difficulty-2026) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.retrasoReprobar` | Retraso por reprobar un examen | 0.5 años | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | media |  |  |
| `md.probMatch` | Prob. de match (Main Match, IM/FM/Peds, aplicación amplia) | 45% | [Desglose por visa 2026: 67.9% sin visa vs 54.4% con visa (fuente secundaria)](https://academically.com/blogs/img-match-rate-2026-can-indian-mbbs-doctors-actually-get-us-residency/) | 2026-10-27 | baja | ⚠️ ESTIMADO | Non-US IMG sin visa 67.9% (2026); se reduce por ~8-9 años desde graduación (YOG), sin experiencia clínica médica reciente. Rango razonable 25–60%. |
| `md.abiertoMudarse` | Dispuesto a mudarte a cualquier estado para la residencia | Sí | [% de puestos IM PGY-1 2026 ocupados por non-US IMG por estado (NY 37.4%, NJ 42.4%, PA 33.4%)](https://www.residencyprogramslist.com/img-friendly-internal-medicine-in-new-york) | 2026-10-27 | media |  | Si es 'no', prob. de match × factor de la región × 0.75 (menos programas). |
| `md.probSoap` | Prob. de obtener puesto en SOAP si no hay match | 25% | [ResidencyAdvisor – resultados SOAP para IMGs (estimación 20–35%)](https://residencyadvisor.com/resources/img-residency-guide/postmatch-soap-outcomes-for-imgs-positions-specialties-and-odds) | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.soapCategoricoPct` | Del SOAP, fracción categórico (vs preliminar) | 40% | [AMA – especialidades que más colocan por SOAP (IMGs 27.1% de puestos SOAP)](https://www.ama-assn.org/medical-students/preparing-residency/match-which-specialties-place-most-residents-through-soap) | 2026-10-27 | baja | ⚠️ ESTIMADO | En 2025, 146 puestos preliminares de medicina y 260 transicionales en SOAP. |
| `md.probMatchTrasPrelim` | Prob. de match categórico tras año preliminar | 55% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.probMatchReintento` | Prob. de match en reintento (sin puesto previo) | 30% | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.intentosMax` | Ciclos de Match que estás dispuesto a intentar | 2 | Parámetro de diseño del modelo | 2026-10-27 | media |  |  |
| `md.residenciaAnios` | Duración residencia IM/FM | 3 años | Parámetro de diseño del modelo | 2026-10-27 | alta |  |  |
| `md.especialidad` | Salida como attending | hospitalista | Parámetro de diseño del modelo | 2026-10-27 | alta |  |  |
| `md.locumsTurnosMes` | Turnos locum extra por mes (12 h, vía S-corp) | 2 | [Barton Associates – hospitalista locum $130–175/h; postings $200/h](https://www.bartonassociates.com/salary-tool/physician/hospitalist/) | 2026-10-27 | media |  |  |
| `md.locumsTarifa` | Tarifa locum hospitalista | 170 $/h | [Barton Associates – hospitalista locum $130–175/h; postings $200/h](https://www.bartonassociates.com/salary-tool/physician/hospitalist/) | 2026-10-27 | media |  |  |
| `md.directorMedico` | Ingreso medical director (desde attending año 3) | $0 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.tutoria` | Tutoría USMLE/médica anual (tras aprobar Steps) | $0 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.residentePslf` | Residencia y empleo attending en sin fines de lucro (PSLF) | Sí | [Cambios PSLF/RAP 2026 (OBBBA): RAP califica para PSLF, 1–10% del AGI](https://www.tateesq.com/learn/pslf-changes-2026) | 2026-10-27 | media |  |  |
| `md.montecarloN` | Simulaciones Monte Carlo | 1000 | Parámetro de diseño del modelo | 2026-10-27 | alta |  |  |
| `md.bonoFirmaAttending` | Bono de firma como attending | $20,000 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |
| `md.factorMatchSiReprueba` | Multiplicador de prob. de match por cada examen reprobado | 0.5 | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO | Reprobar un Step es una 'red flag' fuerte para los programas. |
| `md.creditoPrelim` | El año preliminar cuenta como PGY-1 (no se repite) | No | Estimación propia del modelo (sin dato publicado directo); ver nota | 2026-10-27 | baja | ⚠️ ESTIMADO |  |

### Escenarios

| Ajuste | Pesimista | Base | Optimista |
|---|---|---|---|
| salarios | 0.92 | 1 | 1.06 |
| retorno | -0.02 | 0 | 0.015 |
| inflacion | 0.01 | 0 | -0.005 |
| retraso | 0.5 | 0 | 0 |
| probMatch | -0.15 | 0 | 0.1 |
| apreciacion | -0.02 | 0 | 0.01 |
| tasaHipoteca | 0.01 | 0 | -0.0125 |
| gastos | 1.08 | 1 | 0.96 |
| probExamenes | -0.1 | 0 | 0.08 |

salarios/gastos = multiplicadores; retorno, inflación, apreciación, tasaHipoteca, probMatch, probExamenes = puntos que se suman; retraso = años que se suman al inicio de Step 1, CRNA y NP. Todos ⚠️ ESTIMADOS.

## Fuentes

| Id | Fuente | URL |
|---|---|---|
| irs2026 | IRS Rev. Proc. 2025-32 (brackets y deducción estándar 2026) vía Accounting Today | https://www.accountingtoday.com/news/irs-announces-inflation-adjustments-for-2026 |
| limites2026 | Límites 2026 (SS wage base, 403b, IRA) – Mayer Brown | https://www.mayerbrown.com/es/insights/publications/2025/12/irs-annual-limits-for-benefit-plans-2026-cost-of-living-adjustments |
| ohio2026 | EY Tax News – Ohio tasa plana 2.75% desde 2026 | https://taxnews.ey.com/news/2025-1744 |
| nytax | NY State/NYC tasas (aprox. 2026, verificar en tax.ny.gov) | https://www.countrytaxcalc.com/tax-guides/compare/new-york-vs-ohio/ |
| nrmp2026 | NRMP Results and Data 2026 Main Residency Match | https://www.nrmp.org/wp-content/uploads/2026/05/Main_Match_Results_and_Data-2026.pdf |
| nrmpCO2026 | NRMP Charting Outcomes Non-U.S. IMG 2026 | https://www.nrmp.org/wp-content/uploads/2026/07/Non-US-IMG_Charting-Outcomes_FINAL.pdf |
| ecfmg2026 | ECFMG – resultados del Match 2026 para IMGs (56.4% non-US IMG) | https://www.ecfmg.org/news/?p=5542 |
| visa2026 | Desglose por visa 2026: 67.9% sin visa vs 54.4% con visa (fuente secundaria) | https://academically.com/blogs/img-match-rate-2026-can-indian-mbbs-doctors-actually-get-us-residency/ |
| soapAMA | AMA – especialidades que más colocan por SOAP (IMGs 27.1% de puestos SOAP) | https://www.ama-assn.org/medical-students/preparing-residency/match-which-specialties-place-most-residents-through-soap |
| soapRA | ResidencyAdvisor – resultados SOAP para IMGs (estimación 20–35%) | https://residencyadvisor.com/resources/img-residency-guide/postmatch-soap-outcomes-for-imgs-positions-specialties-and-odds |
| usmleFees | FSMB – tarifas USMLE 2026/2027 | https://www.fsmb.org/usmle/ |
| eras2027 | AAMC – tarifas ERAS 2027 | https://students-residents.aamc.org/applying-residencies-eras/publication-chapters/fees-2027-eras-season |
| ecfmgPath | Pathways ECFMG 2027 ($945) y OET Medicine | https://thematchguy.com/pathways-ecfmg-certification/ |
| usmlePass | Tasas de aprobación USMLE IMGs (Step 1 ~72%, Step 2 CK ~68%) | https://www.iatrox.com/blog/usmle-step-1-step-2-ck-pass-rates-difficulty-2026 |
| aamcStipend | Encuesta AAMC 2025 de salarios de residentes por región (vía MedSchoolCoach) | https://www.medschoolcoach.com/average-residency-salary |
| medscapeIM | Medscape 2026 – internistas $307k (vía Weatherby) | https://m.weatherbyhealthcare.com/blog/internal-medicine-salary-report |
| medscapeFM | Medicina familiar ~$288k (Medscape, vía Physician on FIRE) | https://www.physicianonfire.com/physician-salary-by-specialty/ |
| doximity2026 | Doximity Physician Compensation Report 2026 | https://www.doximity.com/reports/physician-compensation-report/2026 |
| locums | Barton Associates – hospitalista locum $130–175/h; postings $200/h | https://www.bartonassociates.com/salary-tool/physician/hospitalist/ |
| blsRN | BLS OOH – Registered Nurses (mediana $97,550; media nacional $101,420, mayo 2025) | https://www.bls.gov/ooh/healthcare/registered-nurses.htm |
| rnMiami | RN Miami-Fort Lauderdale (BLS OEWS 2025 vía Hyring: media $94,990) | https://hyring.com/jobseeker-toolkit/salary/registered-nurse-salary-in-miami |
| rnTX | RN DFW $101,420 / Houston $99,830 (allnurses, año BLS no claro); DFW 2024 mediana $98,740 | https://allnurses.com/nursing-salaries/rn/texas/ |
| rnNY | RN New York-Newark-Jersey City (OEWS mayo 2025 vía Wagedex/Hyring: ~$119,600) | https://wagedex.com/jobs/registered-nurses/metro/new-york-newark-jersey-city-ny-nj |
| rnCLE | RN Cleveland (OEWS mayo 2025 vía DegreeCalc: mediana $83,940) | https://degreecalc.com/major/nursing/cleveland-oh |
| crnaBLS | BLS mayo 2025 – CRNA mediana $236,590 (vía Becker's) | https://www.beckershospitalreview.com/compensation-issues/crna-median-pay-by-state/ |
| crnaCost | Costo programas DNP-CRNA (Iowa $85.7k residente/$163.8k no residente; Duke $2,250/crédito; rango $60k–$100k+) | https://nursing.uiowa.edu/sites/nursing.uiowa.edu/files/2025-09/ANP_costs_estimates_2025.pdf |
| npBLS | BLS mayo 2025 – NP mediana $132,300 (vía Becker's) | https://www.beckershospitalreview.com/compensation-issues/np-median-pay-by-state/ |
| pmhnp | PMHNP ~$145k (AANP 2024 / Indeed 2026, vía Barton) | https://www.bartonassociates.com/np-psychiatry-salary-guide/ |
| fnpCost | Costo MSN-FNP online part-time ($18k–$42k; Frontier ~$34.6k) | https://www.nursingprocess.org/online-part-time-fnp-programs.html |
| travel | Travel nurse: promedio semanal ~$2,216 (Vivian, oct 2026), Aya $2,234 | https://dreambound.com/blog/travel-nurse-salary |
| cdi | CDI Specialist: Payscale 2026 $84.6k; ACDIS 2023 ~$99k; postings $68k–$113k | https://payscale.com/research/US/Job=Clinical_Documentation_Specialist/Salary |
| mgr | Clinical Nurse Manager Payscale 2026 ~$102.7k; educador clínico Indeed ~$112k | https://www.payscale.com/research/US/Job=Clinical_Nurse_Manager/Salary/1645540c/Clinical-Education |
| injector | Aesthetic injector RN postings 2026 $75k–$125k (NakedMD) | https://apply.workable.com/nakedmd/jobs/view/EC42AEE17C.md |
| icuTrans | Programas de transición/fellowship ICU para RN experimentados (CHI Memorial, CommonSpirit) | https://memorial.org/careers/nurse-fellowship |
| pslf2026 | Cambios PSLF/RAP 2026 (OBBBA): RAP califica para PSLF, 1–10% del AGI | https://www.tateesq.com/learn/pslf-changes-2026 |
| loans2026 | ED – tasa Direct Unsubsidized posgrado 2026-27: 8.07% | https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-04/interest-rates-federal-direct-loans-first-disbursed-between-july-1-2026-and-june-30-2027 |
| loanCaps | Límites préstamos desde 1-jul-2026: posgrado $20,500/año ($100k total); profesional $50k/año ($200k) | https://www.uvu.edu/financialaid/aid/graduate_professional_loan_changes_2026.html |
| freddie | Freddie Mac PMMS – 30 años 7.32% (22-oct-2026) | https://fred.stlouisfed.org/series/MORTGAGE30US |
| dfwHome | DFW mediana ~$395k (Opendoor, may-2026); $439,990 (Follow Up Ace, jul-2026) | https://www.opendoor.com/articles/state-of-the-dfw-market |
| dfwDuplex | Dúplex DFW: nuevos Midlothian $699k; Fort Worth 2009 $525k (listados) | https://www.houzeo.com/homes/6525-greenway-rd-fort-worth-tx-76116/hzid_2e0709ab |
| miamiHome | Miami-Dade unifamiliar mediana $692k (sep-2026, Echo Fine Properties) | https://www.echofineproperties.com/miami-dade-county-all-property-types-market-update-september-2026/ |
| houHome | Houston (HAR) mediana unifamiliar ~$345k (jun-2026) | https://www.harbertgroup.com/blog/1007/Houston+Real+Estate+Market+Update+June+2026%3A+Har+Mls+Data+And+What+It+Means |
| cleHome | Cuyahoga County mediana venta ~$225k (Zillow jun-2026); ATTOM impuesto efectivo 1.72% | https://www.attomdata.com/data/us-real-estate/oh/cuyahoga-county |
| insurance | Insurance.com 2026: prima promedio FL $8,471; TX $4,582; nacional $2,872 | https://www.insurance.com/home-and-renters-insurance/home-insurance-unaffordable-states/ |
| propTX | Impuesto predial efectivo Dallas 1.44–1.85%, Tarrant 1.54–1.80% | https://propertytaxalmanac.com/texas/ |
| nlc | Nurse Licensure Compact – estados miembros 2026 | https://www.registerednursing.org/articles/nursing-license-compact/ |
| imgFriendly | % de puestos IM PGY-1 2026 ocupados por non-US IMG por estado (NY 37.4%, NJ 42.4%, PA 33.4%) | https://www.residencyprogramslist.com/img-friendly-internal-medicine-in-new-york |
| flPath | Estatutos FL 2026 cap. 458 (licencia restringida: práctica activa 2 de los últimos 4 años) | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0400-0499%2F0458%2F0458.html |
| txDoctor | Texas DOCTOR Act (HB 2038): residencia extranjera + 5 años de práctica + oferta de empleo | https://www.texastribune.org/2026/01/09/texas-foreign-doctors-recruiting-law/ |
| statesIMG | Niskanen Center – vías alternativas de licencia por estado | https://www.niskanencenter.org/implementing-new-licening-pathways-that-work-for-international-doctors-and-american-patients/ |
| estimado | Estimación propia del modelo (sin dato publicado directo); ver nota | — |
| usuario | Dato proporcionado por ti (README del repositorio) | — |
| modelo | Parámetro de diseño del modelo | — |
