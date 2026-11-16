# Densitat · Planificació completa

Recull en un sol document del pla mestre (`PLA.md`) i dels onze documents de `planificacio/`, en l'ordre de lectura. Els fitxers originals no s'han modificat i continuen sent la font de referència. Generat el 2026-11-16.


---

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

---

# 01 · Fonaments pedagògics

Aquest document fixa per a qui és l'app, què demana el currículum, què prenem de cada font, amb quins principis es dissenya i quines idees equivocades ha de desmuntar.

Torna al [pla mestre](PLA.md).

---

## 1. Encaix curricular

**Marc:** Decret 175/2022, d'ordenació dels ensenyaments de l'educació bàsica a Catalunya (LOMLOE), amb les modificacions posteriors que cita la recerca inicial. Matèria de Física i Química, trams 1r–3r i 4t d'ESO.

> Abans d'escriure la guia docent cal contrastar la redacció literal i la numeració de competències i sabers amb el document oficial d'XTEC. Aquí es recullen pel sentit, no per la lletra.

| Àmbit del currículum | Què ha de permetre l'app |
|---|---|
| Destreses científiques bàsiques | Formular hipòtesis, identificar i controlar variables, mesurar amb instruments, repetir mesures, construir taules i gràfiques, treure conclusions i comunicar-les |
| La matèria | Massa, volum i densitat com a propietats; propietats extensives i intensives; identificació de substàncies; model de partícules |
| La interacció | Pes, empenyiment, força normal i tensió; equilibri de forces; pressió hidrostàtica i principi d'Arquimedes (4t) |
| Llenguatge científic | Magnituds, unitats del SI, canvis d'unitats, precisió i xifres |
| Competència digital | Ús de simuladors i tractament de dades experimentals |

**Orientacions curriculars de la Generalitat que la recerca ha localitzat:**

- A **1r i 2n**: experiments amb la densitat, càlculs en diferents unitats per interpretar la flotabilitat i l'activitat paradigmàtica de mesurar la densitat d'una patata i preguntar què passa si es talla per la meitat.
- A **4t**: pressió hidrostàtica, empenyiment i principi d'Arquimedes, comprovats amb experiments o simulacions; relació entre pressió, profunditat i densitat.
- També hi apareix la barreja d'aigua i alcohol (els volums no són additius), que es reserva per a l'ampliació.

**Connexió amb Matemàtiques:** proporcionalitat directa (gràfica massa-volum i pendent), canvis d'unitats, volums de cossos (enllaç amb l'app `Volums`) i interpretació de gràfics.

## 2. Destinataris i context d'ús

| Perfil | Necessitat | Resposta de l'app |
|---|---|---|
| Alumnat de 1r–2n | Manipular, comparar, mesurar sense por d'equivocar-se | Nivell 1, nombres senzills, instruments ideals |
| Alumnat de 3r | Calcular, convertir, interpretar gràfiques, identificar materials | Nivell 2, instruments amb resolució, gràfica massa-volum |
| Alumnat de 4t | Explicar amb forces i equacions, dissenyar | Nivell 3, newtons, Arquimedes, taller de barques |
| Alumnat nouvingut o amb NESE | Poc text, suport visual, vocabulari | Lectura fàcil (A2), glossari amb traducció al castellà i a l'anglès, icones amb etiqueta |
| Professorat | Projectar, plantejar un debat, encarregar feina | Mode projector, escenes preparades, enllaços, informe en PDF |

**Escenaris d'ús previstos**

1. **Projecció a la pissarra digital** (gran grup): el docent planteja la pregunta, recull prediccions a mà alçada i fa l'experiment.
2. **Treball en parelles amb portàtil** (1366 × 768, sovint amb escalat): investigació guiada de 15 a 25 minuts.
3. **Feina autònoma per Classroom**: l'alumne fa la investigació i lliura l'informe en PDF.
4. **Abans o després d'una pràctica real**: predir amb la simulació i contrastar amb plastilina, patata, sal i un ou de debò.

## 3. Què prenem de cada font

### 3.1. Science Bits, 2n d'ESO: *Massa, volum i densitat*

| Pàgines | Contingut | Què en fem |
|---|---|---|
| 4–5 | Al supermercat: grams i litres; un quilo de palla i un de ferro; un litre de palla i un de ferro | Investigacions A1 i C1 |
| 7–9 | Columna de líquids (mel, aigua, oli, alcohol) i boles de masses diferents, de masses iguals i del mateix material | Investigació D3 |
| 11–12 | La massa, la balança i la tara per a líquids | Investigació A3 |
| 13 | Recipients graduats i aforats: pipeta, bureta, proveta, matràs aforat | Fitxa de Consulta i A6 |
| 14 | Volum de sòlids regulars (fórmules) i d'altres sòlids per immersió; vareta per als que suren | A5 i A7 |
| 15 | El menisc: còncau i convex, vista a l'altura del líquid, lectura tangent | A6: lupa de lectura |
| 17–18 | Concepte de densitat, `d = m / V` i les seves formes, unitats i conversió per factors | C3, B4 |
| 18 | Propietats extensives i intensives: mitja bola i un quart de bola de plastilina | C4 |
| 18–20 | Càlcul de densitats, identificació de fustes per interval de densitat, gràfica massa-volum amb mostres | C5 i C6 |
| 21–22 | Flotabilitat de materials, sòlids en una columna, globus i gasos, vaixells de formigó | D3, D4, F9 i F4 |

### 3.2. Science Bits, 4t d'ESO: *Fluids i pressió*

| Pàgines | Contingut | Què en fem |
|---|---|---|
| 4–5 | Vaixells: la fusta sura, el metall no, i tanmateix els vaixells són de metall | Pregunta motor del bloc F |
| 7 | Quatre esferes (fusta i plastilina, petites i grans): massa, volum, densitat i flotació | D2 |
| 8–9 | Bola i barqueta de plastilina; forces; pes i pes aparent amb dinamòmetre | F1 i E1 |
| 10–11 | Simulador amb dinamòmetre, vas de vessament i balança: pes del cos, força ascendent, volum i pes del líquid desplaçat, en aigua i en alcohol; objectes que no suren i que suren | E2, E3 i E4 |
| 12 | La barqueta amb pesos afegits: massa total, volum submergit, empenyiment; bola, barqueta i bloc massís | F2 i F4 |
| 13 | Conclusions: `E = V · d · g` | E3 |
| 20–23 | Pressió hidrostàtica, `p = d · g · h`, independència de la forma del recipient | G1 i G2 |
| 29–30 | Principi d'Arquimedes, empenyiment màxim, objectes massissos i no massissos | E3, E5 i F4 |
| 30–34 | Activitats: contenidor, coco, ou i aigua salada, iceberg, pes aparent, globus, dirigible | D5, F6, E1 i F9 |
| 15–19, 24–28, 35–46 | Pressió, Pascal, vasos comunicants, atmosfera i meteorologia | Fora de l'abast |

**Tres lliçons de la seqüència de Science Bits que conservem**

- La progressió *engeguem → explorem → expliquem*: primer una situació quotidiana, després l'experiment, al final la formalització.
- La **barqueta** com a fil conductor de 4t: mateix material, mateixa massa, forma diferent.
- Les **taules de dades** com a suport del raonament: l'alumne compara columnes i descobreix la coincidència.

**El que hi afegim:** continuïtat sobre els mateixos objectes (no cal canviar de simulador ni tornar a introduir dades), llibertat per provar el que no és al guió i un quadern que recull tot el recorregut.

### 3.3. Simuladors de referència

| Referent | Què n'aprofitem | Què intentem millorar |
|---|---|---|
| PhET, *Density* i *Buoyancy* | Immediatesa visual, objectes misteriosos, no mostrar totes les dades d'entrada | Instruments de mesura reals, quadern i itinerari |
| Educaplus, *Laboratorio de densidad* | Balança i proveta, ganxo per enfonsar els objectes que suren | Registre integrat i connexió amb els experiments següents |
| Gizmos, *Density Laboratory* | Líquid de densitat regulable, fitxes d'investigació | Tot en una sola eina i en obert |
| SimulaCiencia | Interfície en català, predir-observar-explicar, profunditat i empenyiment | Un sol laboratori en lloc de dos de separats |
| CEDEC-INTEF, *¿Flota o se hunde?* | Dotze objectes, hipòtesis, taules i conclusions en parelles | Taules i conclusions dins de l'app |

Aquestes diferències són objectius de disseny, no una auditoria de cada producte.

### 3.4. Recerca educativa

- L'aprenentatge per indagació funciona millor **amb guia adequada** que amb exploració totalment lliure (metaanàlisi de Lazonder i Harmsen, 2016).
- En flotació, l'alumnat tendeix a explicar amb **trets visibles** (massa, mida, forma) i li costa relacionar les propietats de l'objecte amb les del líquid.
- Els laboratoris virtuals no superen sistemàticament els reals: el que compta és la **guia**, les **representacions focalitzades** i les **oportunitats reals de decidir i reflexionar**. Convé combinar-los amb experiments físics.
- Les guies de PhET recomanen **preguntes breus** i adverteixen que les instruccions massa pautades frenen la investigació.

## 4. Principis de disseny didàctic

| # | Principi | Concreció a l'app |
|---|---|---|
| P1 | Primer observar i experimentar, després relacionar i al final formalitzar | La fórmula apareix quan l'alumne ja ha vist la regularitat a la taula o a la gràfica |
| P2 | Predir abans de provar | Tota investigació demana una predicció i el motiu abans de deixar manipular |
| P3 | Mesurar abans de calcular | En el mode experimental només hi ha les dades que l'alumne ha mesurat |
| P4 | Canviar una sola variable | El comparador mostra dues situacions de costat i marca què ha canviat |
| P5 | Contrastar, no corregir | Una predicció equivocada porta a l'experiment de contrast, no a un «incorrecte» |
| P6 | Bastida retirable | Tres graons de pista i nivells de suport que es poden desactivar |
| P7 | Representacions sincronitzades | L'objecte, les forces, els números i la gràfica canvien alhora |
| P8 | Transferir | Cada investigació acaba amb un cas nou sense ajuda immediata |
| P9 | Exigència per a tothom | El mateix experiment per a tot el grup; canvia el suport, no el repte |
| P10 | Cada animació té un propòsit | Mostra una relació, una magnitud o una observació; res de decoració |

### El cicle de cada investigació

| Pas | Què fa l'alumne | Què fa l'app |
|---|---|---|
| 1. Observa | Mira una situació i en llegeix la pregunta | Presenta l'escena inicial, sense dades de més |
| 2. Prediu | Tria què passarà i per què | Desa la predicció i el motiu; no diu si és correcta |
| 3. Experimenta | Manipula objectes, líquids i instruments | Respon amb el motor físic; ofereix pistes si s'encalla |
| 4. Mesura | Anota al quadern les lectures que necessita | Construeix la taula amb les dades anotades |
| 5. Explica | Compara predicció i resultat i completa la conclusió | Diagnostica la idea que hi ha darrere i proposa el contrast si cal |
| 6. Aplica | Resol un cas diferent | Comprova, valora i enllaça amb la investigació següent |

Al laboratori lliure el cicle no és obligatori.

## 5. Els tres nivells i els suports

| | Nivell 1 · Descoberta | Nivell 2 · Mesura | Nivell 3 · Models |
|---|---|---|---|
| Curs orientatiu | 1r–2n | 2n–3r | 4t |
| Nombres | Enters o un decimal | Decimals reals dels instruments | Decimals, notació científica quan cal |
| Unitats | g, kg, mL, L, cm³ | Totes, amb conversions | SI i newtons, pascals |
| Instruments | Ideals | Amb resolució, menisc i tara | Amb resolució i mesures repetides |
| Explicació | Qualitativa: «més dens que l'aigua» | Quantitativa: `d = m / V` | Forces i equacions: `E = dL · g · V` |
| Dades visibles | Les mesurades | Les mesurades | Les mesurades i, si s'activa, l'anàlisi de forces |

**Suports independents del nivell**

- **Nombres senzills:** valors escolars arrodonits (aigua 1,00 g/cm³) o valors de referència (0,998 g/cm³).
- **Lectura fàcil:** enunciats en nivell A2, frases curtes, una instrucció per línia.
- **Glossari:** amb traducció al castellà i a l'anglès, accessible des de qualsevol paraula marcada.
- **Pistes:** activades o desactivades pel docent.

## 6. Catàleg d'idees prèvies (IP)

Cada idea té un codi. Les investigacions, les opcions de resposta i el motor de diagnosi s'hi refereixen.

| Codi | Idea equivocada | Experiment de contrast | Investigació |
|---|---|---|---|
| IP-01 | «El que pesa molt s'enfonsa i el que pesa poc sura» | Un tauló de 2 kg que sura i un clau de 16 g que s'enfonsa | D1, D2 |
| IP-02 | «Els objectes grans són més densos» o «els grans s'enfonsen» | Dues peces del mateix material i mida diferent | C4, D2 |
| IP-03 | «Si tallo un objecte, la densitat es fa més petita» | Mesurar la patata sencera, la meitat i el quart | C4 |
| IP-04 | «La densitat és el mateix que la massa» | Objectes de la mateixa massa i volums diferents | C1, C3 |
| IP-05 | «La forma canvia la densitat del material» | Modelar la mateixa plastilina en bola, cilindre i plat compacte | C8 |
| IP-06 | «Un litre sempre pesa un quilo» | Pesar un litre d'aigua, d'oli, d'alcohol i de mel | B3 |
| IP-07 | «Massa i pes són el mateix» | Balança de braços i dinamòmetre a la Terra i a la Lluna | A4 |
| IP-08 | «Volum i capacitat són coses diferents» o «d'un graó a l'altre de volum es multiplica per 10» | Omplir el cub d'1 dm amb 1000 cubets i amb 1 L | B1, B2 |
| IP-09 | «L'aire no pesa ni ocupa espai» | Got cap per avall dins l'aigua; pilota inflada a la balança | A2 |
| IP-10 | «Com més pesa un objecte, més fa pujar l'aigua» | Dos objectes del mateix volum i massa molt diferent a la proveta | A7, E2 |
| IP-11 | «L'aigua no empeny els objectes que s'enfonsen» | Dinamòmetre: pes fora i dins de l'aigua | E1 |
| IP-12 | «Com més avall, més empenyiment» | Baixar un bloc ja submergit i observar el dinamòmetre | E5, G3 |
| IP-13 | «L'empenyiment depèn del pes de l'objecte» | Esferes d'igual volum i materials diferents: mateix empenyiment | E3, E5 |
| IP-14 | «El que sura queda tot per sobre de l'aigua i no en desplaça» | Mesurar la part submergida i l'aigua vessada per un objecte que sura | D6, E4 |
| IP-15 | «Si està quiet, no hi actua cap força» | Mostrar pes i empenyiment iguals i oposats en un objecte que sura | E6 |
| IP-16 | «Els líquids de densitat diferent sempre fan capes» o «el líquid més espès és el més dens» | Aigua i alcohol es mesclen; l'oli és espès i sura | D7 |
| IP-17 | «Surar depèn només de l'objecte» o «amb més aigua sura millor» | El mateix objecte en líquids diferents i en recipients de mida diferent | D4, D5 |
| IP-18 | «El metall sempre s'enfonsa» o «els vaixells suren perquè tenen motor o es mouen» | Bloc d'acer i buc d'acer de la mateixa massa | F1, F4 |
| IP-19 | «Tot el que és buit sura» | Una bola buida amb parets gruixudes que s'enfonsa | F4 |
| IP-20 | «La pressió depèn de la quantitat d'aigua que hi ha a sobre» | Recipients de forma diferent amb la mateixa alçada de líquid | G2 |

## 7. Catàleg d'errors de procediment (EP) i de càlcul (EM)

Aquests errors no són idees sobre el món, sinó descuits o tècniques mal apreses. Es diagnostiquen a part perquè no es confonguin amb una manca de comprensió.

| Codi | Error | Com el detecta l'app | Missatge orientatiu |
|---|---|---|---|
| EP-01 | No tarar el recipient | Anota la massa d'un líquid amb el recipient inclòs | «Aquesta massa inclou el vas. Com la pots descomptar?» |
| EP-02 | Llegir el menisc per dalt | La lectura introduïda coincideix amb la vora superior | «Mira la part més baixa de la corba.» |
| EP-03 | Llegir amb la vista desviada | La lectura es fa amb l'ull alt o baix | «Posa l'ull a l'altura del líquid.» |
| EP-04 | Mesurar per desplaçament un objecte que sura | Anota la pujada del nivell sense haver-lo enfonsat | «Una part de l'objecte és fora de l'aigua. Quin volum has mesurat?» |
| EP-05 | Triar una proveta inadequada | L'objecte no hi cap o la resolució és massa gran per al que es vol mesurar | «Prova amb una proveta que s'ajusti millor a la mida.» |
| EP-06 | L'objecte no queda cobert pel líquid | Hi ha massa poc líquid a la proveta | «Cal prou líquid per cobrir-lo del tot.» |
| EP-07 | No posar la balança a zero | Mesura amb un desplaçament inicial | «Què marca la balança buida?» |
| EM-01 | Invertir el quocient (`V / m`) | El resultat coincideix amb l'invers | «Has calculat quant espai ocupa cada gram. La densitat és la massa de cada centímetre cúbic.» |
| EM-02 | Barrejar unitats incoherents | Divideix grams entre litres i etiqueta g/cm³ | «Quines unitats té cada dada?» |
| EM-03 | Factor de conversió de volum erroni | Multiplica per 10 o per 100 entre graons | «Cada graó de volum val 1000.» |
| EM-04 | Convertir malament g/cm³ i kg/m³ | Divideix quan cal multiplicar, o fa servir 100 | «1 g/cm³ són 1000 kg/m³.» |
| EM-05 | Resultat sense unitat | Camp de la unitat buit | «Un número sense unitat no és una mesura.» |
| EM-06 | Confondre massa i pes en una força | Introdueix grams on calen newtons | «El pes és una força: massa en quilograms per `g`.» |
| EM-07 | No passar cm³ a m³ a `E = dL · g · V` | Resultat un milió de vegades més gran | «La densitat està en kg/m³. I el volum?» |
| EM-08 | Massa xifres decimals | Més decimals dels que permet l'instrument (només nivell 3) | «L'instrument no pot donar tanta precisió.» |

## 8. Les quatre dimensions de progrés

L'app no dona una nota global. Recull evidències separades:

| Dimensió | Evidències |
|---|---|
| **Comprensió conceptual** | Distingeix massa, volum, densitat, pes i empenyiment; supera les idees IP |
| **Procediment experimental** | Tria l'instrument, tara, llegeix el menisc, controla variables |
| **Competència matemàtica** | Calcula densitats, converteix unitats, interpreta gràfiques |
| **Raonament científic** | Prediu amb motiu, explica la discrepància, conclou amb dades |

El funcionament del diagnòstic és a [`07-guia-quadern-i-avaluacio.md`](planificacio/07-guia-quadern-i-avaluacio.md).

---

# 02 · Model científic

Aquest document defineix el motor físic: què és cada cosa del laboratori, quines magnituds té, quines lleis s'apliquen, quines regles no es poden trencar mai i amb quins casos es comprova. És la base de les proves automàtiques de la fase 0.

Torna al [pla mestre](PLA.md).

---

## 1. Criteris generals

1. **Tot resultat surt del model.** Cap activitat pot forçar un resultat que el motor no doni.
2. **Els equilibris són exactes; els moviments, il·lustratius.** La posició final d'un objecte es calcula analíticament. El trajecte fins a arribar-hi és una animació plausible, no una simulació de fluids.
3. **Una dimensió vertical.** Els objectes només pugen i baixen. No giren, tret del model simplificat d'estabilitat de les barques (fase 3).
4. **El valor real i el valor mesurat són diferents.** El motor coneix el valor real; l'instrument en dona una lectura segons la seva resolució.
5. **Les simplificacions s'expliciten.** Cada una té un codi (S-xx) i es pot consultar des de l'app, a «Com funciona aquest laboratori».

## 2. Entitats

```
Material ──► Part ──► Objecte ──► (dins d'un) Recipient amb Líquids
                         ▲                    ▲
                    Cavitats            Instruments ──► Lectures ──► Quadern
```

### 2.1. Material

| Camp | Descripció |
|---|---|
| `id`, `nom` | Identificador i nom en català |
| `dEscolar` | Densitat arrodonida per a l'aula (g/cm³) |
| `dReferencia` | Densitat de referència a 20 °C (g/cm³) |
| `interval` | Mínim i màxim habituals, quan el material és variable (fustes, plastilina) |
| `estat` | Sòlid, líquid o gas |
| `deformable` | Si es pot modelar sense tallar (plastilina) |
| `tallable` | Si es pot dividir amb el ganivet |
| `aspecte` | Color, textura i brillantor per al dibuix |
| `notes` | Advertiments: porós, soluble, tòxic, variable |

### 2.2. Líquid

Com el material, més:

| Camp | Descripció |
|---|---|
| `familia` | Grup de miscibilitat: aquós, oliós o mercuri |
| `viscositatVisual` | Baixa, mitjana o alta; només afecta la velocitat de l'animació |
| `menisc` | Còncau (aigua en vidre) o convex (mercuri) |
| `color`, `transparencia` | Per al dibuix i per distingir capes |

### 2.3. Objecte

Un objecte és un conjunt de **parts** massisses i de **cavitats**, amb una forma.

| Camp | Descripció |
|---|---|
| `id`, `etiqueta` | Identitat persistent (A, B, C… o un nom) |
| `forma` | Geometria paramètrica: cub, ortoedre, cilindre, esfera, prisma, irregular, buc |
| `parts` | Llista de `{material, volum}` |
| `cavitatsTancades` | Llista de `{volum, contingut}` (aire, buit, líquid) |
| `cavitatOberta` | Per als bucs: volum interior en funció de l'alçada i el que conté |
| `origen` | D'on ve: creat, tallat de l'objecte X, modelat a partir de Y |
| `misteri` | Si s'amaga el nom del material |

**Magnituds derivades (mai emmagatzemades):**

| Magnitud | Definició |
|---|---|
| Massa `m` | Suma de `d · V` de totes les parts, més el contingut de les cavitats |
| Volum de material `Vmat` | Suma dels volums de les parts |
| Volum exterior `Vext` | Volum que delimita la superfície exterior tancada: `Vmat` més les cavitats tancades |
| Volum envoltant `Venv` | En un buc obert, el volum fins a la vora: material més cavitat oberta |
| Volum màxim desplaçable `Vmax` | Tancat: `Vext`. Buc sencer: `Venv`. Buc inundat: `Vmat` |
| Densitat del material `dmat` | Només si l'objecte és d'un sol material |
| Densitat mitjana `dmitj` | `m / Vmax` |
| Pes `P` | `m · g` |

### 2.4. Recipient

| Camp | Descripció |
|---|---|
| `tipus` | Proveta, vas de precipitats, matràs aforat, vas de vessament, tanc, ampolla |
| `seccio(y)` | Àrea interior en funció de l'alçada; constant en cilindres i prismes |
| `capacitat` | Volum útil fins a la darrera marca o fins a la vora |
| `diametreBoca` | Per saber si un objecte hi cap |
| `graduacio` | Valor de la divisió més petita, o marca única si és aforat |
| `massaBuit` | Tara |
| `bec` | Alçada de sortida, als vasos de vessament |

### 2.5. Entorn

| Camp | Valor per defecte | Opcions |
|---|---|---|
| Gravetat `g` | 9,8 N/kg | 9,81 · 10 · Lluna 1,6 · Mart 3,7 |
| Temperatura | 20 °C | Variable a la fase 4 |
| Aire ambient | 1,2 kg/m³, sense efecte sobre les pesades | Efecte activable a la fase 4 |
| Pressió atmosfèrica | 101 325 Pa, no sumada | Sumable al bloc G |

## 3. Unitats internes i aritmètica

- **Unitats internes:** massa en g, longitud en cm, volum en cm³, densitat en g/cm³, força en N, pressió en Pa.
- **Conversió a força:** `P (N) = m (g) / 1000 · g`.
- **Conversió a pressió:** `p (Pa) = d (g/cm³) · 1000 · g · h (cm) / 100`.
- **Comparacions amb tolerància:** dos valors són iguals si difereixen menys d'una part en un milió del valor de referència.
- **Canvis d'unitats exactes:** les conversions es fan amb potències de deu sobre enters escalats, perquè no apareguin resultats com 0,30000000000000004.
- **Presentació:** coma decimal, espai fi als milers, tants decimals com la resolució de l'instrument.

## 4. Lleis que aplica el motor

### 4.1. Massa, volum i densitat

```
d = m / V        m = d · V        V = m / d
```

**Tallar** un objecte homogeni en fraccions `f` i `1 − f`: cada tros té `f · m` i `f · V`. La densitat no canvia.

**Unir** dos objectes: `m = m1 + m2`, `Vmat = V1 + V2`, `dmitj = (m1 + m2) / (V1 + V2)`.

**Modelar** un material deformable: canvia la forma; `m` i `Vmat` es conserven. Si la nova forma té cavitat oberta (barca), canvia `Venv` i, per tant, `Vmax` i `dmitj`.

### 4.2. Equivalències

```
1 dm³ = 1 L = 1000 cm³ = 1000 mL          1 m³ = 1000 L          1 cm³ = 1 mL
1 g/cm³ = 1 g/mL = 1 kg/L = 1 kg/dm³ = 1000 kg/m³ = 1000 g/L
```

