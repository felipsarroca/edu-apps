# 10 · Llengua i glossari

Terminologia, símbols, format dels nombres, criteris de redacció i glossari.

Torna al [pla mestre](../PLA.md).

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
