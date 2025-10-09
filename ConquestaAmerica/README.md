# Conqueridors d'Amèrica

Aplicació web interactiva que narra cinc expedicions castellanes clau posteriors als viatges de Colom. Les rutes de Cortés, Pizarro, Cabeza de Vaca, Hernando de Soto i Pedro de Valdivia s'exploren amb un mapa dinàmic, línia de temps i panells contextuals pensats per a l'aprenentatge històric.

## Tecnologies utilitzades

- **HTML5**
- **CSS3** (Grid, Flexbox, variables per a tematització)
- **JavaScript ES Modules**
- **Leaflet.js** per als mapes
- **Web Speech API** per narrar els episodis

## Funcionalitats

- **Pantalla d'inici renovada** amb targetes biogràfiques i retrats dels cinc conqueridors.
- **Mapa Leaflet** amb animacions de ruta, punts numerats i finestres emergents que inclouen curiositats i botó d'àudio.
- **Panell d'informació** segmentat en Objectiu, Forces i aliances, Dificultats i Conseqüències. S'adapta quan es comparen múltiples expedicions.
- **Línia de temps sincronitzada** amb el mapa, controlable manualment o amb reproducció automàtica.
- **Assistència d'àudio** (ca-ES) que llegeix els episodis destacats.

## Dades i estructura

- `index.html`: Estructura de la portada i de l'experiència interactiva.
- `styles.css`: Estils globals, nova graella de targetes i panell informatiu.
- `app.js`: Lògica de càrrega de dades, mapa, targetes dinàmiques i línia de temps.
- `1cortes.json` a `5valdivia.json`: Informació de cada expedició (forces, episodis, problemes i resultats).
- Carpeta `img/`: Retrats reutilitzables de domini públic.
- `favicon.svg`, `CC_BY-NC-SA.svg`: Recursos gràfics i llicència.

## Execució local

1. Obre un servidor estàtic dins la carpeta del projecte:
   - Python: `python -m http.server`
   - Node.js: `npx serve`
2. Navega fins a l'URL que indiqui la consola (per exemple `http://localhost:8000`).
3. Evita `file://index.html` perquè bloqueja les peticions `fetch` dels JSON.

## Personalització

- **Actualitzar contingut**: Modifica els fitxers `*.json` per afegir episodis, dades de forces o curiositats.
- **Canviar paleta i tipografies**: Edita les variables definides a `:root` a `styles.css`.
- **Veu narradora**: A `app.js` es pot ajustar l'idioma o desactivar la síntesi de veu.

## Llicència

Projecte sota llicència [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca).
