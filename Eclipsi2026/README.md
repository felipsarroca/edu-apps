# Missió eclipsi 2026

Aplicació web progressiva (PWA) mòbil per a la sortida familiar de l’eclipsi total de Sol i les Perseides del 12 d’agost de 2026.

## Posada en marxa local

1. Obre el PowerShell dins d’aquesta carpeta.
2. Executa `python -m http.server 4173`.
3. Obre `http://localhost:4173` al navegador.

## Instal·lació a Android

1. Publica la carpeta en un servidor HTTPS, per exemple GitHub Pages.
2. Obre l’adreça amb Chrome al telèfon.
3. Prem **Instal·la** o ves a **⋮ → Instal·la l’aplicació**.

La checklist, les observacions i els qüestionaris es desen només al dispositiu mitjançant `localStorage`.

## Contingut

- Pla operatiu, checklist, seguretat i ubicacions per als adults.
- Missió tàctil per a joves de 10–12 anys amb tres perfils, estats «vist / no vist / no comprovat» i crònica final imprimible o exportable en JSON.
- Banc de 90 preguntes visuals en llenguatge inclusiu per a infants de 5 anys, amb dues o tres opcions: cinc preguntes i opcions en ordre aleatori, resultat gràfic, historial, efectes configurables i segona oportunitat per rectificar els errors.
- Dotze il·lustracions de la carpeta `imatges` valorades i optimitzades, més una variant inclusiva amb una nena, distribuïdes només on aporten informació útil i ampliables quan cal detall.
- Funcionament sense connexió després de la primera càrrega, amb confirmació visible quan el PWA està preparat.

Les dades de base provenen dels PDF de la carpeta. La proposta nocturna de Sant Jeroni s’ha contrastat amb Turisme de la Ribera d’Ebre i queda condicionada als avisos, l’accés i el Pla Alfa del mateix dia.
