# Possibles millores per a GraphMath

## Millores funcionals
- Desar a `localStorage` la llista de funcions, el tema i la configuració de vista, i afegir exportació/importació ràpida (JSON o enllaç compartible) per evitar perdre el treball entre sessions (`assets/index-Cr9Wxxtb.js:63`).
- Validar les expressions al modal i mostrar missatges d’error específics quan l’anàlisi (`pf`, dominis, etc.) no pugui parsejar l’entrada (`assets/index-Cr9Wxxtb.js:63`).
- Compilar i emmagatzemar la funció JavaScript en el moment d’afegir o editar per reutilitzar-la al dibuix, reduint crides repetides a `new Function` i `pf` (`assets/index-Cr9Wxxtb.js:57`).
- Millorar la precisió d’interseccions i arrels aplicant una refinació numèrica (cerca binària/secant) sobre els intervals detectats per mostreig (`assets/index-Cr9Wxxtb.js:49`).

## Millores pedagògiques
- Mostrar sobre la gràfica els punts clau ja calculats (interseccions, talls, dominis limitats) amb etiquetes breus i legibles (`assets/index-Cr9Wxxtb.js:57`).
- Aportar plantilles i llavors d’activitat vinculades a competències LOMLOE/competències bàsiques dins del modal d’entrada i del diàleg d’ajuda (`assets/index-Cr9Wxxtb.js:63`).
- Incorporar un mode amb paràmetres ajustables (lliscadors per a `y = ax^2 + bx + c`, `y = k·sin(x)`, etc.) que permeti explorar transformacions sense reescriure expressió (`assets/index-Cr9Wxxtb.js:63`).
- Permetre graduar el teclat virtual segons nivell lingüístic/competencial (versions simplificada i completa) per reduir la càrrega cognitiva d’alumnat A1–B1 (`assets/index-Cr9Wxxtb.js:63`).

## Millores estètiques i d'UX
- Reorganitzar el modal i el teclat perquè en pantalles petites no se solapin (pestanyes o seccions plegables) i assegurar focus states accessibles (`assets/index-Cr9Wxxtb.js:63`).
- Ampliar l’elecció de colors: afegir un selector personalitzat o paletes amb contrast garantit per a alumnat amb daltonisme (`assets/index-Cr9Wxxtb.js:49`).
- Corregir metadades i documentació: definir `lang="ca"` a l’arrel (`index.html:2`) i reencodar `README.md` en UTF-8 per eliminar caràcters malmesos (`README.md:1`).

