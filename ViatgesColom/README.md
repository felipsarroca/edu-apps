# Viatges de Cristòfor Colom

Aplicació interactiva creada amb React + Vite per explorar els quatre viatges de Cristòfor Colom. Ofereix mapes Leaflet, línia de temps i fitxes de context perquè l'alumnat treballi la dimensió històrica i geogràfica amb suport visual.

## Requisits
- Node.js 22 o superior
- npm

## Scripts disponibles
- `npm install` instal·la les dependències.
- `npm run dev` arrenca l'entorn de desenvolupament.
- `npm run build` genera la versió de producció a `docs/ViatgesColom`.
- `npm run preview` serveix la build localment.

## Desplegament a GitHub Pages
- El `npm run build` crea `docs/index.html` que redirigeix cap a `docs/ViatgesColom/`, on hi ha tota la build.
- Per defecte la base �s relativa (`./`), de manera que la p�gina funciona tant si es publica al root del domini com en un subdirectori (`https://<usuari>.github.io/edu-apps/ViatgesColom/`).
- Si cal for�ar un altre prefix (p. ex. `/edu-apps/ViatgesColom/`), exporta `VITE_BASE_PATH=/edu-apps/ViatgesColom/` abans d'executar `npm run build`.
- Nom�s cal pujar la carpeta `docs/` al repositori (GitHub Pages configurat perqu� apunti a `docs/`).

## Estructura principal
- `src/`: components React, dades i estils.
- `public/`: recursos estàtics servits tal qual (dades JSON).
- `docs/`: sortida generada per Vite; no s'ha d'editar manualment.

## Manteniment futur
1. Fer canvis a `src/` o a `public/`.
2. Executar `npm run build` (en Windows, millor en una ruta sense espais si dona problemes).
3. Revisar el resultat a `docs/` (es pot usar `npm run preview`).
4. Fer commit i push.
