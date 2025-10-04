import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rawBasePath = process.env.VITE_BASE_PATH ?? "./";
const base = rawBasePath.endsWith("/") ? rawBasePath : `${rawBasePath}/`;

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
