# Laboratori d’equacions · 4t d’ESO
## Especificació pedagògica, funcional, visual i tècnica

**Versió del document:** 1.0 · 18 d’octubre de 2026  
**Naturalesa:** proposta de producte i criteris de desenvolupament; no és una descripció de funcions ja implementades.  
**Destinataris:** alumnat de 4t d’ESO i professorat de matemàtiques.  
**Plataforma prevista:** aplicació web autònoma en català, apta per publicar a GitHub Pages.

---

## 1. Decisió de partida: quina aplicació val la pena fer?

**La proposta no és crear un llibre de text digital, un resolutor d’equacions ni una col·lecció interminable d’exercicis.** Ja existeixen recursos excel·lents per explicar, resoldre i practicar. Una nova aplicació es justifica si fa visibles relacions que sobre el paper són difícils d’intuir.

El seu propòsit és permetre **predir, manipular, observar, justificar i comprovar**. Les preguntes centrals serien:

1. Què vol dir que un nombre sigui solució d’una equació?
2. Per què algunes transformacions conserven les solucions i d’altres no?
3. Com es relacionen una expressió algebraica, les seves solucions i una representació gràfica?
4. Per què un mateix problema pot tenir una, diverses, cap o infinites solucions?
5. Com podem reconèixer un error matemàtic encara que el resultat sembli plausible?

**Criteri editorial:** si una funció es limita a mostrar fórmules i llistes d’exercicis sense aportar interacció, comprovació raonada o visualització, no hauria de ser prioritària.

## 2. Objectius pedagògics

L’alumnat hauria de poder:

- Interpretar una equació com una igualtat entre expressions que només es compleix per determinats valors de la incògnita, o per tots o per cap, segons el cas.
- Distingir expressió algebraica, equació, identitat, contradicció, arrel o solució i conjunt solució.
- Substituir un valor, calcular els dos membres i verificar rigorosament si satisfà una equació o inequació.
- Aplicar transformacions equivalents i explicar per què preserven les solucions.
- Reconèixer quan apareixen, desapareixen o es modifiquen solucions després d’una operació no reversible.
- Relacionar equacions de primer i segon grau, inequacions, sistemes i biquadrades amb representacions adequades.
- Fer servir estratègies algebraiques, no només eines gràfiques, per arribar a solucions exactes.
- Detectar errors habituals, justificar-los i corregir-los.
- Passar progressivament de la comprensió guiada al treball autònom.

**Enfocament:** una base comuna per a tot l’alumnat i, posteriorment, un aprofundiment opcional; no dividir d’entrada l’app en dues matemàtiques diferents.

## 3. Estructura general de l’aplicació

La pàgina inicial ha de presentar sis laboratoris temàtics, un espai de pràctica i un espai d’errors. Cada laboratori seguirà el mateix patró didàctic:

1. **Pregunta o repte inicial.** Exemple: «Si sumo 5 als dos membres, canvia la solució?»
2. **Predicció de l’alumne.** Escollir una resposta o fer una estimació abans de veure el resultat.
3. **Experiment interactiu.** Canviar coeficients, operar, moure rectes o seleccionar valors.
4. **Resultat visible.** Actualitzar expressions, conjunt solució i gràfic de manera sincronitzada.
5. **Explicació curta i rigorosa.** Justificar allò que s’ha observat.
6. **Repte de transferència.** Repetir la idea amb una situació diferent, sense ajuda immediata.

### 3.1. Modes d’ús

- **Descobreix:** exploració guiada amb preguntes i pistes; ideal per començar un concepte.
- **Laboratori lliure:** controls oberts per experimentar sense itinerari predefinit.
- **Practica:** l’alumne ha de produir una resposta i rebre una correcció explicativa.
- **Mode projector (desitjable):** menys elements decoratius, fórmules i gràfics grans, possibilitat d’amagar la solució fins al moment de debat.

L’app no ha d’obligar a completar una secció per poder-ne visitar una altra.

## 4. Mòdul 0 — Què és una equació?

**Prioritat: imprescindible.** Serveix de fonament conceptual per a la resta.

### Continguts