### 4.3. Empenyiment

Per a un cos dins d'un líquid en repòs:

```
E = dL · g · Vsub
```

Amb diverses capes de líquid (o líquid i aire), el motor suma cada tram:

```
E = g · Σ (di · Vi)
```

### 4.4. Estat d'un objecte dins d'un sol líquid

Sigui `Vnec = m / dL` el volum que cal desplaçar per igualar el pes.

| Condició | Estat | Volum submergit | Forces |
|---|---|---|---|
| `Vnec < Vmax` | **Sura** | `Vsub = Vnec` | `E = P` |
| `Vnec = Vmax` | **Equilibri dins del líquid** (ni puja ni baixa) | `Vsub = Vmax` | `E = P` |
| `Vnec > Vmax` | **S'enfonsa** | `Vsub = Vmax` | `E < P`; al fons, `N = P − E` |

Per a un sòlid massís homogeni, la fracció submergida quan sura és `Vsub / V = dobj / dL`.

**Objecte penjat d'un dinamòmetre:** `T = P − E(Vsub)`, mai negativa. La lectura és el **pes aparent**.

**Objecte enfonsat amb la vareta:** força de la vareta `F = Emàx − P`, cap avall.

**Objecte en una columna de capes:** baixa fins a la primera capa de densitat igual o superior a la seva i queda a la interfície, amb `m = dsup · Vsup + dinf · Vinf`.

### 4.5. Nivell del líquid i desplaçament

En un recipient de secció constant `A`, amb un volum de líquid `VL` i objectes que hi tenen submergit `Vsub`:

```
nivell = (VL + Vsub) / A
```

- La **pujada llegida** a la proveta és `Vsub`. Només coincideix amb el volum de l'objecte si està totalment submergit.
- Un objecte que sura fa pujar el nivell `m / dL`, no el seu volum.
- Si el nivell supera la vora o el bec, el sobrant **vessa**: `Vvessat = VL + Vsub − capacitat`.
- En recipients de secció variable, el nivell es resol numèricament sobre `seccio(y)`.

### 4.6. Barques (buc obert)

Model de buc prismàtic de llargada `L`, amplada `B`, alçada `H` i gruix de paret `t`:

```
Vmat = L·B·H − (L − 2t)·(B − 2t)·(H − t)        (fixat per la massa de material)
Venv = L·B·H
calat      h = (mbarca + mcàrrega) / (dL · L · B)
francbord  f = H − h
càrrega màxima = dL · Venv − mbarca
```

- L'alumne tria la forma (o `L`, `B` i `H`); el motor resol el gruix `t`. Si `t` baixa d'un mínim, la paret «es trenca» i la forma no és vàlida.
- Si `h > H`, **l'aigua entra**: la cavitat s'omple, `Vmax` passa a ser `Vmat` i la barca s'enfonsa si el material és més dens que el líquid.
- **Via d'aigua** (fase 3): l'aigua embarcada s'afegeix a la massa; la barca s'enfonsa quan `h` arriba a `H`.
- **Estabilitat simplificada** (fase 3, opcional): alçada metacèntrica d'un buc rectangular, `GM = h/2 + B²/(12·h) − zG`. Si és negativa, la barca bolca. Es presenta com a model simplificat.

### 4.7. Submarí i globus

**Submarí** de volum exterior fix `Vext`, massa del buc `mb` i tanc de llast de capacitat `Vt` omplert en una fracció `x`:

```
m = mb + dL · x · Vt          dmitj = m / Vext
```

Puja si `dmitj < dL`, baixa si `dmitj > dL` i queda en equilibri si són iguals.

**Globus** de volum `V` ple d'un gas de densitat `dgas`, amb una coberta de massa `mc`:

```
E = daire · g · V        P = (mc + dgas · V) · g        Fneta = E − P
```

### 4.8. Líquids, capes i mescles

1. Un líquid que s'aboca **baixa** a través de les capes menys denses fins que troba una capa de densitat igual o superior.
2. Si en baixar travessa una capa de la **mateixa família**, s'hi **mescla**.
3. Si queda a sobre d'una capa de la mateixa família sense travessar-la (abocat amb cura), forma una **capa separada inestable**, amb la interfície difuminada.
4. **Remenar** mescla tots els líquids de cada família i després les fases resultants es tornen a ordenar per densitat.
5. Densitat d'una mescla ideal: `d = (m1 + m2) / (V1 + V2)`.
6. **Aigua amb sal:** la densitat es llegeix d'una taula en funció del percentatge en massa; el volum de la dissolució és `(maigua + msal) / d`. Per sobre de la saturació, la sal sobrant queda al fons sense dissoldre's.
7. **Aigua i etanol** (fase 4): el volum de la mescla és inferior a la suma, segons una taula de referència.

### 4.9. Pressió hidrostàtica (bloc G)

```
p = dL · g · h                         (pressió deguda al líquid)
p total = p atmosfèrica + dL · g · h   (si s'activa)
F = p · S                              (força sobre una cara)
```

En un bloc de cares horitzontals d'àrea `S` i alçada `a`: `F inferior − F superior = dL · g · a · S = dL · g · V = E`. Les forces laterals es compensen.

## 5. Moviment: com es mou un objecte fins a l'equilibri

Només serveix per mostrar un trajecte creïble i una força neta diferent de zero mentre l'objecte puja o baixa.

- Estat: posició vertical `y` i velocitat `v`.
- Forces: pes, empenyiment `E(y)` segons el volum submergit a cada instant, i una resistència proporcional a la velocitat.
- La resistència augmenta amb la `viscositatVisual` del líquid: a la mel els objectes cauen a poc a poc.
- El temps s'escala perquè tot trajecte duri entre 0,6 i 2,5 segons.
- Quan la velocitat i la força neta són prou petites, l'objecte es col·loca exactament a la posició d'equilibri calculada.
- Amb «reduir el moviment» activat, l'objecte va directament a la posició final.

Mentre dura el moviment, el vector de força neta es mostra i no és zero. En equilibri, pes i empenyiment (i normal o tensió, si n'hi ha) es compensen exactament.

## 6. Instruments: del valor real a la lectura

```
lectura = arrodoneix(valor real + desplaçament de zero + soroll, resolució)
```

| Paràmetre | Nivell 1 | Nivell 2 | Nivell 3 |
|---|---|---|---|
| Resolució | Àmplia i amb nombres rodons | La de l'instrument triat | La de l'instrument triat |
| Desplaçament de zero | No | En algunes investigacions | Sí |
| Soroll | No | No | Opcional (mesures repetides) |
| Lectura del menisc | Automàtica, amb línia guia | La fa l'alumne | La fa l'alumne |

**Rang:** si el valor supera la capacitat, l'instrument ho indica (sobrecàrrega, fora d'escala) i no dona lectura.

**Tolerància en les respostes:** una resposta numèrica és vàlida si és compatible amb la resolució dels instruments utilitzats (propagada al resultat) o, al nivell 1, si difereix menys d'un 2 % del valor esperat. Sempre s'exigeix la unitat.

## 7. Regles invariables

Són les afirmacions que l'app ha de complir sempre. Cada una té, com a mínim, una prova automàtica.

| Codi | Regla |
|---|---|
| R1 | La massa d'un objecte és la suma de les masses de les seves parts i del contingut de les cavitats |
| R2 | Tallar un objecte homogeni conserva la densitat i reparteix massa i volum en la mateixa proporció |
| R3 | La suma de masses i de volums de material dels trossos és igual a la de l'objecte original |
| R4 | No es poden fixar alhora material, massa i volum: dos determinen el tercer |
| R5 | Modelar conserva la massa i el volum de material |
| R6 | La balança dona la mateixa lectura sigui quina sigui la forma de l'objecte |
| R7 | Un objecte totalment submergit desplaça el seu volum exterior, a qualsevol profunditat |
| R8 | Un objecte que sura desplaça un volum de líquid de massa igual a la seva |
| R9 | En equilibri, la suma de forces verticals és zero |
| R10 | L'empenyiment no depèn de la massa ni del material de l'objecte, sinó del volum submergit i de la densitat del líquid |
| R11 | Un objecte recolzat al fons continua rebent empenyiment; la normal val `P − E` |
| R12 | El pes aparent és `P − E` i mai és negatiu |
| R13 | La fracció submergida d'un sòlid massís que sura és `dobj / dL` i no depèn de `g` |
| R14 | El volum de líquid es conserva: el que surt d'un recipient entra en un altre o vessa |
| R15 | Un buc obert s'inunda quan el calat supera l'alçada del costat |
| R16 | El mateix objecte pot surar en un líquid i enfonsar-se en un altre |
| R17 | La pressió a una profunditat només depèn de la profunditat, de la densitat del líquid i de `g` |
| R18 | Dos líquids de famílies diferents no es mesclen; dos de la mateixa família es mesclen en remenar |
| R19 | La lectura d'un instrument és un múltiple de la seva resolució i queda dins del seu rang |
| R20 | El que es veu (posició, nivell, vectors) coincideix amb el que es calcula |

## 8. Simplificacions declarades

| Codi | Simplificació | Quan es revela |
|---|---|---|
| S1 | L'aigua té densitat 1,00 g/cm³ | Nivell 3 i fase 4: 0,998 a 20 °C; depèn de la temperatura |
| S2 | Un litre d'aigua té una massa d'1 kg | Nivell 2: és una aproximació; l'equivalència 1 dm³ = 1 L sí que és exacta |
| S3 | L'aire no afecta les pesades | Fase 4: l'empenyiment de l'aire és petit però real |
| S4 | L'aire de dins d'una barca o d'una bola buida no té massa | Nivell 3: és unes 800 vegades menys dens que l'aigua |
| S5 | Els líquids no es comprimeixen ni canvien amb la temperatura | Fase 4 |
| S6 | Els objectes no absorbeixen aigua ni s'hi dissolen | Fase 4: esponja i terròs de sucre |
| S7 | La vareta i el fil no tenen volum ni massa | Sempre visible a la descripció de l'eina |
| S8 | En treure un objecte de l'aigua no se n'endú | Sempre |
| S9 | Els objectes no giren ni es tomben | Fase 3: model d'estabilitat de les barques |
| S10 | La viscositat només alenteix l'animació | Investigació D7 |
| S11 | La plastilina té 1,5 g/cm³ | Consulta: varia entre 1,3 i 1,9 segons la marca |
| S12 | El pes es calcula amb `g = 9,8 N/kg` | Configurable |
| S13 | Els aliments (patata, ou, poma) es tracten com a homogenis | Investigació F8 |
| S14 | La pressió es mostra sense l'atmosfèrica | Bloc G: activable |

## 9. Casos de prova amb resultat conegut

Amb valors escolars i `g = 9,8 N/kg`, tret que s'indiqui una altra cosa.

### 9.1. Massa, volum i densitat

| # | Situació | Resultat esperat |
|---|---|---|
| T01 | Bloc d'alumini (2,70) de 2,5 × 4 × 10 cm a la balança | 270 g (volum 100 cm³) |
| T02 | El mateix bloc, tallat per la meitat | Dos trossos de 135 g i 50 cm³; densitat 2,70 cadascun |
| T03 | Patata (1,08) de 160 cm³ tallada per la meitat i una meitat tallada altra vegada | 86,4 g i 80 cm³; 43,2 g i 40 cm³; 1,08 sempre |
| T03b | Un bloc de 150 cm³ del mateix material tallat en 2/3 i 1/3 | 108 g i 100 cm³; 54 g i 50 cm³; 1,08 tots dos |
| T04 | El bloc d'alumini dins una proveta de 500 mL amb 200 mL | Nivell a 300 mL |
| T04b | El bloc d'alumini i una proveta de 250 mL (boca de 3,6 cm) | No hi cap: la proveta el rebutja |
| T05 | Plastilina (1,5) de 200 g modelada en bola, cilindre i plat | 200 g i 133,3 cm³ en tots tres casos |
| T06 | Constructor: material ferro (7,87) i volum 20 cm³ | Massa 157,4 g, no modificable |
| T07 | Un litre d'aigua, oli, alcohol, llet i mel | 1000 g, 920 g, 790 g, 1030 g i 1420 g |
| T08 | 2,70 g/cm³ en altres unitats | 2700 kg/m³ · 2,70 kg/L · 2700 g/L |
| T09 | Massa real 123,47 g en balances d'1 g, 0,1 g i 0,01 g | 123 g · 123,5 g · 123,47 g |
| T10 | Proveta de 100 mL amb 90 mL i una pedra de 25 cm³ | Fora d'escala; sense lectura vàlida |

### 9.2. Flotació

| # | Situació | Resultat esperat |
|---|---|---|
| T11 | Fusta de pi (0,50) de 200 cm³ en aigua | Sura amb 100 cm³ submergits (50 %) |
| T12 | La mateixa fusta en alcohol (0,79) i en oli (0,92) | 126,6 cm³ (63,3 %) i 108,7 cm³ (54,3 %) |
| T13 | Roure (0,75) de 100 cm³ en aigua i en alcohol | 75 % i 94,9 % submergit |
| T14 | Cera (0,90) en alcohol, oli i aigua | S'enfonsa · sura al 97,8 % · sura al 90 % |
| T15 | Gel (0,917) en aigua (1,00) i en aigua de mar (1,03) | 91,7 % i 89,0 % submergit |
| T16 | Ou de 60 g i 56 cm³ en aigua | S'enfonsa; `P = 0,588 N`, `E = 0,549 N` |
| T17 | El mateix ou en aigua amb un 15 % de sal (1,109) | Sura amb 54,1 cm³ submergits |
| T18 | Ferro (7,87) i or (19,3) en mercuri (13,55) | El ferro sura al 58,1 %; l'or s'enfonsa |
| T19 | Fusta de pi de 200 cm³ dins una proveta | El nivell puja 100 mL, no 200 mL |
| T20 | Columna de mel, aigua, oli i alcohol abocats en qualsevol ordre amb cura | De baix a dalt: mel, aigua, oli, alcohol |

### 9.3. Forces

| # | Situació | Resultat esperat |
|---|---|---|
| T21 | Bloc d'alumini de 100 cm³: pes | 2,646 N (2,649 N amb `g = 9,81`) |
| T22 | El mateix bloc totalment submergit en aigua | `E = 0,980 N`; pes aparent 1,666 N |
| T23 | El mateix bloc en alcohol | `E = 0,774 N`; pes aparent 1,872 N |
| T24 | El mateix bloc recolzat al fons | Normal 1,666 N; l'empenyiment continua sent 0,980 N |
| T25 | El mateix bloc a 10 cm i a 40 cm de profunditat | Mateix empenyiment; pressió diferent |
| T26 | Esferes de 50 cm³ de plastilina, ceràmica i acer submergides | Mateix empenyiment: 0,490 N |
| T27 | Fusta de pi de 200 cm³ surant | `P = E = 0,980 N`; força neta zero |
| T28 | Fracció submergida de la fusta a la Terra, la Lluna i Mart | 50 % en tots tres casos |

### 9.4. Barques, submarí i globus

| # | Situació | Resultat esperat |
|---|---|---|
| T29 | Bola de 200 g de plastilina en aigua | S'enfonsa; `Emàx = 1,307 N`, `P = 1,960 N`, normal 0,653 N |
| T30 | La mateixa plastilina en un buc de 12 × 10 × 5 cm | Gruix de paret 0,43 cm; sura amb 1,67 cm de calat i 3,33 cm de francbord |
| T31 | Càrrega màxima d'aquest buc en aigua | 400 g; amb 401 g s'inunda i s'enfonsa |
| T32 | El mateix buc en aigua salada (1,20) | Càrrega màxima 520 g |
| T33 | Bloc massís de plastilina de 600 cm³ | 900 g; s'enfonsa, tot i desplaçar el mateix volum que el buc |
| T34 | Submarí de 1000 cm³, buc de 700 g i tanc de 400 cm³, en aigua | Equilibri amb 300 cm³ d'aigua al tanc (75 %) |
| T35 | Globus de 10 L d'heli (0,17 g/L) amb coberta de 3 g | `E = 0,118 N`; `P = 0,046 N`; força neta 0,072 N cap amunt |

### 9.5. Pressió

| # | Situació | Resultat esperat |
|---|---|---|
| T36 | Aigua a 0,5 m, 1 m i 2 m de profunditat | 4900 Pa, 9800 Pa i 19 600 Pa |
| T37 | Mateixa profunditat en recipients de formes diferents | Mateixa pressió |
| T38 | Cub de 10 cm d'aresta amb la cara superior a 5 cm | Força superior 4,9 N, inferior 14,7 N; diferència 9,8 N, igual a l'empenyiment |

## 10. Com es verifica la coherència visual

No n'hi ha prou que el número sigui correcte. Per a cada cas de prova de flotació i de forces es comprova que:

1. La línia de flotació dibuixada coincideix amb la fracció submergida calculada.
2. El nivell del líquid dibuixat coincideix amb la lectura de la proveta.
3. La longitud dels vectors és proporcional a les forces i, en equilibri, pes i empenyiment mesuren el mateix.
4. Les dades del panell, del quadern i de la gràfica són les mateixes.

---

# 03 · Dades de referència

Valors dels materials, líquids, gasos, objectes, recipients i instruments del laboratori.

Torna al [pla mestre](PLA.md).

---

## 1. Criteris

- Cada substància té **dos valors**: l'**escolar**, arrodonit perquè els càlculs siguin nets, i el de **referència**, a 20 °C i 1 atm. El suport «nombres senzills» tria quin s'utilitza.
- Totes les densitats de sòlids i líquids són en **g/cm³**; les de gasos, en **kg/m³** (o g/L, que és el mateix número).
- Els valors de referència s'han de **contrastar amb una font tabulada** (per exemple, el *CRC Handbook of Chemistry and Physics*) abans de programar-los. Un script de validació comprovarà que cada valor escolar cau dins de l'interval de referència.
- No es copien les dades dels exercicis de Science Bits: les masses i els volums dels objectes són propis.

## 2. Sòlids

| Material | Escolar | Referència | Interval habitual | Notes |
|---|---|---|---|---|
| Poliestirè expandit | 0,05 | 0,03 | 0,015–0,05 | Gairebé tot és aire |
| Fusta de balsa | 0,15 | 0,16 | 0,10–0,20 | |
| Suro | 0,25 | 0,24 | 0,12–0,25 | |
| Fusta de pi | 0,50 | 0,50 | 0,35–0,60 | |
| Pedra tosca | 0,60 | — | 0,25–0,90 | Porosa: és una densitat mitjana. Una pedra que sura |
| Fusta de roure | 0,75 | 0,75 | 0,60–0,90 | |
| Poma | 0,80 | — | 0,75–0,85 | Aliment; valor mitjà |
| Cera (parafina) | 0,90 | 0,90 | 0,88–0,92 | |
| Gel | 0,92 | 0,917 | — | A 0 °C |
| Polietilè | 0,95 | 0,95 | 0,91–0,97 | Plàstic que sura |
| Ou fresc | 1,07 | — | 1,03–1,09 | Disminueix amb els dies |
| Patata | 1,08 | — | 1,06–1,10 | |
| Fusta de banús | 1,10 | 1,12 | 1,05–1,20 | Una fusta que s'enfonsa |
| Niló | 1,15 | 1,14 | 1,13–1,15 | Plàstic que s'enfonsa |
| PVC | 1,40 | 1,38 | 1,35–1,45 | |
| Plastilina | 1,50 | — | 1,3–1,9 | Segons la marca; deformable |
| Formigó | 2,30 | 2,30 | 2,2–2,4 | |
| Ceràmica | 2,40 | — | 2,3–2,5 | Per a les esferes d'Arquimedes |
| Vidre | 2,50 | 2,50 | 2,4–2,8 | |
| Granit | 2,70 | 2,70 | 2,6–2,8 | Coincideix amb l'alumini: cas didàctic |
| Alumini | 2,70 | 2,70 | — | |
| Pirita | 5,00 | 5,01 | 4,9–5,2 | «L'or dels ximples» |
| Zinc | 7,14 | 7,14 | — | |
| Estany | 7,30 | 7,29 | — | |
| Acer | 7,85 | 7,85 | 7,75–8,05 | |
| Ferro | 7,87 | 7,87 | — | |
| Llautó | 8,50 | 8,50 | 8,4–8,7 | Aliatge de coure i zinc |
| Coure | 8,96 | 8,96 | — | |
| Plata | 10,5 | 10,49 | — | |
| Plom | 11,3 | 11,34 | — | |
| Or | 19,3 | 19,32 | — | |

**Per què aquests materials?**

- Cobreixen tota l'escala, del poliestirè a l'or, amb diversos valors a prop de l'aigua, que són els més interessants.
- Hi ha **contraexemples** de les idees prèvies: una fusta que s'enfonsa (banús), una pedra que sura (tosca), plàstics que suren i que s'enfonsen (polietilè i niló).
- Hi ha **parelles difícils** per al joc dels detectius: alumini i granit; ferro i acer; or, llautó i pirita.

## 3. Líquids

| Líquid | Escolar | Referència (20 °C) | Família | Viscositat visual | Notes |
|---|---|---|---|---|---|
| Alcohol (etanol) | 0,79 | 0,789 | Aquosa | Baixa | Es mescla amb l'aigua |
| Oli | 0,92 | 0,91–0,92 | Oliosa | Mitjana | D'oliva o de gira-sol |
| Aigua | 1,00 | 0,998 | Aquosa | Baixa | 1,000 a 4 °C |
| Aigua de mar | 1,03 | 1,02–1,03 | Aquosa | Baixa | |
| Llet | 1,03 | 1,03 | Aquosa | Baixa | Només per a «quanta massa té un litre?» |
| Aigua salada saturada | 1,20 | 1,197 | Aquosa | Baixa | 26 % de sal en massa |
| Glicerina | 1,26 | 1,26 | Aquosa | Alta | |
| Xarop | 1,33 | 1,30–1,35 | Aquosa | Alta | Sucre concentrat |
| Mel | 1,42 | 1,38–1,45 | Aquosa | Molt alta | Es mescla amb l'aigua molt a poc a poc |
| Mercuri | 13,55 | 13,55 | Mercuri | Baixa | Tòxic: pictograma de perill a l'etiqueta |
| Gasolina | 0,75 | 0,72–0,76 | — | — | Inflamable: pictograma de perill a l'etiqueta |

### Aigua amb sal

Densitat de la dissolució de sal comuna segons el percentatge en massa, a 20 °C:

| Sal (% en massa) | 0 | 5 | 10 | 15 | 20 | 25 | 26 (saturació) |
|---|---|---|---|---|---|---|---|
| Densitat (g/cm³) | 0,998 | 1,034 | 1,071 | 1,109 | 1,148 | 1,189 | 1,197 |

- Amb «nombres senzills»: `d = 1,00 + 0,0075 · %`, que dona 1,075 al 10 % i 1,195 al 26 %.
- Percentatge en massa: `msal / (msal + maigua) · 100`.
- Solubilitat: uns 36 g de sal per cada 100 g d'aigua. El que passa d'aquí no es dissol.
- Referència per a l'aula: l'ou (1,07) comença a surar amb uns 110 g de sal per litre d'aigua.

### Aigua i temperatura (fase 4)

| Temperatura (°C) | 0 (gel) | 0 | 4 | 10 | 20 | 40 | 60 | 80 | 100 |
|---|---|---|---|---|---|---|---|---|---|
| Densitat (g/cm³) | 0,917 | 0,9998 | 1,0000 | 0,9997 | 0,9982 | 0,9922 | 0,9832 | 0,9718 | 0,9584 |

## 4. Gasos (fase 4)

A 20 °C i 1 atm, en kg/m³.

| Gas | Escolar | Referència | Notes |
|---|---|---|---|
| Hidrogen | 0,09 | 0,084 | Inflamable |
| Heli | 0,17 | 0,166 | El dels globus de fira |
| Metà | 0,70 | 0,67 | |
| Aire calent (100 °C) | 0,95 | 0,946 | Globus aerostàtic |
| Aire | 1,20 | 1,204 | |
| Diòxid de carboni | 1,80 | 1,84 | S'acumula a baix |
| Butà | 2,50 | 2,49 | |

## 5. Constants i entorns

| Constant | Valor |
|---|---|
| Gravetat a la Terra | 9,8 N/kg (opcions: 9,81 i 10) |
| Gravetat a la Lluna | 1,6 N/kg |
| Gravetat a Mart | 3,7 N/kg |
| Pressió atmosfèrica normal | 101 325 Pa |
| Temperatura del laboratori | 20 °C |

## 6. Objectes del prestatge

Els objectes són combinacions de material i forma. Les mides estan triades perquè donin nombres nets amb el valor escolar.

### 6.1. Joc bàsic (fase 1a)

| Etiqueta | Objecte | Material | Forma i mides | Volum (cm³) | Massa (g) | En aigua |
|---|---|---|---|---|---|---|
| A | Bloc metàl·lic | Alumini | Ortoedre de 2,5 × 4 × 10 cm | 100 | 270 | S'enfonsa |
| B | Bloc de fusta | Pi | Ortoedre de 4 × 4 × 12,5 cm | 200 | 100 | Sura (50 %) |
| C | Bola de plastilina | Plastilina | Esfera de 4,2 cm de diàmetre | 40 | 60 | S'enfonsa |

Les mides estan pensades perquè es puguin mesurar amb el regle i perquè els blocs passin per la boca d'una proveta de 500 mL o de 1000 mL.

### 6.2. Joc ampliat (fases 1a i 1b)

