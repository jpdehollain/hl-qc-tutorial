import { useEffect, useRef, useState } from "react";
import { usePreloadWhenVisible } from "../lib/usePython";
import "./CodeRunner.css";

// Counts the seconds since it appeared on screen.
function Elapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => setSeconds(Math.floor((performance.now() - start) / 1000)), 500);
    return () => clearInterval(id);
  }, []);
  return <>{seconds} s</>;
}

/**
 * An editable Python code box with a Run button and an output area.
 * It does not run anything itself: the parent passes the state from useCodeRun().
 * Pass `onStop` to show a Stop button while the code is running, and `preload`
 * (a function that starts loading Python) if the demo doesn't use the default runtime.
 */
export default function CodeRunner({ code, onChange, onRun, onReset, onStop, preload, status, pythonPhase, stdout, error }) {
  const rootRef = useRef(null);
  usePreloadWhenVisible(rootRef, preload);

  const running = status === "running";
  const downloading = running && pythonPhase === "loading";

  let output = null;
  if (downloading) {
    output = { text: <>Downloading Python (first run only, a few seconds)&hellip; <Elapsed /></>, kind: "note" };
  } else if (running) {
    output = { text: <>Running&hellip; <Elapsed /></>, kind: "note" };
  } else if (status === "stopped") {
    output = { text: "Stopped. Python restarts the next time you press Run (a few seconds).", kind: "note" };
  } else if (error) {
    output = { text: [stdout, error].filter(Boolean).join("\n"), kind: "error" };
  } else if (stdout) {
    output = { text: stdout, kind: "out" };
  } else if (status === "done") {
    output = { text: "Done \u2713", kind: "note" };
  }

  return (
    <div className="cr" ref={rootRef}>
      <div className="cr-bar">
        <span className="cr-lang">Python</span>
        <span className="cr-hint">you can edit this code</span>
        <div className="cr-buttons">
          {onReset && (
            <button className="cr-button" onClick={onReset} disabled={running}>
              Reset
            </button>
          )}
          {running && onStop ? (
            <button className="cr-button cr-run" onClick={onStop}>
              {"\u25a0 Stop"}
            </button>
          ) : (
            <button className="cr-button cr-run" onClick={onRun} disabled={running}>
              {running ? "Running\u2026" : "\u25b6 Run"}
            </button>
          )}
        </div>
      </div>
      <textarea
        className="cr-code"
        value={code}
        rows={code.split("\n").length}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        aria-label="Python code (press Ctrl+Enter to run)"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            if (!running) onRun();
          }
        }}
      />
      {output && (
        <pre className={`cr-output cr-output-${output.kind}`} aria-live="polite">
          {output.text}
        </pre>
      )}
    </div>
  );
}
