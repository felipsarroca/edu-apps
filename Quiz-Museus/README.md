# Quiz dels museus

Aplicació web educativa per entrenar el reconeixement visual d'obres del **Museo del Prado** i del **Museo Reina Sofía**. L'objectiu és arribar a 100 punts identificant **títol** o **autor** d'una obra amb temps limitat i bonus per velocitat.

**Captures de pantalla**

![Pantalla inicial](Captura-App%20(1).JPG)

![Pantalla de joc](Captura-App%20(2).JPG)

![Rànquing](Captura-App%20(3).JPG)

**Com funciona**

1. Escriu el nom i cognom.
2. Tria el museu.
3. Comença la partida.
4. A cada ronda es mostra una imatge i **només una pregunta**: títol o autor (a l'atzar).
5. Respon abans que s'acabi el temps.
6. Arriba a 100 punts per finalitzar la partida.

**Regles i puntuació**

- Temps per ronda: `10 s`.
- Encert: `+1 punt`.
- Bonus velocitat: `+2 punts` si respons abans de 4 s, `+3 punts` abans de 2 s.
- Error o temps esgotat: `-1 punt`.
- Objectiu final: `100 punts`.
- Guardat de rànquing: només si la puntuació final és `>= 25`.

**Rànquing**

- Mode principal: Google Apps Script (`CONFIG.rankingMode = "appsScript"`).
- L'app envia un POST amb `museum`, `playerName`, `prado`, `reina` i `clientTimestamp`.
- Lectura del rànquing: `GET ?action=top10` (si el backend retorna `top`).
- Si el backend falla, s'utilitza **localStorage** com a alternativa local.
- La taula mostra posició, nom, puntuació per museu i total combinat.

**Arquitectura**

Aplicació estàtica en `HTML + CSS + JavaScript`.

- `index.html`: estructura de pantalles (inici, joc, final) i modal de rànquing.
- `styles.css`: estil visual i responsive.
- `app.js`: motor del joc, temporitzador, puntuació i rànquing.
- `data/*.json`: dades d'obres per museu.
- `assets/<museu>/*.jpg`: imatges de les obres.

**Estructura de carpetes**

- `index.html`
- `styles.css`
- `app.js`
- `data/prado.json`
- `data/reina.json`
- `assets/prado/`
- `assets/reina/`
- `Captura-App (1).JPG`
- `Captura-App (2).JPG`
- `Captura-App (3).JPG`

**Format de dades**

Cada registre JSON té aquesta estructura:

```json
{
  "id": "prado_01",
  "museum": "prado",
  "title": "Autorretrato",
  "artist": "Alberto Durero",
  "image": "Alberto Durero - Autorretrato.jpg"
}
```

**Configuració ràpida**

1. Obre un servidor local a l'arrel del projecte.
2. Accedeix a `index.html` des del navegador.

Comandes típìques (tria'n una):

```bash
python -m http.server 5500
```

```bash
npx serve .
```

**Paràmetres clau**

Edita `app.js` per ajustar el joc:

- `CONFIG.timeLimit`: temps per ronda.
- `CONFIG.targetScore`: puntuació objectiu.
- `CONFIG.rankingMode`: `appsScript` o local.
- `CONFIG.appsScriptUrl`: URL del teu Apps Script.

**Notes d'ús**

- El nom del jugador es desa a `localStorage` per facilitar l'inici.
- El menú contextual està desactivat per evitar descàrregues d'imatges.
- Les opcions de resposta es generen automàticament amb distractors del mateix museu.

**Finalitats didàctiques (LOMLOE / currículum català)**

- Reforçar la competència **cultural i artística** a través del reconeixement visual d'obres.
- Treballar la **competència en comunicació lingüística** (títols, autors, vocabulari artístic).
- Afavorir l'**aprenentatge autònom** i la metacognició (ratxa, temps, puntuació).
- Potenciar la **competència digital** amb una eina d'autoavaluació immediata.

Possible ús a l'aula:

- Com a activitat d'inici o tancament d'una situació d'aprenentatge.
- En treball cooperatiu amb rotació de rols (jugador, observador, corrector).
- Com a repàs abans d'una prova o d'una visita museística.

**Com afegir un altre museu**

1. Crea un fitxer `data/<nou-museu>.json` amb el mateix format que els existents.
2. Crea la carpeta `assets/<nou-museu>/` i hi afegeix les imatges.
3. A `index.html`, afegeix un nou botó dins del selector de museu:
   - Exemple: `<button class="seg" data-museum="thyssen">Thyssen</button>`
4. A `app.js`, no cal tocar res si el nom del museu coincideix amb el fitxer JSON i la carpeta d'imatges.
5. Si vols que el rànquing separi el nou museu, hauràs d'actualitzar el backend (Apps Script) i la taula del rànquing.

**Com afegir més obres als museus existents**

1. Afegeix noves entrades a `data/prado.json` o `data/reina.json`.
2. Comprova que `image` coincideix exactament amb el nom del fitxer a `assets/<museu>/`.
3. Mantén `id` únics i consistents (`prado_21`, `reina_21`, etc.).
4. Evita duplicats de `title` i `artist` innecessaris per millorar la qualitat dels distractors.

**Llicència**

- Contingut sota llicència `CC BY-NC-SA 4.0`.
- Aplicació creada per Felip Sarroca amb assistència de la IA.
