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

El repositori `edu-apps` es publica tal com és des de la branca `main` (sense cap pas de compilació), així que cal pujar-hi la versió compilada a `NombresReals/app/`:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/edu-apps/NombresReals/app'
bun run build
# Substitueix el contingut de NombresReals/app/ pel de out/
```

- Adreça publicada: <https://felipsarroca.github.io/edu-apps/NombresReals/app/> (enllaç curt: <https://ja.cat/nombres>).
- `NombresReals/index.html` redirigeix a `app/`.
- El fitxer `.nojekyll` de l'arrel del repositori és imprescindible: sense ell, GitHub Pages ignora les carpetes que comencen per `_` (com `_next/`).
- Per executar-la en local a l'arrel, deixa la variable sense definir i torna a compilar.
- Si la carpeta és en una unitat de Google Drive, `bun install` falla: cal treballar en una còpia en un disc local.
