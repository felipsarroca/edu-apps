# Conqueridors d'Amèrica

Aplicació web interactiva centrada en cinc expedicions castellanes posteriors als viatges de Colom. L’usuari pot seguir els itineraris sobre un mapa dinàmic, contrastar els objectius i les conseqüències de cada conqueridor i escoltar la narració de cada episodi en català.

## Característiques clau

- **Portada narrativa** amb targetes biogràfiques i retrats que donen accés directe a cada expedició.
- **Mapa Leaflet animat** amb rutes numerades, punts emergents amb curiositats i re-centre suau quan s’obren les finestres informatives.
- **Línia de temps cronològica** sincronitzada amb el mapa: cada expedició respecta l’ordre 1-2-3… dels punts del mapa i la comparativa global manté les seqüències sense salts.
- **Panell informatiu modular** amb quatre pestanyes (Objectiu, Forces i aliances, Dificultats i Conseqüències) que s’adapten tant a la vista individual com a la comparativa simultània dels cinc viatges.
- **Resums contextuals**: en la vista conjunta, cada secció mostra les síntesis específiques d’objectius, forces, dificultats o resultats per a cada conqueridor.
- **Narració amb veu** (ca-ES) dels episodis destacats mitjançant la Web Speech API, activable des de cada punt del mapa.

## Tecnologies utilitzades

- **HTML5**
- **CSS3** (Grid, Flexbox, variables per tematització i respostivitat)
- **JavaScript ES Modules**
- **Leaflet.js** per a la cartografia interactiva
- **Web Speech API** per a l’assistència d’àudio

## Estructura del projecte

- `index.html`: Marc general de la portada i de l’experiència interactiva.
- `styles.css`: Estils globals, graella de targetes, panells informatius i personalització cromàtica.
- `app.js`: Càrrega de dades, control de mapes, línia de temps, comparatives i síntesi de veu.
- `1cortes.json` … `5valdivia.json`: Informació de cada expedició (objectius, forces, episodis, problemes i resultats).
- `img/`: Retrats i recursos visuals.
- `favicon.svg`, `CC_BY-NC-SA.svg`: Iconografia i llicència.

## Execució local

1. Inicia un servidor estàtic des de la carpeta del projecte.
   - Python: `python -m http.server`
   - Node.js: `npx serve`
2. Obre l’URL que mostri la consola (per exemple `http://localhost:8000`).
3. Evita obrir `index.html` via `file://`, perquè bloqueja les peticions `fetch` als fitxers JSON.

## Personalització ràpida

- **Contingut històric**: edita els fitxers `*.json` per afegir o modificar episodis, forces, aliances i conseqüències.
- **Disseny**: ajusta la paleta, les tipografies i els gradients modificant les variables declarades a `:root` a `styles.css`.
- **Narració**: a `app.js` pots canviar la veu, l’idioma o desactivar la lectura en veu alta.

## Llicència

Projecte distribuït sota [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca).
