# Especificació operativa per a IA

## Propòsit

Aquest document serveix perquè una IA implementi recursos educatius adaptatius baiesians de forma fiable.  
És una especificació operativa breu.  
Si cal fonament teòric, exemples o justificació matemàtica, consulta `documentacion_evaluacion_adaptativa_bayesiana.md`.  
Si hi hagués conflicte entre tots dos documents, preval aquest.

## Instrucció d'ús

Adjunta aquest document a la IA i usa aquest prompt:

> Llegeix el document adjunt i implementa el recurs seguint exactament les seves regles operatives.

## Flux obligatori

1. Abans d'implementar, comprova si tens aquesta informació:
   - tema;
   - curs o edat;
   - objectiu d'aprenentatge;
   - tipus de recurs;
   - finalitat principal;
   - nombre d'hipòtesis o nivells;
   - tipus d'interacció;
   - nombre aproximat de preguntes o passos;
   - sortida final esperada.
2. Si falta informació essencial, pregunta només pel que és imprescindible.
3. Si la informació ja està donada, no repeteixis preguntes i passa a implementar.
4. El resultat ha de ser una pàgina web estàtica autocontinguda en un únic fitxer `HTML + CSS + JavaScript`, llevat que es demani explícitament un altre format.

## Regles de disseny

- El recurs no ha de ser lineal si la finalitat exigeix adaptació.
- Cada resposta de l'alumne ha de modificar l'estat estimat del sistema.
- L'adaptació pot afectar:
  - la següent pregunta;
  - la dificultat;
  - el tipus d'activitat;
  - l'explicació;
  - l'ajuda o les pistes;
  - l'itinerari;
  - el moment de finalitzar.
- El resultat final ha de ser pedagògic, no només una puntuació.

## Estat de l'alumne

- Representa l'estat de l'alumne com una distribució de probabilitat sobre `n` hipòtesis.
- Si no hi ha informació prèvia fiable, usa distribució uniforme.
- Si les hipòtesis són jeràrquiques, assigna-ls valors `theta` ordenats i centrats.
- Si el docent no fixa valors, usa una escala simètrica centrada en 0.

## Actualització baiesiana

Després de cada resposta:

1. calcula la versemblança d'aquesta resposta sota cada hipòtesi;
2. multiplica prior per versemblança;
3. normaliza;
4. usa el resultat com a nou estat.

Això s'ha de fer després de cada interacció rellevant.

## Versemblances

- Si les hipòtesis representen nivells ordenats de domini, usa IRT 3PL.
- Fórmula recomanada:

`P(encert | H_i, q) = c_q + (1 - c_q) / (1 + exp(-a * (theta_i - b_q)))`

- Usa per defecte:
  - `a = 1.5`
  - `c_q = 1 / m_q` si hi ha atzar
  - `c_q = 0` si no n'hi ha
- Si l'alumne falla:

`P(fallada | H_i, q) = 1 - P(encert | H_i, q)`

- Si les hipòtesis no són jeràrquiques, no usis IRT logística. Defineix versemblances diagnòstiques específicas.
- No usis taules fixes globals si cada pregunta pot generar les seves pròpies versemblances.

## Preguntes i activitats

Cada pregunta o interacció autocorregible ha de tenir, quan escaigui:

- text o enunciat;
- dificultat `b_q`;
- nombre d'opcions `m_q`;
- categoria o concepte;
- criteri de correcció;
- ajuda o pista opcional;
- explicació o retroalimentació.

Si el recurs és procedimental o tutorial, les interaccions poden no ser preguntes clàssiques, però han de continuar sent autocorregibles o avaluables de forma explícita.

## Selecció adaptativa

Per a cada candidata disponible:

1. calcula la probabilitat marginal d'encert;
2. simula posterior si hi ha encert;
3. simula posterior si hi ha fallada;
4. calcula l'entropia esperada posterior;
5. calcula el guany esperat d'informació.

Selecciona la candidata amb més guany esperat d'informació.

Si diverses són pràcticament equivalents:

- trenca empats amb aleatorització;
- afavoreix categories o conceptes menys repetits.

No usis selecció determinista simple en empats.

## Criteri de parada

Atura la sessió quan es compleixin criteris raonables de tancament, per exemple:

- entropia per sota de `H_stop`;
- hipòtesi més probable per sobre de `p_min`;
- mínim de preguntes ja complert;
- no queden preguntes útils;
- la millor pregunta restant aporta molt poca informació;
- s'assoleix el màxim pràctic.

Regles mínimes:

- no tanquis massa d'hora;
- no allarguis artificialment la sessió quan la utilitat marginal ja és baixa;
- si la incertesa continua sent alta, el resultat s'ha d'indicar com a provisional.

## Itineraris per etapes

Si el recurs té fases, tècniques o etapes successives:

- distingeix entre estimació global i estimació local per etapa;
- no promocionis una etapa usant només la creença global acumulada;
- decideix la superació de l'etapa amb evidència generada dins d'aquesta etapa.

Per donar una etapa per superada, convé exigir almenys:

- confiança local suficient;
- entropia local suficientment baixa;
- i un mínim explícit de rendiment observat en aquesta etapa.

Exemple raonable:

- `p_min = 0.80`
- mínim de `60 %` d'encerts en l'etapa

Si l'alumne repeteix una etapa:

- reinicia l'estimació local d'aquella etapa, llevat de justificació pedagògica explícita en contra.

Acabar una etapa no implica necessàriament haver-la superat.

## Recuperació i reforç

- Si l'alumne mostra dificultats, el sistema ha de poder:
  - oferir pistes;
  - mostrar explicació;
  - proposar reforç;
  - canviar el tipus d'activitat;
  - reduir temporalment la dificultat;
  - permetre reintent o repàs.
- Si mostra domini, pot:
  - avançar;
  - ampliar;
  - augmentar complexitat;
  - reduir ajuda.

## Resultat final

La sortida final ha d'incloure, segons el tipus de recurs:

- diagnòstic o nivell estimat;
- grau de confiança;
- dificultats detectades;
- fortaleses observades;
- recomanació pedagògica;
- següent pas.

Si és un itinerari o activitat d'aprenentatge, afegeix a més:

- recorregut seguit;
- etapes superades o no;
- ajudes usades;
- àrees a reforzar.

No retornis només una nota o etiqueta.

## Restriccions d'implementació

- La interfície ha de ser comprensible per a alumnat i professorat.
- Ha de mostrar amb claredat el progrés i la retroalimentació.
- Si uses fórmules visibles, acompanya-les d'interpretació llegible.
- Evita dependre de backend si no s'ha demanat.
- Evita preguntes obertes llargues sense correcció automàtica fiable.

## Valors per defecte recomanats

Si el docent no especifica paràmetres:

- `n = 3` hipòtesis o nivells;
- `a = 1.5`;
- `p_min = 0.80`;
- mínim de preguntes: entre `4` i `6`;
- màxim pràctic: entre `10` i `20`, segons el tipus de recurs.

## Què no ha de fer la IA

- No confondre una explicació teòrica amb una regla obligatòria d'implementació.
- No usar la creença global per promocionar etapes locals en itineraris.
- No tancar el recurs sense justificar la certesa assolida.
- No presentar com a ferm un resultat amb incertesa alta.
- No limitar la sortida a una puntuació nua.
