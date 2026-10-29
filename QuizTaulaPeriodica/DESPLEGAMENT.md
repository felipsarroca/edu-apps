# Desplegament del rànquing

## Estat actual

- Codi Apps Script sincronitzat amb `clasp` a `apps-script/Código.js`.
- Versió immutable **16** preparada: caducitat als 9 mesos, reintents d'accés, lectura pública només de les marques vigents i històric sempre en una pestanya del document original.
- L'activador horari executa `netejaDuplicatsMillorTemps` sobre el codi actual. La darrera execució comprovada es va completar el 28/10/2026 a les 20.26 h.
- El desplegament web que utilitza `config.js` continua a la versió **15**. `clasp deploy` de la versió 16 ha retornat «Only users in the same domain as the script owner may deploy this script»; cal fer l'últim pas amb el compte del centre. La versió 15 ja llegeix les marques de la pestanya «Resultats» del document original.
- L'històric es desa a la pestanya «Històric» del mateix document original i es manté privat. La versió 16 elimina la possibilitat de crear un segon document d'històric. Inclou les marques recuperades de la còpia de seguretat i registra l'entrada, la sortida i la durada en dies de cada marca al full de resultats.
- El propietari del full i de l'script és **felip.sarroca@ramonpont.cat**. El compte **felip.sarroca@gmail.com** només hi té permís d'editor i Google li impedeix actualitzar el desplegament.
- S'ha comprovat que l'endpoint web respon amb HTTP 200 i valida les dades sense crear una marca de prova.

## Futures actualitzacions

1. Inicia sessió a Google amb **felip.sarroca@ramonpont.cat**.
2. Obre el [projecte QuizTaulaPeriodica](https://script.google.com/home/projects/1tQvVCqWPPYzTP54a_WiB120Gag_39bxvzZuY9bI3HhRnF5VFKAzTxh9T/edit).
3. Tria **Implementar → Gestionar implementaciones**.
4. Selecciona el desplegament que té la mateixa URL que `GOOGLE_SCRIPT_URL` a `config.js`. **Edita aquest desplegament**; no en creïs un de nou.
5. Al camp **Versión**, selecciona la nova versió creada. Conserva el tipus **Aplicación web**, l'execució com a **usuari que fa el desplegament** i l'accés **qualsevol persona** tal com estan configurats ara.
6. Prem **Implementar**. Si Google demana autorització, revisa-la amb el compte del centre.

## Verificació

1. Confirma que el desplegament indica la versió publicada i manté la URL de `config.js`.
2. Obre el joc, aconsegueix una marca de prova i envia-la. Comprova que apareix a la pestanya **Resultats** del full.
3. Recarrega el rànquing amb el botó de refrescar i comprova que mostra la nova marca.
4. A **Apps Script → Ejecuciones**, confirma que `doPost` ha acabat sense error. Si es fa una prova amb un nom de prova, elimina després aquesta fila del full.

No cal modificar el desencadenador horari per a la caducitat de nou mesos.
