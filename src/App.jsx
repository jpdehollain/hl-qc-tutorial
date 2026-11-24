import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import About from "./components/About";
import PythonDownloadDialog from "./components/PythonDownloadDialog";
import Chapter1 from "./chapters/Chapter1";
import Chapter2 from "./chapters/Chapter2";
import Chapter3 from "./chapters/Chapter3";
import Chapter4 from "./chapters/Chapter4";
import Chapter5 from "./chapters/Chapter5";
import "./App.css";

const CHAPTER_COMPONENTS = {
  1: Chapter1,
  2: Chapter2,
  3: Chapter3,
  4: Chapter4,
  5: Chapter5,
};

export default function App() {
  const LAST_CHAPTER = Object.keys(CHAPTER_COMPONENTS).length;
  const [current, setCurrent] = useState(1); // a chapter number, or "about"
  const [returnTo, setReturnTo] = useState(1); // where "Back" goes from the About page
  const showingAbout = current === "about";
  const ChapterView = showingAbout ? About : CHAPTER_COMPONENTS[current];

  function select(id) {
    if (id === "about" && typeof current === "number") setReturnTo(current);
    setCurrent(id);
  }
  const contentRef = useRef(null);

  // Start every chapter at the top. On wide screens the content pane scrolls
  // by itself, on narrow screens the whole page does, so reset both.
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <div className="app-shell">
      <Sidebar current={current} onSelect={select} />
      <main className="content" ref={contentRef}>
        <div className="content-inner">
          <ErrorBoundary resetKey={current}>
            <ChapterView />
          </ErrorBoundary>
          <div className="chapter-nav">
            {showingAbout ? (
              <button onClick={() => setCurrent(returnTo)}>&larr; Back to chapter {returnTo}</button>
            ) : (
              <>
                <button
                  disabled={current === 1}
                  onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                >
                  &larr; Previous
                </button>
                <button
                  disabled={current === LAST_CHAPTER}
                  onClick={() => setCurrent((c) => Math.min(LAST_CHAPTER, c + 1))}
                >
                  Next &rarr;
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <PythonDownloadDialog />
    </div>
  );
}