- Diferència entre expressió algebraica i equació.
- Incògnita, membres, signe igual i domini considerat (d’entrada, nombres reals).
- Solució d’una equació: un valor que fa veritable la igualtat.
- Conjunt solució, comprovació per substitució.
- Equacions amb una solució, sense solució o amb infinites solucions.
- Diferència entre una identitat i una igualtat que només es compleix en certs valors.

### Interaccions

- Mostrar `3x + 4 = x + 12`, deixar triar `x` i mostrar simultàniament el valor numèric del membre esquerre i el del dret.
- Fer lliscar `x` per una recta numèrica i assenyalar els valors que compleixen la igualtat.
- Representar, opcionalment, `y = 3x + 4` i `y = x + 12`: la intersecció indica `x = 4`.
- Comparar `2(x + 1) = 2x + 2` (tots els reals) amb `2x + 1 = 2x + 3` (cap real).
- Microreptes: «És una equació?», «Aquest valor és solució?», «Quantes solucions té?».

**Diferencial educatiu:** fer que “ser solució” sigui una experiència de comprovació i no només l’última línia d’un procediment.

## 5. Mòdul 1 — Equacions de primer grau i equivalència

**Prioritat: màxima.** És el nucli original i probablement més útil de l’app.

### Continguts

- Equació lineal amb una incògnita.
- Sumar o restar el mateix valor als dos membres.
- Multiplicar o dividir tots dos membres per un nombre diferent de zero.
- Propietat distributiva, reducció de termes semblants i fraccions amb denominadors numèrics.
- Resolució, comprovació i classificació: una solució, cap o tots els reals.
- Transformacions equivalents enfront de passos que poden perdre o afegir solucions.

### Eines

1. **Equació editable:** inicialment `ax + b = cx + d`, amb presets seleccionables.
2. **Panell d’operacions:** `+ k`, `− k`, `× k`, `÷ k`, sempre aplicades als dos membres.
3. **Vista d’abans i després:** mostrar exactament què s’ha modificat.
4. **Historial dels passos:** tornar enrere, refer, reiniciar i comparar.
5. **Comprovador de solucions:** substituir qualsevol valor i comparar membres.
6. **Gràfic vinculat:** dues rectes `y = E(x)` i `y = D(x)`, amb la mateixa abscissa d’intersecció després d’una transformació equivalent, o bé gràfic de la diferència `E(x) − D(x)`.
7. **Explicació contextual:** per exemple, «Suma 5 als dos membres: l’equivalència es conserva».
8. **Repte invers:** mostrar una transformació i preguntar si conserva el conjunt solució.

### Regles matemàtiques importants

- No es pot dividir per zero.
- Multiplicar els dos membres per zero **no** és una transformació equivalent en general; s’ha d’impedir al laboratori d’equivalències o mostrar com a contraexemple controlat.
- Multiplicar o dividir per una expressió que contingui `x` exigeix estudiar els seus zeros i el domini; no s’ha de tractar com si fos automàticament reversible.
- No banalitzar la regla «passa a l’altre costat i canvia de signe». L’app ha de mostrar l’operació correcta sobre ambdós membres.
- Els càlculs amb fraccions han de ser exactes quan sigui possible.

### Exemples de reptes

- Resoldre `3x + 4 = x + 12` amb el menor nombre de passos justificats.
- Trobar una transformació que deixi la solució intacta.
- Fer que una equació acabi convertida en `0 = 5` o `0 = 0` i interpretar-ne el significat.
- Detectar per què dividir `x² = x` per `x` pot fer perdre la solució `x = 0` (ampliació conceptual).

## 6. Mòdul 2 — Inequacions de primer grau

**Prioritat: alta.** No convé amagar-lo dins del primer mòdul: té un concepte distintiu important.

### Continguts

- Signes `<`, `>`, `≤`, `≥`.
- Solució com a conjunt de valors, no necessàriament un únic nombre.
- Conservació o inversió del sentit d’una desigualtat segons l’operació.
- Representació en una recta numèrica amb extrems oberts o tancats.
- Notació d’intervals, si ja s’ha treballat a classe.
- Casos amb conjunt solució buit o tots els reals.

### Interaccions

