# Repte de la taula periòdica

## Contingut del repositori

- `index.html`: esquelet de laplicació i estructura HTML principal.
- `styles.css`: disseny visual amb èmfasi en una estètica molt acolorida i responsiva.
- `app.js`: lògica del joc, gestió de dificultats, temps, feedback i enviament de resultats.
- `elementsData.js`: catàleg dels 118 elements amb posicions i categories per muntar la taula.
- `config.js`: punt únic de configuració per afegir la URL de Google Apps Script.

## Com executar el joc

1. Obre el fitxer `index.html` amb el teu navegador (Chrome recomanat).
2. Introdueix el nom i cognom i tria el nivell de dificultat.
3. Comença la partida i identifica els elements a partir del símbol que apareix al focus central.
4. Aconsegueix 10 encerts seguits abans que sacabi el temps. Podràs reiniciar el repte sempre que vulguis.

### Suggeriment per a docència

- Pots allotjar el projecte a [GitHub Pages](https://pages.github.com) o bé compartir el fitxer `index.html` mitjançant Google Classroom.
- Si fas servir Classroom, afegeix instruccions perquè els alumnes introdueixin el seu nom i cognom real per registrar lactivitat.

## Configuració de lenviament a Google Sheets

1. **Crea el full de càlcul** a Google Drive amb les columnes: `Nom`, `Nivell`, `Encerts`, `Marca de temps`.
2. **Obre Apps Script** des del full (`Extensions → Apps Script`).
3. **Enganxa aquest codi** a `Code.gs`:

   ```javascript
   function doPost(e) {
     const SHEET_NAME = 'Full1'; // Canvia-ho si cal
     const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
     const body = JSON.parse(e.postData.contents);
     sheet.appendRow([
       body.name,
       body.difficulty,
       body.completedStreak,
       new Date(body.timestamp || Date.now()),
     ]);
     return ContentService.createTextOutput(
       JSON.stringify({ success: true })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```

4. **Desplega el servei web** (`Desplega → Desplegaments → Nou desplegament`).
   - Tipus: *Aplicació web*
   - Executal com a: *Tu*
   - Accés: *Qualsevol persona amb lenllaç*
5. **Copia la URL del desplegament** i enganxa-la a `config.js`:

   ```javascript
   export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/EL-TEU-ID/exec";
   ```

6. Desa els canvis i recarrega el joc. Quan un jugador acabi amb 10 encerts, podrà enviar el resultat i el trobaràs al full.

> **Nota:** Si prefereixes mantenir laplicació local, també pots fer servir un servei intermedi (p. ex. Make, n8n) que rebi la petició `POST` i guardi les dades al teu flux habitual.

## Adaptació i ampliació

- Pots modificar les llistes delements per dificultat a `app.js` (const `BASE_POOLS`).
- Ajusta els temps límit canviant `timeLimit` dins `DIFFICULTY_CONFIG`.
- A `styles.css` trobaràs les classes `category-*` per personalitzar més els degradats de cada família delements.
- Si vols treballar competències específiques, afegeix preguntes complementàries (p. ex. un camp de resposta oberta) abans de mostrar el missatge final.

## Bones pràctiques daula

- Treballa amb parelles o petits grups per fomentar laprenentatge cooperatiu.
- Crea rúbriques ràpides a Google Classroom per valorar no només lencert sinó també largumentació.
- Després del joc, proposa als alumnes elaborar una infografia (Canva) sobre un element que els hagi costat identificar.
