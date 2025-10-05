# Els viatges de Colom

Aplicació web interactiva que reconstrueix les quatre expedicions atlàntiques de Cristòfor Colom. Combina un mapa dinàmic, lineal temporal i panells informatius per oferir una experiència narrativa i visual que ajuda a comprendre els punts clau de cada travessia.

## Funcionalitats

- **Selecció ràpida de viatges** des de la pantalla inicial, amb targetons que condueixen a l'experiència interactiva.
- **Mapa Leaflet** amb rutes animades, punts numerats i finestres emergents amb context històric, curiositats i botó de locució.
- **Panell d'informació** organitzat en pestanyes (objectiu, vaixells, problemes i resultats) que s'adapta als viatges seleccionats, amb mode comparatiu.
- **Panell de curiositats** amb anècdotes aleatòries i estat especial quan no hi ha contingut disponible.
- **Línia de temps** sincronitzada amb el mapa, que permet avançar etapa a etapa manualment o amb reproducció automàtica.
- **Assistència d'àudio** mitjançant l'API de síntesi de veu del navegador per narrar cada episodi.

## Estructura de carpetes

- index.html – Estructura de la pàgina d'inici i de la vista del mapa.
- styles.css – Full d'estils global: portada, panells, pop-ups i adaptacions responsives.
- pp.js – Lògica del client: càrrega dels JSON, inicialització del mapa, gestió de panells i línia de temps.
- 1viatge.json ... 4viatge.json – Dades de cada expedició (etapes, vaixells, curiositats, etc.).
- colonportada.avif, avicon.svg, CC_BY-NC-SA.svg – Recursos gràfics de l'aplicació.

## Requisits i execució en local

1. Cal servir la carpeta amb un servidor estàtic (perquè els etch dels JSON funcionin):
   - python -m http.server o python3 -m http.server
   - 
px serve
2. Obre el navegador i accedeix a l'URL indicada (p. ex. http://localhost:8000 o http://localhost:3000).
3. Evita obrir l'index.html directament amb ile://, ja que no es carregaran les dades.

## Personalització

- **Contingut històric**: edita els fitxers *viatge.json per afegir episodis, curiositats o modificar textos.
- **Estils**: ajusta colors i tipografies a styles.css (hi ha variables CSS a :root per als tons principals).
- **Fonts de veu**: pp.js utilitza speechSynthesis amb idioma ca-ES; canvia'l si cal suportar altres veus o idiomes.

## Llicència

El projecte es distribueix sota llicència [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca). Consulta el fitxer CC_BY-NC-SA.svg per al logotip i recorda mantenir l'atribució corresponent.
