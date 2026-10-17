# La recta numèrica

Recurs educatiu interactiu per explorar com es representen els nombres reals sobre la recta numèrica. L’alumnat construeix fraccions amb el teorema de Tales, situa arrels irracionals amb el teorema de Pitàgores i classifica nombres en els conjunts numèrics.

**[Obre l’aplicació](https://felipsarroca.github.io/edu-apps/NombresReals/)** · [Enllaç curt](https://ja.cat/nombres)

## Captures de pantalla

### Portada

![Portada de La recta numèrica, amb la recta i les tres activitats](docs/captures/portada.png)

### Fraccions amb Tales

![Activitat per construir i situar fraccions amb el teorema de Tales](docs/captures/fraccions.png)

### Irracionals amb Pitàgores

![Activitat per construir arrels quadrades amb el teorema de Pitàgores](docs/captures/irracionals.png)

### Classificació dels nombres

![Activitat per classificar nombres en els conjunts numèrics](docs/captures/classifica.png)

## Què s’hi pot treballar

- **Fraccions:** construir fraccions positives i negatives, pròpies i impròpies, dividint la unitat en parts iguals. Una seqüència guiada mostra la construcció geomètrica amb Tales; abans de començar, es pot predir entre quins enters cau el resultat.
- **Nombres irracionals:** construir arrels quadrades amb triangles rectangles i el teorema de Pitàgores, i traslladar-les a la recta numèrica.
- **Conjunts numèrics:** classificar nombres com a naturals, enters, racionals o irracionals. Tres nivells de dificultat, arrossegar o clicar per col·locar i retroacció amb pistes.

Les activitats s’adapten a diferents amplades de pantalla i funcionen al navegador sense base de dades.

## Executar en local

Cal tenir [Bun](https://bun.com/) instal·lat. Des de la carpeta del projecte:

```powershell
bun install --frozen-lockfile
bun run dev
```

Obre <http://localhost:3000>. Les pàgines són:

| Pàgina | Ruta |
| --- | --- |
| Portada | `/` |
| Fraccions amb Tales | `/fraccions/` |
| Irracionals amb Pitàgores | `/irracionals/` |
| Classificació | `/classifica/` |

## Compilar i servir

```powershell
bun run build
bun run start
```

La compilació estàtica es desa a `out/`. L’ordre `start` la serveix en local i indica l’adreça al terminal. La configuració d’exportació estàtica permet allotjar l’app en un servidor web sense Node.js.

## Publicar a GitHub Pages

El repositori `edu-apps` publica la branca `main` sense un pas de compilació automàtic. Per actualitzar la versió publicada des d’aquesta carpeta:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/edu-apps/NombresReals'
bun run build
# Copia el contingut d'out/ a l'arrel de NombresReals/
```

El fitxer `.nojekyll` de l’arrel del repositori és necessari perquè GitHub Pages publiqui els recursos de `_next/`. `bun run build` també executa `scripts/fix-export.mjs`, que ajusta els noms d’alguns fitxers de precàrrega de Next.js 16. Per tornar a compilar per a l’arrel local, elimina `NEXT_PUBLIC_BASE_PATH` de l’entorn.

> Si el projecte és en una unitat de Google Drive i `bun install` falla, treballa en una còpia del projecte en un disc local.

## Tecnologies

- Next.js 16 amb exportació estàtica
- React 19, TypeScript i Tailwind CSS
- SVG per a les construccions geomètriques i la recta numèrica
- Bun per instal·lar dependències i executar les ordres del projecte

## Llicència

Aplicació creada per [Felip Sarroca](https://ja.cat/felipsarroca) amb assistència de la IA. El projecte s’ofereix sota la llicència [Creative Commons Reconeixement-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca).