- Transformar una inequació fent la mateixa operació als dos membres.
- Si l’operació és multiplicar o dividir per un nombre negatiu, invertir automàticament el signe i explicar el motiu.
- Mostrar el conjunt solució sobre una recta numèrica i actualitzar-lo en cada pas.
- Fer provar valors inclosos i exclosos, especialment els valors frontera.
- Contrastar `x > 2` amb `x ≥ 2` mitjançant cercle buit o ple i explicació textual.
- Preguntar abans de l’operació: «Canviarà el sentit del signe?».

**Exemple central:** `−2x + 3 > 7` porta a `−2x > 4` i després a `x < −2`.

**Evitar:** acolorir el conjunt sense escriure també la desigualtat o l’interval; no inferir el signe d’una expressió amb incògnita sense estudiar-ne els casos.

## 7. Mòdul 3 — Equacions de segon grau

**Prioritat: alta.** La interacció ha d’unir àlgebra i gràfic, però també ensenyar a calcular.

### Continguts

- Forma `ax² + bx + c = 0`, amb `a ≠ 0`.
- Equacions completes i incompletes.
- Factorització quan sigui senzilla, extracció d’arrel i fórmula general.
- Discriminant `Δ = b² − 4ac` i relació amb el nombre d’arrels reals distintes.
- Paràbola, talls amb l’eix X i posició del vèrtex.
- Comprovació de solucions.

### Interaccions

- Tres controls numèrics (`a`, `b`, `c`) vinculats al gràfic i al discriminant.
- Botons de casos: dues arrels reals, una de doble, cap arrel real.
- Predicció abans de revelar `Δ` i les arrels.
- Pas a pas de la fórmula general, amb substitució dels coeficients i simplificació.
- Alternativa de factorització quan sigui convenient; no forçar-la en tots els casos.
- Selecció d’una arrel per comprovar la substitució.
- Ampliació: comparar equació `f(x) = 0` i paràbola `y = f(x)`.

### Regles

- Si `a = 0`, avisar que l’equació deixa de ser de segon grau i passa a un altre cas; no corregir silenciosament `a` a `1`.
- Si `Δ < 0`, indicar «cap solució real», no afirmar «cap solució» sense precisar el domini.
- Diferenciar arrels exactes, com `(3 + √5)/2`, de la seva aproximació decimal.
- Fer que el gràfic s’escali correctament: que una arrel no sigui visible a la finestra no significa que no existeixi.

## 8. Mòdul 4 — Sistemes de dues equacions lineals

**Prioritat: alta.** La relació entre dues rectes i la resolució algebraica és molt potent.

### Continguts

- Solució comuna de dues equacions amb dues incògnites: parella ordenada `(x, y)`.
- Sistemes compatibles determinats, compatibles indeterminats i incompatibles.
- Interpretació gràfica: rectes secants, coincidents o paral·leles diferents.
- Mètodes de substitució, igualació i reducció.
- Comprovació d’una parella en totes dues equacions.

### Interaccions

- Modificar coeficients de les dues equacions i veure canvis immediats en les rectes.
- Mostrar les coordenades del punt d’intersecció, si és únic.
- Fer clic o escriure un punt candidat per verificar les dues equacions.
- Presets per als tres tipus de sistema, amb predicció prèvia.
- Resoldre el mateix sistema amb almenys dos mètodes i comparar passos.
- En mode avançat, acceptar la forma general `Ax + By = C`, perquè hi ha rectes verticals que no es poden expressar com `y = mx + n`.

**Exemple:** `y = 2x + 1` i `y = −x + 4`, solució `(1, 3)`.

**Regla crítica:** si la intersecció és fora del gràfic visible, no s’ha de concloure que el sistema no té solució. La classificació ha de basar-se en càlcul algebraic, no en inspecció visual aproximada.

## 9. Mòdul 5 — Equacions biquadrades

**Prioritat: mitjana-alta.** Té una justificació didàctica clara perquè el canvi de variable és abstracte.

### Continguts

- Forma `ax⁴ + bx² + c = 0`, amb `a ≠ 0`.
- Substitució `t = x²`; equació auxiliar `at² + bt + c = 0`.
- Restricció `t ≥ 0` si es treballa en els reals.
- Recuperació de `x`: si `t > 0`, `x = ±√t`; si `t = 0`, només `x = 0`; si `t < 0`, no hi ha cap `x` real.
- Comprovació de totes les arrels originals.

