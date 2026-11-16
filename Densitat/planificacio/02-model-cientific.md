# 02 · Model científic

Aquest document defineix el motor físic: què és cada cosa del laboratori, quines magnituds té, quines lleis s'apliquen, quines regles no es poden trencar mai i amb quins casos es comprova. És la base de les proves automàtiques de la fase 0.

Torna al [pla mestre](../PLA.md).

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
