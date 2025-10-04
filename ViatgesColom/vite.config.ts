import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = "/edu-apps/ViatgesColom/";

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: "docs/ViatgesColom",
    emptyOutDir: true,
  },
});