### Interaccions

- Mostrar tres nivells sincronitzats: equació original, equació en `t` i arrels en `x`.
- Etiquetar de manera raonada cada valor de `t`: admissible positiu, admissible zero o descartat negatiu.
- Representar la funció de quart grau i els seus talls amb l’eix X.
- Ocultar les solucions perquè l’alumne anticipi quantes n’hi haurà.
- Comparar casos amb cap, una, dues, tres i quatre arrels reals **distintes**.

**Exemple:** `x⁴ − 5x² + 4 = 0` dona `t = 1` i `t = 4`, i per tant `x = −2, −1, 1, 2`.

**Advertiment:** és incorrecte afirmar sempre que una biquadrada només pot tenir 0, 2 o 4 solucions reals distintes: `x⁴ − x² = 0` té tres (`−1`, `0`, `1`) i `x⁴ = 0` en té una (`0`).

## 10. Mòdul transversal — Detectiu d’errors

**Prioritat: imprescindible en una primera versió útil.** Afavoreix el raonament sobre els passos, no només la resposta.

### Tipologies de casos

- Operar només en un membre.
- Multiplicar per negatiu i no invertir el signe d’una inequació.
- Dividir per zero o per `x` sense considerar `x = 0`.
- Aplicar malament la distributiva o els signes.
- Donar només `+√t` i oblidar `−√t`.
- Acceptar `t < 0` com si fos possible `x² = t` en els reals.
- Interpretar una paràbola que no talla l’eix X com si tingués una arrel real.
- Confondre rectes paral·leles amb coincidents.
- No comprovar una solució en totes dues equacions d’un sistema.

### Mecànica

1. Mostrar una transformació o una resolució curta.
2. Preguntar «És correcte aquest pas?» i, idealment, «Per què?».
3. Deixar escollir la justificació entre diverses possibilitats o escriure una correcció curta.
4. Donar resposta específica: què s’ha trencat i com es repara.
5. Oferir un cas anàleg nou per comprovar que l’error s’ha entès.

Evitar una classificació binària sense explicació. No penalitzar experimentar al laboratori lliure.

## 11. Motor de pràctica graduada

**Prioritat: segona fase, després de garantir que els laboratoris funcionen.** Una pràctica de qualitat és millor que centenars d’operacions aleatòries poc controlades.

### Nivells

- **Nivell 1 — Comprendre:** seleccionar solucions, predir canvis de signes, interpretar gràfics.
- **Nivell 2 — Resoldre amb ajuda:** un pas cada vegada, amb pistes que no donen directament el resultat.
- **Nivell 3 — Resoldre autònomament:** introduir el resultat final i justificar algun pas.
- **Nivell 4 — Aprofundir:** casos especials, solucions paramètriques senzilles o transformacions no reversibles, només si escau a la programació.

### Funcions de correcció

- Comprovar el conjunt solució, no només una cadena de text concreta.
- Acceptar fraccions equivalents i ordre diferent de les arrels.
- Diferenciar resposta correcta, resposta parcial i error identificable.
- No donar immediatament la solució; oferir **pista 1**, **pista 2**, **pas següent** i **solució raonada**.
- Incloure exercicis prèviament verificats, amb plantilles de generació limitades i validades.
- Mostrar una síntesi de conceptes dominats i errors recurrents, sense una classificació competitiva entre alumnes.

**Limitació tècnica conscient:** corregir qualsevol pas algebraic escrit lliurement és una funció complexa. A la primera versió es recomanen operacions estructurades i entrades matemàtiques acotades; una entrada completament lliure només quan hi hagi un motor simbòlic fiable.

## 12. Funcions transversals de tota l’app

### 12.1. Sistema d’ajuda i explicacions

Cada laboratori tindrà:

- Definició breu i rigorosa.
- Exemple complet com a referència, plegable per no interferir amb l’exploració.
- Botó «Per què?» al costat dels punts conceptualment delicats.
- Pistes graduades, i no només un botó «Mostra la resposta».
- Glossari accessible dels termes (membre, discriminant, arrel doble, inequació equivalent...).

### 12.2. Historial i control

