# Taula periòdica dinàmica

Aplicació web (HTML, CSS i JavaScript, sense dependències) que acoloreix la taula periòdica segons el criteri que es triï: famílies, propietats periòdiques, propietats físiques, química i vida, abundància i història.

Funciona obrint directament `index.html` (també des de `file://`) o publicada a GitHub Pages.

## Funcionalitats

- **24 visualitzacions** agrupades en sis blocs:
  - *Classificació*: famílies (amb halògens), metalls/semimetalls/no-metalls, blocs s-p-d-f i estat físic a 25 °C.
  - *Estructura i enllaç*: estats d'oxidació habituals (formulació d'ESO), electronegativitat, energia d'ionització i radi atòmic.
  - *Propietats físiques*: densitat, punts de fusió i d'ebullició (en °C o K), conductivitat elèctrica i tèrmica, i ferromagnetisme.
  - *Química i vida*: reactivitat, bioelements (primaris, secundaris i oligoelements), toxicitat, radioactivitat (natural o artificial) i període de semidesintegració (escala logarítmica amb marques de referència: 1 s, 1 dia, 1.000 anys i edat de la Terra).
  - *Abundància*: escorça terrestre, cos humà i univers (escala logarítmica).
  - *Història*: any de descobriment, amb un control lliscant per veure com creix la taula.
- **Escales de color contínues** amb llegenda en degradat per a les magnituds numèriques.
- **Llegenda interactiva**: en clicar una categoria, es destaquen els seus elements.
- **Panell d'informació** a l'espai buit de la taula: vista ampliada de l'element sota el cursor, descripció del mode i tendències periòdiques amb fletxes.
- **Fitxa de l'element** amb totes les propietats, el valor del mode actiu destacat, notes que matisen les dades, un resum i el descobriment. En els elements radioactius, inclou la corba de desintegració de l'isòtop més estable i un context per entendre-la.
- **Compara**: tria dos elements i en veus les propietats en paral·lel.
- **Repte**: preguntes sobre les tendències periòdiques (per exemple, quin element del període 3 té el radi més gran o quin actínid dura més) amb puntuació.
- **Mode projector** (text més gran) i **tema clar o fosc**.
- Els elements 104-118 es mostren amb una vora discontínua: tenen propietats predites.

## Adaptació a la pantalla

- La interfície es dissenya per a 1440 × 820 px útils. En portàtils més petits (1366 × 768) o amb escalat del sistema (125 %, 150 %) es redueix sencera (`--ui-zoom`, com a l'app *Equacions*), amb un mínim del 75 %.
- La graella s'escala per ocupar tot l'espai disponible i es recalcula en redimensionar la finestra o en canviar de monitor.
- En mòbils i tauletes (< 900 px), el tauler de control se situa a dalt, la taula es pot desplaçar dins del seu marc i el peu queda al final.

## Estructura

- `index.html`: estructura de la interfície.
- `style.css`: estils, temes i adaptació a la pantalla.
- `app.js`: definició dels modes, pintat, llegenda, fitxa, comparació, repte i escalat.
- `data/elements.js`: dataset base (PeriodicTableJSON, de Bowserinator, elements 1-118).
- `data/propietats.js`: dades complementàries revisades (classificació, radis, conductivitats, abundàncies, estats d'oxidació, bioelements, toxicitat, períodes de semidesintegració, descobriment i notes).
- `data/noms_ca.js` i `data/summaries_ca.js`: noms i resums en català.
- `assets/CC_BY-NC-SA.png`: distintiu de la llicència.
- Documents i imatges de referència: `Valors dels elements de la Taula Periòdica.pdf/.docx`, `Propietats dels Elements.pdf` i les imatges `*.JPG`.

## Fonts de les dades

| Dada | Font |
|---|---|
| Massa, electronegativitat (Pauling), 1a energia d'ionització, densitat, punts de fusió i d'ebullició, configuració | PeriodicTableJSON (Bowserinator) |
| Radi atòmic | Slater (1964); gasos nobles, Clementi (1967) |
| Conductivitat elèctrica (20 °C) i tèrmica (300 K) | CRC Handbook of Chemistry and Physics |
| Abundància a l'escorça | CRC Handbook of Chemistry and Physics |
| Abundància al cos humà | J. Emsley, *The Elements* (adult de 70 kg) |
| Abundància a l'univers | K. Croswell (1996), Via Làctia |
| Període de semidesintegració (isòtop més estable) | NUBASE2020 (Kondev et al., 2021) i IAEA LiveChart; elements 104-118, valors aproximats |
| Any de descobriment | Taula de la carpeta (`AnyDescobrimentElements.JPG`) |

## Afegir un mode nou

Afegeix una entrada a l'objecte `MODES` d'`app.js`:

- Mode de categories: `kind: 'cat'`, `cats` (clau, etiqueta i color) i `catOf(el)`.
- Mode numèric: `kind: 'num'`, `value(el)`, `fmt(v, el)` i `legendFmt(v)`; opcionalment `log: true`.
- Camps opcionals: `group` (grup del selector), `desc`, `note`, `source` i `trend`.

## Llicència

Aplicació de Felip Sarroca i sota llicència [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca). El dataset PeriodicTableJSON es distribueix sota llicència CC BY-SA 3.0.
