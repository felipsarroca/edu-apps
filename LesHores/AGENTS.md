# LesHores («Ara és l'hora»)

Detall de nivells, criteris de preguntes i fitxers: README.md. Enllaç públic: ja.cat/araeslhora.

- Interfície fluida: mides en rem i arrel amb clamp() d'amplada i alçada (horitzontal i vertical per separat); la pantalla de joc ocupa 100dvh menys el peu. No hi ha opció «Ordinador/Mòbil»: no la tornis a afegir (Felip, 2026-11-23).
- Durant la partida no es desplaça en cap mida (1366 × 768, 1920 × 1080, tauleta 768 × 1024, mòbil 390 × 844, tema clar i fosc) i la pàgina no pot ser més ampla que la pantalla. Comprova-ho amb captures abans de publicar.
- Al joc no hi ha la franja d'insígnies: només la icona del nivell; la col·lecció és a «Insígnies» (Felip, 2026-11-23: «les insígnies ocupen massa espai»).
- Preguntes: cap rellotge es repeteix fins que s'han vist tots els del nivell i la mateixa hora mai surt dues vegades seguides (Felip, 2026-11-23: «pregunta per les 11 i a la següent torna a preguntar per les 11»). Si toques `engine.js` o el banc, simula 2.000 partides per nivell.
- `time_bank.json` es genera amb `scripts/genera_banc.py`; no el retoquis a mà.
- Els ids d'insígnia i les claus de localStorage (`leshores_profiles`, `leshores_active`, `leshores_sound`, `leshores_theme`) no canvien: guarden el progrés i les preferències de l'alumnat.
- `instruccions.txt` i `backend-design.md` són esborranys inicials (parlen de reptes diaris i d'un backend que no existeix); l'app real és la del README.