- Desfer, refer i reiniciar sense perdre el problema original.
- Recuperar la configuració d’exemple.
- Poder compartir un enllaç a una activitat configurada (mòdul, coeficients, mode) sense incloure dades personals.
- Opció d’amagar les respostes per formular hipòtesis abans de revelar-les.

### 12.3. Visualitzacions vinculades

Les representacions algebraica, gràfica, numèrica i verbal han de reflectir **el mateix estat matemàtic**, amb la mateixa precisió conceptual. Canviar un coeficient ha d’actualitzar resultats i gràfics alhora.

### 12.4. Diferenciació

L’accés inicial i la seqüència són comuns per a tot el grup. Les ajudes es poden activar o retirar, i es poden oferir reptes addicionals sense bloquejar la versió bàsica.

## 13. Disseny visual i experiència d’ús

### Identitat visual

- Aspecte contemporani, net, matemàtic i juvenil; **no infantilitzat**.
- Fons clar, text fosc i una paleta curta (blau marí o petroli per a estructura; turquesa per a accions; ocre per a observacions; vermell només per a errors rellevants).
- Colors consistents per identificar els dos membres o les dues funcions, però mai com a únic mitjà d’informació.
- Tipografia llegible, fórmules clarament diferenciades i contrast suficient.
- Animacions breus i opcionals només quan ajudin a seguir una transformació.

### Estructura de pantalla recomanada

**Capçalera:** nom del laboratori, navegació, selector de mode i ajuda.  
**Columna esquerra (ordinador):** repte, expressió actual, controls i accions.  
**Columna dreta:** gràfic o visualització principal.  
**Zona inferior:** conjunt solució, historial, comprovació i explicacions.

En tauletes i mòbils, aquests espais passen a una disposició vertical. No s’ha de perdre la possibilitat de fer servir el teclat o veure els resultats sense haver de desplaçar-se constantment.

### Requisits d’usabilitat

- Els controls numèrics han de permetre tant lliscar com **escriure un valor exacte**.
- Les gràfiques han de tenir eixos, graduació, zoom, restabliment i indicadors textuals de solucions.
- La notació s’ha de mantenir coherent en català: `−`, `≤`, `≥`, `≠`, exponents, fraccions i radicals.
- S’ha d’admetre la coma decimal en la introducció, i idealment també el punt.
- Els missatges d’error han de dir què passa i com corregir-ho, sense limitar-se a «Entrada no vàlida».
- Evitar pantalles carregades; una idea principal per experiment.

### Accessibilitat

Assumir com a objectiu **WCAG 2.2 nivell AA**: navegació amb teclat, focus visible, contrast, etiquetes accessibles, controls tàctils suficients, alternatives textuals als gràfics, absència de dependència exclusiva del color i preferència per moviment reduït. Les fórmules han de disposar d’una representació accessible.

## 14. Rigor matemàtic i limitacions que no es poden negociar

1. **Precisió:** calcular fraccions racionalment de forma exacta quan el problema ho permeti; evitar comparar nombres decimals amb igualtat estricta a causa dels errors de coma flotant.
2. **Solucions exactes:** mostrar `√2` o una fracció si és exacta; l’aproximació decimal es pot afegir però no substituir la forma exacta.
3. **Dominis:** indicar sempre que es treballa en els reals, sobretot per al segon grau i les biquadrades.
4. **Condicions de les operacions:** descartar divisió per zero i diferenciar equivalència d’implicació quan es fan operacions no reversibles.
5. **Casos degenerats:** coeficients nuls, identitats, contradiccions, arrels repetides, sistemes dependents i desigualtats sempre certes o sempre falses.
6. **Gràfics:** cap decisió algebraica essencial pot dependre només dels píxels del dibuix o de la finestra visible.
7. **Comprovacions:** validar substituint a les expressions originals, no només en una forma transformada.
8. **Entrades:** limitar clarament quines famílies d’equacions són admeses. No acceptar aparentment expressions que el motor no sap interpretar correctament.
9. **Explicacions:** evitar regles mnemotècniques enganyoses o frases que confonguin exemple i teorema.
10. **Consistència:** la resposta, la gràfica, el pas seleccionat i les pistes han de procedir d’un mateix model intern.

## 15. Arquitectura tècnica proposada

### Plataforma

