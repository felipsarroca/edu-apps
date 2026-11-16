# Densitat: pla mestre

**Laboratori digital de matèria, densitat i flotació per a l'ESO**

Versió 1.0 del pla · 16 de novembre de 2026 · Estat: **planificació, sense codi**

Aquest document és la porta d'entrada a tota la planificació. Resumeix què serà l'app, quines decisions ja queden preses, quines has de confirmar tu i on és cada detall. La resta de documents són a la carpeta `planificacio/`.

---

## 1. Què és i què no és

**Densitat** és un únic laboratori virtual on cada objecte té propietats físiques reals, cada instrument dona mesures (no números regalats), cada experiment genera dades i cada repte obliga a pensar com un científic.

| És | No és |
|---|---|
| Un laboratori manipulable amb un sol motor físic coherent | Una col·lecció de minijocs o animacions predeterminades |
| Un itinerari d'investigacions guiades (predir, experimentar, mesurar, explicar, aplicar) | Un llibre de text digitalitzat ni una bateria d'exercicis |
| Una eina amb quadern científic integrat i informe exportable | Una plataforma amb registre, núvol o seguiment d'alumnes |
| La mateixa realitat explicada a tres nivells de profunditat | Tres apps diferents per a tres cursos |

**Pregunta que l'app ha d'ajudar a respondre:** per què alguns objectes suren i d'altres s'enfonsen, i com ho podem mesurar, predir i demostrar?

## 2. Destinataris

