# Revisió final de l’aplicació en cinc bucles

## Bucle 1 · Estructura i funcionament

- Anàlisi: revisió de les quatre rutes, l’estat local, el banc de 90 preguntes i els fluxos de rectificació.
- Decisió: completar els gestors que faltaven i ampliar les proves automatitzades.
- Millores: tres perfils independents de 10–12 anys, observacions amb «vist / no vist / no comprovat», etapes de progrés, historial del joc i registre de la millor puntuació.
- Resultat: 100 rondes simulades sense preguntes repetides; resultat, rectificació d’errors, perfils i crònica funcionals.

## Bucle 2 · Composició i ús de les imatges

- Anàlisi: revisió de l’amplada útil, proporcions, galeries, peus d’imatge i llocs on calia veure més detall.
- Decisió: reservar la informació científica extensa per a desplegables i permetre ampliar tant les infografies com les fotos d’ubicació.
- Millores: visor modal accessible, textos alternatius descriptius, dimensions explícites, càrrega diferida, imatge quadrada de seguretat i galeries adaptatives sense columnes buides.
- Resultat: les pantalles d’acció són més curtes i totes les imatges informatives es poden consultar a mida gran.

## Bucle 3 · Inclusió i accessibilitat

- Anàlisi: llenguatge infantil, retorn de focus, anuncis del lector de pantalla i visibilitat dels resultats.
- Decisió: evitar termes excloents i donar retorn multimodal configurable sense saturar.
- Millores: «infant» i «jove astrònom/a», portada complementària amb una nena, punts verds/corall, focus conservat, missatges `aria-live`, so/vibració desactivables i compte enrere silenciós per als lectors de pantalla.
- Resultat: cap ús excloent de «nen/noi» al banc o la interfície i historial visible al final de cada ronda.

## Bucle 4 · Crònica, espai i impressió

- Anàlisi: el resum havia de distingir clarament allò vist, no vist i no comprovat, i preparar una sortida presentable.
- Decisió: construir la crònica per etapes i separar l’acció immediata del detall consultable.
- Millores: nom, data i lloc; mesures, comparacions, comprensions, record, mancances; botó d’impressió/desament en PDF; exportació JSON; tres perfils; peu corporatiu i navegació inferior compactats de 132 a 112 px.
- Resultat: resum complet, reutilitzable i imprimible, amb més espai real per al contingut.

## Bucle 5 · PWA i verificació final

- Anàlisi: instal·lació, estat offline, actualització de memòria cau i disponibilitat de tots els recursos.
- Decisió: fer visible l’estat «Offline preparat», detectar si l’app ja està instal·lada i versionar la memòria cau.
- Millores: caché `eclipsi-2026-v5`, nova imatge inclusiva optimitzada a 146 KB, 29 recursos únics disponibles offline i proves d’exportació, impressió i visor.
- Resultat: sintaxi correcta, auditoria estàtica correcta, prova funcional correcta i 29/29 recursos servits amb HTTP 200; paquet offline aproximat d’1,81 MB.

## Limitació de la revisió visual

El navegador integrat no tenia cap superfície activa en aquesta sessió. S’ha aplicat el protocol complet de reconnexió de la skill i no s’ha substituït per un navegador aliè. La revisió visual s’ha completat amb inspecció individual de les imatges, fulls de contacte, proporcions reals, regles responsives, mides tàctils, textos alternatius i comprovacions automatitzades.
