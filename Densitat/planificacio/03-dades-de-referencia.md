# 03 · Dades de referència

Valors dels materials, líquids, gasos, objectes, recipients i instruments del laboratori.

Torna al [pla mestre](../PLA.md).

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
