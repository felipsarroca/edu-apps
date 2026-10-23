# Volums: pla pedagògic i de disseny

App web per treballar, practicar i aprendre el càlcul de volums a l'ESO, amb figures 3D manipulables, pràctica guiada amb diagnosi d'errors i reptes contextualitzats.

## 1. Destinataris i encaix curricular

- **Alumnat**: 1r a 3r d'ESO (amb ampliació a 4t). Grups diversos, alumnat nouvingut i amb NESE/NE.
- **Currículum de Matemàtiques (Decret 175/2022, LOMLOE)**
  - Sentit de la mesura: magnituds, unitats del SI, estimació, càlcul de volums de cossos geomètrics, relació volum-capacitat.
  - Sentit espacial: reconeixement i visualització de cossos geomètrics, representació i manipulació amb eines digitals.
  - Sentit socioafectiu: perseverança, gestió de l'error i autoavaluació.
- **Competències específiques**: resoldre problemes (CE1-CE2), raonar i justificar (CE3-CE4), connectar amb la realitat (CE6) i comunicar amb llenguatge matemàtic (CE8).

## 2. Principis pedagògics

| Principi | Com es concreta a l'app |
|---|---|
| Concret → pictòric → abstracte | Primer es compten cubs unitaris, després es visualitzen capes i llesques i finalment s'arriba a la fórmula. |
| Comprendre abans de memoritzar | Cada fórmula es deriva: V = Ab · h (pila de llesques), ÷3 (experiment d'abocar el con), 4/3 (Arquimedes). |
| Bastida retirable | Mode *pas a pas* (fórmula → base → volum → unitat) i mode *directe*. Pistes progressives. |
| L'error com a informació | Cada resposta incorrecta es contrasta amb els errors típics i rep un missatge específic. |
| Progressió adaptativa | Tres nivells per habilitat; en mode automàtic, el nivell puja o baixa segons el domini recent. |
| Context real | Reptes amb objectes reals (bric, llauna, piscina, gelat, piràmide de Kheops). |
| Accessibilitat (DUA) | Lectura en veu alta, glossari multilingüe, coma decimal, tipografia molt llegible i objectius tàctils grans. |

## 3. Errors típics que es diagnostiquen

| Error | Exemple | Missatge |
|---|---|---|
| Unitats quadrades en lloc de cúbiques | 24 cm² | El volum es mesura en unitats cúbiques. |
| Oblidar dividir per 3 | Con = π·r²·h | El con és la tercera part del cilindre. |
| Diàmetre en lloc del radi | π·d²·h | r = d / 2. |
| Confondre àrea i volum | 4πr², 6a², 2πrh | Has calculat una àrea, no un volum. |
| No elevar | π·r·h, 3·a | Cal multiplicar el radi pel radi. |
| Factor de conversió erroni | ×10 o ×100 entre m³ i dm³ | Cada graó de volum és ×1000. |
| Operació inversa al revés | Multiplicar en lloc de dividir | Si passes a una unitat més petita, el número creix. |
| Oblidar dividir per 2 la base triangular | b·t·h | L'àrea del triangle és (b·t)/2. |

## 4. Estructura de l'app

| Secció | Funció | Contingut |
|---|---|---|
| **Inici** | Motivació i orientació | Escena 3D, accés ràpid i progrés. |
| **Aprèn** | Construir el concepte | 6 lliçons breus amb laboratori 3D i pregunta de comprovació. |
| **Explora** | Experimentar lliurement | 9 cossos, controls lliscants, cotes, cubs unitaris, aigua i comparació amb una referència. |
| **Practica** | Automatitzar amb sentit | 9 habilitats × 3 nivells, sessions de 6 exercicis generats aleatòriament, pas a pas o directe. |
| **Reptes** | Transferir a la realitat | 8 problemes de diversos passos amb objectes reals. |
| **Progrés** | Autoavaluació | Domini per habilitat, punts i insígnies. |
| **Fórmules** | Suport permanent | Xuleta amb fórmules, escala d'unitats i glossari multilingüe. |

### Seqüència de lliçons

1. **Què és el volum?** Cubs unitaris, comptatge per capes i V = a · b · c.
2. **Unitats de volum i capacitat.** 1 dm³ = 1000 cm³ = 1 L, l'escala ×1000.
3. **Prismes i cilindres.** Pila de llesques: V = Ab · h, i principi de Cavalieri.
4. **Piràmides i cons.** Experiment d'abocar: V = (Ab · h) / 3.
5. **L'esfera i Arquimedes.** Esfera = 2/3 del cilindre circumscrit: V = (4/3) · π · r³.
6. **Cossos compostos.** Descomposició, suma i resta de volums.

### Habilitats de pràctica

Compta cubs · Cubs i ortoedres · Prismes · Cilindres · Piràmides · Cons · Esferes · Unitats i capacitat · Troba la dada (problemes inversos).

- **Nivell 1**: nombres enters i unitat cm.
- **Nivell 2**: decimals, diàmetre en lloc de radi i altres unitats.
- **Nivell 3**: decimals més fins, conversions encadenades i problemes inversos amb context.

## 5. Disseny visual

- **Identitat**: fons de paper càlid, tinta blau fosc i un color per família de cossos (prismes blau, cilindres turquesa, piràmides i cons taronja, esferes lila). Aquest mateix color es repeteix a les icones, a les figures 3D i a les targetes.
- **Tipografia**: *Fredoka* per als títols i *Atkinson Hyperlegible* per al text, dissenyada per a la llegibilitat.
- **3D**: Three.js amb rotació per arrossegament, quadrícula d'1 unitat al terra, cotes etiquetades, cubs per capes amb tons alterns i aigua que omple el cos.
- **Resposta adaptable**: tres columnes en escriptori i una sola columna en mòbil, amb la figura a dalt.

## 6. Tecnologia

- HTML, CSS i JavaScript sense compilació. Funciona obrint `index.html` o publicant-lo a GitHub Pages.
- Three.js r147 (CDN jsDelivr) amb OrbitControls.
- El progrés es desa a `localStorage` del navegador. No es recullen dades personals.

## 7. Fases

| Fase | Abast | Estat |
|---|---|---|
| 1 | Pla, identitat visual, Explora, 6 lliçons, pràctica amb diagnosi, reptes, progrés i xuleta | En curs (aquesta versió) |
| 2 | Proves amb alumnat, ajust de textos (A2-B1) i revisió del glossari per parlants nadius | Pendent |
| 3 | Guia del professorat, exportació de resultats (CSV o Google Sheets) i codi de sessió per a Classroom | Pendent |
| 4 | Model adaptatiu bayesià per diagnosticar errors conceptuals i nous cossos (troncs de con, cossos amb forats) | Pendent |
