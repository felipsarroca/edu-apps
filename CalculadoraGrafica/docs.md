# Especificació: teclat virtual i modes d’entrada

## 1. Context i objectiu
- Millorar l’experiència d’entrada d’expressions matemàtiques perquè l’alumnat pugui treballar funcions, inequacions i sistemes sense errors de sintaxi.
- Proporcionar un teclat virtual optimitzat per símbols habituals i un selector de modes que adapti la interfície, els consells i la validació.
- Alinear l’eina amb l’ús a l’aula (ESO) i amb dispositius diversos (pantalla tàctil, portàtil i escriptori).

## 2. Modes d’entrada
### 2.1 Tipus
- **Funció:** expressions del tipus `y = f(x)` o directament `f(x)`.
- **Inequació:** desigualtats de la forma `y ≥ f(x)`, `f(x) < g(x)`, `x > 3`, etc.
- **Sistema:** conjunt ordenat d’equacions i/o inequacions que es resolen conjuntament.

### 2.2 Comportament general
- Selector visual (pestanyes o botons) situat damunt del camp d’entrada.
- El mode actiu defineix:
  - Placeholder del camp (`Exemple: y = 2*x + 3`, `Exemple: y ≥ x^2`, `Exemple: { y = x + 1 ; y = -x }`).
  - Exemple destacat a la secció d’exemples.
  - Validacions específiques i missatges d’ajuda contextuals.
- Canvi de mode:
  - Si hi ha text al camp, demanar confirmació abans de canviar per evitar pèrdua accidental.
  - Permetre recordar el mode preferit en `localStorage`.

## 3. Teclat virtual
### 3.1 Disposició
- Teclat plegable sota el camp d’entrada.
- Tres files principals:
  1. Caràcters bàsics: `x`, `y`, `z`, `=`, `<`, `>`, `≤`, `≥`, `≠`.
  2. Operadors i funcions: `+`, `-`, `×`, `÷`, `^`, `√`, `| |`, `abs`, `ln`, `log`, `exp`.
  3. Quantitats especials i parèntesis: `π`, `e`, `(`, `)`, `[`, `]`, `{`, `}`, `,`.
- Botons addicionals:
  - `frac` → insereix patró `()/()`.
  - `pow` → insereix patró `()^()`.
  - `undo`, `redo` (gestió local dins el camp).
  - `⌫` (esborrar) i `Enter` (equivalent a “Dibuixar”).

### 3.2 Interacció
- Cada botó insereix text a la posició del cursor del `input` (respectant la selecció activa).
- Implementar amb `document.execCommand` (fallback) o `setRangeText` per suport modern.
- Accessible amb teclat: tabulació per recórrer botons, `Space/Enter` per activar-los.
- Estat “enganxa” (toggle) per botons com `| |` i `√` introdueix plantilles amb parèntesis marcats i cursor col·locat al centre (usar `selectionStart`/`selectionEnd`).

### 3.3 Visibilitat
- Icona o botó “Teclat” amb estat plegat/ desplegat; recordar preferència en `localStorage`.
- Auto-obrir en pantalles tàctils (detectar `pointer` principal `touch`).

### 3.4 Accessibilitat i didàctica
- Etiquetes `aria-label` descriptives (`"insereix símbol menor o igual"`).
- Tooltip breu amb explicació i exemple (`≤ — desigualtat inclosa`).
- Integrar curt vídeo/gif (futur) que mostri cómo usar el teclat.

## 4. Validació i missatges segons mode
### 4.1 Funció
- Accepta expressions amb `x` com a variable principal.
- Missatge d’error si no hi ha `x` o s’usa `=` incorrectament.
- Suggeriments automàtics: llista de funcions (`sin`, `cos`, `tan`, `abs`, `sqrt`, `log`, `exp`).

### 4.2 Inequació
- Detectar comparadors `<`, `>`, `≤`, `≥`, `≠`.
- Si l’expressió no conté comparador, advertir i oferir conversió (`Vols fer servir el mode Funció?`).
- Si hi ha diverses variables, avisar que actualment només es representa en termes de `x` i `y`.
- Mostrar avís quan s’escriu una inequació que requereix resolució en `x` (ex. `2x + 3 > 7`), indicant que es dibuixarà la regió vertical.

### 4.3 Sistema
- Formulari dinàmic amb llistat d’entrades (cada línia una expressió). Botons `+` i `-` per afegir/eliminar.
- Validació individual per expressió (funció o inequació). Cal indicar clarament quina línia conté l’error.
- Opció per etiquetar el sistema (p. ex. “Sistema 1”) i mostrar-ho a la llista de funcions actives.

## 5. Integració tècnica
### 5.1 Componentització
- Nou mòdul `src/keyboard.js` per gestionar:
  - Estat de visibilitat.
  - Construcció de botons i esdeveniments.
  - Funció `insertSymbol(symbol | template)` reutilitzable.
- Nou mòdul `src/modes.js`:
  - Defineix configuració per mode (`id`, `label`, `placeholder`, `examples`, `validators`).
  - Exporta `setMode(modeId)` i emet `CustomEvent('modechange')`.
  - Consumit per `main.js` per actualitzar UI i `store` per etiquetar entrades.

### 5.2 Estat i persistència
- Afegir a `store`:
  - `currentMode`.
  - Historial d’expressions per mode (`recentExpressions[modeId]`, max 10).
- Guardar `currentMode` i preferències del teclat a `localStorage`.

### 5.3 UI existent
- La secció “Exemples per provar” es transforma en contenidor dinàmic alimentat pel mode (`mode.examples`).
- Botons principals (`Dibuixar`, `Netejar`) segueixen funcionament actual però passen `modeId` i tipus (funció/inequació/sistema) al `store`.
- Llista de funcions actives mostra `badge` amb el mode (`Func`, `Ineq`, `Sist`).

