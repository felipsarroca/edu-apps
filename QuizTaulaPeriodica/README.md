# Repte de la taula periòdica

Aplicació web per treballar el reconeixement dels elements químics a partir del seu símbol. El repte consisteix a encertar 10 elements consecutius en el menor temps possible, amb pistes visuals i nivells de dificultat graduats.

## Característiques principals
- Interfície responsiva pensada per projector, pissarra digital o ordinador portàtil.
- Cinc nivells de dificultat que controlen el temps disponible i el conjunt d'elements que poden aparèixer.
- Botó d'ajuda visible (icona "?") que obre un resum de les instruccions sense sortir de la partida.
- Seguiment automàtic de la ratxa d'encerts i del temps total emprat.
- Possibilitat d'enviar el resultat final a un registre extern quan el repte es completa en nivell normal, difícil o molt difícil.

## Fitxers principals
- `index.html`: estructura de la pàgina i components del joc.
- `styles.css`: estilisme general, taula periòdica i modalitats emergents.
- `app.js`: lògica del joc, gestió dels nivells, temporitzadors i enviament de dades.
- `elementsData.js`: catàleg complet amb la informació de cada element químic.
- `config.js`: punt de configuració per indicar l'URL del teu Google Apps Script.

## Requisits
- Navegador modern (Chrome, Edge, Firefox o Safari) amb JavaScript habilitat.
- Per registrar resultats: un compte de Google amb accés a Google Sheets i Apps Script.

## Posada en marxa
1. Clona o descarrega el repositori a la teva carpeta de treball (`I:\Mi unidad\Github` si segueixes la mateixa estructura).
2. Obre `index.html` amb el navegador. No cal servidor web.
3. (Opcional) Edita `config.js` i afegeix l'URL del teu Apps Script per habilitar l'enviament de resultats.

## Funcionament del joc
1. Escriu el nom i cognoms a la targeta de configuració inicial.
2. Tria el nivell de dificultat que vulguis practicar.
3. Si tens dubtes, clica el botó circular amb el símbol `?` per llegir les instruccions resumides.
4. Prem "Comença el repte" i identifica l'element correcte cada vegada que aparegui un símbol destacat.
5. Cal aconseguir 10 encerts seguits. Qualsevol error reinicia la ratxa.
6. En finalitzar la partida en nivell normal, difícil o molt difícil, apareix una finestra modal per enviar (o no) el resultat.

## Nivells de dificultat
| Nivell | Temps per pregunta | Conjunt d'elements |
| --- | --- | --- |
| Molt fàcil | 20 s | Elements bàsics (grup starter)
| Fàcil | 17 s | Starter + part del grup central
| Normal | 14 s | Starter + grup central complet + primers avançats
| Difícil | 11 s | Starter + central + avançats complets
| Molt difícil | 9 s | Tots els anteriors + elements més rars

## Enviament dels resultats a Google Sheets
1. Crea un full de càlcul i prepara una pestanya amb les columnes `Nom`, `Puntuació`, `Nivell`, `Temps` i `Data`.
2. Obre **Extensions → Apps Script** i enganxa aquest codi a `Code.gs`:
   ```javascript
   function doPost(e) {
     const SHEET_NAME = 'Full1';
     const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
     const { nom, puntuacio, nivell, temps } = e.parameter;
     sheet.appendRow([
       nom,
       puntuacio,
       nivell,
       temps,
       new Date(),
     ]);
     return ContentService.createTextOutput('OK');
   }
   ```
3. Desa el projecte i publica'l com a **Aplicació web** (accés: qualsevol amb l'enllaç, executar com a tu).
4. Copia la URL del desplegament i defineix-la a `config.js`:
   ```javascript
   export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/EL-TEU-ID/exec";
   ```
5. Desa canvis i recarrega el joc. Quan un/a alumne/a finalitzi el repte en nivell admissible, podrà enviar el registre; el missatge "Resultats enviats correctament" confirma l'enviament.

> Si prefereixes registrar les dades amb un altre sistema (Make, n8n, servidor propi), adapta la petició `POST` que el joc envia amb els camps `nom`, `puntuacio`, `nivell` i `temps`.

## Personalització
- Modifica la configuració temporal o els conjunts d'elements a `app.js` (`BASE_POOLS` i `DIFFICULTY_CONFIG`).
- Ajusta els colors de cada família d'elements a `styles.css` (classes `category-*`).
- Canvia o tradueix els textos de suport editant `index.html` i les constants d'`app.js`.
- Afegeix més apartats d'instruccions al modal si treballes competències específiques.

## Bones pràctiques a l'aula
- Fes que l'alumnat comenci en nivells fàcil o molt fàcil i puja la dificultat quan guanyi seguretat.
- Complementa l'activitat amb rúbriques a Google Classroom que valorin el procediment i la justificació.
- Després del repte, proposa investigar un element desconegut i crear una infografia amb Canva.
- Utilitza els resultats exportats per treballar estadística bàsica (mitjana de temps, percentatges d'encert, etc.).

## Crèdits i llicència
Projecte desenvolupat per Felip Sarroca amb assistència de la IA i basat en una idea d'E. Boixader. Llicència [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).
