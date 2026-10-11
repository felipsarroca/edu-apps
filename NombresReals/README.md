# La recta numèrica

Pàgina educativa interactiva sobre la representació de fraccions amb Tales, nombres irracionals amb Pitàgores i classificació dels nombres reals.

## Executar-la en local

Cal tenir [Bun](https://bun.com/) instal·lat. Des d'aquesta carpeta:

```powershell
bun install --frozen-lockfile
bun run dev
```

Obre <http://localhost:3000> al navegador.

## Generar la versió publicable

```powershell
bun run build
bun run start
```

La compilació estàtica queda a `out/`. L'ordre `start` la serveix en local i mostra l'adreça exacta al terminal. Les activitats funcionen al navegador i no necessiten base de dades.

La portada (`/`) obre tres pàgines independents: `/fraccions/`, `/irracionals/` i `/classifica/`.

## Publicar-la amb GitHub Pages

El repositori `edu-apps` es publica tal com és des de la branca `main` (sense cap pas de compilació). Per això la versió compilada conviu amb el codi font a la mateixa carpeta `NombresReals/`:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/edu-apps/NombresReals'
bun run build
# Copia el contingut de out/ a l'arrel de NombresReals/ (index.html, _next/, fraccions/, irracionals/, classifica/…)
```

- Adreça publicada: <https://felipsarroca.github.io/edu-apps/NombresReals/> (enllaç curt: <https://ja.cat/nombres>).
- El fitxer `.nojekyll` de l'arrel del repositori és imprescindible: sense ell, GitHub Pages ignora les carpetes que comencen per `_` (com `_next/`).
- `bun run build` executa `scripts/fix-export.mjs`, que corregeix els noms d'uns fitxers de precàrrega de Next 16.
- Per executar-la en local a l'arrel, deixa la variable sense definir i torna a compilar.
- Si la carpeta és en una unitat de Google Drive, `bun install` falla: cal treballar en una còpia en un disc local.
