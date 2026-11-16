# 07 · Guia, quadern i avaluació

El motor pedagògic: com es guia l'alumne sense interrompre'l, com es detecten les idees equivocades, què recull el quadern científic, com es mostra el progrés i què té a l'abast el professorat.

Torna al [pla mestre](../PLA.md).

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
