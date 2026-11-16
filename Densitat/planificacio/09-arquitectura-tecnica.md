# 09 · Arquitectura tècnica

Tecnologia, estructura de fitxers, mòduls, estat, desament, proves, llicència i publicació.

Torna al [pla mestre](../PLA.md).

---

## 1. Decisions tecnològiques

| Tema | Decisió | Alternativa descartada i motiu |
|---|---|---|
| Llenguatge | JavaScript natiu, amb anotacions de tipus en comentaris (JSDoc) | TypeScript: exigeix compilar, i cap altra app teva ho fa |
| Interfície | HTML i CSS natius, components propis senzills | React: una dependència gran per a una sola pantalla principal |
| Gràfics | SVG | Canvas: perd accessibilitat i nitidesa en escalar. WebGL i Three.js: innecessaris en 2D |
| Física | Motor propi, en mòduls purs sense accés a la pàgina | Biblioteques de física: simulen xocs i rigidesa, no flotació verificable |
| Compilació | Cap. Els fitxers es publiquen tal com són | Empaquetadors: afegeixen passos i fragilitat |
| Dependències | Cap en temps d'execució | — |
| Dades | Mòduls de JavaScript amb objectes plans | Base de dades o servidor: no calen |
| 3D | Ajornat a la fase 4, i només si aporta comprensió | — |

La recerca inicial suggeria React i TypeScript «o tecnologia equivalent». Es tria l'equivalent més simple, perquè el rigor depèn del motor físic i de les proves, no del marc de treball.

### Mòduls

**Decisió:** mòduls ES (`type="module"`). L'app s'utilitza sempre des de GitHub Pages. No cal obrir-la amb doble clic des d'una carpeta descarregada ni que es pugui descarregar (decisió 7 del pla mestre).

- Cada fitxer declara què necessita dels altres, i el motor es prova directament amb Node.
- La instal·lació com a app (PWA) i el funcionament sense connexió queden per a més endavant, com a opció.

## 2. Estructura de fitxers

```
Densitat/
├── index.html
├── favicon.svg
├── LICENSE
├── README.md
├── PLA.md
├── planificacio/                 Aquests documents
├── css/
│   ├── base.css                  Variables, tipografia, escalat, estructura
│   ├── components.css            Botons, pestanyes, targetes, panells, taules
│   ├── laboratori.css            Prestatge, escena, eines
│   ├── quadern.css               Quadern i panell de dades
│   └── informe.css               Full d'estils d'impressió
├── js/
│   ├── app.js                    Arrencada, navegació, escalat
│   ├── fisica/                   Motor: sense accés a la pàgina
│   │   ├── unitats.js            Conversions exactes i format
│   │   ├── geometria.js          Volums i volum submergit de cada forma
│   │   ├── objecte.js            Parts, cavitats i magnituds derivades
│   │   ├── flotacio.js           Equilibri, empenyiment, forces
│   │   ├── recipient.js          Nivells, vessament i capes
│   │   ├── liquids.js            Mescles, sal i miscibilitat
│   │   ├── barca.js              Bucs, calat, càrrega i estabilitat
│   │   ├── moviment.js           Trajecte fins a l'equilibri
│   │   └── instruments.js        Del valor real a la lectura
│   ├── dades/
│   │   ├── materials.js
│   │   ├── liquids.js
│   │   ├── objectes.js
│   │   ├── recipients.js
│   │   ├── instruments.js
│   │   ├── idees.js              Catàleg d'idees prèvies i d'errors
│   │   ├── glossari.js
│   │   └── investigacions/       Un fitxer per investigació: A1.js, C4.js…
│   ├── estat/
│   │   ├── magatzem.js           Estat únic, accions, desfer i refer
│   │   ├── desament.js           Navegador, exportació i importació
│   │   └── escena-url.js         Estat codificat a l'adreça
│   ├── laboratori/
│   │   ├── escena.js             Dibuix de la taula activa
│   │   ├── prestatge.js
│   │   ├── manipulacio.js        Arrossegar, seleccionar i teclat
│   │   ├── taula-mesura.js
│   │   ├── taula-columna.js
│   │   ├── taula-tanc.js
│   │   ├── taller.js
│   │   └── instruments/          balanca.js, proveta.js, lupa.js, dinamometre.js…
│   ├── eines/
│   │   ├── calculadora.js
│   │   ├── conversor.js
│   │   ├── comparador.js
│   │   ├── grafica.js
│   │   ├── cubets.js
│   │   └── forces.js
│   ├── guia/
│   │   ├── motor.js              Passos, condicions i pistes
│   │   ├── preguntes.js
│   │   ├── diagnosi.js
│   │   └── progres.js
│   ├── quadern/
│   │   ├── quadern.js
│   │   ├── taula-dades.js
│   │   └── informe.js
│   └── pantalles/
│       ├── inici.js
│       ├── consulta.js
│       ├── progres.js
│       ├── configuracio.js
│       └── docent.js
├── assets/
│   ├── fonts/
│   ├── icones/
│   └── CC_BY-NC-SA.png
├── tests/
│   ├── fisica.test.mjs           Regles R1–R20 i casos T01–T38
│   ├── dades.test.mjs
│   ├── investigacions.test.mjs
│   └── visual/                   Captures de verificació
├── scripts/
│   └── valida-dades.mjs
└── docs/
    └── captures/                 Imatges del README
```

