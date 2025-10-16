## **📁 Estructura del projecte**

mcd-mcm-app/

│

├─ index.html

├─ style.css

├─ script.js

├─ data/

│   ├─ easy.json

│   ├─ medium.json

│   ├─ hard.json

│   ├─ problems.json

└─ assets/

    ├─ icones/

    ├─ cc-by-nc-sa.svg

    └─ logo.png

## **🧮 Modes de funcionament**

### *Mode lliure*

* L’usuari introdueix 2, 3 o 4 nombres.  
* L’aplicació valida que siguin enters positius.  
* No es donen pistes ni ajudes.  
* Quan l’usuari ha completat tota la selecció de factors, l’aplicació fa el càlcul final de MCD o mcm.

### *Mode pràctica amb números predefinits*

* L’aplicació llegeix grups de números des de fitxers JSON (`easy.json`, `medium.json`, `hard.json`).  
* Els grups es trien a l’atzar dins del nivell corresponent.  
* Ha d’haver-hi molts conjunts de nombres per evitar repeticions freqüents.  
* Els fitxers han d’estar pensats per **ser fàcilment ampliables** sense alterar el codi principal.

### *Mode problemes contextualitzats*

* L’aplicació llegeix enunciats des del fitxer `problems.json`.  
    
* Cada problema:  
    
  * Presenta un **enunciat real o contextualitzat** que requereix l’ús del MCD o del mcm.  
  * Conté **els nombres que cal utilitzar** per a la resolució.


* L’usuari selecciona aquests nombres per descompondre’ls factorialment i calcular el resultat corresponent.  
    
* No s’ofereixen pistes ni passos guiats.

---

## **📚 Fitxers JSON**

### *`easy.json`, `medium.json`, `hard.json`*

* Estructura basada en **llistes de conjunts numèrics**.  
* Cada element conté entre 2 i 4 nombres.  
* Exemple de format:

\[

  \[12, 18\],

  \[8, 20, 30\],

  \[9, 15, 25, 45\]

\]

* S’han d’incloure molts conjunts per permetre **extracció aleatòria** amb sensació de no repetició.  
* Han de poder-se ampliar simplement afegint nous conjunts al final del fitxer.

### *`problems.json`*

* Conté una col·lecció de problemes contextualitzats.  
    
* Cada element té:  
    
  * `id`: identificador únic.  
  * `text`: enunciat del problema.  
  * `numbers`: llista dels nombres que apareixen a l’enunciat.  
  * `type`: `"mcm"` o `"mcd"`, segons la resolució que s’espera.


* Exemple:

\[

  {

    "id": 1,

    "text": "Tres autobusos surten a les 8 del matí. Un triga 12 minuts a fer la ruta, un altre 18 minuts i un altre 30 minuts. Al cap de quants minuts tornaran a coincidir els tres autobusos a la sortida?",

    "numbers": \[12, 18, 30\],

    "type": "mcm"

  },

  {

    "id": 2,

    "text": "Tenim 48 caramels de maduixa i 60 de llimona. Volem fer bosses iguals sense que en sobri cap. Quants caramels tindrà cada bossa?",

    "numbers": \[48, 60\],

    "type": "mcd"

  }

\]

* Els problemes han de ser **pràctics, variats i ampliables** sense modificar el codi.

---

## **🧮 Procés de descomposició factorial**

* L’usuari introdueix el factor primer manualment.  
    
* L’aplicació comprova si és correcte.  
    
  * Si és correcte → fa la divisió i mostra el resultat a la taula.  
  * Si és incorrecte → missatge informatiu (sense donar pistes addicionals).


* Els factors s’alineen en columnes segons el nombre primer.  
    
* Cada fila correspon a un dels nombres introduïts o seleccionats.

---

## **🧠 Procés de càlcul final**

* Per al MCD: l’usuari selecciona els **factors comuns amb el mínim exponent**.  
    
* Per al mcm: l’usuari selecciona **factors comuns i no comuns amb el màxim exponent**.  
    
* L’aplicació només calcula quan l’usuari ja ha fet tota la selecció.  
    
* El resultat apareix clarament a la part inferior:  
    
  * `MCD = ...`  
  * `mcm = ...`

---

## **🖼️ Interfície visual**

* Zona superior: selector de mode (lliure, pràctica, problemes).  
    
* Zona central: descomposició factorial i selecció de factors.  
    
* Zona inferior: resultats finals.  
    
* Footer:  
    
  * `Aplicació creada per Felip Sarroca amb l’assistència de la IA`  
  * `Obra sota llicència CC BY-NC-SA 4.0` (amb enllaç a `https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca` i símbol SVG).

---

## **🛠️ Tecnologia**

* HTML, CSS i JavaScript purs.  
* Sense React, Vite ni dependències que requereixin compilació.  
* Mòduls ES6 si cal estructura modular.  
* JSON fàcilment ampliables i accessibles per `fetch()` local.  
* Compatibilitat directa amb GitHub Pages.

