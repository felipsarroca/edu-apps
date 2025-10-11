# Graficadora+

React + Vite application for plotting functions, inequalities, and systems with an interactive graph.

## Getting started

1. Install Node.js 20 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` if you plan to use external services.
4. Launch the development server with `npm run dev`.

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run build` generates the production build in `dist`.
- `npm run preview` serves the built assets for a final check.

## Project structure

```
.
|- index.html
|- package.json
|- src/
   |- components/
   |- services/
   |- App.tsx
   |- index.css
   |- main.tsx
   |- constants.ts
   |- types.ts
|- vite.config.ts
```

Tailwind styles are loaded from the CDN in `index.html`, so no local Tailwind build step is required.
