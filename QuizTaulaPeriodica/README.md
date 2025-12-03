# Repte de la taula periòdica

Aplicació web per reforçar la identificació dels elements químics a partir del seu símbol. L’objectiu és encertar deu elements consecutius en el mínim temps possible, gestionant la pressió del cronòmetre i els diferents nivells de dificultat.

## Funcionalitats destacades
- Interfície responsive optimitzada per projector, pissarra digital o portàtil.
- Cinc nivells de dificultat que combinen temps disponible i pool d’elements.
- Modal d’instruccions accessible des de la icona `❓` amb un resum del repte.
- Pantalla de rànquing en tres columnes (Normal, Difícil i Molt difícil) amb icones `⏳` i `📅` per destacar el temps i la data respectivament.
- Rànquing automàtic alimentat per Google Sheets amb memòria cau de 60 segons i opció de refrescar manualment.
- Seguiment de la ratxa d’encerts, temps total i enviament opcional del resultat mitjançant Apps Script.

## Com s’hi juga
1. Escriu el teu nom a la targeta de configuració inicial.
2. Selecciona el nivell de dificultat que vols practicar.
3. Revisa les instruccions amb la icona `❓` si necessites un recordatori ràpid.
4. Prem “Comença el repte” i tria l’element que correspon al símbol il·luminat.
5. Aconsegueix una ratxa de 10 encerts consecutius; qualsevol error reinicia la seqüència.
6. En acabar, pots enviar el resultat (nom, puntuació, nivell i temps) al full compartit.
7. Consulta els millors registres amb la icona `🏆`; els nivells es mostren en paral·lel perquè la comparativa sigui immediata.

## Integració amb Google Sheets
### Preparar el full de càlcul
1. Crea un full amb les columnes `Nom`, `Puntuació`, `Nivell`, `Temps`, `Data`.
2. Comparteix-lo en mode “Qualsevol amb l’enllaç pot veure” per permetre la lectura del rànquing.

### Publicar l’endpoint Apps Script
1. A **Extensions → Apps Script**, enganxa aquest codi a `Code.gs`:
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
2. Desa el projecte i publica’l com a **Aplicació web** (execució com a tu, accés per a qualsevol amb l’enllaç).
3. Copia la URL de desplegament i enganxa-la a `GOOGLE_SCRIPT_URL` dins `config.js`.

### Configurar la lectura del rànquing
- Copia l’ID del full i el `gid` de la pestanya pública i assigna’ls a `LEADERBOARD_SHEET_ID` i `LEADERBOARD_SHEET_GID`.
- L’app consulta el full via `https://docs.google.com/spreadsheets/d/<ID>/gviz/tq?gid=<GID>`; no cal cap `doGet` personalitzat.

## Configuració inicial del projecte
1. Clona o descarrega el repositori (ex.: `I:\La meva unitat\Github\QuizTaulaPeriodica`).
2. Obre `index.html` directament al navegador; no cal servidor local.
3. Revisa `config.js` i actualitza les constants de connexió segons el teu full i Apps Script.

## Estructura del projecte
- `index.html`: estructura, capçalera i modals (instruccions i rànquing).
- `styles.css`: estils generals, temàtica visual, graella de rànquing i estats interactius.
- `app.js`: lògica del joc, temporitzadors, gestió de nivells, enviament i lectura de resultats.
- `elementsData.js`: catàleg complet dels elements químics (nom, símbol, número atòmic, categoria).
- `config.js`: valors de configuració per a Apps Script i Google Sheets.

## Personalització
- Ajusta temps, pools o recompenses a `app.js` (`BASE_POOLS`, `DIFFICULTY_CONFIG`).
- Modifica colors, gradients i tipografies a `styles.css` per adaptar-los al vostre centre.
- Canvia els textos de suport a `index.html` o les cadenes definides a `app.js`.
- Afegeix noves mètriques al rànquing ampliant la renderització i el full de càlcul.

## Bones pràctiques a l’aula
- Comença pels nivells més assequibles i augmenta la dificultat a mesura que l’alumnat guanya confiança.
- Emmarca l’activitat amb rúbriques a Google Classroom per valorar estratègies i constància.
- Demana a cada alumne que investigui un element nou i elabori una infografia amb Canva com a tasca d’ampliació.
- Exporta els resultats per treballar estadística bàsica (mitjana de temps, percentatge d’encerts, rànquing per classes, etc.).

## Crèdits i llicència
Projecte desenvolupat per Felip Sarroca amb assistència de la IA i inspirat en una idea d’E. Boixader. Llicència [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).


