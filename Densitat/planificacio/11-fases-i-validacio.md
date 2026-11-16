# 11 · Fases i validació

Què es construeix a cada fase, què ha de complir per donar-la per acabada, com es prova amb alumnat i quins riscos cal vigilar.

Torna al [pla mestre](../PLA.md).

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

Amb un grup, abans de continuar: les sis preguntes de control de l'apartat 10 del document [07](07-guia-quadern-i-avaluacio.md), abans i després, i observació d'on s'encallen.

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

Una fase està acabada quan totes les seves investigacions ho estan, es compleixen els criteris d'acceptació i s'ha completat la llista de publicació de l'apartat 9 del document [09](09-arquitectura-tecnica.md).

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
