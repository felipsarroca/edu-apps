# edu-apps
Aplicacions interactives creades per treballar continguts d’ESO i batxillerat amb suport digital i IA.

## Per començar
- Cada carpeta conté una aplicació independent; consulta el seu `README.md` o la documentació adjunta per veure detalls ampliats.
- Les propostes basades en fitxers HTML/JS funcionen obrint `index.html` al navegador; només `ViatgesColom` i `ConquestaAmerica` requereixen un petit servidor estàtic.
- Els projectes amb Node.js especifiquen dependències i scripts (`npm install`, `npm run dev`).
- Pots desplegar qualsevol aplicació a GitHub Pages o Google Sites publicant la carpeta corresponent.

## Catàleg d’aplicacions

### Història i cultura
| Carpeta | Etapa / àrea | Què trobaràs | Tecnologies | Execució ràpida |
| --- | --- | --- | --- | --- |
| `ScapeRoomErmita` | Cicle superior – ESO / Història local | Escape room de 12 enigmes sobre l’ermita romànica de Ca n’Anglada amb pistes, comptador d’errors i medidor de temps | HTML, CSS, JavaScript | Obre `index.html` |
| `voltaalmon` | ESO – Batxillerat / Història moderna | Mapa Leaflet amb 27 etapes de l’expedició Magallanes-Elcano, fitxes contextuals i cronologia visual | HTML, CSS, JavaScript, Leaflet | Obre `index.html` |
| `Ulisses` | ESO / Cultura clàssica | Viatge d’Ulisses en 14 parades amb cites homèriques, reflexions filosòfiques i estètica de pergamí | HTML, CSS, JavaScript, Leaflet | Obre `index.html` |
| `ViatgesColom` | ESO / Descobriments geogràfics | Quatre expedicions de Colom amb mapa animat, línia de temps sincronitzada, pestanyes i locució | HTML, CSS, JavaScript, Leaflet, Web Speech API | Serveix la carpeta (`python -m http.server`) |
| `ConquestaAmerica` | ESO – Batxillerat / Història moderna | Cinc conquestes castellanes amb targetes biogràfiques, mapes, línies de temps i narració en veu | HTML, CSS, JavaScript, Leaflet, Web Speech API | Serveix la carpeta (`python -m http.server`) |

### Ciències, tecnologia i matemàtiques
| Carpeta | Etapa / àrea | Què trobaràs | Tecnologies | Execució ràpida |
| --- | --- | --- | --- | --- |
| `TaulaPeriodicaDinamica` | ESO – Batxillerat / Física i química | Taula periòdica amb modes de color (famílies, blocs, electronegativitat, fase...) i llegendes dinàmiques | HTML, CSS, JavaScript | Obre `index.html` |
| `ConfiguracioElectronica2` | 3r-4t ESO – Batxillerat / Física i química | Simulador complet d’orbitals amb reforç visual, valències i taula periòdica sincronitzada | HTML, CSS, JavaScript | Obre `index.html` |
| `ConfiguracioElectronica` | ESO – Batxillerat / Física i química | Visualitzador generat amb React per mostrar configuracions electròniques i taula interactiva | React, TypeScript, Vite (build estàtica) | Obre `index.html` |
| `QuizTaulaPeriodica` | ESO / Física i química | Repte “10 encerts seguits” amb nivells, cronòmetre i integració amb Google Sheets per al rànquing | HTML, CSS, JavaScript | Obre `index.html` i configura `config.js` + Apps Script |
| `GraphMath` | ESO – Batxillerat / Matemàtiques | Representació gràfica de funcions múltiples amb zoom, MathJax i estil Tailwind | HTML, Tailwind CSS, JavaScript, D3.js | Obre `index.html` o visita l’enllaç publicat |

### Competència digital, IA i emprenedoria
| Carpeta | Etapa / àrea | Què trobaràs | Tecnologies | Execució ràpida |
| --- | --- | --- | --- | --- |
| `Joc-Marc-IA` | ESO / Competència digital | Classificador d’escenaris en els sis nivells d’integració humà-IA amb feedback detallat | HTML, CSS, JavaScript | Obre `index.html` |
| `4x15-Joc-IA` | ESO / IA i pensament computacional | Joc “4 x 15” amb preguntes sobre IA, temporitzador, rànquing i pantalles dinàmiques | HTML, CSS, JavaScript | Obre `index.html` |
| `Joc-Cooperatives` | 4t ESO – Emprenedoria | Avaluació gamificada amb 19 preguntes, pistes i puntuació sobre economia social i cooperatives escolars | React, TypeScript, Vite, shadcn/ui, React Query | `npm install` i `npm run dev` |

## Notes addicionals
- Totes les aplicacions inclouen textos en català i es poden compartir via Google Classroom, GitHub Pages o qualsevol LMS que accepti contingut web.
- Per adaptar continguts (nivell lingüístic, rúbriques, extensions), revisa els fitxers `*.json`, `config.js` o constants de cada projecte.
- Recorda controlar les API keys (per exemple `Gemini`) abans de publicar projectes que les necessiten.
