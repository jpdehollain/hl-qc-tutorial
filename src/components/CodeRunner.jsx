import { useRef } from "react";
import { usePreloadWhenVisible } from "../lib/usePython";
import "./CodeRunner.css";

/**
 * An editable Python code box with a Run button and an output area.
 * It does not run anything itself: the parent passes the state from useCodeRun().
 */
export default function CodeRunner({ code, onChange, onRun, onReset, status, pythonPhase, stdout, error }) {
  const rootRef = useRef(null);
  usePreloadWhenVisible(rootRef);

  const running = status === "running";
  const downloading = running && pythonPhase === "loading";

  let output = null;
  if (downloading) {
    output = { text: "Downloading Python (first run only, a few seconds)\u2026", kind: "note" };
  } else if (running) {
    output = { text: "Running\u2026", kind: "note" };
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
          <button className="cr-button cr-run" onClick={onRun} disabled={running}>
            {running ? "Running\u2026" : "\u25b6 Run"}
          </button>
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
