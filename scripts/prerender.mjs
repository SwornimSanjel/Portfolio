/**
 * Writes real HTML for every public route.
 *
 * The app is client-rendered, so `dist/index.html` ships an empty
 * `<div id="root">`. Anything that does not execute JavaScript — a WhatsApp
 * or LinkedIn unfurler, most notably, which is how people actually receive
 * this link — sees a title and nothing else.
 *
 * Rather than restructure routing for an SSG framework, this serves the built
 * output, loads each route in a real browser, and saves the resulting DOM.
 * The page it saves is the page a visitor sees, including the per-route title,
 * description, canonical and OpenGraph tags that `useSeo` writes on mount.
 *
 * The bundle is still linked, so the app boots and takes over exactly as
 * before: routing, motion and interactivity are untouched.
 *
 * `--force-prefers-reduced-motion` matters. Reveals are authored at opacity 0
 * and animated up, and a headless capture never runs those frames, so without
 * it every prerendered page would be saved with its content invisible.
 *
 * Requires a Chromium-family browser on the build machine. If none is found
 * the build FAILS rather than quietly shipping empty pages, which is the
 * failure that made this script necessary.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const PORT = 4199;

const BROWSERS = [
  process.env.CHROME_PATH,
  // Alpine/Debian container installs, for CI.
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
  // Local development on macOS.
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].filter(Boolean);

const browser = BROWSERS.find((b) => spawnSync("test", ["-x", b]).status === 0);
if (!browser) {
  console.error(
    "\nprerender: no Chromium-family browser found.\n" +
      "Set CHROME_PATH, or install Brave/Chrome. Refusing to ship un-prerendered HTML.\n",
  );
  process.exit(1);
}

// The sitemap is already generated from the content files and already excludes
// empty sections, so it is the single source of truth for what is public.
const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .map((p) => (p === "" ? "/" : p));

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: root,
  stdio: "ignore",
});

const ready = async () => {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/`);
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
};

try {
  if (!(await ready())) throw new Error("preview server did not start");

  let written = 0;
  for (const route of routes) {
    const res = spawnSync(
      browser,
      [
        "--headless",
        "--disable-gpu",
        // Required when the build runs as root in a container, and harmless
        // otherwise. /dev/shm is small in Docker and Chromium will crash
        // without the second flag.
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
        "--force-prefers-reduced-motion",
        "--virtual-time-budget=8000",
        "--dump-dom",
        `http://localhost:${PORT}${route}`,
      ],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );

    const html = res.stdout ?? "";
    // A page that rendered has its app markup in it. Anything less means the
    // capture raced the app, and shipping it would be worse than not trying.
    if (!html.includes("<h1") || html.includes('<div id="root"></div>')) {
      throw new Error(`prerender: ${route} produced no rendered body`);
    }

    const dir = route === "/" ? dist : path.join(dist, route);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), html);
    written += 1;
  }
  console.log(`prerendered ${written} routes`);
} finally {
  server.kill();
}
