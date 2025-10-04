# Viatges de Cristòfor Colom

Aplicació interactiva creada amb React + Vite per explorar els quatre viatges de Cristòfor Colom. Ofereix mapes Leaflet, línia temporal i fitxes de context perquè l'alumnat treballi la dimensió històrica i geogràfica amb suport visual.

## Requisits
- Node.js 22 o superior
- npm

## Scripts disponibles
- \\
pm install\\ instal·la les dependències.
- \\
pm run dev\\ arrenca l'entorn de desenvolupament.
- \\
pm run build\\ genera la versió de producció a la carpeta \\docs\\.
- \\
pm run preview\\ serveix la build localment.

## Desplegament a GitHub Pages
La configuració de Vite defineix la base \\/edu-apps/ViatgesColom/\\ i escriu la build a \\docs\\. Fer commit de la carpeta \\docs\\ permet publicar l'aplicació des de https://<usuari>.github.io/edu-apps/ViatgesColom/.

## Estructura principal
- \\src\\: components React, dades i estils.
- \\public\\: recursos estàtics accessibles durant el build.
- \\docs\\: sortida generada per Vite; no editar manualment.

## Manteniment futur
1. Fer canvis a \\src\\ o a les dades.
2. Executar \\
pm run build\\ (a preferència en una ruta sense espais si hi ha problemes de Windows).
3. Comprovar el resultat a \\docs\\.
4. Actualitzar el repositori amb commit i push.

