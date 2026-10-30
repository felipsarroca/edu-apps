# Configuració electrònica

Aplicació web interactiva per practicar l'ompliment d'orbitals, la identificació d'elements a la taula periòdica i la lectura de configuracions electròniques. Dissenyada per a les classes de física i química de 3r-4t d'ESO i batxillerat, amb textos íntegrament en català.

## Característiques principals
- Emplenament progressiu d'electrons: els botons `+ electró` i `- electró` segueixen l'ordre d'Aufbau i actualitzen en temps real la configuració completa i abreujada.
- Taula periòdica connectada: clicant qualsevol element es carrega el seu nombre atòmic, el bloc, el període i la cel·la corresponent queda ressaltada.
- Diagrama d'orbitals i visualització atòmica: mostra parelles d'electrons amb punts, destaca la capa en curs i genera un esquema circular amb capes, etiquetes i comptatge d'electrons.
- Informació de valències: llistat de valències d'oxidació habituals i possibles, amb codis de color segons signe i valors més freqüents marcats.
- Accessibilitat i llenguatge acadèmic: ús d'atributs ARIA, text alternatiu i contrastos de color per facilitar l'ús amb lectors de pantalla i pantalles tàctils.
- Regla de Hund: dins de cada subnivell, els electrons ocupen primer un orbital cadascun i després s'aparellen; les càpsules roses mostren els electrons desaparellats.
- Excepcions a l'ordre d'Aufbau: per a elements com Cr, Cu, Mo, Ag, Pd, Pt o Au es mostra la configuració real (experimental) al costat de la teòrica.
- Adaptació a la pantalla: tota la interfície escala segons l'amplada i l'alçada (1366x740, 1920x1080, pissarra digital) i s'apila en tauletes i mòbils.
- Teclat: les fletxes ← i → (o les tecles − i +) treuen i afegeixen electrons.

## Instruccions d'ús
1. Obre el fitxer `index.html` amb un navegador modern (Chrome, Edge, Firefox o similar). No cal servidor web.
2. Afegeix o treu electrons amb els botons de l'apartat «Emplenament d'orbitals» o amb les fletxes del teclat. La configuració, la notació amb gas noble i el diagrama es refresquen automàticament. També pots fer clic en un punt del diagrama per arribar fins a aquell electró.
3. Alternativament, fes clic sobre un element de la taula periòdica per carregar la seva configuració i valències.
4. Consulta la columna de capes per interpretar la distribució d'electrons i utilitza la secció de valències per planificar exercicis o qüestionaris.
5. Reinicia la simulació amb el botó «reinicia» per començar amb un nou element o repàs.

## Estructura del projecte
| Fitxer | Descripció |
| --- | --- |
| `index.html` | Maquetació principal, capçaleres i seccions per al diagrama d'orbitals, taula periòdica i valències. |
| `styles.css` | Estils responsius, codis de color per blocs (s, p, d, f) i ajustos per a impressores o pantalles tàctils. |
| `script.js` | Dades dels 118 elements, nombres d'oxidació, excepcions d'Aufbau, càlcul de configuracions, generació de la taula periòdica i actualització de totes les vistes. |
| `assets/CC_BY-NC-SA.png` | Distintiu de la llicència del peu de pàgina. |
| `favicon.svg` | Icona de la pàgina, en format vectorial. |

## Suggeriments per a l'aula
- Activitat guiada: projecta l'aplicació i demana a l'alumnat que anticipi l'emplenament abans de prémer «+ electró»; dialoga sobre les excepcions d'elements de transició.
- Investigació cooperativa: assigna grups d'elements (alcalins, halògens...) i encarrega que analitzin patrons de valències i capes utilitzant l'eina.
- Autoavaluació: combina l'aplicació amb un formulari a Google Forms on l'alumnat registri la configuració o identifiqui l'element a partir d'una notació donada.

## Personalització
- Per afegir o corregir valències, edita les crides a `setOxidation` dins de `script.js`; les excepcions d'Aufbau són al mapa `REAL_CONFIG`.
- Els textos de la taula periòdica (nom, símbol, bloc) es troben a l'array `ELEMENTS` del mateix fitxer.
- L'estil visual es pot ajustar modificant les variables CSS i classes definides a `styles.css` (per exemple, per adaptar la paleta a l'aula o al pòster imprès).

## Llicència i autoria
- Aplicació creada per [Felip Sarroca](https://ja.cat/felipsarroca) amb assistència de la IA.
- Obra sota llicència [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca): cal citar l'autoria, no se'n pot fer ús comercial i les adaptacions han de mantenir la mateixa llicència.