- **Alumnat** de 1r a 4t d'ESO, amb grups diversos, alumnat nouvingut i amb NESE/NE. Per això hi ha lectura fàcil i glossari amb traducció al castellà i a l'anglès.
- **Professorat** de Física i Química i de l'àmbit cientificotecnològic, que la projecta a classe o encarrega investigacions per Google Classroom.
- **Encaix amb els llibres de l'escola:** Science Bits, *Massa, volum i densitat* (2n d'ESO) i *Fluids i pressió* (4t d'ESO). L'app en segueix la progressió i el vocabulari, però no en copia textos, imatges ni dades.

## 3. Mapa de documents

| Document | Contingut |
|---|---|
| `PLA.md` (aquest) | Visió, decisions, estructura de l'app, fases i decisions pendents |
| [`01-fonaments-pedagogics.md`](planificacio/01-fonaments-pedagogics.md) | Currículum, fonts, principis didàctics, nivells, catàleg d'idees prèvies i d'errors |
| [`02-model-cientific.md`](planificacio/02-model-cientific.md) | Motor físic: entitats, magnituds, lleis, regles invariables, simplificacions i casos de prova |
| [`03-dades-de-referencia.md`](planificacio/03-dades-de-referencia.md) | Materials, líquids, gasos, objectes, recipients i instruments amb els seus valors |
| [`04-laboratori-i-instruments.md`](planificacio/04-laboratori-i-instruments.md) | Taules de treball, funcionament de cada instrument, accions sobre els objectes i eines |
| [`05-cataleg-investigacions-1.md`](planificacio/05-cataleg-investigacions-1.md) | Fitxes de les investigacions dels blocs A (matèria i mesura), B (unitats) i C (densitat) |
| [`06-cataleg-investigacions-2.md`](planificacio/06-cataleg-investigacions-2.md) | Fitxes dels blocs D (flotabilitat), E (forces i Arquimedes), F (construïm i apliquem) i G (pressió) |
| [`07-guia-quadern-i-avaluacio.md`](planificacio/07-guia-quadern-i-avaluacio.md) | Motor pedagògic: guia, pistes, diagnosi, quadern científic, progrés, mode docent i situació d'aprenentatge |
| [`08-disseny-visual-i-interaccio.md`](planificacio/08-disseny-visual-i-interaccio.md) | Pantalles, composició, identitat visual, representacions, adaptació a la pantalla i accessibilitat |
| [`09-arquitectura-tecnica.md`](planificacio/09-arquitectura-tecnica.md) | Tecnologia, estructura de fitxers, mòduls, estat, desament, proves, llicència i publicació |
| [`10-llengua-i-glossari.md`](planificacio/10-llengua-i-glossari.md) | Terminologia, símbols, format dels nombres, criteris de redacció i glossari |
| [`11-fases-i-validacio.md`](planificacio/11-fases-i-validacio.md) | Fases, lliuraments, criteris d'acceptació, proves amb alumnat i riscos |

## 4. Les idees que ho ordenen tot

1. **Un sol model físic.** El que passa surt de les propietats de l'objecte i del líquid, mai d'una animació associada a una activitat. Un bloc d'alumini de 100 cm³ marca 270 g a la balança, fa pujar 100 mL la proveta, s'enfonsa a l'aigua i pesa 0,98 N menys quan està submergit; i si el talles, cada tros manté 2,70 g/cm³.
2. **Objectes persistents.** L'objecte que has pesat és el mateix que submergeixes, talles o converteixes en barca, i el quadern en conserva totes les dades.
3. **Mesurar abans de calcular.** L'alumne obté la massa i el volum amb instruments que tenen escala, resolució, tara i menisc. En el mode experimental no veu cap dada que no hagi mesurat.
4. **Dues capes separables.** La simulació funciona sola (laboratori lliure, projecció a classe) i la guia pedagògica s'hi posa a sobre (investigacions), sense preguntes que interrompin la manipulació.
5. **L'error com a punt de partida.** Les idees prèvies equivocades formen part del disseny: una predicció equivocada no rep un «incorrecte», sinó l'experiment que la posa a prova.
6. **Senzilla d'usar.** Pocs controls visibles, només els que calen per a l'experiment en curs, i una pantalla compacta sense desplaçaments llargs.

## 5. Estructura de l'app

| Espai | Funció | Fase |
|---|---|---|
| **Inici** | Itinerari de les investigacions per blocs i accés al laboratori lliure | 1 |
| **Laboratori** | La taula de treball: objectes, instruments, líquids i taller, sense guia | 1 |
| **Investigacions** | El mateix laboratori amb una guia lateral: observa, prediu, experimenta, mesura, explica, aplica | 1 |
| **Quadern** | Dades anotades, càlculs, gràfiques, prediccions i conclusions; informe exportable | 1 |
| **Consulta** | Fórmules, escala d'unitats, taula de densitats, instruments i glossari | 1 |
| **Progrés** | Investigacions fetes i quatre dimensions d'aprenentatge | 1 |
| **Mode docent** | Projector, control del que es veu, escenes preparades i enllaços per compartir | 2 |

### Els set blocs de contingut (51 investigacions)

| Bloc | Tema | Investigacions | Nivell principal | Fase |
|---|---|---|---|---|
| A | Matèria i mesura | 8 | 1r–2n | 1 (i 2) |
| B | Unitats i equivalències | 4 | 1r–3r | 1 |
| C | La densitat | 10 | 2n–3r | 1 |
| D | Flotabilitat | 8 | 2n–3r | 1 i 2 |
| E | Forces i Arquimedes | 7 | 4t | 2 |
| F | Construïm i apliquem | 11 | 2n–4t | 3 i 4 |
| G | Pressió i hidrostàtica | 3 | 4t | 4 |

### Els tres nivells de profunditat

| Nivell | Curs orientatiu | Què s'hi veu |
|---|---|---|
| **1 · Descoberta** | 1r–2n | Nombres senzills, g i cm³, instruments ideals, explicacions qualitatives |
| **2 · Mesura** | 2n–3r | Resolució dels instruments, menisc, conversions, gràfiques massa-volum, identificació de materials |
| **3 · Models** | 4t | Forces en newtons, pes aparent, Arquimedes, fracció submergida, pressió, disseny d'embarcacions |

## 6. Decisions preses (amb el motiu)

| Tema | Decisió | Motiu |
|---|---|---|
| Plataforma | Web estàtica en català, publicada a GitHub Pages dins d'`edu-apps` | Com la resta de les teves apps |
| Tecnologia | HTML, CSS i JavaScript natius, sense compilació, i gràfics en SVG | Mantenible, coherent amb `Equacions` i `Volums`, i suficient per a un laboratori 2D rigorós |
| Física | Motor propi, en una dimensió vertical, amb equilibris exactes i moviments il·lustratius | És on hi ha el rigor; el 3D no l'aporta |
| 3D | Ajornat. Cap dependència de Three.js ni de Blender a les fases 1 a 3 | La recerca ho recomana i la pantalla en guanya claredat |
| Dades de l'alumnat | Sense registre ni núvol: tot al navegador, amb exportació en PDF, CSV i JSON | Privacitat i senzillesa |
| Abast de 4t | Densitat, flotabilitat, Arquimedes i el mínim d'hidrostàtica que explica l'empenyiment | Pascal, vasos comunicants i pressió atmosfèrica queden per a una possible app germana |
| NotebookLM | No cal incorporar-hi fonts | És una app interactiva, no un web de contingut |
| Fonts externes | Referents, no continguts per copiar (PhET és CC BY-NC; Science Bits té tots els drets reservats) | Llicències i autoria pròpia |
| Llicència | Codi AGPLv3 o posterior i continguts CC BY-NC-SA 4.0, amb SPDX dins del codi | Criteri de totes les teves apps |

## 7. Fases (resum)

| Fase | Nom | Resultat utilitzable |
|---|---|---|
| 0 | Prova del motor | El model físic programat i verificat amb proves automàtiques, sense interfície |
| 1a | Nucli del laboratori | Balança, proveta, vas d'aigua, columna de líquids, sal, quadern amb informe i nou investigacions (A7, C3, C4, C6, D1, D2, D3, D4 i D5) |
| 1b | Laboratori essencial | Catorze investigacions més de mesura, unitats i densitat (vint-i-tres en total), Consulta, Progrés i glossari |
| 2 | Flotabilitat i Arquimedes | Líquids, columna, sal, dinamòmetre, vas de vessament, forces i mode docent |
| 3 | Taller de construcció | Barques, càrrega, vaixell d'acer, submarí, iceberg i reptes oberts |
| 4 | Ampliació | Pressió, gasos, temperatura, partícules, editor d'activitats i diagnosi bayesiana |

El detall, amb criteris d'acceptació, és a [`11-fases-i-validacio.md`](planificacio/11-fases-i-validacio.md).

## 8. Decisions que has de confirmar

Indico la meva recomanació a cada punt. Pots respondre per números («d'acord amb tot excepte la 3 i la 7», per exemple).

1. **Nom i subtítol.** *Decidit:* «Densitat · Laboratori virtual de densitat i flotació», a la carpeta `Densitat`, amb l'àlies `ja.cat/densitat` (o `ja.cat/labdensitat` si està ocupat).
2. **Vocabulari.** *Decidit:* «surar» i «flotar» són correctes i es poden alternar a la interfície per facilitar la comprensió (per exemple, «sura (flota)» la primera vegada que surt en una investigació); «flotar» és el terme del llibre de Science Bits. «Empenyiment» i «líquid desplaçat».
3. **Símbols.** *Decidit:* `d` per a la densitat a tota l'app, com el llibre (`d = m / V`), `dL` per al líquid i `E = dL · g · V` per a l'empenyiment. Al nivell 3, una nota: «En física també s'escriu ρ».
4. **Gravetat.** *Decidit:* `g = 9,8 N/kg` per defecte, com el llibre. El docent pot canviar-lo a 10 o a 9,81 des del mode docent; la Lluna (1,6) i Mart (3,7) només surten a la investigació E7.
5. **Nivells.** *Decidit:* tres nivells per profunditat (Descoberta, Mesura, Models), amb el curs només com a orientació, i suports activables a qualsevol nivell. Per defecte el nivell el tria l'alumne i el pot canviar; si entra amb un enllaç del docent que porta el nivell (paràmetre a l'adreça), el nivell queda fix.
6. **Tecnologia.** *Decidit:* JavaScript natiu sense compilació, sense React ni TypeScript, i dibuix en SVG 2D. El 3D, ajornat fins que les proves amb l'alumnat demostrin que aporta alguna cosa.
7. **Mòduls de JavaScript.** *Decidit:* mòduls ES. L'app s'utilitza sempre des de GitHub Pages; no cal que s'obri amb un doble clic des d'una carpeta descarregada ni que es pugui descarregar. La instal·lació com a app (PWA) queda com a opció per a més endavant.
8. **Abast de la fase 1a.** *Decidit:* la versió àmplia. Taules de Mesura i de Columna, líquids (aigua, aigua salada, alcohol, oli i mel) i nou investigacions: A7, C3, C4, C6, D1, D2, D3, D4 i D5.
9. **Hidrostàtica.** *Decidit:* només les tres investigacions del bloc G (G1, G2 i G3), de nivell 3, a la fase 4, perquè expliquen d'on surt l'empenyiment. Pascal, els vasos comunicants, la pressió atmosfèrica i la meteorologia queden fora.
10. **Mercuri i gasolina.** *Decidit:* tots dos són líquids del laboratori com els altres, sense restriccions ni avisos llargs. Només porten el pictograma de perill a l'etiqueta de l'ampolla, com al laboratori real.
11. **Glossari.** *Decidit:* en català, amb traducció només al castellà i a l'anglès. Sense veu alta.
12. **Els dos PDF de Science Bits no es publiquen.** *Decidit:* la carpeta `Densitat` té un `.gitignore` amb `*.pdf`, de manera que els llibres es queden en local i no entren mai al repositori públic.
13. **Categoria al menú d'edu-apps.** *Decidit:* «Física», amb KineGraph i KineGraphIA.

## 9. Què passa quan aprovis el pla

1. ~~Aplico les decisions de l'apartat 8 als documents.~~ Fet el 2026-11-16.
2. Programo la fase 0 (motor físic i proves) i la fase 1a.
3. Verifico el disseny a 1920 × 1080, a 1366 × 768 i amb l'escalat del sistema al 125 % i al 150 %, i en mòbil.
4. Publico: commit i push, `README.md` amb captures, enllaç `ja.cat`, targeta al menú, llicència i formulari d'errors.