A la fase 1a només existeixen els fitxers que calen. L'estructura es dona completa perquè el creixement no obligui a reordenar res.

## 3. Capes i dependències

```
   pantalles ──► laboratori ──► estat ──► fisica
       │             │            ▲          ▲
       └──► guia ────┴──► quadern ┘          │
                 └──────────► dades ─────────┘
```

Regles:

1. **`fisica/` no depèn de res**: ni de la pàgina, ni de l'estat, ni de les dades. Rep valors i en torna.
2. **`dades/` només conté dades**, sense lògica.
3. **`estat/` és l'única font de veritat**. El dibuix es deriva de l'estat.
4. **`guia/` observa l'estat**, però no el modifica, tret del propi progrés.
5. Cap mòdul de `laboratori/` calcula física pel seu compte: sempre crida `fisica/`.

## 4. L'estat

Un sol objecte, que es pot desar tal com és.

```js
{
  versio: 1,
  configuracio: { nivell: 1, nombresSenzills: true, lecturaFacil: false,
                  g: 9.8, simbolDensitat: "d", moviment: "normal" },
  laboratori: {
    taula: "mesura",
    objectes: { A: { forma, parts, cavitats, origen, misteri } },
    ubicacions: { A: "balanca", B: "prestatge" },
    recipients: { proveta1: { tipus: "proveta250", capes: [{ liquid: "aigua", volum: 120 }] } },
    instruments: { balanca: { model: "laboratori", tara: 0, zero: 0 } },
    vistes: { cubets: false, forces: false, valors: false },
    visibilitat: "experimental"
  },
  investigacio: { id: "C4", pas: 2, respostes: {}, pistes: [] },
  quadern: { entrades: [], mesures: [], notes: [] },
  progres: { fetes: [], evidencies: [], idees: {} }
}
```

- **Les magnituds derivades no es desen**: massa, densitat, nivell, forces i lectures es calculen sempre.
- **Accions**: tot canvi passa per una acció amb nom (`mouObjecte`, `tara`, `aboca`, `talla`, `anota`). Això dona desfer i refer, i permet que la guia sàpiga què ha passat.
- **Desfer** actua sobre el laboratori, no sobre el quadern ni el progrés.

## 5. Dibuix

- Cada taula és un SVG amb un sistema de coordenades en centímetres reals, de manera que les proporcions són correctes sense càlculs afegits.
- El dibuix es refà a partir de l'estat quan hi ha un canvi; no es manté cap estat propi al gràfic.
- Durant un moviment, el mòdul de moviment actualitza la posició a cada fotograma i s'atura en arribar a l'equilibri.
- Fora dels moviments no hi ha cap bucle actiu: l'app no gasta bateria en repòs.

## 6. Desament i compartició

| Què | On | Format |
|---|---|---|
| Sessió en curs | Emmagatzematge local del navegador | JSON, amb número de versió |
| Escenes amb nom | Emmagatzematge local | JSON |
| Còpia de seguretat | Fitxer que descarrega l'alumne | JSON |
| Dades | Fitxer | CSV amb punt i coma i coma decimal |
| Informe | Impressió del navegador | PDF |
| Escena compartida | L'adreça | Estat comprimit i codificat després del `#` |

- Clau d'emmagatzematge amb prefix: `densitat:v1:…`.
- Si l'esquema canvia, una funció de migració converteix les dades antigues; si no pot, les aparta sense esborrar-les i avisa.
- Tot accés a l'emmagatzematge està protegit: en mode privat o amb l'emmagatzematge blocat, l'app funciona igual sense desar.
- Un enllaç d'escena no conté dades de l'alumne: només l'estat del laboratori.

## 7. Proves

### 7.1. Automàtiques