| Objecte | Material | Volum (cm³) | Massa (g) | Per a què serveix |
|---|---|---|---|---|
| Cilindres bessons | Alumini i plom | 20 cadascun | 54 i 226 | Mateix volum i mateixa pujada a la proveta, tot i la diferència de massa (IP-10) |
| Clau | Ferro | 2 | 15,7 | Objecte petit que s'enfonsa (IP-01) |
| Tauló | Pi | 4000 (10 × 20 × 20 cm) | 2000 | Objecte gran i pesant que sura (IP-01); es mesura amb el regle |
| Patata | Patata | 160 (allargada, 4,8 cm de gruix) | 172,8 | Tallar-la (IP-03); la meitat i el quart donen 80 i 40 cm³ |
| Pedra | Granit | 30 | 81 | Sòlid irregular per desplaçament |
| Tap | Suro | 20 | 5 | Sura molt amunt; cal vareta per mesurar-ne el volum |
| Espelma | Cera | 50 | 45 | Sura gairebé submergida |
| Glaçó | Gel | 30 | 27,6 | Fracció submergida |
| Ou | Ou fresc | 56 | 60 | Aigua salada |
| Poma | Poma | 200 | 160 | Aliment que sura |
| Bala de vidre | Vidre | 4 | 10 | Esfera petita |
| Peça d'escacs | Banús | 20 | 22 | Fusta que s'enfonsa |
| Pedra tosca | Tosca | 50 | 30 | Pedra que sura |
| Daus | Polietilè i niló | 8 | 7,6 i 9,2 | Dos plàstics, dos comportaments |
| Cubs bessons | Suro, pi, alumini, ferro, plom | 10 cadascun | 2,5 · 5 · 27 · 78,7 · 113 | Mateix volum, masses diferents |
| Peces d'un quilo | Poliestirè, pi, alumini, ferro | 20 000 · 2000 · 370 · 127 | 1000 cadascuna | Mateixa massa, volums diferents |
| Sèrie d'alumini | Alumini | 10, 20, 30, 50, 80, 100, 120, 150, 180, 200 | 27 a 540 | La recta massa-volum |
| Quatre esferes | Pi i plastilina | 20 i 60 | 10, 30, 30 i 90 | Massa, volum, densitat i flotació |

**Detall de les quatre esferes:** la gran de fusta (30 g) i la petita de plastilina (30 g) tenen la mateixa massa i comportament oposat. Això desmunta IP-01 sense cap explicació.

### 6.3. Objectes misteri (detectius de materials)

Sis peces sense nom, de colors neutres i mides diferents, generades a l'atzar entre: alumini, granit, zinc, estany, ferro, llautó, coure, plom, vidre, PVC, niló i banús. Al nivell 3 s'hi afegeixen els casos difícils: **or, llautó o pirita?** i **alumini o granit?**

### 6.4. Fase 2 i 3

| Objecte | Descripció |
|---|---|
| Sis esferes d'Arquimedes | Plastilina, ceràmica (2,4) i acer, de 20 cm³ i de 50 cm³ |
| Quatre esferes que suren | Cera, polietilè, pi i suro, de 50 cm³ |
| Bola buida d'acer | Volum exterior 100 cm³, 60 g de material: sura |
| Bola buida de parets gruixudes | Volum exterior 100 cm³, 300 g de material: s'enfonsa |
| Plastilina de taller | 200 g, modelable en bola, bloc, plat i barca |
| Planxa d'acer de taller | 500 g, conformable en bloc o en buc |
| Peses de càrrega | De 10 g, 20 g, 50 g i 100 g |
| Corona | Or pur o aliatge d'or i plata, a descobrir |

## 7. Recipients

| Recipient | Capacitat | Divisió | Diàmetre interior | Tara | Ús |
|---|---|---|---|---|---|
| Proveta de 25 mL | 25 mL | 0,5 mL | 1,6 cm | 30 g | Objectes petits, màxima resolució |
| Proveta de 100 mL | 100 mL | 1 mL | 2,6 cm | 80 g | Ús general |
| Proveta de 250 mL | 250 mL | 2 mL | 3,6 cm | 150 g | Objectes mitjans |
| Proveta de 500 mL | 500 mL | 5 mL | 5,0 cm | 280 g | Columna de líquids |
| Proveta de 1000 mL | 1000 mL | 10 mL | 6,0 cm | 450 g | Objectes grans |
| Vas de precipitats de 250 mL | 250 mL | 25 mL (orientativa) | 6,8 cm | 100 g | Contenir, no mesurar |
| Vas de precipitats de 600 mL | 600 mL | 50 mL (orientativa) | 8,6 cm | 200 g | Proves de flotació |
| Matràs aforat de 100 mL | 100,0 mL | Marca única | — | 60 g | Volum exacte de líquid |
| Ampolla d'1 L | 1000 mL | — | — | 40 g | Quanta massa té un litre? |
| Cub d'1 dm | 1000 cm³ | Quadrícula d'1 cm | 10 × 10 cm | 250 g | Construïm un litre |
| Vas de vessament | 600 mL fins al bec | — | 9,0 cm | 220 g | Recollir el líquid desplaçat; hi caben la poma i la patata |
| Tanc | 10 L | Regle lateral en cm | 30 × 15 cm | — | Barques, forces i pressió |

El **diàmetre** importa: un objecte que no passa per la boca de la proveta no s'hi pot mesurar, i com més estreta és la proveta, més puja el nivell i millor es llegeix.

## 8. Instruments de mesura

| Instrument | Model | Rang | Resolució | Fase |
|---|---|---|---|---|
| Balança digital | De cuina | 0–5000 g | 1 g | 1 |
| Balança digital | De laboratori | 0–2000 g | 0,1 g | 1 |
| Balança digital | De precisió | 0–200 g | 0,01 g | 2 |
| Balança de braços | Amb masses patró | 0–1000 g | 1 g (massa patró més petita) | 2 |
| Regle | 30 cm | 0–30 cm | 1 mm | 1 |
| Peu de rei | Simplificat | 0–15 cm | 0,1 mm | 2 |
| Dinamòmetre | Sensible | 0–5 N | 0,01 N | 2 |
| Dinamòmetre | General | 0–20 N | 0,05 N | 2 |
| Dinamòmetre | Gran | 0–100 N | 0,5 N | 3 |
| Sonda de pressió | — | 0–20 000 Pa | 10 Pa | 4 |
| Termòmetre | — | −10–110 °C | 1 °C | 4 |
| Densímetre | — | 0,70–1,50 g/cm³ | 0,01 g/cm³ | 4 |

**Masses patró de la balança de braços:** 500, 200, 200, 100, 50, 20, 20, 10, 5, 2, 2 i 1 g.

## 9. Format de les dades al codi

Cada taula d'aquest document es correspon amb un mòdul de dades. Exemple orientatiu:

```js
// dades/materials.js
export const MATERIALS = {
  alumini: {
    nom: "alumini",
    estat: "solid",
    dEscolar: 2.70,
    dReferencia: 2.70,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#B8BEC6", brillant: true },
    notes: []
  }
};
```

Un script `scripts/valida-dades.mjs` comprovarà, com a mínim:

1. Que cada valor escolar és dins de l'interval de referència.
2. Que la massa de cada objecte del prestatge és `d · V`.
3. Que cada objecte que s'ha de mesurar per desplaçament hi cap, com a mínim, en una proveta o al vas de vessament; els grans (tauló, peces d'un quilo) tenen forma regular i es mesuren amb el regle.
4. Que no hi ha dos materials del joc de detectius amb la mateixa densitat, tret dels casos difícils declarats.

---

# 04 · El laboratori i els instruments

Com és la taula de treball, com funciona cada instrument, què es pot fer amb els objectes i quines eines acompanyen l'experimentació.

Torna al [pla mestre](PLA.md).

---

## 1. Organització: quatre taules i un prestatge

El laboratori és un sol espai amb **quatre taules de treball**. Només se'n veu una cada vegada, i els objectes viatgen de l'una a l'altra perquè viuen al **prestatge**, que sempre és visible.

| Taula | Què hi ha | Per a què serveix | Fase |
|---|---|---|---|
| **Mesura** | Tres llocs per a instruments: per defecte, balança, proveta i vas amb aigua | Massa, volum, densitat i primera prova de flotació | 1 |
| **Columna** | Una proveta alta i les ampolles de líquids | Torres de líquids, capes i mescles, aigua amb sal | 2 |
| **Tanc** | Un tanc gran, dinamòmetre amb suport, vas de vessament amb vas col·lector i balança | Forces, pes aparent, Arquimedes, barques, pressió | 2 |
| **Taller** | Banc de treball amb eines: ganivet, motlles, constructor | Tallar, unir, modelar, construir objectes i barques | 1 (bàsic) i 3 |

**Per què taules i no un sol escenari gran?** Perquè cada taula té una composició fixa, que es pot dissenyar i verificar a 1366 × 768 sense retalls, i perquè l'alumne només veu els instruments que necessita.

En una **investigació guiada** només hi ha les taules i els instruments que la investigació necessita. Al **laboratori lliure** hi són tots.

### El prestatge

- Mostra els objectes disponibles com a fitxes amb dibuix i etiqueta (A, B, C… o un nom).
- Un objecte és o al prestatge o en un lloc d'una taula; no es pot duplicar per accident.
- En canviar de taula, els objectes que hi havia a sobre tornen al prestatge i conserven les seves dades.
- Els trossos d'un objecte tallat hi apareixen amb l'etiqueta del pare: A1 i A2.

## 2. Com es manipula

| Acció | Amb ratolí o dit | Amb teclat |
|---|---|---|
| Agafar i deixar | Arrossegar i deixar anar | Tabulador fins a l'objecte, Retorn per agafar, fletxes per triar la destinació, Retorn per deixar |
| Alternativa sense arrossegar | Clic a l'objecte i clic a la destinació | El mateix amb Retorn |
| Veure què es pot fer | Les destinacions vàlides s'il·luminen | Es llegeix la llista de destinacions |
| Destinació no vàlida | L'objecte torna enrere amb un missatge breu | Missatge llegit |
| Desfer | Botó «Desfés» | Ctrl + Z |

**Destinacions:** plat de la balança, boca de la proveta, superfície del vas o del tanc, ganxo del dinamòmetre, banc del taller i prestatge.

**Missatges de destinació no vàlida:** sempre diuen el motiu físic. Exemples: «No hi cap: la boca fa 3,6 cm», «Pesa massa per a aquesta balança», «El ganxo ja està ocupat».

## 3. Instruments

### 3.1. Balança digital

| Aspecte | Especificació |
|---|---|
| Aspecte | Plat, pantalla numèrica i dos botons: `Tara` i `Unitat` |
| Models | De cuina (5 kg, 1 g), de laboratori (2 kg, 0,1 g) i de precisió (200 g, 0,01 g) |
| Lectura | Massa total del que hi ha al plat, menys la tara, arrodonida a la resolució |
| Tara | Posa la pantalla a zero amb el que hi hagi al plat; en buidar-lo, marca el valor negatiu |
| Zero inicial | Als nivells 2 i 3 pot començar marcant un valor petit diferent de zero |
| Sobrecàrrega | Mostra `— — —` i un avís |
| Unitat | Alterna g i kg |
| Botó d'anotar | Envia la lectura al quadern amb l'objecte, l'instrument i la resolució |

**Procediment per a líquids** (com al llibre de 2n): recipient buit al plat, `Tara`, abocar el líquid.

### 3.2. Balança de braços (fase 2)

