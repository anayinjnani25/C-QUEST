import { fileURLToPath } from "node:url";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Static build for GitHub Pages. The game runs in the browser and talks to Supabase
// directly, so it is shipped as a single-page app instead of the Worker.
// Assets are served from https://anayinjnani25.github.io/C-QUEST/, hence `base`
// (override with PAGES_BASE for another repo name or a custom domain, e.g. "/").
export default defineConfig({
  base: process.env.PAGES_BASE || "/C-QUEST/",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [
    tanstackStart({
      srcDirectory: "src",
      spa: {
        enabled: true,
        prerender: { outputPath: "/index.html" },
      },
    }),
    react(),
  ],
});