### 5.4 Futur OCR i integració
- El teclat i els modes han d’exposar una API perquè el futur mòdul d’imatge pugui:
  - Establir mode automàtic segons l’expressió detectada.
  - Emplenar el camp d’entrada i obrir el teclat si cal revisió.

## 6. Proves i validacions
- **Unitàries:** funcions d’inserció i validació (per mode) testejades amb casuística bàsica.
- **UX:** taula de proves manuals (dispositiu, navegador, interaccions tàctils vs ratolí).
- **Avaluació pedagògica:** recollir feedback d’alumnat (p. ex. classe pilot) i docents sobre claredat de símbols i missatges.

## 7. Tasques derivades
1. Implementar `src/modes.js` i adaptar `main.js` i `ui.js` a la nova estratègia d’estat.
2. Desenvolupar `src/keyboard.js` amb la disposició definida i integració amb el camp d’entrada.
3. Actualitzar els estils (`styles/main.css`) per al selector de modes i el teclat (responsive + accessible).
4. Afegir validacions per mode i missatges contextuals (posiblement component `src/messages.js`).
5. Preparar proves manuals + scripts de smoke test (p. ex. `npm run lint` si s’introdueixen eines).

## 8. Requisits detallats per inequacions i sistemes

### 8.1 Model de dades
- Estendre cada entrada del `store` amb:
  - `mode` (`'function' | 'inequality' | 'system'`).
  - `expressions` (array d’expressions; per funció i inequació conté un únic element).
  - `metadata` (objecte amb informació calculada: punts clau, tipus de desigualtat, domini).
- Nova estructura `results`:
  ```js
  {
    type: 'point' | 'region' | 'line',
    label: 'P1',
    coordinates: { x: 2, y: -1 },
    description: 'Intersecció y = 2x i y = x + 3',
  }
  ```
  Guardada per entrada per mostrar-se a la barra lateral.

### 8.2 Inequacions – gràfica
- Transformar cada desigualtat en `f(x, y) ≤ 0`:
  - Cas `y` explícit: `y - f(x)` (per < o ≤) o `f(x) - y` (per > o ≥).
  - Cas `x`: `x - c` o `c - x`.
  - Cas general `lhs(x,y) - rhs(x,y)`.
- Generar dataset de contorn (igualtat) reutilitzant lògica actual.
- Crear dataset d’ombra:
  - Grid de punts dins del rang visible (`SAMPLE_POINTS` per eix → 40k punts màxim; optimitzar reduint resolució i usant `ImageData` si cal).
  - Assignar `pointBackgroundColor` semitransparent (`rgba(color, 0.15)`).
  - Alternativa: ús de `filler` de Chart.js amb `fill: 'origin'` quan l’inequació és respecte a `y`.
- Mostrar llegenda textual: “Zona ombrejada = solucions”.

### 8.3 Inequacions – feedback
- Calcular punts de canvi:
  - Arrels de `f(x) = 0` dins del rang (usar `math.solve` o `math.nroots` si es disponible; sinó aproximació numèrica).
  - Interseccions amb eixos (`y = 0` i `x = 0`).
- Mostrar taula amb intervals i signe (`x < -2 → compleix`).
- Missatges pedagògics (“En aquesta zona, les `y` es troben per damunt de la paràbola”).

### 8.4 Sistemes – resolució
- Per cada sistema, generar objecte:
  ```js
  {
    type: 'system',
    equations: [...],
    inequalities: [...],
    solutions: [...],
  }
  ```
- **Lineals 2x2:** construir matriu `A` i vector `b`, cridar `math.lusolve`.
- **Lineals 3x3:** opcional; si es detecten tres equacions, avisar que només es graficaran projeccions en 2D.
- **No lineals:** aplicar mostra de punts dins del rang (grid adaptatiu), detectar canvis de signe i refinar (mètode de bisecció en 2D).
- Integrar amb Chart.js:
  - Dibuixar cada expressió com dataset separat amb color compartit.
  - Afegir punts solució com dataset `scatter` amb radi major (p.ex. 6px).

### 8.5 UI/UX
- Llista lateral:
  - Mostrar etiqueta `[Func] y = …`, `[Ineq] y ≥ …`, `[Sist] { y = … ; y = … }`.
  - Botó per desplegar resultats (`accordió`) amb punts i explicacions.
- Canvas:
  - Tooltip personalitzat que indiqui si el cursor és dins la zona-solució (inequacions/sistemes).
  - Possibilitat de destacar punts quan es passa per la llista (hover sincronitzat).
- Missatges d’error:
  - Inequacions amb operador incompatible → avisar.
  - Sistemes amb nombre d’expressions insuficient → “Cal com a mínim dues expressions”.

### 8.6 Prestacions i optimització
- Gestionar rendiment limitant el nombre de punts per dataset (adaptar `SAMPLE_POINTS` segons zoom).
- Desactivar transicions de Chart.js en datasets d’ombra per evitar retard.
- Reutilitzar resultats calculats mentre el rang visible no canvia per reduir recomputació.

### 8.7 Proves
- Casos a validar (manuals i automàtics):
  - `y ≥ x^2`, `x ≥ -1`, `|x| < 3`.
  - Sistema: `{ y = x + 2, y = -x }`, `{ y ≥ x, y ≤ 2 }`.
  - Errors: `y => x^2`, `x >< 3`, `y =`.
- Mesurar temps de resposta amb intervals d’ús real (fins a 4 expressions simultànies).