- Dos plats i un fidel. Es poden comparar dos objectes directament o equilibrar un objecte amb masses patró.
- Serveix per a dues coses que la digital no fa: **comparar sense números** i mostrar que la **massa no depèn de la gravetat** (a la Lluna s'equilibra igual).

### 3.3. Regle i peu de rei

| Nivell | Funcionament |
|---|---|
| 1 | En activar el regle, les arestes de l'objecte mostren la mida en centímetres |
| 2 i 3 | El regle es col·loca sobre una aresta, amb l'escala mil·limetrada visible, i l'alumne llegeix i escriu el valor |

El peu de rei simplificat (fase 2) mesura diàmetres d'esferes i de cilindres.

### 3.4. Proveta graduada

És l'instrument més treballat, perquè és on es concentren més errors de procediment.

| Aspecte | Especificació |
|---|---|
| Mides | 25, 100, 250, 500 i 1000 mL, amb la divisió i el diàmetre de la taula de dades |
| Escala | Dibuixada amb totes les divisions; xifres a les principals |
| Omplir | Des de l'ampolla o la gerra, mantenint premut; ajust fi amb el comptagotes |
| Buidar | Botó per abocar a la pica o a un altre recipient |
| Introduir un objecte | Es deixa anar a la boca; si hi cap, baixa fins al seu equilibri |
| Vareta | Eina per enfonsar del tot un objecte que sura |
| Lupa | Amplia la zona del menisc per llegir-lo |
| Fora d'escala | Si el nivell passa de la darrera marca, no hi ha lectura vàlida |

**La lupa i el menisc**

```
        ull massa alt          ull a l'altura          ull massa baix
        ┌──────────┐           ┌──────────┐            ┌──────────┐
   30 ──┤  ╭────╮  │      30 ──┤          │       30 ──┤          │
        │ (  ⌣  )  │           │ ╲______╱ │            │ (  ⌢  )  │
   20 ──┤  ╰────╯  │      20 ──┤          │       20 ──┤  ╰────╯  │
        └──────────┘           └──────────┘            └──────────┘
        es veu una el·lipse    es veu una corba         es veu una el·lipse
```

- La lupa té un control per **pujar i baixar l'ull**. Només quan l'ull és a l'altura del líquid la superfície es veu com una sola corba.
- El menisc de l'aigua és **còncau**: es llegeix la part més baixa. El del mercuri és **convex**: es llegeix la part més alta.
- Al nivell 1, una línia guia marca la lectura. Als nivells 2 i 3, l'alumne escriu el valor que llegeix.
- Es pot estimar mitja divisió (per exemple, 62,5 mL en una proveta d'1 mL de divisió).

**Mesura per desplaçament**

1. Anotar el volum inicial.
2. Introduir l'objecte; si sura, enfonsar-lo amb la vareta.
3. Anotar el volum final.
4. Calcular la diferència.

L'app no fa la resta per l'alumne: li dona dues lectures.

### 3.5. Vas de precipitats

- Graduació orientativa i gruixuda. Serveix per contenir i per fer proves de flotació, no per mesurar.
- Si l'alumne l'utilitza per mesurar un volum, el resultat és poc precís, i l'app ho fa notar a la investigació A8.

### 3.6. Matràs aforat i ampolla d'un litre

- El matràs té una sola marca: en arribar-hi, conté exactament 100,0 mL.
- L'ampolla d'un litre s'omple fins a la marca i es posa a la balança.
- Serveixen per obtenir la densitat d'un líquid amb un volum conegut.

### 3.7. Pipeta i bureta

No se simulen a la primera versió. Tenen una fitxa a Consulta («Instruments de laboratori»), amb el dibuix, l'ús i la diferència entre recipients graduats i aforats.

### 3.8. Dinamòmetre (fase 2)

| Aspecte | Especificació |
|---|---|
| Aspecte | Suport amb un dinamòmetre digital penjat, ganxo i fil |
| Models | 5 N (0,01 N), 20 N (0,05 N) i 100 N (0,5 N) |
| Lectura | Tensió del fil: pes a l'aire, pes aparent dins del líquid |
| Control | L'objecte es puja i es baixa amb el suport; es pot aturar a qualsevol alçada |
| Objectes que suren | La lectura baixa fins a zero quan l'objecte sura; el fil queda fluix |
| Sobrecàrrega | Avís i lectura no vàlida |

### 3.9. Vas de vessament i vas col·lector (fase 2)

- El vas de vessament s'omple fins al bec.
- En introduir-hi un objecte, el líquid desplaçat cau al vas col·lector, que està sobre una balança i té graduació.
- Es poden obtenir tres mesures del líquid desplaçat: **volum** (graduació), **massa** (balança) i **pes** (calculat per l'alumne).
- La composició reprodueix el muntatge clàssic: dinamòmetre a sobre, vas gran al mig i vas petit amb balança al costat.

### 3.10. Tanc (fase 2)

- Recipient gran, vist de cara i en secció, amb regle lateral en centímetres.
- Admet un líquid o diverses capes.
- És on es proven les barques, el submarí i les forces.
- Mostra la línia de flotació i, si s'activa, la part submergida ombrejada.

### 3.11. Sonda de pressió, termòmetre i densímetre (fase 4)

- **Sonda:** un punt que es mou per dins del líquid i dona la pressió en pascals.
- **Termòmetre:** amb un escalfador i un bany de gel, per estudiar la densitat de l'aigua.
- **Densímetre:** flotador graduat que s'enfonsa més o menys segons el líquid.

## 4. Líquids

| Acció | Funcionament |
|---|---|
| Triar | Ampolles etiquetades al costat de la taula |
| Abocar | Mantenir premut; el cabal és constant i es pot ajustar gota a gota |
| Abocar amb cura | Opció per dipositar el líquid a sobre sense travessar les capes |
| Afegir sal | Cullerades de 5 g; la sal es dissol fins a la saturació |
| Remenar | Botó amb vareta de vidre; mescla els líquids de la mateixa família |
| Buidar | Tot el recipient o fins a un nivell |

Les capes es dibuixen amb el color de cada líquid i una etiqueta opcional. Les capes inestables tenen la frontera difuminada.

## 5. Accions sobre els objectes (taller)

| Acció | Què fa | Condicions | Fase |
|---|---|---|---|
| **Tallar** | Divideix l'objecte en dos trossos, per la meitat o en una fracció triada (1/2, 1/3, 1/4 o lliure) | Material tallable | 1 |
| **Modelar** | Canvia la forma d'un material deformable entre formes compactes: bola, cilindre, bloc, plat | Plastilina | 1 |
| **Duplicar** | Crea una còpia amb una etiqueta nova | Sempre | 1 |
| **Construir** | Crea un objecte triant dues de tres coses: material, massa i volum | Laboratori lliure i investigació C7 | 1 |
| **Unir** | Ajunta dos objectes en un; si són de materials diferents, la densitat és la mitjana | — | 2 |
| **Buidar** | Crea una cavitat tancada dins d'una esfera o d'un bloc | — | 3 |
| **Donar forma de barca** | Converteix el material en un buc amb llargada, amplada i alçada regulables | Plastilina o planxa d'acer | 3 |
| **Carregar** | Posa peses dins d'un buc | Buc obert | 3 |

### El constructor d'objectes i «l'objecte impossible»

```
   Material   [ alumini ▾ ]   fixat
   Massa      [   270 g   ]   fixat
   Volum      [  100 cm³  ]   lliure  ← es calcula sol
```

- Hi ha tres caselles i **només se'n poden bloquejar dues**. La tercera la calcula el motor.
- Si l'alumne vol canviar les tres, l'app li pregunta quina vol deixar lliure i ensenya per què no pot ser d'una altra manera.
- És la manera manipulable de descobrir que massa, volum i densitat estan lligats.

## 6. Què se sap de cada objecte: dos modes de visibilitat

| | Mode experimental | Mode d'anàlisi |
|---|---|---|
| Què es veu a la fitxa de l'objecte | Només el que l'alumne ha mesurat i anotat | Tots els valors reals: massa, volums, densitat |
| Forces | Amagades | Vectors i valors |
| Qui el pot activar | És el mode per defecte | L'alumne al laboratori lliure; el docent a les investigacions |
| Motor físic | El mateix | El mateix |

La fitxa de l'objecte s'obre en clicar-lo:

```
   ┌───────────────────────────────┐
   │  A · Bloc metàl·lic           │
   │  ───────────────────────────  │
   │  Massa      270 g   balança   │
   │  Volum      —                 │
   │  Densitat   —                 │
   │  Material   ?                 │
   │  [ Talla ]  [ Duplica ]       │
   └───────────────────────────────┘
```

## 7. Eines de pensament

### 7.1. Calculadora amb unitats

- Les lectures anotades es converteixen en **fitxes** que porten el número i la unitat: `270 g`, `100 cm³`.
- L'alumne arrossega fitxes i tria l'operació. El resultat surt **amb la unitat que li correspon**: `270 g ÷ 100 cm³ = 2,7 g/cm³`.
- Si divideix al revés, obté `0,37 cm³/g`, i l'app li pregunta què significa aquest número en lloc de dir-li que s'ha equivocat.
- Al nivell 1 hi ha un marc guiat: `[massa] ÷ [volum] = [densitat]`.
- El resultat es pot anotar al quadern com una dada calculada.

### 7.2. Conversor i escala d'unitats

- Tres escales visuals: massa (graons de 10), capacitat (graons de 10) i volum (graons de 1000).
- L'alumne mou el valor per l'escala i veu com es desplaça la coma.
- Per a la densitat, la conversió es mostra amb **factors de conversió**, com al llibre: `1 g/cm³ · (1 kg / 1000 g) · (1 000 000 cm³ / 1 m³) = 1000 kg/m³`.

### 7.3. Comparador de dues situacions

- Duplica l'escena en dues meitats, **A** i **B**.
- L'alumne canvia una cosa en una de les dues.
- L'app marca quines variables són diferents entre A i B. Si n'ha canviat més d'una, ho avisa: «Has canviat dues coses. Com sabràs quina ha causat el resultat?»
- És l'eina del control de variables.

### 7.4. Gràfica massa-volum

- Cada fila de la taula del quadern és un punt.
- Als nivells 2 i 3 es pot dibuixar la recta que passa per l'origen i pels punts d'un mateix material; el pendent és la densitat.
- Es poden superposar diversos materials: cada un té la seva recta.
- La recta de l'aigua es pot mostrar com a frontera: per sobre, s'enfonsa; per sota, sura.

### 7.5. Vista de cubets

- Representa l'objecte dividit en cubets d'1 cm³ i reparteix-hi la massa: cada cubet d'alumini conté 2,7 g; cada cubet de fusta de pi, 0,5 g.
- És el pont entre l'objecte i la fórmula: la densitat és «el que pesa cada cubet».
- En tallar l'objecte, hi ha menys cubets, però cada cubet continua igual.

### 7.6. Anàlisi de forces (nivell 3)

- Vectors proporcionals sobre l'objecte: **pes** cap avall, **empenyiment** cap amunt, **normal** o **tensió** quan n'hi ha.
- La força neta es mostra a part, i és zero en equilibri.
- Les etiquetes porten el valor en newtons si s'activa «valors».

## 8. Estats i avisos del laboratori

| Situació | Resposta |
|---|---|
| Objecte que no hi cap | Torna enrere i diu la mida de la boca |
| Líquid que vessa | Animació de vessament i avís; el volum vessat es comptabilitza |
| Proveta fora d'escala | La lupa mostra el nivell per sobre de la darrera marca: «No es pot llegir» |
| Objecte no cobert | Als nivells 2 i 3 no s'avisa: és un error que ha de detectar l'alumne i que l'app diagnostica |
| Balança sobrecarregada | Pantalla amb guions |
| Paret de la barca massa fina | La forma es marca en vermell: «La paret es trencaria» |
| Barca inundada | L'aigua entra, la barca s'enfonsa i es pot recuperar amb «Treu-la i eixuga-la» |
| Escena desordenada | Botó «Endreça» que torna tots els objectes al prestatge |

## 9. Reinici, desfer i desar

- **Desfés i refés** il·limitats dins de la sessió.
- **Reinicia l'escena** torna a la situació inicial de la investigació o al laboratori buit, però no esborra el quadern.
- **L'estat es desa sol** al navegador a cada canvi.
- **Desa una escena** amb un nom per recuperar-la o compartir-la amb un enllaç.

## 10. Com funciona aquest laboratori

Pantalla de consulta, accessible des de l'ajuda, que explica en llenguatge planer què simula el laboratori i què no. Recull les simplificacions del [model científic](planificacio/02-model-cientific.md): l'aigua fa 1 g/cm³, l'aire no compta a les pesades, la vareta no ocupa lloc, els objectes no absorbeixen aigua. Forma part del rigor: l'alumne ha de saber que treballa amb un model.

---

# 05 · Catàleg d'investigacions (1): matèria, unitats i densitat

Fitxes de les investigacions dels blocs **A** (matèria i mesura), **B** (unitats i equivalències) i **C** (la densitat). Els blocs D a G són a [`06-cataleg-investigacions-2.md`](planificacio/06-cataleg-investigacions-2.md).

Torna al [pla mestre](PLA.md).

---

## Com llegir una fitxa

| Camp | Significat |
|---|---|
| **Pregunta** | La pregunta que veu l'alumne i que dona nom al repte |
| **Nivell · fase · durada** | Nivell de profunditat (1, 2 o 3), fase de desenvolupament i temps orientatiu |
| **Idees i errors** | Codis del catàleg d'[idees prèvies i errors](planificacio/01-fonaments-pedagogics.md) que treballa |
| **Escena** | Taula, objectes, instruments i líquids disponibles |
| **Seqüència** | Passos del cicle: observa, prediu, experimenta, mesura, explica |
| **Dades** | Columnes de la taula que es construeix al quadern |
| **Conclusió** | El que l'alumne ha de poder afirmar al final |
| **Aplica** | Cas de transferència, sense ajuda immediata |
| **Origen** | Font que la inspira: SB2 i SB4 són els llibres de Science Bits de 2n i de 4t |

Les dades numèriques són pròpies i surten de les [dades de referència](planificacio/03-dades-de-referencia.md).

## Resum dels blocs A, B i C

| Codi | Investigació | Nivell | Fase |
|---|---|---|---|
| A1 | Al supermercat | 1 | 1b |
| A2 | L'aire també és matèria | 1–2 | 2 |
| A3 | Mesurem la massa: la tara | 1–2 | 1b |
| A4 | Massa i pes no són el mateix | 2–3 | 2 |
| A5 | El volum dels sòlids regulars | 1–2 | 1b |
| A6 | La proveta i el menisc | 1–2 | 1b |
| A7 | El volum per desplaçament | 1–2 | 1a |
| A8 | Quina proveta necessito? | 2 | 1b |
| B1 | L'escala de les unitats | 1–2 | 1b |
| B2 | Construïm un litre | 1–2 | 1b |
| B3 | Quanta massa té un litre? | 1–2 | 1b |
| B4 | Les unitats de la densitat | 2–3 | 2 |
| C1 | Un quilo de palla i un quilo de ferro | 1 | 1b |
| C2 | Cubs bessons | 1 | 1b |
| C3 | Construïm la densitat | 1–2 | 1a |
| C4 | Tallem la patata | 1–2 | 1a |
| C5 | La recta de cada material | 2 | 1b |
| C6 | Detectius de materials | 2–3 | 1a |
| C7 | L'objecte impossible | 2 | 1b |
| C8 | La forma no enganya | 1–2 | 1b |
| C9 | La densitat dels líquids | 2 | 1b |
| C10 | Dues balances, una veritat? | 2–3 | 2 |

---

# Bloc A · Matèria i mesura

### A1 · Al supermercat

- **Pregunta:** un litre d'oli i un litre de llet ocupen el mateix. Pesen el mateix?
- **Nivell · fase · durada:** 1 · 1b · 10 min
- **Idees i errors:** IP-06, IP-08
- **Escena:** taula de Mesura amb balança de cuina. Productes envasats: arròs (1 kg), farina (500 g), oli (1 L), llet (1 L), aigua (1,5 L) i suc (200 mL). Els envasos d'un litre són idèntics.
- **Seqüència:**
  1. Observa les etiquetes i classifica cada producte segons la magnitud que indica: massa o volum.
  2. Prediu quin pesa més, el litre d'oli o el de llet, o si pesen igual.
  3. Pesa'ls. Descompta l'envàs amb la tara.
  4. Explica per què dos productes amb el mateix volum tenen masses diferents.
- **Dades:** producte · quantitat de l'etiqueta · magnitud · massa mesurada.
- **Conclusió:** els grams i els quilograms mesuren massa; els litres i els mil·lilitres, volum. El mateix volum no vol dir la mateixa massa.
- **Aplica:** un pot conté 500 g de mel. Ocupa mig litre? (No: uns 352 mL.)
- **Origen:** SB2, p. 4–5.

### A2 · L'aire també és matèria

- **Pregunta:** l'aire ocupa espai? Té massa?
- **Nivell · fase · durada:** 1–2 · 2 · 15 min
- **Idees i errors:** IP-09
- **Escena:** taula del Tanc amb aigua, un got transparent amb un paper sec al fons, una pilota amb inflador i la balança de laboratori.
- **Seqüència:**
  1. Prediu si el paper es mullarà en enfonsar el got cap per avall.
  2. Enfonsa el got recte: l'aigua no hi entra. Inclina'l: surten bombolles i hi entra aigua.
  3. Pesa la pilota tova i torna-la a pesar després d'inflar-la a pressió.
  4. Explica què hi ha dins del got i què ha entrat a la pilota.
- **Dades:** situació · què s'observa · massa de la pilota abans i després.
- **Conclusió:** l'aire ocupa volum i té massa: cada litre d'aire té una massa d'uns 1,2 g.
- **Nota de rigor:** la balança només detecta l'aire afegit a pressió. Un globus ple d'aire a pressió normal marca gairebé el mateix que buit (simplificació S3).
- **Aplica:** quina massa d'aire hi ha en una aula de 7 × 5 × 3 m? (126 kg.)
- **Origen:** segona recerca («El misteri del volum invisible»); SB2, p. 19.

### A3 · Mesurem la massa: la tara

- **Pregunta:** com es pesa un líquid sense pesar el vas?
- **Nivell · fase · durada:** 1–2 · 1b · 10 min
- **Idees i errors:** EP-01, EP-07
- **Escena:** balança de laboratori, vas de precipitats, ampolla d'aigua i una pedra.
- **Seqüència:**
  1. Observa la balança buida. Al nivell 2 marca 0,4 g: què cal fer?
  2. Pesa la pedra.
  3. Prediu com obtindries la massa de 150 mL d'aigua.
  4. Ordena els passos: vas buit, tara, abocar, llegir.
  5. Fes-ho de dues maneres: restant la massa del vas i amb la tara.
- **Dades:** massa del vas · massa del vas amb aigua · massa de l'aigua (per resta) · massa de l'aigua (amb tara).
- **Conclusió:** la tara descompta el recipient i dona directament la massa del contingut.
- **Aplica:** tens un pot tancat amb oli i un pot idèntic buit. Com saps la massa de l'oli?
- **Origen:** SB2, p. 11–12.

### A4 · Massa i pes no són el mateix

- **Pregunta:** a la Lluna tindries menys massa?
- **Nivell · fase · durada:** 2–3 · 2 · 15 min
- **Idees i errors:** IP-07, EM-06
- **Escena:** balança de braços amb masses patró, dinamòmetre i selector de lloc (Terra, Lluna, Mart). Un objecte de 300 g.
- **Seqüència:**
  1. Prediu què canviarà a la Lluna: la massa, el pes, totes dues coses o cap.
  2. Mesura la massa amb la balança de braços als tres llocs.
  3. Mesura el pes amb el dinamòmetre als tres llocs.
  4. Calcula el quocient entre el pes i la massa a cada lloc.
- **Dades:** lloc · massa (g) · pes (N) · pes / massa (N/kg).
- **Conclusió:** la massa és la quantitat de matèria i no canvia; el pes és una força, es mesura en newtons i depèn de la gravetat: `P = m · g`.
- **Aplica (nivell 3):** una balança digital de cuina, què mesura realment? Què marcaria a la Lluna?
- **Origen:** primera recerca (laboratori 2).

### A5 · El volum dels sòlids regulars

- **Pregunta:** quants cubets caben dins d'aquest bloc?
- **Nivell · fase · durada:** 1–2 · 1b · 15 min
- **Idees i errors:** IP-08
- **Escena:** un bloc de 2 × 4 × 5 cm, cubets d'1 cm³, el regle i la vista de cubets.
- **Seqüència:**
  1. Prediu quants cubets d'1 cm³ ocupen el mateix espai que el bloc.
  2. Construeix-lo per capes i compta: 8 cubets per capa, 5 capes.
  3. Mesura les tres arestes amb el regle i multiplica.
  4. Al nivell 2, calcula el volum d'un cilindre i d'una esfera amb la fórmula que es dona.
- **Dades:** objecte · llargada · amplada · alçada · volum.
- **Conclusió:** el volum és l'espai que ocupa un cos; en un ortoedre, `V = a · b · c`, i es mesura en unitats cúbiques.
- **Aplica:** una capsa fa 3 × 4 × 6 cm. Quin volum té?
- **Enllaç:** l'app `Volums` per a la resta de cossos.
- **Origen:** SB2, p. 14.

### A6 · La proveta i el menisc

- **Pregunta:** on s'ha de mirar per llegir bé una proveta?
- **Nivell · fase · durada:** 1–2 · 1b · 10 min
- **Idees i errors:** EP-02, EP-03
- **Escena:** provetes de 25, 100 i 250 mL, gerra d'aigua i la lupa.
- **Seqüència:**
  1. Aboca aigua fins a prop de 40 mL en la proveta de 100 mL.
  2. Obre la lupa i mou l'ull amunt i avall: observa com canvia el que es veu.
  3. Tria quina de les tres lectures (ull alt, a l'altura, baix) és la bona i per què.
  4. Fes tres lectures més amb quantitats diferents.
  5. Passa el líquid a la proveta de 25 mL: es llegeix millor o pitjor?
- **Dades:** proveta · divisió · lectura · posició de l'ull.
- **Conclusió:** l'ull ha d'estar a l'altura del líquid i es llegeix la part més baixa de la corba. Cada proveta té la seva divisió.
- **Aplica (nivell 2):** llegeix el menisc convex del mercuri.
- **Origen:** SB2, p. 13–15.

### A7 · El volum per desplaçament

- **Pregunta:** com es mesura el volum d'una pedra?
- **Nivell · fase · durada:** 1–2 · 1a · 15 min
- **Idees i errors:** IP-10, EP-04, EP-06
- **Escena:** proveta de 250 mL amb aigua, una pedra (30 cm³), dos cilindres del mateix volum (20 cm³) d'alumini i de plom, un tap de suro i la vareta.
- **Seqüència:**
  1. Prediu quin dels dos cilindres farà pujar més l'aigua: el de plom, que pesa quatre vegades més, o cap dels dos.
  2. Anota el nivell inicial, introdueix cada cilindre i anota el final.
  3. Mesura la pedra de la mateixa manera.
  4. Introdueix el tap de suro: el nivell puja molt poc. Què ha passat?
  5. Enfonsa'l amb la vareta i torna a llegir.
- **Dades:** objecte · volum inicial · volum final · diferència.
- **Conclusió:** un objecte submergit del tot fa pujar el líquid tant com el seu volum, pesi el que pesi. Si sura, cal enfonsar-lo.
- **Aplica:** en un aquari de 60 × 40 cm de base, l'aigua puja 2 cm en posar-hi unes roques. Quin volum tenen? (4800 cm³.)
- **Origen:** SB2, p. 14 i 16.

### A8 · Quina proveta necessito?

- **Pregunta:** totes les provetes serveixen per a tot?
- **Nivell · fase · durada:** 2 · 1b · 10 min
- **Idees i errors:** EP-05
- **Escena:** les cinc provetes, un vas de precipitats i tres objectes: un clau (2 cm³), la pedra (30 cm³) i la patata (160 cm³).
- **Seqüència:**
  1. Tria un recipient per a cada objecte abans de provar.
  2. Prova el clau a la proveta de 1000 mL: el nivell puja molt menys d'una divisió.
  3. Prova'l a la de 25 mL: puja quatre divisions.
  4. Prova la patata a la de 250 mL: no hi cap.
  5. Compara el vas de precipitats amb una proveta per mesurar 100 mL.
- **Dades:** objecte · recipient · divisió · pujada · nombre de divisions.
- **Conclusió:** es tria la proveta més petita on l'objecte hi càpiga i quedi cobert, perquè és la que es llegeix millor.
- **Aplica:** has de mesurar 4 mL de xarop. Què fas servir?
- **Origen:** segona recerca.

---

# Bloc B · Unitats i equivalències

### B1 · L'escala de les unitats

- **Pregunta:** per què en el volum cada graó val 1000?
- **Nivell · fase · durada:** 1–2 · 1b · 15 min
- **Idees i errors:** IP-08, EM-03
- **Escena:** el conversor amb les tres escales (massa, capacitat i volum) i la balança amb el botó d'unitat.
- **Seqüència:**
  1. Pesa un objecte i canvia la unitat de la balança: mateix objecte, números diferents.
  2. Mou un valor per l'escala de massa i per la de capacitat: graons de 10.
  3. Observa el cub d'1 dm: 10 cubets de llarg, 10 d'ample i 10 d'alt.
  4. Mou un valor per l'escala de volum: graons de 1000.
  5. Resol vuit conversions, amb diagnosi de l'error.
- **Dades:** valor inicial · unitat · valor convertit · unitat.
- **Conclusió:** en passar a una unitat més petita el número creix. En massa i capacitat, cada graó val 10; en volum, 1000.
- **Aplica:** una recepta demana 0,25 L de llet i 1500 g de farina. Quants mil·lilitres i quants quilograms són?
- **Origen:** SB2, p. 12 i 14–15.

### B2 · Construïm un litre

- **Pregunta:** quants cubets d'un centímetre caben en un litre?
- **Nivell · fase · durada:** 1–2 · 1b · 15 min
- **Idees i errors:** IP-08
- **Escena:** un cub transparent d'1 dm d'aresta, cubets d'1 cm³, barres de 10, plaques de 100, una ampolla amb 1 L d'aigua i la balança.
- **Seqüència:**
  1. Prediu quants cubets hi caben: 10, 100 o 1000.
  2. Omple'l: una barra (10), una placa (100), deu plaques (1000).
  3. Buida'l i aboca-hi el litre d'aigua: s'omple exactament.
  4. Pesa el litre d'aigua amb la tara del cub.
- **Dades:** peça · nombre de cubets · volum (cm³).
- **Conclusió:** 1 dm³ = 1000 cm³ = 1 L = 1000 mL, i per tant 1 cm³ = 1 mL. Un litre d'aigua té una massa d'1 kg, aproximadament.
- **Nota de rigor (nivell 2):** l'equivalència de volum és exacta; la de la massa de l'aigua és una aproximació que depèn de la temperatura.
- **Aplica:** quants litres caben en un metre cúbic? Quina massa d'aigua és?
- **Origen:** primera recerca (laboratori 6); SB2, p. 13.

### B3 · Quanta massa té un litre?

- **Pregunta:** un litre sempre pesa un quilo?
- **Nivell · fase · durada:** 1–2 · 1b · 10 min
- **Idees i errors:** IP-06
- **Escena:** cinc ampolles idèntiques d'un litre amb aigua, oli, alcohol, llet i mel, i la balança de cuina.
- **Seqüència:**
  1. Prediu l'ordre de més lleugera a més pesant, o si pesen totes igual.
  2. Posa l'ampolla buida a la balança i fes la tara.
  3. Pesa-les totes.
  4. Ordena-les i compara-ho amb la predicció.
- **Dades:** líquid · volum (L) · massa (g) · massa (kg).
- **Conclusió:** el mateix volum de líquids diferents té masses diferents. La massa d'un litre, en quilograms, és la densitat en kg/L.
- **Aplica:** quina massa té una garrafa de 5 L d'oli? (4,6 kg.)
- **Origen:** SB2, p. 5 i 18.

### B4 · Les unitats de la densitat

- **Pregunta:** 1 g/cm³ i 1000 kg/m³ són la mateixa densitat?
- **Nivell · fase · durada:** 2–3 · 2 · 15 min
- **Idees i errors:** EM-04
- **Escena:** tres recipients d'aigua (1 cm³, 1 L i 1 m³ representat a escala), la balança i el conversor de densitats.
- **Seqüència:**
  1. Observa la massa de l'aigua de cada recipient: 1 g, 1 kg i 1000 kg.
  2. Escriu la densitat en cada cas, amb les seves unitats.
  3. Segueix la conversió pas a pas amb factors.
  4. Resol sis conversions.
- **Dades:** substància · g/cm³ · kg/L · kg/m³ · g/L.
- **Conclusió:** 1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³.
- **Aplica:** l'aire té 1,2 kg/m³. Quants grams d'aire hi ha en una ampolla d'un litre «buida»?
- **Origen:** SB2, p. 17–19.

---

# Bloc C · La densitat

### C1 · Un quilo de palla i un quilo de ferro

- **Pregunta:** què pesa més, un quilo de palla o un quilo de ferro?
- **Nivell · fase · durada:** 1 · 1b · 10 min
- **Idees i errors:** IP-04
- **Escena:** quatre peces d'un quilo (poliestirè, pi, alumini i ferro), la balança de cuina i el regle.
- **Seqüència:**
  1. Prediu quina pesa més.
  2. Pesa-les totes: 1000 g cadascuna.
  3. Ordena-les per la mida i mesura'n el volum amb el regle.
  4. Pensa: què hauries de fer perquè un quilo de palla ocupés el mateix que un de ferro?
- **Dades:** material · massa (g) · volum (cm³).
- **Conclusió:** la mateixa massa pot ocupar volums molt diferents: en alguns materials la matèria està més concentrada.
- **Aplica:** i un litre de palla i un litre de ferro, pesen el mateix?
- **Origen:** SB2, p. 5.

### C2 · Cubs bessons

- **Pregunta:** cinc cubs iguals de mida. Pesen el mateix?
- **Nivell · fase · durada:** 1 · 1b · 10 min
- **Idees i errors:** IP-04
- **Escena:** cinc cubs de 10 cm³ (suro, pi, alumini, ferro i plom), la balança de laboratori i la vista de cubets.
- **Seqüència:**
  1. Prediu l'ordre de més lleuger a més pesant.
  2. Pesa'ls.
  3. Activa la vista de cubets: quants grams hi ha a cada cubet de cada material?
- **Dades:** material · volum (cm³) · massa (g) · massa de cada cubet (g).
- **Conclusió:** el mateix volum de materials diferents té masses diferents. Cada material té la seva «massa per cada centímetre cúbic».
- **Aplica:** els cinc cubs estan pintats de gris. Com trobes el de plom?
- **Origen:** primera recerca (laboratori 9).

### C3 · Construïm la densitat

- **Pregunta:** com podem comparar materials si els objectes tenen mides diferents?
- **Nivell · fase · durada:** 1–2 · 1a · 20 min
- **Idees i errors:** IP-04, EM-01, EM-05
- **Escena:** els objectes A (bloc metàl·lic), B (bloc de fusta) i C (bola de plastilina), la balança, la proveta, el regle, la calculadora amb unitats i la vista de cubets.
- **Seqüència:**
  1. Observa els tres objectes: quin té «la matèria més atapeïda»?
  2. Mesura la massa i el volum de cada un.
  3. Reparteix la massa entre els cubets: quants grams toquen a cada centímetre cúbic?
  4. Fes el càlcul amb la calculadora: massa dividida entre volum.
  5. Posa-hi nom i unitat: densitat, en g/cm³.
- **Dades:** objecte · massa (g) · volum (cm³) · densitat (g/cm³).
- **Conclusió:** la densitat és la massa de cada unitat de volum: `d = m / V`.
- **Aplica:** calcula la densitat de la pedra sense cap ajuda.
- **Origen:** SB2, p. 17.

### C4 · Tallem la patata

- **Pregunta:** si talles una patata per la meitat, què li passa a la densitat?
- **Nivell · fase · durada:** 1–2 · 1a · 15 min
- **Idees i errors:** IP-03, IP-02
- **Escena:** una patata (160 cm³), el ganivet del taller, la balança de laboratori i les provetes de 250, 500 i 1000 mL.
- **Seqüència:**
  1. Prediu la densitat de mitja patata: la meitat, la mateixa o el doble.
  2. Mesura la massa i el volum de la patata sencera i calcula'n la densitat.
  3. Talla-la per la meitat i mesura un dels trossos.
  4. Torna a tallar i mesura el quart.
  5. Observa la taula i, al nivell 2, els tres punts a la gràfica.
- **Dades:** tros · massa (g) · volum (cm³) · densitat (g/cm³).
- **Valors esperats:** 172,8 g i 160 cm³ · 86,4 g i 80 cm³ · 43,2 g i 40 cm³ · 1,08 g/cm³ sempre.
- **Conclusió:** en tallar, la massa i el volum es redueixen en la mateixa proporció i la densitat no canvia. La densitat és una propietat del material, no de la quantitat.
- **Vocabulari (nivell 2):** propietats extensives (massa, volum) i intensives (densitat).
- **Aplica:** un anell d'or i un lingot d'or tenen la mateixa densitat?
- **Connexió amb l'aula:** fer-ho amb una patata o amb plastilina de debò.
- **Origen:** orientacions curriculars de la Generalitat; SB2, p. 18.

### C5 · La recta de cada material

- **Pregunta:** quina forma té la gràfica de la massa i el volum d'un mateix material?
- **Nivell · fase · durada:** 2 · 1b · 20 min
- **Idees i errors:** IP-02, IP-03
- **Escena:** la sèrie de deu peces d'alumini, la sèrie de pi, la balança, el regle i la gràfica massa-volum.
- **Seqüència:**
  1. Prediu la forma de la gràfica: una corba, una recta, punts escampats.
  2. Mesura cinc peces d'alumini o més; cada mesura anotada és un punt.
  3. Dibuixa la recta i calcula'n el pendent.
  4. Prediu la massa d'una peça de 65 cm³ i comprova-ho construint-la.
  5. Afegeix la sèrie de pi i la recta de l'aigua.
- **Dades:** peça · volum (cm³) · massa (g).
- **Conclusió:** la massa és directament proporcional al volum. El pendent de la recta és la densitat, i cada material té la seva recta.
- **Aplica:** identifica tres mostres desconegudes situant-les a la gràfica.
- **Origen:** SB2, p. 20; segona recerca («Deu peces del mateix material»).

### C6 · Detectius de materials

- **Pregunta:** de què està fet cada objecte?
- **Nivell · fase · durada:** 2–3 · 1a · 20 min
- **Idees i errors:** EM-01, EP-04, EP-05
- **Escena:** sis objectes misteri, la balança, les provetes, el regle, la calculadora i la taula de densitats de Consulta.
- **Seqüència:**
  1. Tria un objecte i observa'l: color, brillantor, mida.
  2. Prediu de quin material és.
  3. Mesura'n la massa i el volum i calcula'n la densitat.
  4. Compara-la amb la taula i proposa el material.
  5. Demana la confirmació.
- **Dades:** objecte · massa · volum · densitat · material proposat · encert.
- **Casos difícils (nivell 3):** alumini o granit (mateixa densitat: cal una altra propietat); or, llautó o pirita; fustes que es distingeixen per interval.
- **Conclusió:** la densitat permet identificar materials, tot i que de vegades no n'hi ha prou i cal una segona propietat.
- **Assoliment:** quatre encerts de sis.
- **Aplica:** et venen una «moneda d'or» de 15,3 g i 1,8 cm³. És d'or? (No: 8,5 g/cm³, llautó.)
- **Origen:** SB2, p. 18–20.

### C7 · L'objecte impossible

- **Pregunta:** pots fabricar un objecte d'alumini de 100 g i 100 cm³?
- **Nivell · fase · durada:** 2 · 1b · 10 min
- **Idees i errors:** IP-04
- **Escena:** el constructor d'objectes del taller.
- **Seqüència:**
  1. Intenta fabricar la peça: el constructor no deixa fixar les tres coses.
  2. Explica per què.
  3. Quina densitat tindria un objecte de 100 g i 100 cm³? Hi ha algun material del prestatge que la tingui?
  4. Fabrica un objecte de 500 g que suri a l'aigua.
- **Conclusió:** el material, la massa i el volum estan lligats: en triar-ne dos, el tercer queda determinat.
- **Aplica:** un anunci ofereix «un lingot de ferro d'un quilo de la mida d'un terròs de sucre». És possible? (No: un quilo de ferro ocupa 127 cm³.)
- **Origen:** segona recerca («L'objecte impossible»).

### C8 · La forma no enganya

- **Pregunta:** si aixafes una bola de plastilina, canvia la seva densitat?
- **Nivell · fase · durada:** 1–2 · 1b · 10 min
- **Idees i errors:** IP-05
- **Escena:** la bola de plastilina C, el taller amb les formes compactes (bola, cilindre, bloc, plat), la balança i les provetes.
- **Seqüència:**
  1. Prediu què canviarà en aixafar-la: la massa, el volum, la densitat.
  2. Mesura la bola.
  3. Modela-la en cilindre prim, en bloc i en plat, i mesura cada forma.
  4. Observa que el cilindre prim hi cap en una proveta més estreta i es llegeix millor.
- **Dades:** forma · massa · volum · densitat.
- **Conclusió:** canviar la forma d'un objecte massís no en canvia la massa, el volum ni la densitat.
- **Pregunta oberta per al bloc F:** i si en fas una barca?
- **Origen:** primera recerca; SB4, p. 8.

### C9 · La densitat dels líquids

- **Pregunta:** com es mesura la densitat d'un líquid?
- **Nivell · fase · durada:** 2 · 1b · 15 min
- **Idees i errors:** EP-01, EP-02
- **Escena:** la balança de laboratori, la proveta de 100 mL i quatre ampolles: aigua, oli, alcohol i un líquid misteri.
- **Seqüència:**
  1. Dissenya el procediment abans de començar: què mesuraràs i en quin ordre?
  2. Tara la proveta buida, aboca-hi uns 50 mL, llegeix el volum i la massa.
  3. Repeteix-ho amb cada líquid.
  4. Identifica el líquid misteri amb la taula.
- **Dades:** líquid · volum (mL) · massa (g) · densitat (g/mL).
- **Conclusió:** els líquids també tenen una densitat característica, que es mesura igual: massa entre volum.
- **Aplica:** una llet té 1,015 g/mL en lloc d'1,03. Què pot haver passat?
- **Origen:** SB2, p. 11 i 19.

### C10 · Dues balances, una veritat?

- **Pregunta:** si dues balances donen números diferents, quina té raó?
- **Nivell · fase · durada:** 2–3 · 2 · 15 min
- **Idees i errors:** EM-08
- **Escena:** les tres balances, les provetes de 25 mL i de 1000 mL i un objecte de 123,47 g.
- **Seqüència:**
  1. Pesa l'objecte a les tres balances.
  2. Explica per què les lectures són diferents i totes són correctes.
  3. Calcula la densitat amb els instruments més grollers i amb els més fins.
  4. Decideix quantes xifres del resultat tenen sentit.
  5. Al nivell 3, fes cinc mesures repetides i calcula'n la mitjana.
- **Dades:** instrument · resolució · lectura · densitat calculada.
- **Conclusió:** cap mesura és exacta. La resolució de l'instrument limita les xifres que podem donar.
- **Aplica:** amb una balança d'1 g i una proveta de 10 mL, pots distingir l'alumini del vidre? I l'alumini del granit?
- **Origen:** segona recerca («El mateix objecte, dues balances»).

---

# 06 · Catàleg d'investigacions (2): flotabilitat, forces, construcció i pressió

Fitxes de les investigacions dels blocs **D** (flotabilitat), **E** (forces i Arquimedes), **F** (construïm i apliquem) i **G** (pressió i hidrostàtica). Al final hi ha les targetes de repte i la taula de traçabilitat amb les dues recerques.

El format de les fitxes s'explica a [`05-cataleg-investigacions-1.md`](planificacio/05-cataleg-investigacions-1.md). Torna al [pla mestre](PLA.md).

---

## Resum dels blocs D, E, F i G

| Codi | Investigació | Nivell | Fase |
|---|---|---|---|
| D1 | Sura o s'enfonsa? | 1 | 1a |
| D2 | Quatre esferes | 1–2 | 1a |
| D3 | La columna de líquids | 1–2 | 1a |
| D4 | Canviem el líquid | 2 | 1a |
| D5 | L'ou que sura | 1–2 | 1a |
| D6 | Quina part queda submergida? | 2–3 | 2 |
| D7 | Capes o mescla? | 2 | 2 |
| D8 | Ni amunt ni avall | 2–3 | 2 |
| E1 | El pes que desapareix | 3 | 2 |
| E2 | L'aigua desplaçada | 2–3 | 2 |
| E3 | El principi d'Arquimedes | 3 | 2 |
| E4 | Arquimedes quan sura | 3 | 2 |
| E5 | De què depèn l'empenyiment? | 3 | 2 |
| E6 | El diagrama de forces | 3 | 2 |
| E7 | Suraria igual a la Lluna? | 3 | 2 |
| F1 | De la bola a la barqueta | 1–3 | 3 |
| F2 | Quanta càrrega aguanta? | 2–3 | 3 |
| F3 | El repte de la drassana | 2–3 | 3 |
| F4 | Per què sura un vaixell d'acer? | 2–3 | 3 |
| F5 | El submarí | 2–3 | 3 |
| F6 | L'iceberg | 2–3 | 3 |
| F7 | La corona del rei | 3 | 3 |
| F8 | Objectes que enganyen | 1–2 | 4 |
| F9 | Globus i aire calent | 2–3 | 4 |
| F10 | Temperatura i densitat | 3 | 4 |
| F11 | El densímetre | 2–3 | 4 |
| G1 | Més avall, més pressió | 3 | 4 |
| G2 | La forma del recipient importa? | 3 | 4 |
| G3 | D'on surt l'empenyiment? | 3 | 4 |

---

# Bloc D · Flotabilitat

### D1 · Sura o s'enfonsa?

- **Pregunta:** què fa que un objecte suri?
- **Nivell · fase · durada:** 1 · 1a · 15 min
- **Idees i errors:** IP-01, IP-02, IP-18
- **Escena:** taula de Mesura amb el vas de 600 mL ple d'aigua i la balança. Deu objectes: clau, bloc de fusta, bola de plastilina, bloc metàl·lic, tap de suro, espelma, glaçó, bala de vidre, peça de banús i pedra tosca.
- **Seqüència:**
  1. Classifica els deu objectes en dues safates segons la teva predicció: sura o s'enfonsa.
  2. Tria el motiu de cada predicció: pesa molt o poc, és gran o petit, pel material, perquè té forats.
  3. Prova'ls d'un en un. Marca les sorpreses.
  4. Ordena'ls per massa: els que suren són els més lleugers?
- **Dades:** objecte · predicció · motiu · resultat · massa.
- **Sorpreses previstes:** el bloc de fusta (100 g) sura i el clau (16 g) s'enfonsa; la pedra tosca sura; la fusta de banús s'enfonsa.
- **Conclusió:** surar no depèn només de la massa ni només de la mida. Cal buscar una altra magnitud.
- **Origen:** SB4, p. 5–7; CEDEC-INTEF.

### D2 · Quatre esferes

- **Pregunta:** massa, volum o densitat: què decideix si una esfera sura?
- **Nivell · fase · durada:** 1–2 · 1a · 20 min
- **Idees i errors:** IP-01, IP-02
- **Escena:** quatre esferes (fusta petita i gran, plastilina petita i gran), la balança, la proveta de 500 mL amb la vareta i el vas d'aigua.
- **Seqüència:**
  1. Prediu quines suraran.
  2. Mesura la massa i el volum de les quatre i calcula'n la densitat.
  3. Prova-les a l'aigua.
  4. Mira la taula: hi ha dues esferes de 30 g, i una sura i l'altra no. Hi ha dues esferes de 60 cm³, i una sura i l'altra no.
  5. Tria la variable que ho explica i compara-la amb la densitat de l'aigua.
- **Dades:** esfera · massa (g) · volum (cm³) · densitat (g/cm³) · sura?
- **Valors esperats:** fusta petita 10 g i 20 cm³ · fusta gran 30 g i 60 cm³ · plastilina petita 30 g i 20 cm³ · plastilina gran 90 g i 60 cm³.
- **Conclusió:** un objecte massís sura a l'aigua si la seva densitat és més petita que la de l'aigua, i s'enfonsa si és més gran.
- **Aplica:** prediu, abans de provar, què faran l'espelma (0,9), la peça de banús (1,1) i un cub de gel.
- **Origen:** SB4, p. 7.

### D3 · La columna de líquids

- **Pregunta:** on queda cada líquid i on queda cada bola?
- **Nivell · fase · durada:** 1–2 · 1a · 20 min
- **Idees i errors:** IP-16, IP-01
- **Escena:** taula de la Columna amb la proveta de 500 mL i ampolles de mel, aigua, oli i alcohol (acolorits). Jocs de boles.
- **Seqüència:**
  1. Prediu en quin ordre quedaran els quatre líquids.
  2. Aboca'ls amb cura, en l'ordre que vulguis, i observa.
  3. **Mateixa mida, materials diferents:** cinc boles de 4 cm³ de poliestirè, cera, polietilè, niló i estany. Prediu on quedarà cada una i prova-ho.
  4. **Mateixa massa, materials diferents:** tres boles de 10 g. Queden al mateix lloc?
  5. **Mateix material, mides diferents:** dues boles de cera, petita i gran.
- **Dades:** bola · material · massa · volum · densitat · capa on queda.
- **Resultats esperats:** poliestirè a dalt de tot; cera entre l'alcohol i l'oli; polietilè entre l'oli i l'aigua; niló entre l'aigua i la mel; estany al fons.
- **Conclusió:** cada líquid i cada bola se situen segons la densitat, no segons la massa ni la mida.
- **Aplica:** amb la massa i el volum de quatre sòlids nous, digues on quedaran sense provar-ho.
- **Origen:** SB2, p. 7–9 i 21.

### D4 · Canviem el líquid

- **Pregunta:** un objecte que s'enfonsa a l'aigua, s'enfonsa a tot arreu?
- **Nivell · fase · durada:** 2 · 1a · 15 min
- **Idees i errors:** IP-17
- **Escena:** tres vasos amb alcohol, aigua i aigua salada, i el mercuri. Objectes: espelma, ou, dau de polietilè i clau de ferro.
- **Seqüència:**
  1. Omple una taula de prediccions: quatre objectes per quatre líquids.
  2. Prova-ho tot i marca les prediccions fallades.
  3. Repeteix una prova en un vas petit i al tanc gran: canvia res?
- **Dades:** objecte · densitat de l'objecte · líquid · densitat del líquid · resultat.
- **Sorpreses previstes:** l'espelma s'enfonsa en alcohol i sura a l'aigua; l'ou sura a l'aigua salada; el ferro sura en mercuri.
- **Conclusió:** surar depèn de l'objecte i del líquid: cal comparar les dues densitats. La quantitat de líquid no hi influeix.
- **Aplica:** per què costa menys surar al mar que a la piscina?
- **Origen:** primera recerca (laboratori 15); SB4, p. 30.

### D5 · L'ou que sura

- **Pregunta:** pots fer surar un ou sense tocar-lo?
- **Nivell · fase · durada:** 1–2 · 1a · 15 min
- **Idees i errors:** IP-17
- **Escena:** un vas amb 500 mL d'aigua, un ou, sal (cullerades de 5 g), la balança i el matràs aforat.
- **Seqüència:**
  1. Posa l'ou a l'aigua: s'enfonsa. Prediu què passarà si hi afegeixes sal.
  2. Afegeix la sal cullerada a cullerada i remena. Anota en quina cullerada l'ou comença a pujar.
  3. Al nivell 2, mesura la densitat de l'aigua en aquell moment: 100 mL al matràs i a la balança.
  4. Continua afegint sal: l'ou sura cada vegada més amunt, fins que la sal ja no es dissol.
- **Dades:** sal afegida (g) · densitat de l'aigua (g/mL) · què fa l'ou.
- **Conclusió:** l'ou comença a surar quan l'aigua salada arriba a la seva densitat. No ha canviat l'ou: ha canviat el líquid.
- **Repte:** aconsegueix que l'ou quedi a mitja alçada, abocant amb cura aigua dolça sobre l'aigua salada.
- **Connexió amb l'aula:** és l'experiment real més fàcil de reproduir.
- **Origen:** SB4, p. 32; primera recerca (laboratori 16).

### D6 · Quina part queda submergida?

- **Pregunta:** tots els objectes que suren ho fan igual?
- **Nivell · fase · durada:** 2–3 · 2 · 20 min
- **Idees i errors:** IP-14
- **Escena:** taula del Tanc amb el regle lateral. Sis cubs de 10 cm d'aresta de suro, pi, roure, cera, gel i polietilè.
- **Seqüència:**
  1. Prediu quin surarà més enfonsat i quin menys.
  2. Mesura amb el regle quants centímetres de cada cub queden sota l'aigua.
  3. Compara la fracció submergida amb la densitat de cada material.
  4. Canvia l'aigua per aigua salada (1,20) i repeteix-ho amb dos cubs.
  5. Al nivell 3, dedueix la relació igualant pes i empenyiment.
- **Dades:** material · densitat · alçada submergida (cm) · fracció submergida (%) · líquid.
- **Valors esperats en aigua:** 2,5 · 5,0 · 7,5 · 9,0 · 9,2 · 9,5 cm.
- **Conclusió:** la fracció submergida és el quocient entre la densitat de l'objecte i la del líquid. Cap objecte que sura queda tot fora de l'aigua.
- **Aplica:** quin percentatge d'un tronc de roure es veu per sobre de l'aigua?
- **Origen:** primera recerca (laboratori 17); SB4, p. 29.

### D7 · Capes o mescla?

- **Pregunta:** dos líquids de densitat diferent sempre fan capes?
- **Nivell · fase · durada:** 2 · 2 · 15 min
- **Idees i errors:** IP-16
- **Escena:** taula de la Columna amb aigua, alcohol acolorit, oli i mel, la vareta de remenar, la proveta de 100 mL i la balança.
- **Seqüència:**
  1. Prediu què passarà en ajuntar aigua i oli, i aigua i alcohol.
  2. Aboca alcohol amb cura sobre l'aigua: queda una capa amb la frontera borrosa.
  3. Remena: es mesclen. Mesura la densitat de la mescla.
  4. Fes el mateix amb aigua i oli: en deixar de remenar, se separen.
  5. Compara: quin líquid és més espès, l'oli o l'aigua? I quin és més dens?
- **Dades:** parella · es mesclen? · densitat de cada líquid · densitat de la mescla.
- **Conclusió:** només fan capes els líquids que no es mesclen. Que un líquid sigui espès no vol dir que sigui dens.
- **Aplica:** una taca de petroli al mar, queda a sobre o a sota? Es mescla?
- **Ampliació (fase 4):** 50 mL d'aigua i 50 mL d'alcohol no fan 100 mL.
- **Origen:** primera recerca (laboratori 25); orientacions curriculars.

### D8 · Ni amunt ni avall

- **Pregunta:** pot un objecte quedar-se quiet al mig de l'aigua?
- **Nivell · fase · durada:** 2–3 · 2 · 15 min
- **Idees i errors:** IP-15
- **Escena:** taula del Tanc, una càpsula tancada de 100 cm³ i 40 g, i peses petites d'1 g, 5 g i 10 g per posar-hi dins.
- **Seqüència:**
  1. Prediu quanta massa ha de tenir la càpsula per quedar suspesa.
  2. Afegeix-hi peses: amb 99 g sura arran; amb 101 g s'enfonsa.
  3. Troba l'equilibri i calcula la densitat mitjana de la càpsula.
  4. Canvia a aigua salada: quanta massa cal ara?
- **Dades:** massa total (g) · volum (cm³) · densitat mitjana · comportament.
- **Conclusió:** un objecte queda en equilibri dins d'un líquid quan la seva densitat mitjana és igual a la del líquid. És un equilibri delicat.
- **Aplica:** com s'ho fan els peixos i els submarins? (Enllaç amb F5.)
- **Origen:** segona recerca («Flotar sense pujar ni baixar»).

---

# Bloc E · Forces i Arquimedes

### E1 · El pes que desapareix

- **Pregunta:** un objecte pesa el mateix dins de l'aigua que fora?
- **Nivell · fase · durada:** 3 · 2 · 15 min
- **Idees i errors:** IP-11, EM-06
- **Escena:** taula del Tanc, el dinamòmetre sensible, el bloc metàl·lic A i la pedra.
- **Seqüència:**
  1. Prediu què marcarà el dinamòmetre quan el bloc estigui dins de l'aigua.
  2. Mesura el pes a l'aire.
  3. Baixa el bloc a poc a poc: observa la lectura mentre entra a l'aigua i quan ja és tot a dins.
  4. Calcula la diferència.
  5. Deixa'l reposar al fons: el fil queda fluix. L'aigua ha deixat d'empènyer?
- **Dades:** objecte · pes a l'aire (N) · pes aparent (N) · empenyiment (N).
- **Valors esperats per al bloc A:** 2,65 N · 1,67 N · 0,98 N.
- **Conclusió:** l'aigua empeny cap amunt tots els objectes, també els que s'enfonsen. Aquesta força és l'empenyiment, i `E = P − P aparent`.
- **Aplica:** una roca de granit de 70 kg, quina força cal per aixecar-la fora de l'aigua i a dins? (686 N i 432 N.)
- **Origen:** SB4, p. 5 i 9.

### E2 · L'aigua desplaçada

- **Pregunta:** quanta aigua fa vessar cada objecte?
- **Nivell · fase · durada:** 2–3 · 2 · 15 min
- **Idees i errors:** IP-10, IP-14
- **Escena:** el vas de vessament ple fins al bec, el vas col·lector graduat sobre la balança, dos cilindres de 20 cm³ (alumini i plom) i el bloc de fusta B.
- **Seqüència:**
  1. Prediu quin dels dos cilindres farà vessar més aigua.
  2. Introdueix-los i mesura el volum vessat.
  3. Prediu quanta aigua farà vessar el bloc de fusta, que fa 200 cm³.
  4. Mesura-ho: 100 mL. Pesa l'aigua vessada i compara-la amb la massa del bloc.
- **Dades:** objecte · massa (g) · volum (cm³) · volum vessat (mL) · massa de l'aigua vessada (g).
- **Conclusió:** un objecte enfonsat desplaça un volum d'aigua igual al seu. Un objecte que sura desplaça una quantitat d'aigua que té la seva mateixa massa.
- **Aplica:** la llegenda d'Arquimedes i la banyera. (Enllaç amb F7.)
- **Origen:** primera recerca (laboratori 18).

### E3 · El principi d'Arquimedes

- **Pregunta:** amb què coincideix l'empenyiment?
- **Nivell · fase · durada:** 3 · 2 · 25 min
- **Idees i errors:** IP-13, EM-07
- **Escena:** el muntatge complet: dinamòmetre, vas de vessament i vas col·lector sobre la balança. Sis esferes de plastilina, ceràmica i acer, de 20 i de 50 cm³. Aigua i alcohol.
- **Seqüència:**
  1. Prediu quina esfera rebrà més empenyiment: la més pesant, la més gran, o cap.
  2. Per a cada esfera, mesura el pes, el pes aparent, el volum de líquid desplaçat i la seva massa.
  3. Calcula l'empenyiment i el pes del líquid desplaçat.
  4. Busca la coincidència: amb el volum desplaçat, amb el pes de l'objecte o amb el pes del líquid desplaçat?
  5. Repeteix-ho amb alcohol.
  6. Escriu la fórmula.
- **Dades:** esfera · pes (N) · pes aparent (N) · empenyiment (N) · volum desplaçat (cm³) · pes del líquid desplaçat (N).
- **Valors esperats en aigua:** les tres esferes de 20 cm³ reben 0,20 N; les tres de 50 cm³, 0,49 N.
- **Conclusió:** l'empenyiment és igual al pes del líquid desplaçat: `E = dL · g · V`.
- **Assoliment:** predir l'empenyiment d'una esfera de 35 cm³ en alcohol (0,27 N) abans de mesurar-lo.
- **Origen:** SB4, p. 10, 13 i 29.

### E4 · Arquimedes quan sura

- **Pregunta:** els objectes que suren també compleixen el principi d'Arquimedes?
- **Nivell · fase · durada:** 3 · 2 · 15 min
- **Idees i errors:** IP-14, IP-15
- **Escena:** el mateix muntatge i quatre esferes de 50 cm³ que suren: cera, polietilè, pi i suro.
- **Seqüència:**
  1. Prediu quina desplaçarà menys aigua i quina rebrà menys empenyiment.
  2. Mesura el pes de cada esfera, el volum de líquid que desplaça i el pes d'aquest líquid.
  3. Compara les columnes.
- **Dades:** esfera · pes (N) · volum desplaçat (cm³) · pes del líquid desplaçat (N).
- **Valors esperats:** 45 cm³ · 47,5 cm³ · 25 cm³ · 12,5 cm³.
- **Conclusió:** un objecte que sura desplaça un pes de líquid exactament igual al seu. Sura amb una part submergida, no «levita».
- **Condició de flotació:** un cos sura si, sense arribar a enfonsar-se del tot, pot desplaçar un líquid que pesi tant com ell.
- **Origen:** SB4, p. 11 i 29.

### E5 · De què depèn l'empenyiment?

- **Pregunta:** massa, volum, forma, profunditat, líquid: què fa canviar l'empenyiment?
- **Nivell · fase · durada:** 3 · 2 · 20 min
- **Idees i errors:** IP-12, IP-13
- **Escena:** el tanc fondo, el dinamòmetre i el comparador de dues situacions. Jocs d'objectes: mateix volum i material diferent; mateix material i volum diferent; mateixa plastilina en bola i en cilindre.
- **Seqüència:**
  1. Per a cada factor, prediu si fa canviar l'empenyiment.
  2. Comprova-ho canviant només aquell factor. El comparador avisa si se'n canvia més d'un.
  3. Fixa't en la profunditat: baixa un bloc ja submergit de 10 cm a 40 cm.
  4. Fixa't en el moment d'entrar a l'aigua: per què aquí sí que canvia?
- **Dades:** factor · situació A · situació B · empenyiment A · empenyiment B · depèn?
- **Conclusió:** l'empenyiment només depèn del volum submergit i de la densitat del líquid. No depèn de la massa, del material, de la forma ni de la profunditat.
- **Origen:** segona recerca («Com més profund, més empenyiment?»); SB4, p. 29.

### E6 · El diagrama de forces

- **Pregunta:** quines forces actuen sobre un objecte dins de l'aigua?
- **Nivell · fase · durada:** 3 · 2 · 15 min
- **Idees i errors:** IP-15, IP-11
- **Escena:** el tanc i l'anàlisi de forces, inicialment amagada. Cinc situacions: una fusta que sura, una fusta que puja des del fons, una pedra que baixa, una pedra al fons i un bloc penjat del dinamòmetre.
- **Seqüència:**
  1. A cada situació, dibuixa les forces: tria-les, col·loca-les i ajusta'n la llargada.
  2. Activa l'anàlisi i compara-la amb el teu dibuix.
  3. Indica la força neta i relaciona-la amb el moviment.
- **Dades:** situació · forces · força neta · es mou?
- **Conclusió:** un objecte quiet no està lliure de forces: les té compensades. Si no ho estan, es mou cap on apunta la força neta.
- **Assoliment:** quatre diagrames de cinc amb el sentit i la mida relativa correctes.
- **Origen:** SB4, p. 8 i 29.

### E7 · Suraria igual a la Lluna?

- **Pregunta:** un vaixell s'enfonsaria més a la Lluna?
- **Nivell · fase · durada:** 3 · 2 · 10 min
- **Idees i errors:** IP-07
- **Escena:** el tanc, el bloc de fusta B, el dinamòmetre i el selector de gravetat.
- **Seqüència:**
  1. Prediu: més enfonsat, menys o igual.
  2. Canvia la gravetat i observa el pes, l'empenyiment i la línia de flotació.
  3. Explica-ho amb la igualtat entre pes i empenyiment.
- **Dades:** lloc · pes (N) · empenyiment (N) · fracció submergida (%).
- **Conclusió:** el pes i l'empenyiment canvien alhora, i la fracció submergida no canvia.
- **Origen:** proposta pròpia.

---

# Bloc F · Construïm i apliquem

### F1 · De la bola a la barqueta

- **Pregunta:** pots fer surar 200 g de plastilina sense treure'n ni afegir-ne?
- **Nivell · fase · durada:** 1–3 · 3 · 20 min
- **Idees i errors:** IP-18, IP-05
- **Escena:** el tanc, 200 g de plastilina, el taller de barques, la balança i, al nivell 3, l'anàlisi de forces.
- **Seqüència:**
  1. Fes una bola i deixa-la a l'aigua: s'enfonsa. Mesura'n la massa i el volum.
  2. Prediu quina forma la farà surar.
  3. Prova un plat pla sense vores, un plat amb vores baixes i una barca.
  4. Compara què ha canviat i què no: la massa, el volum de plastilina, l'aigua que desplaça.
  5. Al nivell 3, compara el pes amb l'empenyiment màxim de cada forma.
- **Dades:** forma · massa (g) · volum de plastilina (cm³) · volum que pot desplaçar (cm³) · sura?
- **Valors de referència (buc de 12 × 10 × 5 cm):** pes 1,96 N; empenyiment màxim de la bola 1,31 N; de la barca 5,88 N.
- **Conclusió:** la forma no canvia la densitat de la plastilina, però sí el volum d'aigua que l'objecte pot desplaçar. La barca, comptant l'aire que conté, té una densitat mitjana més petita que la de l'aigua.
- **Connexió amb l'aula:** construir la mateixa barca amb plastilina real i comparar.
- **Origen:** SB4, p. 8–9 i 12; primera recerca (experiment estrella).

### F2 · Quanta càrrega aguanta?

- **Pregunta:** quantes peses pot portar la barca abans d'enfonsar-se?
- **Nivell · fase · durada:** 2–3 · 3 · 20 min
- **Idees i errors:** IP-18
- **Escena:** la barca de F1, peses de 50 g, el regle per mesurar el calat i la gràfica.
- **Seqüència:**
  1. Afegeix peses d'una en una i anota el calat.
  2. Representa el calat en funció de la massa total.
  3. Abans d'arribar-hi, prediu la càrrega màxima amb la gràfica o amb un càlcul.
  4. Comprova-ho: què passa en posar-hi una pesa de més?
  5. Canvia a aigua salada i prediu la nova càrrega màxima.
- **Dades:** càrrega (g) · massa total (g) · calat (cm) · volum submergit (cm³) · empenyiment (N) · sura?
- **Valors esperats:** calat d'1,67 cm sense càrrega; 5,0 cm amb 400 g, que és el límit; 520 g en aigua salada.
- **Conclusió:** cada gram afegit obliga la barca a desplaçar un centímetre cúbic més d'aigua. El límit és el volum fins a la vora.
- **Aplica:** per què els vaixells porten pintades diverses línies de càrrega?
- **Origen:** SB4, p. 12.

### F3 · El repte de la drassana

- **Pregunta:** quina és la millor barca que es pot fer amb 200 g de plastilina?
- **Nivell · fase · durada:** 2–3 · 3 · 30 min
- **Idees i errors:** IP-18
- **Escena:** el taller de barques amb llargada, amplada i alçada lliures, el tanc i les peses.
- **Reptes encadenats:**
  1. Màxima càrrega.
  2. Màxima càrrega amb un francbord mínim d'1 cm.
  3. Màxima càrrega amb una amplada màxima de 8 cm.
  4. Al nivell 3, amb l'estabilitat activada: la càrrega alta pot fer bolcar la barca.
- **Informe de disseny:** dimensions, càrrega prevista per càlcul, càrrega real i explicació de la diferència.
- **Conclusió:** dissenyar és trobar un compromís: una barca més gran desplaça més, però les parets es fan més fines.
- **Origen:** primera recerca (experiment estrella).

### F4 · Per què sura un vaixell d'acer?

- **Pregunta:** l'acer s'enfonsa. Com pot surar un vaixell d'acer?
- **Nivell · fase · durada:** 2–3 · 3 · 20 min
- **Idees i errors:** IP-18, IP-19
- **Escena:** el tanc i 500 g d'acer en tres versions: un bloc massís, un buc de 15 × 8 × 6 cm i un bloc massís de la mida del buc. Dues boles buides. La vista de volums.
- **Seqüència:**
  1. Prediu quins suren.
  2. Per a cada objecte, anota el pes, el volum que pot desplaçar i l'empenyiment màxim.
  3. Activa la vista de volums: material, cavitat i volum envoltant.
  4. Calcula la densitat del material i la densitat mitjana de cada objecte.
  5. Prova les dues boles buides: totes dues són buides i només una sura.
  6. Obre una via d'aigua al buc i observa.
- **Dades:** objecte · massa (g) · volum de material (cm³) · volum que pot desplaçar (cm³) · densitat mitjana · sura?
- **Valors esperats:** bloc de 63,7 cm³, s'enfonsa; buc de 720 cm³, sura amb 4,17 cm de calat; bloc gran de 5652 g, s'enfonsa.
- **Conclusió:** compta el pes de tot l'objecte i el volum màxim d'aigua que pot desplaçar. El buc desplaça tant com un bloc massís de la seva mida, però pesa molt menys.
- **Aplica:** durant uns 150 anys es van fer vaixells de formigó. Com era possible?
- **Origen:** SB4, p. 4–5, 12 i 30; SB2, p. 22.

### F5 · El submarí

- **Pregunta:** com puja i baixa un submarí?
- **Nivell · fase · durada:** 2–3 · 3 · 15 min
- **Idees i errors:** IP-15, IP-17
- **Escena:** el tanc fondo i un submarí de 1000 cm³ i 700 g, amb un tanc de llast de 400 cm³ que s'omple i es buida.
- **Seqüència:**
  1. Prediu quanta aigua cal ficar-hi perquè comenci a baixar.
  2. Omple i buida el llast i observa el moviment.
  3. Repte: atura'l a 20 cm de profunditat i mantén-lo cinc segons.
  4. Calcula la densitat mitjana en cada estat.
  5. Canvia a aigua de mar i troba el nou punt d'equilibri.
- **Dades:** aigua al llast (cm³) · massa total (g) · densitat mitjana · comportament.
- **Valors esperats:** equilibri amb 300 cm³ en aigua dolça i amb 320 cm³ en aigua de mar.
- **Conclusió:** el submarí no canvia de volum: canvia de massa i, per tant, de densitat mitjana.
- **Aplica:** com regulen la flotabilitat els peixos i els cefalòpodes?
- **Origen:** primera recerca (laboratori 23).

### F6 · L'iceberg

- **Pregunta:** quina part d'un iceberg es veu?
- **Nivell · fase · durada:** 2–3 · 3 · 15 min
- **Idees i errors:** IP-14
- **Escena:** el tanc amb aigua dolça o aigua de mar, un bloc de gel i el regle.
- **Seqüència:**
  1. Prediu quin percentatge queda per sobre de l'aigua.
  2. Mesura-ho en aigua dolça i en aigua de mar.
  3. Al nivell 3, calcula-ho amb les densitats.
  4. Repte: quan un glaçó es fon dins d'un got d'aigua dolça, puja el nivell? Prediu-ho, observa-ho i explica-ho.
- **Dades:** líquid · densitat del líquid · fracció submergida (%) · fracció visible (%).
- **Valors esperats:** 92 % submergit en aigua dolça i 89 % en aigua de mar.
- **Conclusió:** el gel és menys dens que l'aigua líquida, i per això sura amb gairebé tot el volum submergit.
- **Nota de rigor:** un glaçó que es fon en aigua dolça no canvia el nivell, perquè desplaçava una massa d'aigua igual a la seva. El gel de terra ferma que arriba al mar sí que el fa pujar.
- **Origen:** SB4, p. 32; primera recerca (laboratori 24).

### F7 · La corona del rei

- **Pregunta:** la corona és d'or pur?
- **Nivell · fase · durada:** 3 · 3 · 20 min
- **Idees i errors:** EM-01, EM-07
- **Escena:** una corona de 1000 g, un lingot d'or de referència, la balança, el vas de vessament i el dinamòmetre.
- **Seqüència:**
  1. Llegeix la història d'Arquimedes i el rei Hieró.
  2. Tria un mètode: massa i volum desplaçat, o pes i pes aparent.
  3. Calcula la densitat de la corona i compara-la amb la de l'or.
  4. Comprova el resultat amb l'altre mètode.
- **Dades:** mètode · mesures · volum (cm³) · densitat (g/cm³).
- **Valors esperats:** 64,8 cm³ i 15,4 g/cm³; si fos d'or pur, 51,8 cm³ i 19,3 g/cm³.
- **Conclusió:** dues vies independents porten al mateix resultat: la corona conté un metall menys dens.
- **Ampliació:** quina part de la massa és plata?
- **Origen:** proposta pròpia, com a tancament dels blocs C i E.

### F8 · Objectes que enganyen

- **Pregunta:** per què una taronja sura amb pell i s'enfonsa sense?
- **Nivell · fase · durada:** 1–2 · 4 · 15 min
- **Escena:** taronja amb pell i pelada, dues llaunes de refresc (amb sucre i sense), una pedra tosca i una ampolla tancada, buida i plena.
- **Conclusió:** molts objectes són compostos. El que compta és la densitat mitjana, i l'aire atrapat la fa baixar.
- **Nota de rigor:** el resultat de les llaunes és el típic, però depèn de cada llauna.
- **Origen:** primera recerca (laboratori 26).

### F9 · Globus i aire calent

- **Pregunta:** per què uns globus pugen i d'altres cauen?
- **Nivell · fase · durada:** 2–3 · 4 · 20 min
- **Idees i errors:** IP-09
- **Escena:** una cambra d'aire amb globus d'heli, d'aire i de diòxid de carboni, i un globus aerostàtic amb cremador.
- **Conclusió:** els gasos també són fluids i exerceixen empenyiment. Un globus puja si la seva densitat mitjana és més petita que la de l'aire.
- **Càlcul de referència:** un globus de 10 L d'heli amb 3 g de coberta rep una força neta de 0,072 N cap amunt.
- **Origen:** SB2, p. 22; SB4, p. 33–34.

### F10 · Temperatura i densitat

- **Pregunta:** l'aigua calenta i l'aigua freda tenen la mateixa densitat?
- **Nivell · fase · durada:** 3 · 4 · 20 min
- **Escena:** aigua calenta i freda acolorides, termòmetre, escalfador i bany de gel.
- **Conclusió:** la densitat depèn de la temperatura. L'aigua té la densitat màxima a 4 °C i el gel és menys dens que l'aigua líquida: per això els llacs es glacen per dalt.
- **Origen:** primera recerca (laboratori 28).

### F11 · El densímetre

- **Pregunta:** es pot mesurar la densitat d'un líquid només mirant com sura un objecte?
- **Nivell · fase · durada:** 2–3 · 4 · 15 min
- **Escena:** un tub llastat que es pot graduar i diversos líquids.
- **Conclusió:** com més dens és el líquid, menys s'enfonsa el flotador. És el principi del densímetre.
- **Origen:** proposta pròpia, com a aplicació de D6.

---

# Bloc G · Pressió i hidrostàtica

### G1 · Més avall, més pressió

- **Pregunta:** com canvia la pressió dins d'un líquid?
- **Nivell · fase · durada:** 3 · 4 · 15 min
- **Escena:** el tanc fondo, la sonda de pressió, una proveta amb tres forats a alçades diferents i la gràfica.
- **Seqüència:** predir, mesurar la pressió a cinc profunditats, representar-la, canviar el líquid i observar l'abast dels tres dolls.
- **Conclusió:** la pressió augmenta amb la profunditat i amb la densitat del líquid: `p = d · g · h`.
- **Origen:** SB4, p. 20–22.

### G2 · La forma del recipient importa?

- **Pregunta:** hi ha més pressió al fons d'un recipient ample que al d'un d'estret?
- **Nivell · fase · durada:** 3 · 4 · 15 min
- **Idees i errors:** IP-20
- **Escena:** quatre recipients de formes diferents amb la mateixa alçada de líquid i la sonda. El barril amb un tub prim i alt.
- **Conclusió:** a la mateixa profunditat, la pressió és la mateixa, sigui quina sigui la forma del recipient o la quantitat de líquid.
- **Origen:** SB4, p. 22–24.

### G3 · D'on surt l'empenyiment?

- **Pregunta:** si la pressió augmenta amb la profunditat, per què l'empenyiment no?
- **Nivell · fase · durada:** 3 · 4 · 20 min
- **Idees i errors:** IP-12
- **Escena:** el tanc, un cub de 10 cm d'aresta i les fletxes de pressió sobre les cares.
- **Seqüència:** calcular la força sobre la cara de dalt i la de baix a dues profunditats, restar-les i comparar el resultat amb l'empenyiment.
- **Valors esperats:** 4,9 N i 14,7 N amb la cara superior a 5 cm; la diferència, 9,8 N, es manté a qualsevol profunditat.
- **Conclusió:** l'empenyiment és la diferència entre la força que el líquid fa per sota i la que fa per sobre. Les dues creixen igual amb la profunditat, i la diferència no canvia.
- **Origen:** segona recerca; SB4, p. 20 i 29.

**Fora de l'abast:** vasos comunicants, sifó, principi de Pascal, premsa i frens hidràulics, pressió atmosfèrica i meteorologia. Poden ser una app germana.

---

# Targetes de repte per al laboratori lliure

Reptes curts, sense guia, que es poden triar des del laboratori lliure o projectar a classe.

| # | Repte | Nivell | Fase |
|---|---|---|---|
| 1 | Troba dos objectes de la mateixa massa i volum diferent | 1 | 1 |
| 2 | Ordena cinc objectes per densitat sense calcular res | 1 | 1 |
| 3 | Fabrica un objecte de 300 g que suri | 2 | 1 |
| 4 | Mesura el volum del tap de suro amb un error inferior a 1 cm³ | 2 | 1 |
| 5 | Descobreix quin dels sis objectes misteri és de plom fent una sola mesura a cadascun | 2 | 1 |
| 6 | Fes una columna de quatre capes i col·loca una bola a cada frontera | 2 | 2 |
| 7 | Aconsegueix que l'espelma quedi suspesa entre dos líquids | 2 | 2 |
| 8 | Prepara un líquid on el niló suri | 2 | 2 |
| 9 | Troba el volum d'un objecte fent servir només el dinamòmetre | 3 | 2 |
| 10 | Fes surar 500 g d'acer | 3 | 3 |
| 11 | Carrega 450 g en una barca de 200 g de plastilina | 3 | 3 |
| 12 | Mantén el submarí a mitja alçada durant deu segons | 2 | 3 |

---

# Traçabilitat amb les dues recerques

### Les 32 famílies de la primera recerca

| Família | Investigacions |
|---|---|
| 1. Què és la matèria? | A1, A2 |
| 2. La massa | A3, A4 |
| 3. El volum dels sòlids | A5 |
| 4. Volum de líquids i sòlids irregulars | A6, A7, A8 |
| 5. El món de les unitats | B1, B4 |
| 6. Construïm un litre | B2 |
| 7. Quanta massa té un litre? | B3 |
| 8. La mateixa massa, diferents volums | C1 |
| 9. El mateix volum, diferents masses | C2 |
| 10. Construïm la densitat | C3, C7 |
| 11. La densitat és una propietat del material | C4, C8 |
| 12. Detectius de materials | C6 |
| 13. La gràfica massa-volum | C5 |
| 14. Què sura i què s'enfonsa? | D1, D2 |
| 15. Canviem el líquid | D4 |
| 16. Modifiquem la densitat del fluid | D5 |
| 17. Quina part queda submergida? | D6 |
| 18. L'aigua desplaçada | E2 |
| 19. Les forces de la flotació | E1, E6 |
| 20. El principi d'Arquimedes | E3, E4, E5 |
| 21. El taller de vaixells | F1, F2, F3 |
| 22. Per què suren els vaixells? | F4 |
| 23. Dissenyem un submarí | F5 |
| 24. Un iceberg al mar | F6 |
| 25. La torre de líquids | D3, D7 |
| 26. Objectes que canvien | F8 |
| 27. Flotació a l'aire | F9 |
| 28. Temperatura i densitat | F10 |
| 29. Control de variables | Comparador de dues situacions; E5 |
| 30. Errors de mesura | C10, A8 |
| 31. Organització de dades | Quadern i gràfica; C5 |
| 32. Laboratori de reptes | Targetes de repte; F3 |

### Els experiments nous de la segona recerca

| Experiment | Investigació |
|---|---|
| El misteri del volum invisible | A2 |
| Quina proveta necessito? | A8 |
| El mateix objecte, dues balances | C10 |
| Deu peces del mateix material | C5 |
| El repte de la densitat desconeguda | C6 |
| L'objecte impossible | C7 |
| Flotar sense pujar ni baixar | D8 |
| Com més profund, més empenyiment? | E5, G3 |
| La forma del recipient importa? | G2 |
| Què passa quan entra aigua en una barca? | F2, F4 |
| Barregem 50 mL i 50 mL | D7 (ampliació de la fase 4) |
| La densitat canvia amb la temperatura | F10 |

---

# 07 · Guia, quadern i avaluació

El motor pedagògic: com es guia l'alumne sense interrompre'l, com es detecten les idees equivocades, què recull el quadern científic, com es mostra el progrés i què té a l'abast el professorat.

Torna al [pla mestre](PLA.md).

---

## 1. Dues capes que es poden separar

| Capa | Què fa | On es veu |
|---|---|---|
| **Simulació** | Respon a qualsevol manipulació amb el motor físic | La taula de treball, sempre |
| **Guia** | Planteja la pregunta, demana la predicció, proposa passos, ofereix pistes i tanca amb la conclusió | Un panell lateral, només a les investigacions |

- La guia **observa** el laboratori (què s'ha mesurat, què s'ha anotat, què s'ha provat), però mai en modifica el resultat.
- El panell de la guia es pot **plegar** en qualsevol moment i el laboratori continua funcionant.
- En mode projector, la guia desapareix i el docent fa de guia.

## 2. Estructura d'una investigació

Cada investigació és una fitxa de dades, no codi a mida. Això permet afegir-ne sense tocar el motor.

```js
{
  id: "C4",
  titol: "Tallem la patata",
  pregunta: "Si talles una patata per la meitat, què li passa a la densitat?",
  bloc: "C", nivells: [1, 2], fase: "1a", durada: 15,
  idees: ["IP-03", "IP-02"],
  escena: { taula: "mesura", objectes: ["patata"], instruments: [...], visibilitat: "experimental" },
  passos: [
    { tipus: "prediu",  ... },
    { tipus: "mesura",  condicio: "anotades(massa, volum, de='patata')" , ... },
    { tipus: "explica", ... },
    { tipus: "aplica",  ... }
  ]
}
```

### Tipus de pas

| Tipus | Què demana | Com es completa |
|---|---|---|
| **Observa** | Mirar l'escena i llegir la pregunta | Prement «Continua» |
| **Prediu** | Triar què passarà i per què | Triant una opció i un motiu |
| **Experimenta** | Fer alguna cosa al laboratori | Quan el laboratori compleix una condició |
| **Mesura** | Anotar unes dades concretes | Quan són al quadern |
| **Calcula** | Obtenir una magnitud derivada | Amb un resultat i una unitat vàlids |
| **Explica** | Comparar predicció i resultat, completar la conclusió | Responent i confirmant |
| **Aplica** | Resoldre un cas nou | Amb una resposta, sense pistes immediates |

### Condicions sobre el laboratori

Els passos d'experimentar i de mesurar es completen sols quan passa el que cal. Exemples de condicions:

- `anotades(massa, de="patata")`: hi ha una lectura de massa de la patata al quadern.
- `tallat("patata")`: la patata s'ha dividit.
- `provat("ou", en="aigua salada")`: l'ou s'ha posat en aquest líquid.
- `nivell(proveta) >= cobert(objecte)`: l'objecte queda cobert.

L'alumne no ha de prémer «He acabat»: l'app ho veu.

## 3. Tipus de pregunta

| Tipus | Ús | Exemple |
|---|---|---|
| Opció única amb motiu | Prediccions | «La densitat de mitja patata serà: la meitat, la mateixa, el doble» i «perquè…» |
| Classificar arrossegant | Prediccions múltiples | Deu objectes a «sura» o «s'enfonsa» |
| Ordenar | Seqüències i comparacions | Ordena els líquids de menys a més dens |
| Número amb unitat | Càlculs | `2,7` i `g/cm³` |
| Lectura d'instrument | Mesures | Escriu el que marca la proveta |
| Frase amb buits | Conclusions | «En tallar un objecte, la massa ___ i la densitat ___» |
| Dibuix de forces | Diagrames | Col·loca i ajusta els vectors |
| Text breu | Explicacions obertes | No es corregeix: es desa al quadern |

**Opcions amb sentit:** cada opció incorrecta correspon a una idea prèvia o a un error del catàleg. No hi ha opcions de farciment.

**Text lliure:** l'app no intenta valorar-lo. Es desa a l'informe perquè el valori el docent amb la rúbrica.

## 4. Com respon l'app

### 4.1. A una predicció

Mai diu si és correcta. Diu: «Anotat. Comprovem-ho.» El resultat de l'experiment és qui respon.

### 4.2. Quan el resultat contradiu la predicció

Tres moviments, en aquest ordre:

1. **Constatar:** «Havies previst que s'enfonsaria, i sura.»
2. **Preguntar:** «Què creus que no havies tingut en compte?»
3. **Proposar el contrast**, si la idea persisteix: un experiment curt que la posa a prova.

### 4.3. A una resposta de càlcul

| Situació | Resposta |
|---|---|
| Correcta | Confirmació breu i continua |
| Coincideix amb un error del catàleg | El missatge orientatiu d'aquell error, en forma de pregunta |
| Incorrecta sense patró | «Revisa les dades que has fet servir» i, a la segona, la primera pista |
| Falta la unitat | «Un número sense unitat no és una mesura» |

### 4.4. Pistes en tres graons

| Graó | Què dona | Exemple a C4 |
|---|---|---|
| 1. Orientació | Cap on mirar | «Què necessites saber per calcular una densitat?» |
| 2. Pista concreta | El pas que falta | «Mesura la massa i el volum del tros, igual que has fet amb la patata sencera.» |
| 3. Mostra-m'ho | Una demostració breu | L'app fa el pas amb un objecte diferent |

- Les pistes les demana l'alumne. L'app només en suggereix una si detecta que fa temps que no avança.
- Cada pista utilitzada queda anotada al progrés, sense penalitzar.
- El docent pot desactivar les pistes.

### 4.5. To dels missatges

- Curts, en segona persona i sense exclamacions.
- Preguntes abans que afirmacions.
- Mai «incorrecte», «malament» ni «error»; tampoc elogis buits.
- Reconeixen el que sí que està bé: «El càlcul és correcte, però falta la unitat.»

## 5. Diagnosi de les idees prèvies

### 5.1. Fonts d'evidència

| Font | Exemple | Què indica |
|---|---|---|
| Predicció i motiu | «S'enfonsarà perquè pesa molt» | IP-01 activa |
| Opció triada en una pregunta | «L'empenyiment és més gran a més profunditat» | IP-12 activa |
| Conducta al laboratori | Canvia dues variables alhora | Dificultat amb el control de variables |
| Resposta al cas d'aplicació | Prediu bé un objecte nou | La idea correcta es transfereix |

### 5.2. Estats d'una idea

```
   no observada ──► activa ──► en revisió ──► superada
                      ▲             │
                      └─────────────┘   (si torna a aparèixer)
```

| Estat | Condició |
|---|---|
| **No observada** | Cap evidència |
| **Activa** | Una evidència o més a favor de la idea equivocada |
| **En revisió** | Ha vist l'experiment de contrast i ha respost bé un cop |
| **Superada** | Dues respostes correctes en contextos diferents, una d'elles en un cas d'aplicació |

### 5.3. Què fa l'app amb el diagnòstic

1. **Dins d'una investigació:** tria quin experiment de contrast proposa.
2. **En acabar-la:** recomana la investigació següent. Si IP-03 continua activa després de C4, proposa C5 abans de passar al bloc D.
3. **A l'informe:** indica al docent quines idees han aparegut i en quin estat han quedat.

### 5.4. Model inicial i model futur

- **Fases 1 a 3:** regles deterministes amb comptadors d'evidències, com es descriu aquí. Són transparents i fàcils de verificar.
- **Fase 4:** model bayesià, que estima la probabilitat de cada idea i tria la pregunta més informativa. L'estructura de dades ja ho preveu: cada evidència es desa amb la idea, el sentit i el context. Per construir-lo es farà servir la skill `crea-recursos-adaptatius-bayesians`.

## 6. Progrés en quatre dimensions

Cada pas completat aporta evidències a una dimensió o més.

| Dimensió | Evidències que compten | Com es mostra |
|---|---|---|
| Comprensió conceptual | Idees superades, conclusions correctes, casos d'aplicació | Barra i llista d'idees treballades |
| Procediment experimental | Tara, lectura del menisc, tria de l'instrument, control de variables | Barra i llista de tècniques dominades |
| Competència matemàtica | Càlculs, conversions, lectura de gràfiques | Barra i tipus de càlcul |
| Raonament científic | Prediccions amb motiu, explicació de discrepàncies, conclusions amb dades | Barra |

**Pantalla de progrés**

```
   El meu progrés
   ┌─────────────────────────────────────────────────────────┐
   │  Investigacions fetes        12 de 20                    │
   │                                                         │
   │  Comprensió conceptual       ████████░░░░                │
   │  Procediment experimental    ██████████░░                │
   │  Competència matemàtica      █████░░░░░░░                │
   │  Raonament científic         ███████░░░░░                │
   │                                                         │
   │  Et recomanem: B1 · L'escala de les unitats             │
   └─────────────────────────────────────────────────────────┘
```

- No hi ha nota, punts ni classificació.
- Cada investigació acabada deixa un **segell** a l'itinerari.
- Una dimensió baixa genera una recomanació concreta, no un avís.

## 7. El quadern científic

### 7.1. Què és

L'espai on l'alumne recull el que ha fet. No s'omple sol: **l'alumne decideix què anota**, i l'app s'estalvia que hagi de copiar números a mà.

### 7.2. Com hi arriben les dades

| Origen | Com |
|---|---|
| Lectura d'un instrument | Botó «Anota» al costat de la lectura |
| Lectura que fa l'alumne (menisc, regle) | El valor que ha escrit |
| Càlcul | Botó «Anota» a la calculadora |
| Predicció i motiu | Automàticament, en respondre |
| Conclusió | Automàticament, en completar-la |
| Captura de l'escena | Botó «Fes una foto» |
| Nota lliure | Camp de text |

Cada dada anotada guarda: magnitud, valor, unitat, objecte, instrument, resolució, líquid i moment.

### 7.3. Estructura

```
   Quadern
   ├── Per investigació
   │     ├── Pregunta
   │     ├── Predicció i motiu
   │     ├── Taula de dades
   │     ├── Càlculs
   │     ├── Gràfica (si n'hi ha)
   │     ├── Captures de l'escena
   │     ├── Conclusió
   │     └── Cas d'aplicació
   ├── Laboratori lliure (experiments desats amb nom)
   └── Tots els objectes (fitxa de cada un amb les seves mesures)
```

### 7.4. La taula de dades

- Una fila per objecte o per prova; una columna per magnitud.
- Les columnes apareixen quan s'anota la primera dada d'aquella magnitud.
- Es poden afegir **columnes calculades** amb la calculadora.
- Una cel·la es pot esborrar i tornar a mesurar; es conserva l'historial.
- Dues files es poden marcar per **comparar-les**.

### 7.5. Exemple de fitxa

```
   C4 · Tallem la patata                                  16 de novembre de 2026
   ───────────────────────────────────────────────────────────────────────────
   Predicció   La meitat tindrà la meitat de densitat.
               Motiu: perquè n'hi ha la meitat.

   Tros            Massa (g)    Volum (cm³)    Densitat (g/cm³)
   Sencera           172,8         160             1,08
   Meitat             86,4          80             1,08
   Quart              43,2          40             1,08

   Resultat    La densitat no ha canviat.
   Conclusió   En tallar un objecte, la massa i el volum es redueixen igual
               i la densitat es manté.
   Aplica      Un anell i un lingot d'or tenen la mateixa densitat: sí.
```

### 7.6. Exportació

| Format | Contingut | Ús |
|---|---|---|
| **Informe en PDF** | Les investigacions triades, amb taules, gràfiques, captures i conclusions | Lliurament per Classroom |
| **CSV** | Les taules de dades | Treballar-les a Google Sheets |
| **JSON** | Tota la sessió | Còpia de seguretat i canvi d'ordinador |

- L'informe es genera amb la funció d'impressió del navegador i un full d'estils propi: A4, text justificat, títols alineats a l'esquerra.
- L'alumne hi escriu el nom i el grup en el moment d'exportar. No es desa enlloc més.

## 8. Mode docent

Disponible a partir de la fase 2. S'activa des del menú, sense contrasenya.

| Funció | Descripció |
|---|---|
| **Mode projector** | Lletra i instruments més grans, sense guia ni panells secundaris |
| **Què es veu** | Mostra o amaga noms de materials, valors, densitats, forces i resultats |
| **Amaga la resposta** | Atura l'experiment just abans del resultat per recollir prediccions |
| **Escenes preparades** | Desa qualsevol estat del laboratori amb un nom |
| **Enllaç d'escena** | Genera un enllaç que obre el laboratori en aquell estat exacte |
| **Enllaç d'investigació** | Obre directament una investigació, amb el nivell i els suports triats |
| **Pistes i suports** | Activa o desactiva pistes, lectura fàcil i nombres senzills per defecte |
| **Solucionari** | Valors esperats de cada investigació |

Els enllaços porten l'estat codificat a la mateixa adreça: no hi ha servidor ni comptes.

### Guia docent

Document a part (PDF), a partir de la fase 2:

- Objectius, sabers i competències de cada bloc.
- Fitxa de cada investigació amb temps, valors esperats i preguntes per al debat.
- Les idees prèvies i com fer-les aflorar a classe.
- Material per a les pràctiques reals: plastilina, patata, sal, ou, proveta i balança.
- La situació d'aprenentatge de sis sessions i la rúbrica.

## 9. Situació d'aprenentatge de referència

**Per què suren els vaixells?** Sis sessions per a 2n d'ESO, ampliable a 4t.

| Sessió | Pregunta | A l'app | A l'aula |
|---|---|---|---|
| 1 | Per què uns objectes suren i d'altres s'enfonsen? | D1 | Prediccions en grup amb objectes reals |
| 2 | Com es mesuren la massa i el volum? | A3, A6, A7 | Balança, proveta i pedres |
| 3 | Què és la densitat? | C3, C4 | La patata tallada |
| 4 | Per què un objecte sura en un líquid i en un altre no? | D2, D5 | L'ou i la sal |
| 5 | Com pot surar un vaixell fet d'un material que s'enfonsa? | F1, F2 | Barques de plastilina |
| 6 | Podem predir i demostrar què passarà? | F3 | Repte final i exposició |

- **Producte final:** l'informe de disseny d'una barca, amb la predicció de càrrega, el resultat i l'explicació.
- **Per a 4t:** se substitueixen les sessions 2 i 3 per E1, E3 i E5, i el producte inclou l'anàlisi de forces.
- Fins que la fase 3 no estigui feta, les sessions 5 i 6 es fan amb plastilina real i el laboratori s'usa per a les prediccions.

### Rúbrica orientativa

| Dimensió | Inicial | Bàsic | Notable | Excel·lent |
|---|---|---|---|---|
| Comprensió conceptual | Explica la flotació per la massa o la mida | Fa servir la densitat en objectes massissos | Compara la densitat de l'objecte amb la del líquid | Explica els objectes buits amb la densitat mitjana o amb l'empenyiment |
| Procediment experimental | Mesura amb ajuda | Mesura massa i volum correctament | Tria l'instrument adequat i controla les variables | Detecta i corregeix les seves pròpies fonts d'error |
| Competència matemàtica | Calcula amb el marc guiat | Calcula densitats amb unitats | Converteix unitats i interpreta la gràfica | Prediu valors nous a partir de la relació |
| Raonament científic | Prediu sense motiu | Prediu amb un motiu | Explica la diferència entre la predicció i el resultat | Conclou amb les dades i en reconeix els límits |

## 10. Com sabrem que funciona

Abans de donar per bona la fase 1, es prova amb alumnat real. No es mesura si els agrada, sinó si entenen.

| Pregunta de control | Idea |
|---|---|
| Si talles una barra de ferro per la meitat, cada tros té la mateixa densitat, la meitat o el doble? | IP-03 |
| Un objecte de 2 kg sura i un de 5 g s'enfonsa. Com pot ser? | IP-01 |
| Dos objectes de la mateixa mida, un de plom i un d'alumini, fan pujar igual l'aigua d'una proveta? | IP-10 |
| Un litre d'oli i un litre d'aigua pesen el mateix? | IP-06 |
| Com mesuraries el volum d'un tap de suro? | EP-04 |
| Un objecte té 240 g i 80 cm³. Surarà a l'aigua? | Transferència |

- Es passen les sis preguntes abans i després de treballar amb l'app.
- Es recull també el que diuen mentre treballen: on s'encallen, què no entenen de la interfície.
- Els resultats decideixen què s'ajusta abans de començar la fase 2.

## 11. Privacitat

- No hi ha comptes, cookies de seguiment ni analítiques.
- Tot es desa al navegador de l'alumne.
- El nom només apareix a l'informe que l'alumne exporta.
- En ordinadors compartits, el botó «Comença de nou» esborra la sessió.

---

# 08 · Disseny visual i interacció

Pantalles, composició, identitat visual, convencions de representació, adaptació a la pantalla i accessibilitat.

Torna al [pla mestre](PLA.md).

---

## 1. Criteris de disseny

1. **Un laboratori creïble, no una joguina.** Estètica neta i sòbria, pensada per a adolescents: instruments reconeixibles, colors continguts i cap mascota.
2. **Compacta.** Tot el que cal per a un experiment es veu sense desplaçar la pàgina. Capçaleres baixes, sense imatges decoratives.
3. **Només el que cal.** Es mostren els controls rellevants per a l'experiment en curs; la resta queda a un clic.
4. **L'escena mana.** La taula de treball ocupa la major part de la pantalla; els panells l'acompanyen.
5. **Icones de línia** pròpies i coherents, sempre amb etiqueta. Cap emoji.
6. **Cada color significa una cosa** i sempre va acompanyat d'un símbol o d'un text.

## 2. Mapa de pantalles

```
   Inici ──┬── Investigació (laboratori amb guia) ──┐
           ├── Laboratori lliure ───────────────────┼── Quadern ── Informe
           ├── Consulta                             │
           ├── Progrés                              │
           └── Mode docent (fase 2) ────────────────┘
```

| Pantalla | Contingut | Fase |
|---|---|---|
| Inici | Itinerari per blocs, «Continua on ho vas deixar» i accés al laboratori lliure | 1 |
| Laboratori | Prestatge, taula de treball, eines i panell lateral | 1 |
| Quadern | Llista d'investigacions i fitxa de cadascuna, amb exportació | 1 |
| Consulta | Fórmules, unitats, densitats, instruments, glossari i «Com funciona» | 1 |
| Progrés | Segells i quatre dimensions | 1 |
| Configuració | Nivell, suports, gravetat, símbols, reinici | 1 |
| Mode docent | Projector, visibilitat, escenes i enllaços | 2 |

## 3. Composició de referència (1440 × 800)

### 3.1. Laboratori

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Densitat │ C4 · Tallem la patata      Nivell 1 ▾    Cubets  Forces  Valors    Quadern ⋯ │ 48
├──────────┬─────────────────────────────────────────────────────────┬────────────────────┤
│ PRESTATGE│                                                         │ Guia │ Dades │ Notes│
│          │                                                         ├────────────────────┤
│  ┌────┐  │                                                         │ Pas 2 de 5 · Prediu│
│  │ A  │  │                     ESCENA                              │                    │
│  └────┘  │                                                         │ Si talles la patata│
│  ┌────┐  │      balança          proveta          vas d'aigua      │ per la meitat, la  │
│  │ B  │  │                                                         │ densitat de cada   │
│  └────┘  │                                                         │ tros serà…         │
│  ┌────┐  │                                                         │                    │
│  │ C  │  │                                                         │ ( ) la meitat      │
│  └────┘  │                                                         │ ( ) la mateixa     │
│          │                                                         │ ( ) el doble       │
│ LÍQUIDS  │                                                         │                    │
│  aigua   │                                                         │ Perquè… ▾          │
├──────────┴─────────────────────────────────────────────────────────┤                    │
│ Mesura · Columna · Tanc · Taller │ regle vareta lupa calculadora   │ [Pista] [Continua] │ 56
├────────────────────────────────────────────────────────────────────┴────────────────────┤
│ Felip Sarroca amb assistència de la IA · Codi: AGPLv3 · Continguts: CC BY-NC-SA 4.0      │ 32
└─────────────────────────────────────────────────────────────────────────────────────────┘
     184                              896                                    360
```

| Zona | Amplada o alçada | Contingut |
|---|---|---|
| Barra superior | 48 px | Nom, investigació, nivell, vistes, quadern i menú |
| Prestatge | 184 px | Fitxes d'objectes i ampolles de líquids |
| Escena | 896 × 664 px | Dibuix vectorial de la taula activa |
| Panell lateral | 360 px | Pestanyes: guia, dades i notes |
| Barra d'eines | 56 px | Taules de treball i eines |
| Peu | 32 px | Autoria i llicència |

- Al **laboratori lliure**, el panell lateral mostra «Dades» i «Notes», i es pot plegar perquè l'escena guanyi amplada.
- En **mode projector**, el panell i el prestatge es redueixen i l'escena ho ocupa gairebé tot.

### 3.2. Inici

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Densitat                                             Consulta   Progrés   Quadern   ⋯   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  Laboratori virtual de densitat i flotació                                                       │
│  Mesura, prediu i comprova per què uns objectes suren i d'altres s'enfonsen.           │
│  [ Continua: C4 · Tallem la patata ]   [ Laboratori lliure ]                            │
│                                                                                         │
│  ┌── A ───────┐ ┌── B ───────┐ ┌── C ───────┐ ┌── D ───────┐                            │
│  │ Matèria    │ │ Unitats    │ │ La         │ │ Flotabili- │                            │
│  │ i mesura   │ │            │ │ densitat   │ │ tat        │                            │
│  │ ●●●○○○○○   │ │ ●○○○       │ │ ●●○○○○○○○○ │ │ ○○○○○○○○   │                            │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                            │
│  ┌── E ───────┐ ┌── F ───────┐ ┌── G ───────┐                                           │
│  │ Forces i   │ │ Construïm  │ │ Pressió    │                                           │
│  │ Arquimedes │ │ i apliquem │ │            │                                           │
│  └────────────┘ └────────────┘ └────────────┘                                           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ peu                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

- Tot cap en una pantalla, sense desplaçament.
- En obrir un bloc, la targeta es desplega amb la llista d'investigacions: pregunta, nivell, durada i segell.
- Cap investigació està bloquejada. L'ordre és una recomanació.
- Els blocs encara no programats es veuen atenuats, amb l'etiqueta «Aviat».

### 3.3. Quadern

```
┌──────────────────────┬──────────────────────────────────────────────────────────────────┐
│ Investigacions       │  C4 · Tallem la patata                    [ Informe ] [ CSV ]    │
│  A7 · Desplaçament   │  ──────────────────────────────────────────────────────────────  │
│  C3 · Densitat       │  Predicció · Taula de dades · Gràfica · Captures · Conclusió      │
│ ▸C4 · Patata         │                                                                  │
│  D2 · Esferes        │  ┌──────────┬───────────┬─────────────┬──────────────────┐       │
│ Laboratori lliure    │  │ Tros     │ Massa (g) │ Volum (cm³) │ Densitat (g/cm³) │       │
│  Prova de l'ou       │  ├──────────┼───────────┼─────────────┼──────────────────┤       │
│ Objectes             │  │ Sencera  │  172,8    │    160      │      1,08        │       │
│                      │  └──────────┴───────────┴─────────────┴──────────────────┘       │
└──────────────────────┴──────────────────────────────────────────────────────────────────┘
```

### 3.4. Consulta

Pestanyes: **Fórmules** · **Unitats** · **Densitats** · **Instruments** · **Glossari** · **Com funciona**.

- S'obre com un panell superposat, sense sortir del laboratori.
- La taula de densitats es pot ordenar i filtrar per sòlids, líquids i gasos.
- Les fórmules es presenten amb el triangle `m`, `d`, `V` i amb les tres formes aïllades.

## 4. Adaptació a la pantalla

Se segueix el comportament d'`edu-apps/Equacions`, sense modificar aquella app.

### 4.1. Mecanisme

1. El disseny de referència fa **1440 × 800 px útils**.
2. En obrir l'app i en cada canvi de mida o de monitor, es calcula un factor d'escala: el més petit entre l'amplada disponible dividida per 1440 i l'alçada disponible dividida per 800.
3. El factor s'aplica a tota la interfície amb una variable CSS (`--ui-zoom`), de manera que es conserven les proporcions i la disposició.
4. Les regles que depenen de l'alçada fan servir l'**alçada efectiva** (ja escalada), amb classes a l'arrel, no amb *media queries*.
5. L'escena, que és vectorial, sempre omple la seva zona.

### 4.2. Modes de composició

| Mode | Quan | Composició |
|---|---|---|
| **Gran** | Amplada útil de 1440 px o més | La de referència; en pantalles molt grans la lletra creix fins a un límit i l'escena omple l'espai |
| **Escriptori escalat** | Amplada útil entre 1200 i 1439 px, o alçada inferior a 800 px | La de referència, reduïda uniformement fins a un mínim del 75 % |
| **Compacte** | Amplada útil entre 760 i 1199 px | Escena a tota l'amplada; prestatge en franja horitzontal; panell lateral com a calaix que es desplega |
| **Mòbil** | Amplada inferior a 760 px | Una columna amb desplaçament vertical; un instrument cada vegada; panell a sota |

El límit del 75 % evita reduir el text indefinidament. Per sota, es canvia de composició en lloc d'encongir.

### 4.3. Casos que cal comprovar

| Pantalla | Escalat del sistema | Mida útil aproximada | Resultat esperat |
|---|---|---|---|
| 1920 × 1080 | 100 % | 1920 × 950 | Gran |
| 1920 × 1080 | 125 % | 1536 × 740 | Escalat al 90 % |
| 1920 × 1080 | 150 % | 1280 × 600 | Escalat al 75 % |
| 1366 × 768 | 100 % | 1366 × 640 | Escalat al 80 % |
| 1366 × 768 | 125 % | 1093 × 490 | Compacte |
| Pissarra digital 3840 × 2160 | 200 % | 1920 × 950 | Gran |
| Tauleta 1280 × 800 horitzontal | — | 1280 × 700 | Escalat al 85 % |
| Tauleta 800 × 1280 vertical | — | 800 × 1150 | Compacte |
| Mòbil 390 × 844 | — | 390 × 750 | Mòbil |

Les mides útils depenen del navegador i de les barres del sistema: són el punt de partida de la verificació, no valors garantits.

### 4.4. Regles

- Cap retall, cap solapament i cap desplaçament horitzontal en cap mode.
- El zoom d'accessibilitat del navegador es respecta: l'escalat propi el té en compte i no el neutralitza.
- La versió instal·lada es comporta igual des de la primera obertura.
- En mode projector no s'aplica reducció: es prioritza la mida.

### 4.5. Verificació visual obligatòria

Abans de donar una fase per acabada, captures de **totes les pantalles** a 1920 × 1080, a 1366 × 768, amb escalat del 125 % i del 150 % i en mòbil, i revisió de cadascuna.

## 5. Identitat visual

### 5.1. Colors

| Ús | Color | Codi orientatiu |
|---|---|---|
| Fons de l'app | Gris boira | `#F4F6F8` |
| Superfícies i panells | Blanc | `#FFFFFF` |
| Text principal | Blau petroli fosc | `#16303F` |
| Text secundari | Gris blavós | `#586A76` |
| Vores | Gris clar | `#D5DDE3` |
| Acció principal | Verd blavós | `#0E7C86` |
| Confirmació | Verd | `#1A7F4B` |
| Avís | Ocre | `#A16207` |

**Magnituds** (números, etiquetes i eixos):

| Magnitud | Color | Codi orientatiu | Símbol |
|---|---|---|---|
| Massa | Ocre fosc | `#8A5A00` | `m` |
| Volum | Blau | `#1D6FB8` | `V` |
| Densitat | Violeta | `#6D3FB5` | `d` |

**Forces** (vectors):

| Força | Color | Codi orientatiu | Sentit | Símbol |
|---|---|---|---|---|
| Pes | Taronja | `#C2410C` | Avall | `P` |
| Empenyiment | Blau fosc | `#1553A1` | Amunt | `E` |
| Normal | Gris | `#4B5563` | Amunt | `N` |
| Tensió | Verd fosc | `#0F766E` | Amunt | `T` |
| Força neta | Negre, discontínua | `#111827` | Segons el cas | `F` |

El pes en taronja i l'empenyiment en blau coincideixen amb les il·lustracions del llibre de 4t.

**Líquids:**

| Líquid | Color |
|---|---|
| Aigua | Blau molt clar |
| Aigua salada i de mar | Blau verdós |
| Alcohol | Lila clar (es presenta acolorit) |
| Oli | Groc |
| Glicerina | Rosat clar |
| Xarop | Vermellós |
| Mel | Ambre |
| Mercuri | Gris plata |

- Els codis són orientatius: cal comprovar-ne el contrast (mínim 4,5 a 1 per al text) i la distinció amb simuladors de daltonisme.
- No hi ha mode fosc. El mode projector augmenta el contrast.

### 5.2. Tipografia

| Ús | Tipus | Motiu |
|---|---|---|
| Text i interfície | Atkinson Hyperlegible | Molt llegible, pensada per a la baixa visió |
| Lectures d'instruments | Una lletra monoespaiada amb xifres tabulars | Els números no ballen en canviar |
| Fórmules | La mateixa del text, amb fraccions compostes amb CSS | Sense dependències |

- Les fonts s'inclouen dins de l'app, sense servidors externs.
- Mida base de 16 px a la composició de referència; mai per sota de 12 px efectius.
- Títols només amb la primera lletra en majúscula.
- Text justificat a l'informe; a la interfície, alineat a l'esquerra.

### 5.3. Icones

- Joc propi d'unes quaranta icones de línia, amb el mateix gruix i els extrems arrodonits.
- Sempre amb etiqueta de text a la barra d'eines; només icona en botons repetits i coneguts, amb descripció accessible.
- Llista inicial: balança, proveta, regle, peu de rei, dinamòmetre, vas, tanc, ganivet, vareta, lupa, comptagotes, sal, remenar, calculadora, conversor, gràfica, cubets, forces, comparador, quadern, anotar, captura, pista, desfer, refer, reiniciar, endreçar, nivell, projector, enllaç, exportar, configuració, ajuda, veu, glossari.

### 5.4. Estil del dibuix

| Element | Estil |
|---|---|
| Instruments | Dibuix vectorial net, amb volum suggerit per dos tons i un reflex; escales llegibles i a mida real relativa |
| Vidre | Contorn fi, reflex vertical i transparència |
| Líquids | Color pla amb la superfície marcada per una línia més fosca |
| Objectes | Textura senzilla per material: veta a la fusta, brillantor al metall, mat a la plastilina |
| Objectes misteri | Gris neutre, sense textura |
| Etiquetes | Petita placa amb la lletra de l'objecte, sempre visible |
| Taula | Superfície clara i línia d'horitzó; cap decoració |

- Les **proporcions són reals** entre objectes i instruments de la mateixa taula: un bloc de 10 cm fa el doble que un de 5 cm.
- Cada taula té una escala fixa, indicada amb una barra de 5 cm.

## 6. Convencions de representació

### 6.1. Tres mirades sobre el mateix experiment

| Mirada | Què mostra | Com s'activa | Fase |
|---|---|---|---|
| **Macroscòpica** | Objectes, recipients, nivells i instruments | Sempre | 1 |
| **Esquemàtica** | Cubets d'1 cm³ amb la seva massa; volums de material, cavitat i envoltant; vectors de força | Botons «Cubets», «Volums» i «Forces» | 1, 2 i 3 |
| **Matemàtica** | Valors, fórmules, taules i gràfiques | Botó «Valors» i panell de dades | 1 |
| **De partícules** | Model didàctic de la matèria | Botó «Partícules» | 4 |

Totes estan sincronitzades: en canviar una propietat, canvien totes.

### 6.2. Vista de cubets

- L'objecte es veu com una retícula de cubets d'1 cm³.
- Cada cubet porta un to més o menys intens segons la massa que conté, i un número en passar-hi per sobre.
- En tallar l'objecte, desapareixen cubets, però el to de cada un no canvia.

### 6.3. Vista de volums (fase 3)

En objectes amb cavitats, tres colors: **material**, **cavitat** (aire o aigua) i contorn del **volum envoltant**. És la vista que explica per què sura un buc.

### 6.4. Vectors de força

- Surten del centre de l'objecte; el pes cap avall i l'empenyiment cap amunt.
- La llargada és proporcional a la força, amb una escala comuna per a tota l'escena.
- Si dos vectors coincidirien, es dibuixen de costat.
- La força neta es dibuixa a part, al costat de l'objecte.
- Amb «Valors» activat, cada vector porta el seu valor en newtons.

### 6.5. Línia de flotació i part submergida

- La part submergida es pot ombrejar.
- Al tanc, un regle lateral permet llegir el calat.
- El nivell del líquid sempre es dibuixa on el motor el calcula.

### 6.6. Model de partícules (fase 4)

Amb precaucions, perquè és fàcil transmetre una idea falsa:

- No es representa un material més dens simplement amb partícules més juntes: la densitat també depèn de la massa de cada partícula i de l'estructura.
- Cada model porta un rètol amb el que simplifica.
- Només s'activa quan explica alguna cosa que la vista macroscòpica no pot explicar: per què l'aigua calenta és menys densa, per què el gel sura.

## 7. Moviment

| Tipus | Durada | Criteri |
|---|---|---|
| Resposta de la interfície | 150–250 ms | Immediata, sense rebots |
| Objecte que cau o puja en un líquid | 0,6–2,5 s | Segons el motor; més lent en líquids espessos |
| Líquid que s'aboca | Proporcional al volum | Cabal constant |
| Agulla o pantalla d'un instrument | 300 ms | Estabilització breu abans de la lectura |

- Cap animació en bucle ni decorativa.
- Amb «reduir el moviment» del sistema o de l'app, els objectes van directament a la posició final.
- Sense so per defecte. Opcionalment, sons discrets (abocar, deixar un objecte), desactivats d'entrada.

## 8. Estats i missatges

| Estat | Presentació |
|---|---|
| Laboratori buit | Indicació breu: «Agafa un objecte del prestatge» |
| Quadern buit | «Encara no has anotat cap mesura. Fes servir el botó Anota d'un instrument.» |
| Avís físic | Bafarada al costat de l'instrument, amb el motiu |
| Pas completat | Marca discreta al panell de la guia |
| Investigació acabada | Resum en una targeta: predicció, resultat, conclusió i recomanació |
| Dades no desades | No existeix: tot es desa sol |

## 9. Accessibilitat

Objectiu: conformitat amb les WCAG 2.2, nivell AA.

| Àmbit | Mesura |
|---|---|
| Teclat | Tot es pot fer sense ratolí; ordre de tabulació lògic; focus sempre visible |
| Arrossegar | Sempre hi ha l'alternativa de seleccionar i triar destinació |
| Objectius | Mida mínima de 44 × 44 px en el disseny de referència |
| Lectors de pantalla | Cada objecte, instrument i lectura té nom; els resultats s'anuncien |
| Descripció de l'escena | Text que descriu l'estat actual: «El bloc A és a la balança, que marca 270 g» |
| Color | Mai és l'únic senyal: hi ha símbols, etiquetes i trames |
| Contrast | Mínim de 4,5 a 1 en el text i de 3 a 1 en els elements gràfics |
| Zoom | Fins al 200 % sense perdre contingut ni funcions |
| Moviment | Es pot reduir o desactivar |
| Lectura | Lectura fàcil i glossari amb traducció al castellà i a l'anglès |
| Temps | Cap límit de temps |
| Errors | S'expliquen amb paraules i es poden desfer |
| Idioma | Atribut de llengua correcte, també als termes del glossari en altres llengües |

## 10. Llista de comprovació del disseny

- [ ] Cada pantalla cap a 1366 × 768 sense desplaçament vertical llarg.
- [ ] Cap text per sota de 12 px efectius.
- [ ] Cap control queda tapat o retallat en cap dels casos de l'apartat 4.3.
- [ ] Les escales dels instruments es llegeixen a totes les mides.
- [ ] Tots els colors de significat tenen un segon senyal.
- [ ] Les icones són del mateix joc i tenen etiqueta o descripció.
- [ ] Els textos de la interfície estan revisats: gramàtica, concordança i majúscules.
- [ ] El peu mostra l'autoria i la llicència a totes les pantalles.

---

# 09 · Arquitectura tècnica

Tecnologia, estructura de fitxers, mòduls, estat, desament, proves, llicència i publicació.

Torna al [pla mestre](PLA.md).

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
| Motor físic | Les vint regles i els casos de prova del [model científic](planificacio/02-model-cientific.md) | `node --test` |
| Propietats | Per a objectes i líquids generats a l'atzar: conservació de la massa en tallar, força neta zero en equilibri, lectura dins del rang | `node --test` |
| Dades | Coherència de materials, objectes, recipients i instruments | `scripts/valida-dades.mjs` |
| Investigacions | Cada fitxa té tots els camps, referències vàlides i valors esperats que el motor reprodueix | `node --test` |
| Llengua | Cap cadena buida, cap clau sense text, format de nombres | `node --test` |

Les proves del motor es fan **abans** de la interfície (fase 0). Cap fase es tanca amb una prova en vermell.

### 7.2. Visuals i d'ús

| Prova | Com |
|---|---|
| Composició | Captures amb Playwright de cada pantalla als casos de l'apartat 4.3 del [disseny](planificacio/08-disseny-visual-i-interaccio.md) |
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

---

# 10 · Llengua i glossari

Terminologia, símbols, format dels nombres, criteris de redacció i glossari.

Torna al [pla mestre](PLA.md).

---

## 1. Criteris generals

- Tota l'app és en **català**, amb la terminologia del llibre de Science Bits que fa servir l'alumnat, perquè no hi hagi dues maneres de dir el mateix.
- Cada terme tècnic té **una sola forma** a tota l'app. Els sinònims només surten al glossari.
- Els textos per a l'alumnat tenen dues versions: **estàndard** (B1) i **lectura fàcil** (A2).
- Tots els textos de la interfície passen una **revisió de gramàtica i concordança** abans de publicar, no només els que s'han tocat.

## 2. Decisions terminològiques

| Concepte | Terme a l'app | Sinònims (només al glossari) | Cal evitar |
|---|---|---|---|
| Mantenir-se a la superfície | **surar** o **flotar** (s'alternen per facilitar la comprensió; «flotar» és el del llibre de Science Bits) | — | — |
| Anar al fons | **enfonsar-se** | — | «ofegar-se», «baixar» |
| Capacitat de surar | **flotabilitat** | — | — |
| Força cap amunt del líquid | **empenyiment** | — | «empenta», «impuls» |
| Líquid que l'objecte aparta | **líquid desplaçat** | líquid desallotjat | — |
| Lectura del dinamòmetre dins del líquid | **pes aparent** | — | «pes fals» |
| Quantitat de matèria | **massa** | — | «pes» (quan es vol dir massa) |
| Força de la gravetat sobre un cos | **pes** | — | — |
| Massa per unitat de volum | **densitat** | — | «pesadesa» |
| Sense buits a dins | **massís** | — | «sòlid» (quan es vol dir massís) |
| Amb un buit a dins | **buit** (objecte buit) | — | — |
| Posar la balança a zero amb el recipient | **tarar**, **fer la tara** | — | — |
| Corba de la superfície del líquid | **menisc** | — | — |
| Recipient cilíndric graduat | **proveta** | — | «tub» |
| Vas de laboratori | **vas de precipitats** | — | «got» |
| Recipient amb una sola marca | **matràs aforat** | — | — |
| Instrument que mesura forces | **dinamòmetre** | — | «balança de molla» |
| Instrument per mesurar longituds | **regle** | — | — |
| Cos de la barca | **buc** | — | — |
| Alçada submergida d'una barca | **calat** | — | — |
| Alçada que queda fora de l'aigua | **francbord** | — | — |
| Pes afegit per baixar | **llast** | — | — |
| Líquids que es poden mesclar | **miscibles** (nivell 2); «es mesclen» (nivell 1) | — | — |
| Líquid i gas | **fluid** (només al nivell 3) | — | — |

**«Pesar»** es fa servir com a verb quotidià («pesa la patata»), però el resultat sempre s'anomena **massa** i es dona en grams. La distinció entre massa i pes es treballa a la investigació A4.

## 3. Símbols i fórmules

| Magnitud | Símbol | Unitats | Nota |
|---|---|---|---|
| Massa | `m` | g, kg, mg | |
| Volum | `V` | cm³, dm³, m³, mL, L | |
| Densitat | `d` | g/cm³, kg/m³, g/mL, kg/L, g/L | Al nivell 3 s'esmenta que també s'escriu `ρ` |
| Pes | `P` | N | |
| Empenyiment | `E` | N | |
| Pes aparent | `Pa` | N | |
| Força normal | `N` | N | En cursiva, per no confondre-la amb el newton |
| Tensió | `T` | N | |
| Gravetat | `g` | N/kg (o m/s²) | 9,8 per defecte |
| Pressió | `p` | Pa | En minúscula |
| Profunditat | `h` | m, cm | |
| Superfície | `S` | m², cm² | |

**Subíndexs:** `dL` i `VL` per al líquid, com al llibre; `do` i `Vo` per a l'objecte.

**Fórmules, tal com s'escriuen a l'app:**

```
d = m / V          m = d · V          V = m / d
P = m · g          E = dL · g · VL    Pa = P − E
p = d · g · h
```

- Les magnituds, en cursiva; les unitats, en rodona.
- Les fraccions es componen en vertical a les fitxes de Consulta.
- El signe de multiplicar és el punt volat (`·`); el de dividir, la barra o la fracció.

## 4. Format dels nombres i de les unitats

| Cas | Norma | Exemple |
|---|---|---|
| Decimals | Coma | 2,7 g/cm³ |
| Milers | Espai fi a partir de cinc xifres | 13 550 kg/m³ · 2700 kg/m³ |
| Número i unitat | Separats per un espai | 270 g · 100 cm³ |
| Percentatge | Amb espai | 50 % |
| Graus | Amb espai | 20 °C |
| Exponents | Superíndex real | cm³, m², 10⁻³ |
| Litre | `L` majúscula | 250 mL · 1,5 L |
| Entrada de dades | S'accepten la coma i el punt | 2,7 o 2.7 |
| Xifres mostrades | Les de la resolució de l'instrument | 123,5 g en una balança de 0,1 g |
| Notació científica | Només al nivell 3 | 1,18 · 10⁻¹ N |
| Intervals | Guió curt sense espais | 0,35–0,60 g/cm³ |

## 5. Criteris de redacció

### 5.1. Per a tots els textos

- Frases curtes i en veu activa.
- Segona persona del singular: «mesura», «prediu», «compara».
- Una instrucció per frase.
- Títols amb majúscula només a la primera paraula i als noms propis.
- Sense exclamacions, sense emojis i sense anglicismes innecessaris.
- Els botons són verbs en imperatiu: «Anota», «Talla», «Continua», «Desfés».

### 5.2. Versió de lectura fàcil (A2)

| Estàndard | Lectura fàcil |
|---|---|
| «Mesura la massa i el volum de la patata sencera i calcula'n la densitat.» | «Pesa la patata. Mesura el seu volum. Calcula la densitat.» |
| «Explica per què dos productes amb el mateix volum tenen masses diferents.» | «L'oli i la llet ocupen el mateix. Pesen igual? Per què?» |
| «Un objecte que sura desplaça una quantitat d'aigua que té la seva mateixa massa.» | «L'objecte sura. L'aigua que aparta pesa igual que l'objecte.» |

- Vocabulari freqüent; el terme tècnic es manté i s'enllaça al glossari.
- Frases de dotze paraules com a màxim.
- Sense subordinades encadenades ni pronoms febles combinats.
- El contingut científic no es rebaixa: es rebaixa la dificultat lingüística.

### 5.3. Missatges de resposta

| Situació | Cal | No cal |
|---|---|---|
| Predicció desada | «Anotat. Comprovem-ho.» | «Molt bé!» |
| Resultat que contradiu la predicció | «Havies previst que s'enfonsaria, i sura. Què no havies tingut en compte?» | «Incorrecte.» |
| Càlcul sense unitat | «El número és correcte. Quina unitat té?» | «Error: falta la unitat.» |
| Quocient invertit | «Has calculat quant espai ocupa cada gram. Què et demanen?» | «Has dividit malament.» |
| Avís físic | «No hi cap: la boca de la proveta fa 3,6 cm.» | «Acció no permesa.» |
| Investigació acabada | «Has comprovat que la densitat no canvia en tallar un objecte.» | «Enhorabona, ets un crac!» |

### 5.4. Concordances que cal vigilar

- «la massa mesurada», «el volum mesurat», «la densitat calculada».
- «mitja patata», «un quart de patata»; «la meitat de la massa».
- «líquid desplaçat», «aigua desplaçada».
- «objectes massissos», «boles massisses».
- «el pes aparent», «l'empenyiment màxim».
- Plurals de les unitats: «3 grams», «2,5 centímetres cúbics», «0,98 newtons».

## 6. Glossari

Cada entrada té: terme, definició estàndard, definició en lectura fàcil, exemple, dibuix petit quan ajuda, i la traducció al castellà i a l'anglès.

**Llengües:** castellà i anglès. No hi ha veu alta.

### Termes de la fase 1

| Terme | Definició en lectura fàcil |
|---|---|
| matèria | Tot el que ocupa un espai i té massa |
| massa | La quantitat de matèria d'un objecte. Es mesura en grams o quilograms |
| volum | L'espai que ocupa un objecte. Es mesura en centímetres cúbics o litres |
| capacitat | El volum que cap dins d'un recipient |
| densitat | La massa que hi ha en cada centímetre cúbic d'un material |
| magnitud | Una propietat que es pot mesurar |
| unitat | La mesura que fem servir per comptar una magnitud: gram, litre, metre |
| gram, quilogram | Unitats de massa. Un quilogram són 1000 grams |
| litre, mil·lilitre | Unitats de capacitat. Un litre són 1000 mil·lilitres |
| centímetre cúbic | El volum d'un cub d'un centímetre de costat. És igual a un mil·lilitre |
| balança | Instrument per mesurar la massa |
| tara | La massa del recipient buit, que la balança descompta |
| proveta | Tub de vidre amb marques per mesurar el volum d'un líquid |
| menisc | La corba que fa el líquid a dalt, tocant el vidre |
| graduació | Les marques d'un instrument de mesura |
| resolució | El canvi més petit que un instrument pot mesurar |
| desplaçar | Apartar el líquid per ocupar el seu lloc |
| submergir | Posar del tot a dins d'un líquid |
| surar | Quedar-se a la superfície d'un líquid |
| enfonsar-se | Anar al fons d'un líquid |
| massís | Ple del tot, sense buits a dins |
| material | Allò de què està fet un objecte: fusta, ferro, plàstic |
| substància | Un tipus de matèria amb propietats pròpies |
| propietat | Una característica d'un material o d'un objecte |
| predicció | El que penses que passarà abans de provar-ho |
| hipòtesi | Una explicació que es pot comprovar amb un experiment |
| variable | Una cosa que pot canviar en un experiment |
| mesura | El resultat de mesurar: un número i una unitat |
| conclusió | El que has après després de mirar les dades |

### Termes de les fases 2 i 3

| Terme | Definició en lectura fàcil |
|---|---|
| pes | La força amb què la Terra atrau un objecte. Es mesura en newtons |
| newton | Unitat de força |
| força | Una empenta o una estirada |
| empenyiment | La força cap amunt que un líquid fa sobre un objecte |
| pes aparent | El que marca el dinamòmetre quan l'objecte és dins del líquid |
| dinamòmetre | Instrument per mesurar forces |
| equilibri | Quan les forces es compensen i l'objecte no es mou |
| líquid desplaçat | El líquid que un objecte aparta en entrar-hi |
| fracció submergida | La part d'un objecte que queda sota el líquid |
| densitat mitjana | La massa total d'un objecte dividida pel volum total, amb els buits |
| mescla | Dues substàncies ajuntades |
| miscible | Que es pot mesclar amb un altre líquid |
| dissolució | Una mescla on una substància es reparteix del tot dins d'una altra |
| saturació | Quan en un líquid ja no s'hi pot dissoldre més sal |
| buc | El cos d'una barca |
| calat | L'alçada de la barca que queda sota l'aigua |
| francbord | L'alçada de la barca que queda fora de l'aigua |
| càrrega | El que transporta una barca |
| llast | Pes que s'afegeix per fer baixar un vaixell o un submarí |
| cavitat | Un buit dins d'un objecte |
| fluid | Un líquid o un gas |

### Termes de la fase 4

pressió · pascal · profunditat · pressió hidrostàtica · gas · temperatura · dilatació · convecció · partícula · densímetre.

## 7. Noms dins de l'app

| Element | Nom |
|---|---|
| App | Densitat |
| Subtítol | Laboratori virtual de densitat i flotació |
| Espais | Inici · Laboratori · Quadern · Consulta · Progrés |
| Taules de treball | Mesura · Columna · Tanc · Taller |
| Nivells | Descoberta · Mesura · Models |
| Passos | Observa · Prediu · Experimenta · Mesura · Explica · Aplica |
| Vistes | Cubets · Volums · Forces · Valors |
| Modes | Experimental · Anàlisi |

El nivell «Mesura» i la taula «Mesura» comparteixen nom. Si en les proves genera confusió, la taula passarà a dir-se «Banc de mesura».

---

# 11 · Fases i validació

Què es construeix a cada fase, què ha de complir per donar-la per acabada, com es prova amb alumnat i quins riscos cal vigilar.

Torna al [pla mestre](PLA.md).

---

## 1. Criteri general

- **Cada fase és un producte utilitzable**, no una col·lecció de funcions a mitges.
- **El motor va primer.** Cap pantalla es dibuixa abans que la física que mostra estigui verificada.
- **No es comença una fase** sense haver publicat i provat l'anterior.
- Les fases no porten dates: l'ordre i els criteris d'acceptació són el compromís.

## 2. Vista general

| Fase | Nom | Investigacions | Què s'hi estrena |
|---|---|---|---|
| 0 | Prova del motor | — | Motor físic i proves automàtiques |
| 1a | Nucli del laboratori | A7, C3, C4, C6, D1, D2 | Taula de Mesura, balança, proveta amb lupa, vas d'aigua, tallar, quadern bàsic |
| 1b | Laboratori essencial | A1, A3, A5, A6, A8, B1, B2, B3, C1, C2, C5, C7, C8, C9 | Regle, conversor, gràfica, constructor, modelar, Consulta, Progrés, informe |
| 2 | Flotabilitat i Arquimedes | A2, A4, B4, C10, D6–D8, E1–E7 | Columna, Tanc, líquids, sal, dinamòmetre, vas de vessament, forces, comparador, mode docent |
| 3 | Taller de construcció | F1–F7 | Barques, càrrega, cavitats, submarí, vista de volums, targetes de repte |
| 4 | Ampliació | F8–F11, G1–G3 | Pressió, gasos, temperatura, partícules, editor d'activitats, diagnosi bayesiana |

## 3. Fase 0 · Prova del motor

**Objectiu:** tenir el model físic programat i demostrat, sense cap interfície.

| Lliurament | Detall |
|---|---|
| Mòduls de `fisica/` | Unitats, geometria, objecte, flotació, recipient, líquids i instruments: tot el motor estàtic de les fases 1 i 2 |
| Mòduls de `dades/` | Materials, líquids, objectes, recipients i instruments de les fases 1 i 2 |
| Proves | Regles R1 a R14, R16 i R18 a R20, i casos T01 a T28 |
| Validació de dades | `scripts/valida-dades.mjs` |

**Criteris d'acceptació**

- [ ] Totes les proves passen.
- [ ] El motor no accedeix a la pàgina ni a l'emmagatzematge.
- [ ] Els valors de referència s'han contrastat amb una font tabulada.
- [ ] Les conversions d'unitats no donen errors d'arrodoniment visibles.

## 4. Fase 1a · Nucli del laboratori

**Objectiu:** el primer prototip que val la pena. Un alumne pot mesurar tres objectes, calcular-ne la densitat, predir si suren, comprovar-ho i deixar-ho escrit.

### Abast

| Àmbit | Inclou |
|---|---|
| Pantalles | Inici senzill, Laboratori i Quadern |
| Taules | Mesura, amb tres llocs fixos (balança, proveta i vas d'aigua), i Columna, amb la proveta de 500 mL i tres vasos de líquids |
| Objectes | Joc bàsic (A, B, C), quatre esferes, patata, pedra, cilindres, tap, sis objectes misteri, jocs de boles de la columna, espelma, ou, dau de polietilè i clau de ferro |
| Líquids | Aigua, aigua salada (amb sal en cullerades de 5 g i matràs aforat), alcohol, oli, mel i mercuri, acolorits a la columna |
| Instruments | Balança de laboratori amb tara; provetes de 100, 250, 500 i 1000 mL amb lupa; vareta |
| Accions | Moure, tallar, desfer, reiniciar |
| Eines | Calculadora amb unitats, vista de cubets, taula de densitats |
| Guia | Cicle complet, pistes en tres graons, diagnosi amb comptadors |
| Quadern | Anotar, taula de dades, conclusió, informe en PDF |
| Nivells | 1 i 2 |
| Investigacions | A7, C3, C4, C6, D1, D2, D3, D4 i D5 |
| Adaptació | Totes les composicions |
| Publicació | Llicència, peu, README, formulari d'errors |

### No inclou encara

Regle amb lectura, conversor, gràfica, constructor, modelar, mescles de líquids (D7), forces, mode docent i traduccions del glossari.

### Criteris d'acceptació

- [ ] Les sis investigacions es poden fer senceres, de principi a fi, amb ratolí, amb dit i amb teclat.
- [ ] Totes les lectures surten del motor i coincideixen amb els casos de prova.
- [ ] En el mode experimental no es veu cap dada no mesurada.
- [ ] El bloc A marca 270 g, fa pujar 100 mL una proveta i s'enfonsa; el bloc B sura mig submergit; la patata dona 1,08 g/cm³ sencera, a meitats i a quarts.
- [ ] Un objecte que sura no es pot mesurar bé per desplaçament sense la vareta, i l'app ho diagnostica.
- [ ] L'estat es conserva en tancar i tornar a obrir.
- [ ] L'informe en PDF es llegeix bé en A4.
- [ ] Verificació visual als casos de referència, sense retalls ni desplaçament horitzontal.
- [ ] Textos revisats.

### Prova amb alumnat

Amb un grup, abans de continuar: les sis preguntes de control de l'apartat 10 del document [07](planificacio/07-guia-quadern-i-avaluacio.md), abans i després, i observació d'on s'encallen.

## 5. Fase 1b · Laboratori essencial

**Objectiu:** cobrir tot el que cal per ensenyar massa, volum, unitats i densitat a 1r, 2n i 3r.

| Àmbit | S'hi afegeix |
|---|---|
| Instruments | Balança de cuina, proveta de 25 mL, regle, vas de precipitats, matràs aforat, ampolles d'un litre, cub d'1 dm |
| Accions | Modelar en formes compactes, duplicar, constructor d'objectes |
| Eines | Conversor i escala d'unitats, gràfica massa-volum |
| Pantalles | Consulta completa, Progrés, Configuració |
| Suports | Lectura fàcil, glossari amb traducció al castellà i a l'anglès, nombres senzills |
| Objectes | Tot el joc ampliat |
| Investigacions | A1, A3, A5, A6, A8, B1, B2, B3, C1, C2, C5, C7, C8 i C9 |
| Laboratori lliure | Complet per a la taula de Mesura, amb les targetes de repte 1 a 5 |

**Criteris d'acceptació**

- [ ] Vint-i-tres investigacions disponibles i provades.
- [ ] El menisc es llegeix bé a totes les provetes i mides de pantalla.
- [ ] La gràfica mostra la recta de cada material i el pendent coincideix amb la densitat.
- [ ] El constructor no permet fixar material, massa i volum alhora.
- [ ] El glossari es pot obrir des de qualsevol terme marcat.
- [ ] Enllaç `ja.cat` i targeta al menú d'`edu-apps`.

## 6. Fase 2 · Flotabilitat i Arquimedes

**Objectiu:** explicar científicament la relació entre densitat i flotació, i mesurar les forces.

| Àmbit | S'hi afegeix |
|---|---|
| Motor | Ja verificat a la fase 0 (capes, mescles, sal, forces i gravetat); aquí s'hi connecta la interfície i s'hi afegeix el moviment en líquids espessos |
| Taules | Columna i Tanc |
| Líquids | Alcohol, oli, aigua de mar, aigua salada, glicerina, xarop, mel, mercuri i gasolina |
| Instruments | Balança de precisió, balança de braços, peu de rei, dinamòmetres, vas de vessament amb col·lector |
| Eines | Anàlisi de forces, comparador de dues situacions |
| Nivell | 3 |
| Mode docent | Projector, visibilitat, escenes i enllaços; guia docent en PDF |
| Investigacions | A2, A4, B4, C10, D3 a D8 i E1 a E7 |
| Targetes de repte | 6 a 9 |

**Criteris d'acceptació**

- [ ] La columna de mel, aigua, oli i alcohol queda en l'ordre correcte, s'aboqui com s'aboqui.
- [ ] Aigua i alcohol es mesclen en remenar; aigua i oli, no.
- [ ] L'ou comença a surar amb la quantitat de sal prevista.
- [ ] El dinamòmetre marca 2,65 N a l'aire i 1,67 N dins de l'aigua amb el bloc A.
- [ ] L'empenyiment no canvia amb la profunditat i sí en entrar a l'aigua.
- [ ] En equilibri, els vectors de pes i d'empenyiment mesuren el mateix.
- [ ] El comparador avisa quan es canvien dues variables.
- [ ] Un enllaç d'escena obre el laboratori en l'estat exacte.

## 7. Fase 3 · Taller de construcció

**Objectiu:** convertir el coneixement en capacitat de resoldre problemes de disseny.

| Àmbit | S'hi afegeix |
|---|---|
| Motor | Bucs, calat, càrrega, inundació, cavitats tancades, submarí, estabilitat simplificada (regla R15 i casos T29 a T34) |
| Taller | Donar forma de barca, carregar, buidar, unir |
| Vistes | Volums: material, cavitat i volum envoltant |
| Objectes | Plastilina i planxa d'acer de taller, peses, boles buides, corona |
| Investigacions | F1 a F7 |
| Targetes de repte | 10 a 12 |
| Situació d'aprenentatge | Completa a l'app, amb l'informe de disseny |

**Criteris d'acceptació**

- [ ] La bola de 200 g s'enfonsa i la barca de 12 × 10 × 5 cm sura amb 1,67 cm de calat.
- [ ] La càrrega màxima és de 400 g en aigua i de 520 g en aigua salada.
- [ ] En superar-la, l'aigua entra i la barca s'enfonsa.
- [ ] El buc d'acer sura i el bloc massís de la mateixa mida s'enfonsa.
- [ ] El submarí queda en equilibri amb 300 cm³ de llast.
- [ ] Una forma amb la paret massa fina es rebutja amb una explicació.

## 8. Fase 4 · Ampliació

Cada element és independent i es decideix per separat, segons el que hagin ensenyat les fases anteriors.

| Element | Contingut | Dependència |
|---|---|---|
| Pressió | Sonda, gràfica, recipients de formes diferents; G1 a G3 (regla R17 i casos T36 a T38) | Tanc |
| Gasos | Globus, aire calent; F9 (cas T35) | Motor amb fluid ambient |
| Temperatura | Densitat de l'aigua, convecció; F10 | Taules de referència |
| Objectes compostos | Taronja, llaunes, tosca; F8 | Cavitats |
| Densímetre | F11 | Tanc |
| Volums no additius | Aigua i alcohol | Taula de referència |
| Partícules | Model didàctic amb límits explícits | Disseny a part |
| Editor d'activitats | El docent crea investigacions pròpies | Format de fitxa estable |
| Diagnosi bayesiana | Substitueix els comptadors | Dades de les proves amb alumnat |
| 3D | Només per al taller de barques, si aporta comprensió | Decisió a part |
| App germana | Pascal, vasos comunicants i pressió atmosfèrica | Fora d'aquest projecte |

## 9. Definició d'«acabat»

Una investigació està acabada quan:

1. La fitxa de dades és completa i passa la validació.
2. Els valors esperats els reprodueix el motor.
3. S'ha fet sencera, de principi a fi, com la faria un alumne, als nivells previstos.
4. Cada opció de resposta condueix a una reacció amb sentit.
5. Les tres pistes existeixen i ajuden.
6. El quadern recull el que cal i l'informe es veu bé.
7. Té versió de lectura fàcil.
8. S'ha comprovat a 1366 × 768.

Una fase està acabada quan totes les seves investigacions ho estan, es compleixen els criteris d'acceptació i s'ha completat la llista de publicació de l'apartat 9 del document [09](planificacio/09-arquitectura-tecnica.md).

## 10. Riscos

| Risc | Conseqüència | Com es redueix |
|---|---|---|
| Abast massa gran | Projecte inacabable | Fases tancades; la 1a és petita i completa |
| La pantalla se satura | Alumnat perdut | Quatre taules en lloc d'un escenari; només els controls necessaris |
| No hi cap a 1366 × 768 | Retalls a l'aula | Composició de referència dissenyada per a aquesta mida i verificada a cada fase |
| La física i el dibuix no coincideixen | Aprenentatge erroni | Proves de coherència visual; el dibuix es deriva sempre de l'estat |
| Massa text | Alumnat que no llegeix | Enunciats curts, lectura fàcil, una instrucció per pas |
| La guia interromp | Sensació d'examen | Panell plegable; passos que es completen sols |
| Es percep com un joc | Clics a l'atzar | Predicció amb motiu abans de manipular; quadern obligatori a les investigacions |
| Valors de referència erronis | Pèrdua de credibilitat | Contrast amb font tabulada i script de validació |
| Model massa simplificat | Idees falses noves | Simplificacions declarades i consultables |
| La lectura del menisc no es veu bé en pantalles petites | Frustració | Lupa a mida fixa i llegible; línia guia al nivell 1 |
| Arrossegar és difícil en tauleta o amb ratolí tàctil | Abandonament | Alternativa de seleccionar i triar destinació |
| Publicació accidental dels PDF | Problema de drets | `.gitignore` abans del primer commit |
| Pèrdua de dades en ordinadors compartits | Feina perduda | Exportació en JSON i informe en PDF al final de cada sessió |

## 11. Què queda fora del projecte

- Registre d'usuaris, grups, seguiment des del núvol i integració amb plataformes.
- Correcció automàtica de text lliure amb intel·ligència artificial.
- Simulació de fluids en moviment, onades o vent.
- Pascal, vasos comunicants, pressió atmosfèrica i meteorologia.
- Versions en altres llengües de la interfície (el glossari sí que té traducció al castellà i a l'anglès).

## 12. Ordre de treball proposat un cop aprovat el pla

1. Aplicar als documents les decisions de l'apartat 8 del pla mestre.
2. Protegir els PDF.
3. Fase 0: motor i proves.
4. Fase 1a: taules de Mesura i de Columna i les nou investigacions.
5. Verificació visual, revisió lingüística i publicació.
6. Prova amb un grup d'alumnes i ajustos.
7. Fase 1b.