Aplicació web que funcioni en navegadors actuals, sense compte d’usuari, instal·lacions o servidor. Publicació senzilla a **GitHub Pages**. Funcionalitat principal disponible sense connexió, amb biblioteques locals si se’n necessiten.

### Separació de responsabilitats

- **Nucli matemàtic:** model d’expressions, operacions racionals, resolució de cada família, classificació de casos i validacions.
- **Motor didàctic:** reptes, preguntes, pistes, solucions raonades i criteris de correcció.
- **Visualització:** rectes numèriques, rectes del pla, paràboles, funcions biquadrades i historial.
- **Interfície:** navegació, formularis, botons, modalitats i accessibilitat.
- **Banc d’activitats:** exemples i casos especials editables, independents del codi visual.
- **Proves automàtiques:** unitàries i d’integració, especialment sobre el nucli matemàtic.

No cal adoptar un framework complex si el projecte pot mantenir-se amb HTML, CSS i JavaScript modular. Un motor d’expressions matemàtiques segur pot incorporar-se quan el corrector el requereixi; **no fer servir `eval` amb les entrades de l’alumnat**.

### Privacitat

- No recollir noms, correus ni dades personals per defecte.
- Si es desa el progrés, fer-ho localment i explicitar-ne les limitacions; no presentar-lo com un registre docent fiable.
- Sense seguiment publicitari ni serveis externs imprescindibles.
- Si en un futur hi ha identificació d’alumnes, definir abans la necessitat, la base legal, l’accés i la política de conservació.

## 16. Eines per al professorat (ampliació prioritària, però no inicial)

- Obrir directament un exercici o laboratori amb coeficients concrets mitjançant un enllaç.
- Preparar itineraris breus de 10–20 minuts amb una selecció de reptes.
- Desactivar temporalment la resposta o les pistes en mode projector.
- Exportar una fitxa imprimible de preguntes d’observació i una pauta de solucions.
- Afegir exercicis al banc mitjançant un arxiu de dades simple, sense haver de modificar la lògica de l’app.
- Opcionalment, resum anònim o voluntari del treball realitzat per l’alumne. No començar per un quadre de comandament amb comptes.

## 17. Pla de desenvolupament per fases

| Fase | Contingut | Condició d’èxit |
|---|---|---|
| **0 — Revisió del prototip** | Revisar el laboratori ja creat (equivalències, inequacions, segon grau, biquadrades, sistemes i errors) i documentar mancances. | Detectar i corregir defectes conceptuals abans d’afegir funcions. |
| **1 — Nucli didàctic** | Què és una equació, equivalència pas a pas, inequacions amb recta numèrica, justificacions, historial, predicció i comprovació. | L’alumnat explica per què una transformació és correcta. |
| **2 — Relacions algebra-gràfic** | Acabar i reforçar segon grau, sistemes i biquadrades, amb solucions exactes, casos límit i activitats guiades. | L’alumnat connecta mètode, solució i visualització. |
| **3 — Pràctica i feedback** | Exercicis graduats, corrector de respostes, pistes i detectiu d’errors ampliat. | Es pot practicar autònomament sense obtenir simplement la resposta. |
| **4 — Ús docent i refinament** | Enllaços a activitats, mode projector, fitxes, accessibilitat completa, banc de casos i proves amb alumnat. | L’eina és estable i útil dins d’una sessió real. |

**Ordre de prioritat:** invertir primer en profunditat i correcció del laboratori d’equivalències; després en la qualitat de les representacions i, només finalment, en la quantitat d’exercicis.

## 18. Proves d’acceptació indispensables

L’app no s’hauria de donar per acabada fins que superi, com a mínim, aquests casos:

