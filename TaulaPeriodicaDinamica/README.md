# Taula periòdica dinàmica

Aplicació web simple (HTML/CSS/JS) que mostra la taula periòdica en blanc i permet canviar el mode de visualització per pintar les cel·les segons diferents criteris.

## Contingut del projecte

- `index.html`: estructura i interfície (títol, selector, llegenda i tauler).
- `style.css`: estil fosc, graella responsive i targetes dels elements.
- `app.js`: càrrega de dades, renderitzat i lògica de modes.
- `data/elements.json`: dataset JSON (Bowserinator – PeriodicTableJSON).
- `0. Idees de classificacions.md`: idees de classificació per a futurs modes.

## Com executar

Hi ha dues maneres:

- Obertura directa (`file://`): ja funciona perquè s’inclou `data/elements.js` amb el dataset incrustat. Simplement obre `index.html` amb el navegador.
- Servidor local (`http://`): recomanat si vols treballar amb `fetch()` i fitxers separats.

Opcions ràpides per servidor local:

1) Python 3

```
python -m http.server 8000
```

Obre `http://localhost:8000/` i entra a `TaulaPeriodicaDinamica/` si cal.

2) Node.js (si tens `npx`)

```
npx http-server -p 8000
```

3) Extensió “Live Server” (VS Code)

- Obre la carpeta i fes “Open with Live Server”.

## Modes implementats (segons el .md)

- Famílies / grups principals: colors fixos per categoria (`category`).
- Blocs electrònics (s, p, d, f): colors diferenciats per `block`.
- València: gradient segons nombre d’electrons de la darrera capa (`shells`).
- Electronegativitat: gradient continu (Pauling) (`electronegativity_pauling`).
- Energia d’ionització: gradient continu (primer valor a `ionization_energies`).
- Estat físic a temperatura ambient: colors fixos (`phase`).

Pendent (esquelet preparat per afegir):

- Reactivitat, propietats físiques especials, abundància (humà/escorça/univers), essencials/tòxics/radioactius. Cal una font de dades fiable per a cada camp.

## Estructura bàsica del codi

- Carrega el JSON i genera la graella amb `xpos` i `ypos` de cada element.
- Cada targeta mostra número atòmic, símbol i nom.
- Canviar el selector actualitza el mode, la llegenda i pinta les cel·les.

## Afegir un nou mode

1. A `app.js`, afegeix l’entrada a `modeMeta` (etiqueta i icona).
2. Implementa el cas a `colorize()` (com assignes els colors).
3. Implementa la llegenda a `renderLegend()` (discreta o gradient).
4. Si calen dades noves, amplia `data/elements.json` o crea un nou `data/*.json` i carrega’l.

## Notes de dades

- El dataset original està en anglès i inclou camps útils: `category`, `block`, `phase`, `electronegativity_pauling`, `ionization_energies`, `shells`, `xpos`, `ypos`.
- Les etiquetes de llegenda es mostren en català quan és possible (mapa `familiesLabelCa`).

## Llicència de dades

El JSON prové del projecte “PeriodicTableJSON” (Bowserinator) publicat a GitHub. Revisa la llicència original si el reutilitzes més enllà de l’ús educatiu.
