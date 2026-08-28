import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";

/**
 * Vite replaces Next. The site is entirely static content in TypeScript —
 * there was never a server, a database or a request that needed rendering, so
 * the whole framework was paying for capability the site does not use.
 *
 * Build shape:
 *  - SWC for JSX, not Babel. Roughly an order of magnitude faster to compile.
 *  - Three fixed vendor chunks so a content edit never invalidates the
 *    framework bundles in a returning visitor's cache.
 *  - `sourcemap: false` in production. Sourcemaps were about a third of the
 *    build time and are not wanted on a public portfolio.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split by what changes, not by what is imported where. Content edits
        // are frequent and framework upgrades are not, so the three vendor
        // bundles below keep their filenames — and a returning visitor's
        // cache — across every ordinary deploy.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router") || id.includes("/@remix-run/")) return "router";
          if (id.includes("framer-motion") || id.includes("/motion-dom/") || id.includes("/motion-utils/")) {
            return "motion";
          }
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
            return "react";
          }
          // Everything else — gsap in particular — is left to Rollup, so the
          // chunk it already earns from its dynamic import is not dragged
          // back into a vendor bundle that loads on every page.
          return undefined;
        },
      },
    },
  },
  // PORT lets a supervisor place the dev server; 3000 otherwise.
  server: { port: Number(process.env.PORT) || 3000, open: false },
  preview: { port: Number(process.env.PORT) || 4173 },
});
