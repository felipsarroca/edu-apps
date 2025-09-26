# Repte de la taula periòdica

Aplicació web per treballar el reconeixement dels elements químics a partir del seu símbol. El repte consisteix a encertar 10 elements consecutius en el menor temps possible, amb pistes visuals i nivells de dificultat graduats.

## Característiques principals
- Interfície responsiva pensada per projector, pissarra digital o ordinador portàtil.
- Cinc nivells de dificultat que controlen el temps disponible i el conjunt d'elements que poden aparèixer.
- Icona d'ajuda (❓) amb les instruccions resumides del joc i icona de rànquing (🏆) per desplegar els cinc millors resultats per nivell (Normal, Difícil i Molt difícil).
- Rànquing automàtic alimentat des d'un full de càlcul de Google Sheets (lectura en temps real i memòria cau de 60 s).
- Seguiment automàtic de la ratxa d'encerts, del temps total i possibilitat d'enviar el resultat final.

## Fitxers principals
- `index.html`: estructura de la pàgina, capçalera amb icones i modals.
- `styles.css`: estilisme general, modalitats, icones circulars i rànquing.
- `app.js`: lògica del joc, gestió de nivells, temporitzadors, enviament i lectura de resultats.
- `elementsData.js`: catàleg complet amb la informació de cada element químic.
- `config.js`: punt de configuració per indicar la URL d'Apps Script i la graella pública del rànquing.

## Requisits
- Navegador modern (Chrome, Edge, Firefox o Safari) amb JavaScript habilitat.
- Per registrar i consultar resultats: un compte de Google amb accés a Google Sheets i Apps Script i un full compartit en mode lectura pública.

## Posada en marxa
1. Clona o descarrega el repositori a la teva carpeta de treball (`I:\Mi unidad\Github` si segueixes la mateixa estructura).
2. Obre `index.html` amb el navegador (no cal servidor web).
3. Edita `config.js` i revisa aquestes constants:
   ```javascript
   export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/EL-TEU-ID/exec";
   export const LEADERBOARD_SHEET_ID = "1-W01-KZ1v7PVAQc72pHth9h-CkAAcDBJrBqqsfUd8ZU";
   export const LEADERBOARD_SHEET_GID = "0";
   ```
   - `GOOGLE_SCRIPT_URL`: servei Apps Script que rep els resultats (vegeu la secció següent).
   - `LEADERBOARD_SHEET_ID` / `GID`: identificadors del full de càlcul públic des d'on es llegirà el rànquing. Si canvies de full, actualitza aquests valors.
4. Comparteix el full de càlcul perquè qualsevol amb l'enllaç el pugui veure (sense necessitat d'inici de sessió) i guarda els canvis.

## Funcionament del joc
1. Escriu el nom i cognoms a la targeta de configuració inicial.
2. Tria el nivell de dificultat que vulguis practicar.
3. Si tens dubtes, clica la icona `❓` per llegir les instruccions.
4. Prem "Comença el repte" i identifica l'element correcte cada vegada que aparegui un símbol destacat.
5. Cal aconseguir 10 encerts seguits. Qualsevol error reinicia la ratxa.
6. En finalitzar la partida en nivell normal, difícil o molt difícil, apareix una finestra modal per enviar (o no) el resultat.
7. La icona `🏆` de la capçalera mostra el rànquing: cinc millors resultats en els nivells Normal, Difícil i Molt difícil (ordenats per punts, temps i data). Pots forçar una nova consulta amb el botó "Actualitza".

## Configuració del full de resultats
1. Crea un full de càlcul (pestanya `Resultats`, per exemple) amb les columnes `Nom`, `Puntuació`, `Nivell`, `Temps`, `Data`.
2. Obre **Extensions → Apps Script** i enganxa aquest codi a `Code.gs` per registrar les partides via `POST`:
   ```javascript
   const SHEET_NAME = 'Resultats';

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

     return ContentService.createTextOutput(JSON.stringify({ success: true }))
       .setMimeType(ContentService.MimeType.JSON)
       .setHeader('Access-Control-Allow-Origin', '*');
   }

   function getSheet() {
     const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
     if (!sheet) {
       throw new Error(`No s'ha trobat la pestanya ${SHEET_NAME}`);
     }
     return sheet;
   }
   ```
3. Desa el projecte i publica'l com a **Aplicació web** (accés: qualsevol amb l'enllaç, executar com a tu) i copia la URL al `config.js`.
4. Perquè el rànquing funcioni, publica o comparteix el full en mode "Qualsevol amb l'enllaç pot veure". L'app fa servir l'endpoint `gviz/tq` de Google Sheets per llegir les dades, de manera que no cal cap `doGet` personalitzat.

> Si prefereixes un altre servei de backend (Make, n8n, servidor propi), replica la mateixa API: rep `nom`, `puntuacio`, `nivell`, `temps` via `POST` i escriu-los al full; assegura't que el full resultant continua sent accessible en lectura.

## Personalització
- Modifica la configuració temporal o els conjunts d'elements a `app.js` (`BASE_POOLS` i `DIFFICULTY_CONFIG`).
- Ajusta els colors i l'aspecte general a `styles.css` (classes `category-*`, `circle-trigger`, etc.).
- Adapta els textos mostrats a la interfície editant `index.html` o les constants d'`app.js`.
- Afegeix més seccions al modal d'instruccions o noves mètriques al rànquing segons les necessitats del teu centre.

## Bones pràctiques a l'aula
- Comença en nivells més assequibles i puja la dificultat quan l'alumnat guanyi seguretat.
- Complementa l'activitat amb rúbriques a Google Classroom que valorin procediments i justificació.
- Després del repte, proposa investigar un element desconegut i crear una infografia amb Canva.
- Utilitza els resultats exportats per treballar estadística bàsica (mitjana del temps, percentatges d'encert, etc.).

## Crèdits i llicència
Projecte desenvolupat per Felip Sarroca amb assistència de la IA i basat en una idea d'E. Boixader. Llicència [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).
