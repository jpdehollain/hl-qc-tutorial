import { useCallback, useEffect, useRef, useState } from "react";
import { cancelPython, getPythonPhase, runPython, subscribePythonPhase } from "./pythonClient";

// Same idea as usePython.js, but running Python in a background thread (see
// pythonClient.js), so a long simulation doesn't freeze the page and can be stopped.

/** The current state of the Python worker: idle | loading | ready | error. */
export function usePythonPhase() {
  const [phase, setPhase] = useState(getPythonPhase());
  useEffect(() => subscribePythonPhase(setPhase), []);
  return phase;
}

/**
 * Run Python code and keep track of the outcome.
 * `run` resolves to { result } on success, { cancelled: true } if stopped, or { error }.
 * `result` keeps the last successful result, so a typo in the code doesn't wipe the picture.
 */
export function useCodeRun() {
  const [state, setState] = useState({ status: "idle", stdout: "", error: "", result: null });
  const latest = useRef(0);
  const pythonPhase = usePythonPhase();

  const run = useCallback(async (code, collect) => {
    const id = ++latest.current;
    setState((s) => ({ ...s, status: "running", error: "" }));
    try {
      const { stdout, result } = await runPython(code, collect);
      if (id === latest.current) setState({ status: "done", stdout, error: "", result });
      return { result };
    } catch (err) {
      if (err.name === "Cancelled") {
        if (id === latest.current) setState((s) => ({ ...s, status: "stopped", stdout: "", error: "" }));
        return { cancelled: true };
      }
      if (id === latest.current) {
        setState((s) => ({ status: "error", stdout: err.stdout ?? "", error: err.message, result: s.result }));
      }
      return { error: err.message };
    }
  }, []);

  /** Stop the current run. Python restarts (a few seconds) the next time it is needed. */
  const cancel = useCallback(() => cancelPython(), []);

  return { ...state, run, cancel, pythonPhase };
}