| Prova | Resultat esperat |
|---|---|
| `3x + 4 = x + 12` | Solució `x = 4`; totes les transformacions equivalents la conserven. |
| `2(x + 1) = 2x + 2` | Tots els nombres reals. |
| `2x + 1 = 2x + 3` | Cap solució real. |
| Multiplicar una equació per zero | No presentar-ho com una equivalència reversible. |
| `−2x + 3 > 7` | `x < −2`, amb extrem obert. |
| `x² − 5x + 6 = 0` | Arrels `2` i `3`. |
| `x² + 1 = 0` | Cap arrel real, no «cap solució» sense qualificació. |
| Canviar `a` a zero en una quadràtica | Reclassificar-la o advertir; mai substituir el valor silenciosament. |
| `y = 2x + 1`, `y = −x + 4` | Única solució `(1, 3)`. |
| Dues rectes coincidents | Infinites solucions. |
| Dues rectes paral·leles diferents | Cap solució. |
| Intersecció fora de la finestra gràfica | Continuar mostrant que existeix una solució algebraica. |
| `x⁴ − 5x² + 4 = 0` | Quatre arrels `−2, −1, 1, 2`. |
| `x⁴ − x² = 0` | Tres arrels distintes `−1, 0, 1`. |
| `x⁴ = 0` | Una sola arrel distinta `0`. |
| `x² = x` i divisió per `x` | Advertiment de possible pèrdua de `x = 0`. |
| Pantalla de mòbil, teclat i lector de pantalla | Les funcions essencials continuen accessibles. |

També cal provar valors extrems, nombres negatius, fraccions, decimals, restabliments, canvi de pestanya i desconnexió.

## 19. Com comprovar si val la pena a classe

Abans de construir les funcions més costoses, fer una sessió pilot de 15–20 minuts amb un grup real:

1. **3 minuts:** triar valors de `x` i comprovar què és una solució.
2. **5 minuts:** predir què passa en sumar, restar o dividir als dos membres.
3. **4 minuts:** transformar una inequació amb un factor negatiu i justificar el canvi de signe.
4. **4 minuts:** experimentar amb les arrels d’una quadràtica o el punt d’intersecció d’un sistema.
5. **3 minuts:** identificar un pas incorrecte al detectiu d’errors.

**Observació important:** després de fer servir l’app, demanar a l’alumne que resolgui *en paper* un exercici nou i que expliqui una transformació. Si només sap manipular controls, però no millora la justificació o la transferència, cal repensar la funcionalitat.

## 20. Què no hauria de ser l’app

- Una còpia digital del dossier de teoria.
- Una calculadora que ho resolgui tot amb un clic.
- Un videojoc carregat de recompenses, punts i animacions que distreguin del concepte.
- Un generador de centenars d’equacions sense explicacions ni control de qualitat.
- Un gràfic bonic que ofereixi conclusions matemàtiques aproximades o falses.
- Una plataforma de seguiment d’alumnes que compliqui l’accés, la privacitat o el manteniment.

## 21. Relació amb el prototip existent

**Ja existeix una primera demostració** amb un laboratori d’equivalències i inequacions, coeficients manipulables de segon grau i biquadrades, gràfics de sistemes i un detectiu d’errors. És una bona prova de concepte, però **no es pot donar per fet** que ja implementi totes les funcions aquí descrites.

Els buits més rellevants a cobrir són: introducció conceptual ordenada; preguntes de predicció abans de revelar respostes; resolució guiada completa de segon grau i sistemes; representació específica d’inequacions en una recta numèrica; corrector d’exercicis i pistes; gestió exhaustiva dels casos especials; precisió simbòlica i proves matemàtiques; eines docents.

## 22. Criteri final per decidir si s’ha de desenvolupar

**El projecte es justifica si l’alumnat pot entendre, amb menys intervenció del professor i amb més solidesa, almenys aquestes tres idees:**

1. Per què dos procediments poden ser equivalents i conservar exactament les mateixes solucions.
2. Per què el nombre i el tipus de solucions es poden interpretar, comprovar i explicar des de diferents representacions.
3. Per què una operació aparentment natural pot ser matemàticament incorrecta.

**Recomanació:** construir l’app com un *laboratori de raonament algebraic*, amb uns quants experiments excel·lents i rigorosos, abans que com una gran plataforma de tot el temari. La profunditat pedagògica ha de governar l’abast, i no a l’inrevés.

---

### Referències de context per al disseny

- Generalitat de Catalunya, XTEC: [Currículum de l’ESO — Decret 175/2022](https://xtec.gencat.cat/ca/curriculum/eso/curriculum-175-2022/).
- W3C: [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/wcag/).

*Aquest document defineix un horitzó de desenvolupament. Les fases i prioritzacions són propostes de disseny que es poden ajustar després de provar-les amb l’alumnat.*
