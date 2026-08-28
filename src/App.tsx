import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/layout/Footer";
import { scrollToHashWhenReady } from "@/components/ui/SmartLink";
import Home from "@/routes/Home";

/**
 * The whole site, as one client-rendered app.
 *
 * Home is imported directly — it is where most visits land, and putting it
 * behind a dynamic import would only add a round trip before the first thing
 * anyone sees. Every other route is split, so a visitor who never opens the
 * archive never downloads it.
 */
const Work = lazy(() => import("@/routes/Work"));
const CaseStudy = lazy(() => import("@/routes/CaseStudy"));
const About = lazy(() => import("@/routes/About"));
const Archive = lazy(() => import("@/routes/Archive"));
const Notes = lazy(() => import("@/routes/Notes"));
const Note = lazy(() => import("@/routes/Note"));
const NotFound = lazy(() => import("@/routes/NotFound"));

/**
 * The router restores scroll position; a document reader expects the top of
 * the page. A fragment in the URL wins over both.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      scrollToHashWhenReady(hash);
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

/** Holds the viewport height while a split route loads, so nothing jumps. */
function RouteFallback() {
  return <div className="min-h-[70svh]" aria-busy="true" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      {/* A column that always fills the viewport, so the footer sits at the
          bottom of a short page (404, an empty index) instead of floating
          halfway up with dead ground beneath it. */}
      <MotionProvider>
        <div className="flex min-h-svh flex-col">
          <Nav />
          <main id="main" className="flex-1">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                <Route path="/about" element={<About />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:slug" element={<Note />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </MotionProvider>
    </BrowserRouter>
  );
}
