<div align="center">

# 📈 Graficadora de funcions

Aplicació web en català per representar funcions, equacions, inequacions i sistemes, i descobrir-ne les característiques

![Català](https://img.shields.io/badge/llengua-català-0f766e)
![ESO i Batxillerat](https://img.shields.io/badge/nivell-ESO%20i%20Batxillerat-1e3a5f)
![Sense instal·lació](https://img.shields.io/badge/funciona-al%20navegador-d97706)
![Llicència](https://img.shields.io/badge/llicència-CC%20BY--NC--SA%204.0-555)

![La graficadora amb una paràbola, una recta i una funció trigonomètrica](docs/captures/01-inici.png)

**[▶ Obre l'aplicació](https://felipsarroca.github.io/edu-apps/GraphMath/)**

</div>

---

## Índex

1. [Què és](#què-és)
2. [Primers passos](#primers-passos)
3. [Com s'escriu](#com-sescriu)
4. [Què pots representar](#què-pots-representar)
5. [La gràfica](#la-gràfica)
6. [Estudi de la funció](#estudi-de-la-funció)
7. [Paràmetres i animació](#paràmetres-i-animació)
8. [Sistemes](#sistemes)
9. [Gestionar les funcions](#gestionar-les-funcions)
10. [Idees per a l'aula](#idees-per-a-laula)
11. [Problemes freqüents](#problemes-freqüents)
12. [L'ajuda integrada](#lajuda-integrada)
13. [Accés i execució](#accés-i-execució)
14. [Estructura del codi](#estructura-del-codi)
15. [Privacitat](#privacitat)
16. [Referències curriculars](#referències-curriculars)
17. [Autoria i llicència](#autoria-i-llicència)

Els apartats 2 a 11 recullen el mateix contingut que l'ajuda integrada de l'aplicació (botó ⓘ), en el mateix ordre.

---

## Què és

La **Graficadora de funcions** dibuixa el que s'escriu tal com es faria a mà —funcions, equacions, inequacions, corbes i sistemes— i n'explica les característiques: talls amb els eixos, vèrtex, pendent, màxims i mínims, creixement, signe, asímptotes i discontinuïtats.

Està pensada per a dos usos:

- 👩‍🏫 **El professorat**, per mostrar funcions a l'aula de manera àgil: lliscadors animats per als paràmetres, elements que es destaquen amb un clic, vista que s'ajusta sola i captures en alta resolució per a fitxes i presentacions.
- 🧑‍🎓 **L'alumnat**, per provar funcions i equacions i aprendre'n: el punter segueix la corba i en dona les coordenades exactes, l'estudi s'actualitza a l'instant i, quan una equació no té solució, una explicació breu en diu el motiu.

Altres característiques:

- 🖥️ Funciona en ordinador, tauleta, mòbil i pissarra digital, amb quatre temes de color: clar, fosc, pissarra i alt contrast.
- 🧮 Els resultats exactes es mostren com a enters, fraccions o múltiples de π; els aproximats porten el signe ≈.
- 💾 Tot es desa automàticament al navegador: funcions, paràmetres i opcions de vista.

## Primers passos

1. Prem **«+ Afegir»**. S'obre l'editor.
2. **Escriu l'expressió** amb el teclat de l'ordinador o amb el de l'editor. A sota veuràs si s'ha entès (✓ verd) o què cal corregir (en vermell), i una previsualització ben escrita.
3. Prem **«Afegeix a la gràfica»** o Retorn. La vista s'ajusta sola perquè se'n vegin els punts importants.
4. **Explora-la.** Passa el ratolí (o el dit) per sobre de la corba per llegir-ne coordenades i obre ⓘ a la seva targeta per veure'n l'estudi complet.

Per començar, prova alguna d'aquestes expressions: una paràbola (`y = x^2 − 2x − 3`), una equació (`x^2 − 5x + 6 = 0`), un sistema (`2x + 3y = 7` i `x − y = 1`) o una funció amb paràmetres (`y = a(x − h)^2 + k`).

### Les parts de la pantalla

| Zona | Què hi trobes |
|---|---|
| **Capçalera** | ☰ panell lateral · «+ Afegir» · 💾 desa la imatge · menú de vista · tema de color · ⓘ ajuda |
| **Gràfica** | Es mou arrossegant. A la cantonada: + i − (zoom), ⤢ (ajusta la vista) i ⌂ (vista inicial) |
| **Panell lateral** | Paràmetres (si n'hi ha) i una targeta per a cada funció, equació o sistema |

> 💾 Tot es desa automàticament en aquest navegador: funcions, paràmetres i opcions de vista. Quan hi tornis, ho trobaràs tal com ho vas deixar.

## Com s'escriu

Pots escriure com ho faries a mà. L'editor entén aquestes formes:

| Què | S'escriu | Exemple |
|---|---|---|
| Potència | `^`, `²`, `³` | `x^2`, `2^x`, `x^(1/3)` |
| Producte | sense signe, o amb `·` o `*` | `2x`, `3(x+1)`, `2·x` |
| Fracció | `/` amb parèntesis | `(x+1)/(x−2)` |
| Arrels | `sqrt`, `√`, `∛`, `cbrt` | `√(x+4)`, `∛(x)` |
| Valor absolut | `\| \|` o `abs` | `\|x − 2\|` |
| Trigonometria | `sin` (o sen), `cos`, `tan` (o tg), `arcsin`… | `2sin(x)` |
| Logaritmes | `ln` (neperià), `log` (base 10), `log(x, b)` | `log(x, 2)` |
| Exponencial | `e^` o `exp` | `e^(−x)` |
| Constants | `π` (o pi) i `e` | `y = πx` |
| Decimals | amb coma o amb punt | `2,5x`, `2.5x` |
| Desigualtats | `<`, `>`, `≤`, `≥` (o `<=`, `>=`) | `y ≥ x² − 1` |
| Nom de funció | `f(x) =`, `g(x) =`… | `f(x) = 3x − 1` |
| Domini restringit | després d'una coma o d'un punt i coma | `y = x², −2 < x < 2` |
| Arrodoniments | `floor`, `ceil`, `round` | `y = floor(x)` |
| Paràmetres | `a b c d h k m n p q r s t u v w` | `y = a(x − h)^2 + k` |

> ⚠️ **Compte amb els parèntesis:** `1/x − 2` no és el mateix que `1/(x − 2)`, ni `sin x^2` és el mateix que `(sin x)^2`. Mira la previsualització per comprovar que s'ha entès el que volies.

> 💡 Les funcions trigonomètriques treballen en **radiants**: `sin(π/2) = 1`.

### El teclat de l'editor

| Color | Tecles |
|---|---|
| 🟩 Verd | Variables i constants: x, y, π |
| 🟪 Lila | Plantilles: x², xⁿ, √, fracció, \|□\|, eˣ. Si tens text seleccionat, el fiquen a dins. |
| 🟨 Groc | Relacions: =, <, >, ≤, ≥ |
| 🟦 Blau | Operacions i parèntesis |
| 🟥 Rosa | Mou el cursor (← →), esborra i buida el camp |

El botó **«Més funcions»** desplega sin, cos, tan, ln, log, ∛, e i x⁻¹. Les tecles de funció ja escriuen el parèntesi i deixen el cursor a dins.

![L'editor amb el teclat matemàtic, la validació i la previsualització](docs/captures/02-editor.png)

L'editor separa sol el domini quan s'escriu a la mateixa línia (`f(x) = (x² − 4)/(x − 1), −3 < x < 5`) i avisa dels paràmetres que hi ha trobat.

## Què pots representar

| Tipus | Exemple | Què fa l'aplicació |
|---|---|---|
| **Funció** | `y = x^2/2 − 1,5` | Dibuixa la gràfica i en fa l'estudi complet: domini, talls, vèrtex, extrems, creixement, signe i asímptotes. |
| **Equació amb una incògnita** | `x^2 − 5x + 6 = 0` | Marca les solucions sobre l'eix X. Es dibuixa la corba auxiliar y = (1r membre − 2n membre): les solucions són on talla l'eix. En les de segon grau, també en marca el vèrtex. |
| **Inequació amb una incògnita** | `2x − 2 > 0` | Pinta l'interval solució sobre l'eix X. Un punt buit vol dir que l'extrem no hi entra (< o >); un punt ple, que sí (≤ o ≥). |
| **Inequació amb dues incògnites** | `y > x/2 − 0,5` | Pinta la regió del pla que la compleix. Si la vora no hi entra (< o >), es dibuixa discontínua. |
| **Corbes i rectes en forma general** | `x^2 + y^2 = 9` | Circumferències (n'indica el centre i el radi), el·lipses, rectes com `2x + 3y = 7` sense haver d'aïllar la y, o corbes x = g(y). |
| **Interval** | `−1 < x < 1,5` | Pinta la franja vertical corresponent. Útil per assenyalar una zona de la gràfica. |
| **Sistema d'equacions** | `2x + 3y = 7` ; `x − y = 1` | Cada equació amb el seu color i el punt solució marcat. Vegeu [Sistemes](#sistemes). |

![Una inequació amb dues incògnites i una amb una incògnita](docs/captures/06-inequacions.png)

## La gràfica

| Per… | Amb ratolí | En pantalla tàctil |
|---|---|---|
| Desplaçar-te | Arrossega | Arrossega amb un dit (lluny de les corbes) |
| Apropar o allunyar | Roda del ratolí o botons + i − | Pessiga amb dos dits |
| Llegir coordenades | Passa el punter per sobre de la corba | Toca la corba i llisca-hi el dit |
| Veure-ho tot | ⤢ ajusta la vista a les funcions | Igual |
| Tornar a començar | ⌂ vista inicial (i escala ×1) | Igual |

### Seguir la corba

- El punter s'enganxa a la corba més propera i mostra el punt `(x; y)` amb el color de la funció.
- Avança per valors rodons de x segons el zoom: de 0,1 en 0,1 amb el zoom normal, i de 0,5 en 0,5 o d'1 en 1 si t'allunyes. La y es calcula exactament en aquell valor; així és fàcil aturar-se a x = 4 i llegir-ne el valor exacte.
- Prop d'un punt destacat (arrels, vèrtex, tall de sistemes…), el punter s'hi enganxa i en mostra l'etiqueta.

### El menú de vista

- **Quadrícula, nombres dels eixos i etiquetes dels punts:** amaga el que no calgui per tenir una gràfica neta (per exemple, per demanar a l'alumnat que llegeixi les coordenades).
- **Escala de l'eix Y:** estira o encongeix només l'eix vertical. Amb ×0,1 caben funcions que creixen molt (y = 50x, y = 2ˣ); amb ×10 es veuen bé variacions petites. Quan l'escala no és ×1, apareix un avís a dalt a l'esquerra de la gràfica.

> 💡 En afegir o editar una funció, la vista s'ajusta sola, i si cal també tria una escala de l'eix Y adequada. Si et perds, prem ⤢.

### Imatge i aspecte

- 💾 Descarrega la gràfica en **PNG a alta resolució** (tres o quatre vegades la de la pantalla), amb la llegenda de les expressions. Queda nítida en un document, una presentació, el Classroom o imprès.
- Canvia el **tema**: clar, fosc, pissarra i alt contrast (el més llegible amb un projector).

## Estudi de la funció

Prem ⓘ a la targeta d'una funció per obrir-ne l'estudi. Les dades s'actualitzen soles quan mous un paràmetre.

> 📍 Al costat de molts apartats hi ha el botó **«Mostra»**: destaca aquell element a la gràfica (eix de simetria, talls, extrems o asímptotes). El vèrtex de les paràboles i el pendent de les rectes ja surten marcats; si no els vols, prem «A la gràfica» per amagar-los.

| Apartat | Què indica |
|---|---|
| **Domini** | Valors de x per als quals la funció existeix. Per exemple, `y = 1/(x − 2)` té domini ℝ − {2} i `y = √x`, [0, +∞). Si has restringit el domini, s'hi indica. |
| **Talls amb els eixos** | El tall amb l'eix Y és f(0). Els talls amb l'eix X (arrels) són les solucions de f(x) = 0. Els valors exactes es mostren com a fraccions o múltiples de π; els aproximats, amb ≈. |
| **Vèrtex i eix de simetria** | En les paràboles. El vèrtex és el punt més baix (o més alt) i l'eix de simetria és la recta vertical que hi passa. El vèrtex es marca a la gràfica automàticament (V) i també apareix a la targeta. Se'n mostren, a més, el discriminant i el tipus d'arrels. |
| **Pendent de les rectes** | En les funcions lineals i afins (y = mx + n), el pendent m i l'ordenada a l'origen n. A la gràfica es dibuixa el triangle del pendent: quant puja (o baixa) la recta quan avança cap a la dreta. El pendent també apareix a la targeta. |
| **Màxims i mínims relatius** | Punts on la funció passa de créixer a decréixer (màxim) o al revés (mínim). Amb «Mostra» apareixen marcats com a «Màx» i «Mín». |
| **Creixement** | Intervals on la funció creix i on decreix, en notació d'intervals: `(−∞, −1) ∪ (1, +∞)`. |
| **Signe** | Intervals on f(x) > 0 (la gràfica és per sobre de l'eix X) i on f(x) < 0 (per sota). És la base per resoldre inequacions. |
| **Asímptotes** | Rectes a les quals la gràfica s'acosta indefinidament. Les verticals (x = a) apareixen on la funció «s'escapa» a l'infinit; les horitzontals (y = b), quan x → +∞ o x → −∞. |
| **Discontinuïtat evitable (forat)** | En `y = (x² − 4)/(x − 2)` la funció no existeix a x = 2, però a prop s'acosta a 4. La gràfica hi mostra un punt buit a (2, 4). |
| **Arrels periòdiques** | Les funcions trigonomètriques tenen infinites arrels. Se'n mostren unes quantes properes a 0 (… −π, 0, π, 2π …) i la forma general, per exemple `x = kπ (k ∈ ℤ)`. |
| **Explicacions** | Quan una equació no té solució, en té infinites o una funció no talla l'eix X, una línia amb una bombeta 💡 n'explica el motiu (per exemple, que el discriminant és negatiu). |

![Estudi d'una funció racional amb l'asímptota vertical, el màxim i el mínim marcats](docs/captures/03-estudi.png)

> ℹ️ L'estudi és numèric: les arrels i els extrems es busquen entre x = −100 i x = 100. Fora d'aquest interval, o en funcions molt irregulars, pot no trobar-los tots. Detecta les asímptotes verticals i horitzontals, però no les obliqües.

## Paràmetres i animació

Si escrius una lletra que no és x ni y, es converteix en un **paràmetre** i a dalt del panell lateral apareix un lliscador per canviar-ne el valor. La gràfica i l'estudi s'actualitzen a l'instant.

Lletres disponibles: `a b c d h k m n p q r s t u v w`. Si dues funcions fan servir la mateixa lletra, comparteixen lliscador.

| Control | Què fa |
|---|---|
| Lliscador | Canvia el valor del paràmetre. |
| ▶ | Anima el paràmetre: va i ve sol entre el mínim i el màxim. Prem-lo de nou per aturar-lo. |
| ⚙ | Tria el mínim, el màxim i el pas (per defecte, de −5 a 5 de 0,1 en 0,1). |

### Exemples per explorar

| Expressió | Què s'hi veu |
|---|---|
| `y = m x + n` | Pendent i ordenada a l'origen |
| `y = a(x − h)^2 + k` | Forma canònica de la paràbola |
| `y = a x^2 + b x + c` | Coeficients i discriminant |
| `y = a sin(b x)` | Amplitud i període |
| `y = a^x` | Exponencials creixents i decreixents |
| `(x − a)^2 + (y − b)^2 = r^2` | Circumferència de centre (a, b) |

![La forma canònica de la paràbola amb lliscadors per a a, h i k](docs/captures/04-parametres.png)

## Sistemes

1. **Obre l'editor** amb «+ Afegir» i tria la pestanya «Sistema».
2. **Escriu una equació a cada línia.** Amb «Afegeix una equació» en pots posar més de dues.
3. **Desa-ho.** Cada equació es dibuixa d'un color i les solucions apareixen com a punts, també a la targeta.

> 💡 Els sistemes lineals es resolen de manera exacta i se'n diu el tipus: **compatible determinat** (un punt), **incompatible** (rectes paral·leles, sense solució) o **compatible indeterminat** (la mateixa recta, infinites solucions). Els no lineals (paràboles, circumferències…) es resolen numèricament.

| Exemple | Equacions |
|---|---|
| Lineal | `2x + 3y = 7` ; `x − y = 1` |
| Incompatible | `y = 2x + 1` ; `y = 2x − 3` |
| Paràbola i recta | `y = x^2` ; `y = x + 2` |
| Circumferència i recta | `x^2 + y^2 = 25` ; `y = x + 1` |

Per canviar el color d'una equació concreta, prem el seu punt de color a la targeta.

![Sistema d'una circumferència i una recta amb el tema pissarra](docs/captures/05-sistema.png)

## Gestionar les funcions

| Icona | Què fa |
|---|---|
| 👁 Ull | Mostra o amaga la funció sense esborrar-la. Útil per presentar les funcions d'una en una. |
| ⓘ Informació | Obre o tanca l'estudi de la funció. |
| 🔵 Punt de color | Canvia el color (en un sistema, el de cada equació). |
| ✏️ Llapis | Edita l'expressió. |
| 🗑 Paperera | Esborra-la. |
| ☰ Menú | A la capçalera, obre o tanca el panell lateral (en mòbil, també amb ×). |

<div align="center">

<img src="docs/captures/08-mobil.png" alt="La graficadora en un mòbil" width="260">&nbsp;&nbsp;&nbsp;<img src="docs/captures/09-mobil-panell.png" alt="El panell de funcions en un mòbil" width="260">

*En mòbils i tauletes, el panell lateral s'obre i es tanca amb ☰.*

</div>

## Idees per a l'aula

- 🙈 **Predir abans de veure.** Escriu la funció i amaga-la amb l'ull. Demana a l'alumnat que en predigui la forma, els talls o el vèrtex, i després mostra-la i obre l'estudi per comprovar-ho.
- 🎚️ **Què fa cada paràmetre?** Escriu `y = a(x − h)^2 + k` i anima un paràmetre cada vegada. L'alumnat descriu què canvia (obertura, desplaçament horitzontal o vertical) i ho formula com a regla.
- 🔢 **Lectura de gràfiques.** Amaga els nombres dels eixos o les etiquetes dels punts (menú de vista) i demana que estimin coordenades, extrems o intervals de creixement. Després ho comproveu amb el punter.
- 🟰 **Resolució gràfica d'equacions i sistemes.** Compara la solució algebraica amb la gràfica: una equació de segon grau amb Δ < 0 no talla l'eix X; un sistema incompatible són rectes paral·leles.
- ≥ **Inequacions i signe.** Escriu `x² − 4 ≥ 0` i `y = x² − 4` alhora: l'interval solució coincideix amb la part on la paràbola és per sobre de l'eix X.
- 📈 **Modelització.** Planteja una situació real (tarifa de telèfon, població que creix, preu amb descompte), deixa que l'alumnat proposi el model amb paràmetres i l'ajusti amb els lliscadors.

> 🖼️ Per a fitxes i presentacions: tema clar o d'alt contrast, quadrícula activada i 💾 per descarregar la imatge.

## Problemes freqüents

<details>
<summary><strong>L'editor diu que hi ha un error</strong></summary>

Llegeix el missatge en vermell: indica què falta (un parèntesi, un exponent…) o quina lletra no reconeix. Revisa sobretot els parèntesis de fraccions i funcions.
</details>

<details>
<summary><strong>No veig la gràfica</strong></summary>

Comprova que l'ull de la targeta estigui actiu i prem ⤢ per ajustar la vista. Si la funció creix molt, prova una escala de l'eix Y més petita al menú de vista. Si hi ha un domini restringit, només es dibuixa en aquell tros.
</details>

<details>
<summary><strong>Per què uns valors porten ≈?</strong></summary>

Perquè són aproximats (per exemple, √2 ≈ 1,41). Els exactes es mostren com a enters, fraccions o múltiples de π.
</details>

<details>
<summary><strong>Com escric 2,5 si la coma separa el domini?</strong></summary>

Una coma entre dues xifres és sempre decimal (`2,5x`). La coma que separa el domini ha d'anar seguida d'un espai o d'una expressió: `y = x², −2 < x < 2`. Si vols, separa'l amb punt i coma.
</details>

<details>
<summary><strong>Una lletra s'ha convertit en un lliscador</strong></summary>

Les lletres diferents de x i y es tracten com a paràmetres. Si volies multiplicar, escriu el número: `2x` en lloc de `ax`.
</details>

<details>
<summary><strong>No surten les novetats de l'aplicació</strong></summary>

El navegador pot tenir guardada una versió antiga. Recarrega la pàgina amb **Ctrl + F5** (o **Cmd + Maj + R** a Mac).
</details>

<details>
<summary><strong>On es desen les meves funcions?</strong></summary>

Només en aquest navegador i en aquest dispositiu. Si n'esborres les dades o canvies d'ordinador, no hi seran. Per conservar una gràfica, descarrega-la en imatge.
</details>

## L'ajuda integrada

Tot el contingut dels apartats anteriors és també dins l'aplicació, al botó ⓘ de la capçalera:

- 🔎 **Cercador** per trobar un tema escrivint-ne una paraula («asímptota», «zoom»…).
- 🖼️ **Il·lustracions** per a cada concepte i **desplegables** per no carregar la pantalla.
- ▶ **Botons «Prova-ho»** que afegeixen l'exemple a la gràfica directament.
- Navegació per temes i botó per passar al tema següent; recorda l'últim tema consultat.

![L'ajuda integrada, amb el tema «Què pots representar»](docs/captures/07-ajuda.png)

## Accés i execució

- **App a GitHub Pages:** <https://felipsarroca.github.io/edu-apps/GraphMath/>
- **Codi font:** <https://github.com/felipsarroca/edu-apps/tree/main/GraphMath>

No cal instal·lar res ni compilar: totes les biblioteques són a la carpeta `vendor`. Per executar-la localment cal servir la carpeta amb un servidor web estàtic, perquè el navegador no carrega els mòduls JavaScript des de `file://`. Per exemple:

```bash
cd GraphMath
python -m http.server 8000
```

i obrir <http://localhost:8000>.

## Estructura del codi

```
index.html                         carcassa, mapa d'importacions i càrrega de MathJax
index.js                           punt d'entrada de React
App.js                             estat global: funcions, paràmetres, vista i desament
constants.js                       colors, temes i elements destacats per defecte
styles.css                         estils base
services/parser.js                 analitzador propi: text → arbre → funció, LaTeX i polinomi (sense eval)
services/mathService.js            classificació, arrels, sistemes, domini, extrems, asímptotes i formatació
components/Graph.js                llenç: dibuix, zoom, desplaçament, punter i captura en alta resolució
components/EquationEditorModal.js  editor amb validació en directe i domini en línia
components/MathKeyboard.js         teclat matemàtic
components/MathExpression.js       fórmules amb MathJax
components/SidePanel.js            targetes i estudi de cada funció
components/ParametersPanel.js      lliscadors i animació dels paràmetres
components/ViewMenu.js             menú de vista i escala de l'eix Y
components/InfoModal.js            ajuda integrada amb il·lustracions
components/Header.js               capçalera
components/ThemeSwitcher.js        canvi de tema
vendor/                            React, Tailwind, MathJax i Font Awesome, en local
docs/captures/                     captures de pantalla d'aquest README
```

## Privacitat

- No cal cap registre ni es recull cap dada personal.
- Tot es desa només al **navegador** (`localStorage`): les funcions, els paràmetres, les opcions de vista i l'últim tema de l'ajuda consultat.
- Si s'esborren les dades del lloc al navegador o es canvia de dispositiu, les funcions no hi seran. Per conservar una gràfica, es pot desar com a imatge.

## Referències curriculars

L'aplicació dona suport als sabers del **sentit algebraic** i de les **funcions** de l'ESO i del Batxillerat que estableixen el [Decret 175/2022](https://xtec.gencat.cat/ca/curriculum/eso/curriculum-175-2022/) (educació bàsica) i el Decret 171/2022 (Batxillerat) a Catalunya, desplegament de la LOMLOE:

- Representació i interpretació de funcions lineals, afins, quadràtiques, de proporcionalitat inversa, exponencials, logarítmiques i trigonomètriques.
- Característiques d'una funció: domini, talls amb els eixos, creixement, extrems, signe, asímptotes i continuïtat.
- Resolució gràfica d'equacions, inequacions i sistemes.
- Estudi de famílies de funcions a partir dels seus paràmetres.

També hi són presents les competències de **raonament i prova** (predir i comprovar), **connexions** (expressió algebraica ↔ gràfica ↔ característiques) i **comunicació**.

## Autoria i llicència

<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca"><img src="vendor/cc-by-nc-sa-88x31.png" alt="Creative Commons BY-NC-SA" width="88" align="left"></a>

Aplicació creada per **[Felip Sarroca](https://ja.cat/felipsarroca)** amb assistència de la IA.
Obra sota llicència **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca)**: pots compartir-la i adaptar-la sense finalitat comercial, sempre que en citis l'autoria i comparteixis les adaptacions amb la mateixa llicència.
