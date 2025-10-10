# Full de ruta

## Objectius generals
- Fer l'aplicació didàctica, intuïtiva i atractiva per a alumnat d'ESO.
- Incorporar suport complet per a funcions, inequacions i sistemes, amb resultats visibles sobre la gràfica.
- Facilitar la introducció d'expressions matemàtiques amb eines adaptades (teclat virtual, historial, validacions).
- Preparar l'arquitectura perquè a mig termini es pugui integrar captura i reconeixement automàtic d'equacions.

## Fases de desenvolupament

### Fase 0 – Preparació i mantenibilitat
- Reorganitzar el projecte en carpetes (`index.html`, `src/`, `assets/`) i separar el codi en mòduls (`main.js`, `graph.js`, `parser.js`, `ui.js`, `config.js`).
- Assegurar codificació UTF-8 i substituir els caràcters trencats per emoji o icones SVG correctes.
- Crear un objecte d'estat global (`store`) per centralitzar funcions actives, configuració i resultats.
- Documentar al README l'estructura nova i dependències (Chart.js, Math.js, etc.).

### Fase 1 – Entrada d'expressions amigable
- Afegir un teclat virtual plegable amb símbols freqüents (`≤`, `≥`, `√`, `π`, `^`, fraccions, valor absolut).
- Incorporar pestanyes o un selector de mode (Funció, Inequació, Sistema) que adapti placeholders, consells i validació.
- Implementar validació guiada en temps real amb missatges útils i exemples a la barra lateral.
- Guardar un historial de funcions recents a `localStorage` amb opcions per reutilitzar i eliminar entrades.

### Fase 2 – Inequacions a la gràfica
- Actualitzar el parser per detectar comparadors (`<`, `>`, `≤`, `≥`) i transformar-los en expressió algebraica (`lhs - rhs`).
- Dibuixar la corba frontera com a dataset de línia i aplicar ombrejat semitransparent a la zona que compleix la desigualtat.
- Gestionar inequacions en `x` (p. ex. `x ≥ 2`) amb datasets verticals i etiquetes clares.
- Destacar punts rellevants (interseccions, canvis de signe) i mostrar-los en el panell lateral amb explicacions.

### Fase 3 – Sistemes d'equacions i inequacions
- Permetre agrupar diverses expressions en un mateix problema i configurar la seva resolució conjunta.
- Implementar solució exacta per a sistemes lineals 2x2 amb `math.lusolve` i aproximacions numèriques per a casos no lineals.
- Visualitzar punts solució amb marques destacades (`P1`, `P2`) i llistar-los en una taula de resultats.
- Per a sistemes d'inequacions, calcular i mostrar la intersecció de zones ombrejades amb diferències de color i llegenda.

### Fase 4 – Experiència d'usuari i didàctica
- Afegir un panell d'ajuda amb guies pas a pas, GIF o vídeos curts i exemples curriculars de la LOMLOE.
- Incorporar un mode guia que expliqui el procediment de resolució (suport LaTeX amb MathJax/KaTeX).
- Permetre exportar gràfiques i resultats a PDF o Google Drive per facilitar la compartició a Classroom.
- Millorar l'accessibilitat (mode alt contrast, navegació amb teclat, descripció de colors per daltonisme).

### Fase 5 – Captura i reconeixement d'expressions
- Preparar un mòdul `input/capture.js` amb interfície clara (`analyzeImage(file): Promise<string>`).
- Implementar la càrrega d'imatges i la seva gestió local mentre s'estudia l'API d'OCR/Math (Mathpix o alternatives).
- Crear un modal de revisió perquè l'usuari confirmi o editi l'expressió abans de graficar-la.
- Definir polítiques de privadesa i consentiment per a l'ús de dades, especialment en context educatiu.

## Properes passes immediates
1. Refactoritzar l'estructura de fitxers i corregir tots els problemes de codificació de text.
2. Especificar en un document breu els requisits funcionals del teclat virtual i dels modes d'entrada.
3. Implementar el suport d'inequacions amb ombrejat i punts destacats, validant-lo amb exemples propis del currículum.
4. Dissenyar la taula de resultats i la visualització per als sistemes, incloent proves amb casos lineals i no lineals.
