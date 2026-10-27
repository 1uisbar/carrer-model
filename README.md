# carrer-model
Eres mi analista financiero y de carrera. Construye un modelo financiero completo, interactivo y reproducible que compare mis posibles caminos profesionales a 20 años, con timeline detallado, comparación por ubicación geográfica y TODAS las variables editables. Interfaz y textos en español.

## MI SITUACIÓN ACTUAL (octubre 2026)
- 30 años, vivo en Miami, FL. Estoy abierto a mudarme de estado si los números y la carrera lo justifican.
- RN Clinical Case Manager en Mount Sinai Medical Center (hospital sin fines de lucro → relevante para PSLF). ~$40/hora, ~4 días/semana (ingreso anual como variable).
- Experiencia RN en EE. UU.: solo case management, sin bedside todavía. Experiencia previa: medical assistant y case manager de menores no acompañados.
- Licencias: RN compacta emitida en Texas + RN Florida.
- Cursando RN-BSN online en South University (fecha de graduación variable, default mediados 2027).
- MD de Cuba; cuenta ECFMG abierta desde 2022. Bilingüe inglés/español.
- Step 1 USMLE: fecha objetivo septiembre 2027 (variable).
- Deudas: IRS plan de pagos $1,350 restante; deuda estudiantil $10,000 (tasa variable, default 6%).
- Ahorros/inversiones totales: ~$13,000 (HYSA, Roth IRA, brokerage, 403b).
- 403b del empleador: match 4% empieza enero 2027.
- Tengo Angelmar Group LLC (Florida). Plan futuro: segunda LLC para locums con tratamiento S-corp.
- Familia: mi mamá y mi tía viven en el área de Dallas/Fort Worth.

## META DE VIVIENDA
Quiero vivir cerca de/con mi mamá y mi tía en una vivienda multigeneracional pagada lo más rápido posible. Modela varias configuraciones como opciones seleccionables:
- Dúplex (vivo en una unidad, ellas en la otra).
- Casa grande con in-law suite / ADU.
- Dos casas pequeñas cercanas.
- Otras opciones que consideres razonables (ej. casa + ADU construido después, multifamily de 3-4 unidades con renta de una unidad).
Para cada configuración y cada ubicación: precio típico, enganche, hipoteca, seguro (importante en Florida), impuestos de propiedad, y en qué año es viable comprarla y pagarla en cada camino profesional.

## CAMINOS A MODELAR

### A. Enfermería (múltiples ramas, no solo case management)
1. Case management / utilization review / payer-side (CVS/Aetna, etc.), con upgrade por BSN.
2. Bedside: ICU, ED, step-down. Modela cómo conseguir el primer puesto bedside sin experiencia previa (programas de transición/residencia para RN experimentados) y la curva salarial.
3. Travel nursing tras 1-2 años de bedside: ingresos por contrato, stipends libres de impuestos, estados de mayor pago.
4. Clinical Documentation Integrity (CDI) / clinical liaison / nurse informatics / research nurse coordinator: evalúa especialmente las que valoran un MD extranjero.
5. Liderazgo (nurse manager) y educador clínico.
6. Nurse injector / estética (evalúa requisitos y mercado).
7. CRNA: BSN + 1-2 años de ICU → DNP ~36 meses sin trabajar, matrícula, préstamos, salario.
8. NP (FNP y PMHNP): MSN/DNP part-time trabajando, costo, salario.
Considera combinaciones lógicas (ej. bedside ICU → travel → CRNA). Agrega cualquier otra rama de enfermería que tenga sentido financiero para mi perfil.

