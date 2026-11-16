# 08 · Disseny visual i interacció

Pantalles, composició, identitat visual, convencions de representació, adaptació a la pantalla i accessibilitat.

Torna al [pla mestre](../PLA.md).

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
