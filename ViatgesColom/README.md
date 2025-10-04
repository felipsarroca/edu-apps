# Viatges de Cristòfor Colom

Aplicació interactiva creada amb React + Vite per explorar els quatre viatges de Cristòfor Colom. Ofereix mapes Leaflet, línia de temps i fitxes de context perquè l'alumnat treballi la dimensió històrica i geogràfica amb suport visual.

## Requisits
- Node.js 22 o superior
- npm

## Scripts disponibles
- `npm install` instal·la les dependències.
- `npm run dev` arrenca l'entorn de desenvolupament.
- `npm run build` genera la versió de producció a la carpeta `docs`.
- `npm run preview` serveix la build localment.

## Desplegament a GitHub Pages
- La build queda a `docs`, l'única carpeta que cal publicar.
- Per defecte la base és relatiu (`./`), de manera que la pàgina funciona tant si es publica al root del domini com en un subdirectori.
- Si cal forçar un altre prefix (p. ex. `/edu-apps/ViatgesColom/`), exporta `VITE_BASE_PATH=/edu-apps/ViatgesColom/` abans d'executar `npm run build`.

## Estructura principal
- `src/`: components React, dades i estils.
- `public/`: recursos estàtics servits tal qual (dades JSON).
- `docs/`: sortida generada per Vite; no s'ha d'editar manualment.

## Manteniment futur
1. Fer canvis a `src/` o a `public/`.
2. Executar `npm run build` (en Windows, millor en una ruta sense espais si dona problemes).
3. Revisar el resultat a `docs/` (es pot usar `npm run preview`).
4. Fer commit i push.
