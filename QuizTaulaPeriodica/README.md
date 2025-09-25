# Repte de la taula periòdica

Aplicació web per treballar el reconeixement dels elements químics a partir del seu símbol. El repte consisteix a encertar 10 elements consecutius en el menor temps possible, amb pistes visuals i nivells de dificultat graduats.

## Característiques principals
- Interfície responsiva pensada per projector, pissarra digital o ordinador portàtil.
- Cinc nivells de dificultat que controlen el temps disponible i el conjunt d'elements que poden aparèixer.
- Botó d'ajuda visible (icona "?") amb les instruccions resumides del joc.
- Nou rànquing automàtic amb els tres millors temps per nivell (normal, difícil i molt difícil) llegits directament del full de càlcul.
- Seguiment automàtic de la ratxa d'encerts, del temps total i opcions per compartir el resultat.

## Fitxers principals
- `index.html`: estructura de la pàgina i components del joc.
- `styles.css`: estilisme general, modalitats i rànquing.
- `app.js`: lògica del joc, gestió dels nivells, temporitzadors, enviament i lectura de resultats.
- `elementsData.js`: catàleg complet amb la informació de cada element químic.
- `config.js`: punt de configuració per indicar l'URL del teu Google Apps Script.

## Requisits
- Navegador modern (Chrome, Edge, Firefox o Safari) amb JavaScript habilitat.
- Per registrar i consultar resultats: un compte de Google amb accés a Google Sheets i Apps Script.

## Posada en marxa
1. Clona o descarrega el repositori a la teva carpeta de treball (`I:\Mi unidad\Github` si segueixes la mateixa estructura).
2. Obre `index.html` amb el navegador. No cal servidor web.
3. (Opcional) Edita `config.js` i afegeix l'URL del teu Apps Script per habilitar l'enviament i la consulta del rànquing.

## Funcionament del joc
1. Escriu el nom i cognoms a la targeta de configuració inicial.
2. Tria el nivell de dificultat que vulguis practicar.
3. Si tens dubtes, clica el botó circular amb el símbol `?` per llegir les instruccions resumides.
4. Prem "Comença el repte" i identifica l'element correcte cada vegada que aparegui un símbol destacat.
5. Cal aconseguir 10 encerts seguits. Qualsevol error reinicia la ratxa.
6. En finalitzar la partida en nivell normal, difícil o molt difícil, apareix una finestra modal per enviar (o no) el resultat.

El rànquing es mostra a la columna esquerra: l'app descarrega periòdicament els registres del full i n'exhibeix els tres millors temps per cada nivell (temps ascendent i, si cal, ordre per data). Els resultats es cachegen durant 60 segons per evitar crides innecessàries. El botó "Actualitza" força una nova consulta; si el full no està configurat es mostra un avís.

## Nivells de dificultat
| Nivell | Temps per pregunta | Conjunt d'elements |
| --- | --- | --- |
| Molt fàcil | 20 s | Elements bàsics (grup starter)
| Fàcil | 17 s | Starter + part del grup central
| Normal | 14 s | Starter + grup central complet + primers avançats
| Difícil | 11 s | Starter + central + avançats complets
| Molt difícil | 9 s | Tots els anteriors + elements més rars

## Configuració de l'enviament i del rànquing (Apps Script)
1. Crea un full de càlcul i prepara una pestanya amb les columnes `Nom`, `Puntuació`, `Nivell`, `Temps` i `Data` (fila d'encapçalaments inclosa).
2. Obre **Extensions → Apps Script** i enganxa aquest codi a `Code.gs`:
   ```javascript
   const SHEET_NAME = 'Full1';

   function doPost(e) {
     const sheet = getSheet();
     const params = e.parameter;
     const now = new Date();

     sheet.appendRow([
       params.nom || '',
       Number(params.puntuacio || params.score || 0),
       params.nivell || '',
       params.temps || '',
       now,
     ]);

     return createResponse({ success: true });
   }

   function doGet(e) {
     const action = (e.parameter.action || '').toLowerCase();

     if (action === 'leaderboard') {
       const sheet = getSheet();
       const values = sheet.getDataRange().getValues();
       values.shift(); // elimina la fila d'encapçalaments

       const entries = values
         .filter((row) => row[0])
         .map((row) => ({
           nom: row[0],
           puntuacio: row[1],
           nivell: row[2],
           temps: row[3],
           dataISO: row[4] instanceof Date ? row[4].toISOString() : row[4],
         }));

       return createResponse({ entries });
     }

     return createResponse({ ok: true });
   }

   function getSheet() {
     const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
     if (!sheet) {
       throw new Error(`No s'ha trobat la pestanya ${SHEET_NAME}`);
     }
     return sheet;
   }

   function createResponse(payload) {
     return ContentService.createTextOutput(JSON.stringify(payload))
       .setMimeType(ContentService.MimeType.JSON)
       .setHeader('Access-Control-Allow-Origin', '*');
   }
   ```
3. Desa el projecte i publica'l com a **Aplicació web** (accés: qualsevol amb l'enllaç, executar com a tu).
4. Copia la URL del desplegament i defineix-la a `config.js`:
   ```javascript
   export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/EL-TEU-ID/exec";
   ```
5. Desa canvis i recarrega el joc. L'app enviarà les dades via `POST` (amb `FormData`) i llegirà el rànquing amb una petició `GET` (`?action=leaderboard`).

> Si prefereixes un altre servei de backend (Make, n8n, servidor propi), caldrà reproduir la mateixa API: acceptar `nom`, `puntuacio`, `nivell`, `temps` via `POST` i retornar un JSON amb la clau `entries` per al rànquing.

## Personalització
- Modifica la configuració temporal o els conjunts d'elements a `app.js` (`BASE_POOLS` i `DIFFICULTY_CONFIG`).
- Ajusta els colors de cada família d'elements a `styles.css` (classes `category-*`).
- Adapta els textos mostrats a la interfície editant `index.html` o les constants d'`app.js`.
- Afegeix noves seccions al modal d'instruccions o extén el rànquing amb altres mètriques segons les teves necessitats.

## Bones pràctiques a l'aula
- Comença en nivells més assequibles i puja la dificultat quan l'alumnat guanyi seguretat.
- Complementa l'activitat amb rúbriques a Google Classroom que valorin procediments i justificació.
- Després del repte, proposa investigar un element desconegut i crear una infografia amb Canva.
- Utilitza els resultats exportats per treballar estadística bàsica (mitjana del temps, percentatges d'encert, etc.).

## Crèdits i llicència
Projecte desenvolupat per Felip Sarroca amb assistència de la IA i basat en una idea d'E. Boixader. Llicència [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).
