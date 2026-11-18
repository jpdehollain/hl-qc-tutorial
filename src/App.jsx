import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
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
  const [current, setCurrent] = useState(1);
  const ChapterView = CHAPTER_COMPONENTS[current];
  const contentRef = useRef(null);

  // Start every chapter at the top. On wide screens the content pane scrolls
  // by itself, on narrow screens the whole page does, so reset both.
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <div className="app-shell">
      <Sidebar current={current} onSelect={setCurrent} />
      <main className="content" ref={contentRef}>
        <div className="content-inner">
          <ChapterView />
          <div className="chapter-nav">
            <button
              disabled={current === 1}
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
            >
              &larr; Previous
            </button>
            <button
              disabled={current === 6}
              onClick={() => setCurrent((c) => Math.min(6, c + 1))}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