### B. MD vía USMLE (Internal Medicine o Family Medicine; pediatría como fallback)
Step 1 (sept 2027) → Step 2 CK → USCE (experiencia clínica en EE. UU.) → certificación ECFMG → ERAS (septiembre) → Match (marzo) → residencia 3 años → attending. Incluye:
- Probabilidad de match como variable (investiga datos NRMP recientes para IMGs no estadounidenses en IM/FM).
- SOAP como escenario separado: probabilidad de conseguir puesto por SOAP, distinguiendo categórico vs preliminar, y qué pasa si solo consigo un año preliminar.
- Escenario de no match y reintento el año siguiente.
- Impacto de estar dispuesto a mudarme de estado sobre la probabilidad de match (programas amigables con IMGs por región).
- Conflicto de tiempo: horas de estudio vs horas de trabajo (especialmente si estoy en bedside).
- Salario de residente (PGY1-3) por región y salario de hospitalista / FM attending por región.
- Ingresos extra: locums vía S-corp, medical director, tutoría médica.
- Investiga vías alternativas de licencia para médicos formados en el extranjero sin residencia en EE. UU. (Florida y otros estados que hayan aprobado leyes similares), requisitos, y si podrían aplicar a mí. Si alguna es viable, modélala como camino separado; si no, explica por qué.

### C. Overlay opcional en cualquier camino
Ingreso lateral vía Angelmar Group LLC (variable).

## UBICACIÓN (variable clave)
Compara como mínimo: Miami/Sur de Florida, Dallas-Fort Worth, y 2-3 regiones más que tú identifiques como mejores para mí (por salario RN, programas de residencia amigables con IMGs, costo de vida o vivienda). Para cada una: salarios, impuesto estatal, costo de vida, costo de vivienda multigeneracional, y validez de mi licencia compacta.

## VARIABLES (todas editables desde un único archivo de supuestos y desde la interfaz)
- Fechas de inicio y duración de cada etapa; retrasos (ej. reprobar un examen = +X meses).
- Salarios por región, aumentos anuales, bonos de firma, diferenciales nocturnos.
- Horas trabajadas durante estudios.
- Matrícula, costos de exámenes (USMLE, ERAS, entrevistas, mudanza), préstamos y tasas.
- Impuestos federales (brackets actuales), estatales por ubicación, FICA, S-corp para locums.
- Gastos de vida por ubicación, inflación.
- Tasa de ahorro, retorno de inversión, match del 403b, Roth.
- PSLF.
- Vivienda: configuración, precio, enganche, tasa hipotecaria, seguro, impuestos de propiedad.
- Probabilidades de match, SOAP y éxito por etapa.

## OUTPUT REQUERIDO
1. **Dashboard web interactivo** (un solo archivo HTML con Chart.js o similar, funciona offline) con:
   - Timeline visual tipo Gantt por camino (etapas, exámenes, años sin ingreso, fecha de attending, etc.).
   - Selector de ubicación y de configuración de vivienda.
   - Deslizadores y campos para cada variable clave, con recálculo instantáneo.
   - Gráficos: patrimonio neto año por año, ingreso neto anual, deuda total, flujo de caja acumulado.
   - Punto de cruce: en qué año cada camino supera a los demás.
   - Año de viabilidad de compra y de pago total de la vivienda por camino.
   - Escenarios pesimista / base / optimista.
   - Gráfico de sensibilidad (tornado) con las variables que más mueven el resultado.
   - Simulación Monte Carlo para el camino MD (match, SOAP, retrasos).
2. **Excel (.xlsx)** con fórmulas vivas: hoja de supuestos, una hoja por camino, hoja por ubicación, hoja comparativa.
3. **SUPUESTOS.md**: cada número con su fuente (URL), fecha de consulta y nivel de confianza. Marca claramente lo estimado.
4. **RESUMEN.md**: conclusiones en lenguaje claro, riesgos de cada camino, y tu opinión honesta sobre: cuál camino maximiza patrimonio, cuál balancea mejor riesgo/calidad de vida, cuál llega antes a la vivienda multigeneracional, y qué ubicación conviene. No me des la razón por default; si los números contradicen un camino, dilo.

## REGLAS DE TRABAJO
- Investiga datos actuales de 2026 (BLS, NRMP, AANA, AAMC, Doximity, Medscape, programas y ofertas reales). No inventes cifras; si no encuentras un dato, usa un rango y márcalo.
- Escribe tests para verificar los cálculos de impuestos, préstamos, hipoteca y patrimonio.
- Haz commits frecuentes con mensajes claros.
- Al terminar, abre el dashboard, revisa que funcione bien y se vea bien en móvil, y corrige errores antes de dar por terminado.  
