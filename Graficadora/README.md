## Graficadora+

Aplicació React (Vite + TypeScript) per representar funcions, inequacions i sistemes. Inclou:
- Edició d'expressions amb teclat matemàtic i previsualització MathJax.
- Representació en temps real amb diferents temes i opcions de visualització.
- Exportació del gràfic en format imatge i anàlisi bàsica del domini.

### Requisits previs

- Node.js 18 o superior.
- Un token per a `GEMINI_API_KEY` si es volen fer servir els serveis que en depenen (pots deixar-ho buit per executar la graficadora localment).

### Com posar-la en marxa

1. Instal·la les dependències:
   ```bash
   npm install
   ```
2. Crea el fitxer d'entorn:
   ```bash
   cp .env.example .env.local
   ```
3. Edita `.env.local` i, si cal, afegeix el teu valor per `GEMINI_API_KEY`.
4. Executa el servidor de desenvolupament:
   ```bash
   npm run dev
   ```
5. Obre el navegador a l’adreça que indica la consola (per defecte `http://localhost:3000`).

### Construir la versió de producció

```bash
npm run build
```

El resultat quedarà a la carpeta `dist/`. Pots fer una previsualització local amb:
```bash
npm run preview
```

### Estructura principal

```
graficadora/
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── services/
│   ├── constants.ts
│   ├── types.ts
│   └── main.tsx
└── tsconfig.json
```

### Notes

- La carpeta `src/components` agrupa tota la interfície: el gràfic, els controls laterals i els modals.
- `src/services/mathService.ts` conté la lògica de parseig i anàlisi de les expressions.
- TailwindCSS i Font Awesome s'incorporen via CDN des de `index.html`; no cal cap configuració addicional.