| Prova | Què comprova | Eina |
|---|---|---|
| Motor físic | Les vint regles i els casos de prova del [model científic](02-model-cientific.md) | `node --test` |
| Propietats | Per a objectes i líquids generats a l'atzar: conservació de la massa en tallar, força neta zero en equilibri, lectura dins del rang | `node --test` |
| Dades | Coherència de materials, objectes, recipients i instruments | `scripts/valida-dades.mjs` |
| Investigacions | Cada fitxa té tots els camps, referències vàlides i valors esperats que el motor reprodueix | `node --test` |
| Llengua | Cap cadena buida, cap clau sense text, format de nombres | `node --test` |

Les proves del motor es fan **abans** de la interfície (fase 0). Cap fase es tanca amb una prova en vermell.

### 7.2. Visuals i d'ús

| Prova | Com |
|---|---|
| Composició | Captures amb Playwright de cada pantalla als casos de l'apartat 4.3 del [disseny](08-disseny-visual-i-interaccio.md) |
| Coherència visual | Per als casos de flotació, es compara la posició dibuixada amb la calculada |
| Teclat | Recorregut complet d'una investigació sense ratolí |
| Accessibilitat | Revisió automàtica de contrast, noms i rols, i revisió manual amb lector de pantalla |
| Recorregut real | Cada investigació es fa sencera, de principi a fi, abans de publicar-la |
| Navegadors | Chrome, Edge, Firefox i Safari recents; Chromebook i tauleta |

### 7.3. Rendiment

- Càrrega inicial lleugera: sense biblioteques, les fonts són el fitxer més gran.
- Les investigacions es carreguen quan s'obren.
- Ha de funcionar amb fluïdesa en un portàtil escolar modest.

## 8. Llicència i autoria

Com a la resta de les teves apps:

- **Codi:** AGPL-3.0 o posterior. **Continguts:** CC BY-NC-SA 4.0.
- A `index.html`, just després del doctype: `<!-- SPDX-License-Identifier: AGPL-3.0-or-later AND CC-BY-NC-SA-4.0 -->`.
- A cada fitxer CSS i JS propi: `SPDX-License-Identifier: AGPL-3.0-or-later`.
- Fitxer `LICENSE` a l'arrel de l'app, amb l'explicació en català de la llicència doble, els recursos de tercers, l'enllaç de suggeriments i errors, i el text de l'AGPL.
- Formulari d'incidències a `.github/ISSUE_TEMPLATE/densitat.yml`, amb etiqueta pròpia.
- **Peu visible** i escrit a l'HTML, no generat amb JavaScript: «Codi: AGPLv3 · Continguts: CC BY-NC-SA 4.0», amb l'autoria i l'assistència de la IA. Es fa amb la skill `felip-app-footer`.
- **Recursos de tercers:** només les fonts tipogràfiques, amb la seva llicència lliure. Cap imatge, text ni dada de Science Bits, PhET ni d'altres simuladors.

## 9. Publicació

Llista de comprovació de cada lliurament:

1. Totes les proves automàtiques en verd.
2. Verificació visual a les mides de referència.
3. Revisió lingüística de tots els textos de la interfície.
4. `README.md` complet, amb captures actualitzades.
5. Commit i push a `main`, amb missatge en català.
6. Comprovació de la versió publicada a GitHub Pages: és la mateixa que la local.
7. Enllaç curt a `ja.cat` (a la primera publicació; requereix la teva petició explícita).
8. Targeta al menú d'`edu-apps`, a la categoria «Física», apuntant a l'enllaç de `ja.cat`.
9. Comprovació final de l'enllaç curt, tal com el veurà l'alumnat.

### Abans del primer commit

Els dos PDF de Science Bits són ara dins de `Densitat/`, en un repositori públic, i tenen tots els drets reservats. Cal un `.gitignore` amb `*.pdf` o treure'ls de la carpeta. És la decisió 12 del pla mestre.

## 10. Valoració d'eines

| Eina | Ús | Quan |
|---|---|---|
| Node (`node --test`) | Proves del motor i validació de dades | Fase 0 |
| Playwright (MCP) | Captures i verificació visual a diverses mides | Totes les fases |
| Chrome (extensió) | Recorregut real de les investigacions | Totes les fases |
| `ja.cat` (API) | Enllaç curt | Primera publicació |
| Context7 | Documentació actual de les API del navegador (impressió i emmagatzematge local) | Quan calgui |
| NotebookLM | No cal | — |
| Blender, Three.js | No calen fins a la fase 4, i només si es decideix fer 3D | — |

Cap eina nova per instal·lar.
