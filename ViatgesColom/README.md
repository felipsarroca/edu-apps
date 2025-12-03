# Els viatges de Colom

Aplicació web interactiva que reconstrueix les quatre expedicions atlàntiques de Cristòfor Colom. Combina un mapa dinàmic, línia de temps i panells informatius per oferir una experiència narrativa i visual que ajuda a comprendre els punts clau de cada travessia.

## Tecnologies utilitzades

- **HTML5**
- **CSS3**: Flexbox, Grid, variables CSS per a la tematització.
- **JavaScript (ES6+ Modules)**
- **Leaflet.js**: Per a la creació de mapes interactius.
- **Web Speech API**: Per a la funcionalitat de síntesi de veu.

## Funcionalitats

- **Selecció ràpida de viatges** des de la pantalla inicial, amb targetons que condueixen a l'experiència interactiva.
- **Mapa Leaflet** amb rutes animades, punts numerats i finestres emergents amb context històric, curiositats i botó de locució.
- **Panell d'informació** organitzat en pestanyes (objectiu, vaixells, problemes i resultats) que s'adapta als viatges seleccionats, amb mode comparatiu.
- **Panell de curiositats** amb anècdotes aleatòries i estat especial quan no hi ha contingut disponible.
- **Línia de temps** sincronitzada amb el mapa, que permet avançar etapa a etapa manualment o amb reproducció automàtica.
- **Assistència d'àudio** mitjançant l'API de síntesi de veu del navegador per narrar cada episodi.

## Estructura de fitxers

- `index.html`: Estructura de la pàgina d'inici i de la vista del mapa.
- `styles.css`: Full d'estils global (portada, panells, pop-ups, adaptacions responsives).
- `app.js`: Lògica del client (càrrega de JSON, inicialització del mapa, gestió de panells i línia de temps).
- `1viatge.json` a `4viatge.json`: Dades de cada expedició (etapes, vaixells, curiositats, etc.).
- `colonportada.avif`, `favicon.svg`, `CC_BY-NC-SA.svg`: Recursos gràfics de l'aplicació.
- `README.md`: Aquest mateix fitxer.
- `0. Descripció.md`: Documentació addicional del projecte.

## Requisits i execució en local

1.  Cal servir la carpeta amb un servidor estàtic (perquè les peticions `fetch` als fitxers JSON funcionin):
    -   Amb Python: `python -m http.server` o `python3 -m http.server`
    -   Amb Node.js: `npx serve`
2.  Obre el navegador i accedeix a l'URL indicada (p. ex., `http://localhost:8000` o `http://localhost:3000`).
3.  **Important**: Evita obrir l'arxiu `index.html` directament amb el protocol `file://`, ja que el navegador bloquejarà la càrrega de les dades dels viatges.

## Personalització

-   **Contingut històric**: Edita els fitxers `*.viatge.json` per afegir episodis, curiositats o modificar textos.
-   **Estils**: Ajusta colors i tipografies a `styles.css`. Les variables CSS a `:root` controlen els tons principals.
-   **Fonts de veu**: `app.js` utilitza `speechSynthesis` amb l'idioma `ca-ES`. Pots canviar-ho si cal suportar altres veus o idiomes.

## Llicència

El projecte es distribueix sota llicència [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca). Consulta el fitxer `CC_BY-NC-SA.svg` per al logotip i recorda mantenir l'atribució corresponent.