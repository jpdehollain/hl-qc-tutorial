import { useCallback, useEffect, useRef, useState } from "react";
import { getPythonPhase, loadPython, runPython, subscribePythonPhase } from "./pyodide";
import { requestPythonConsent } from "./consent";

/** The current state of the shared Python runtime: idle | loading | ready | error. */
export function usePythonPhase() {
  const [phase, setPhase] = useState(getPythonPhase());
  useEffect(() => subscribePythonPhase(setPhase), []);
  return phase;
}

/**
 * Run Python code and keep track of the outcome.
 * `result` keeps the last successful result, so a typo in the code doesn't
 * wipe the picture.
 */
export function useCodeRun() {
  const [state, setState] = useState({ status: "idle", stdout: "", error: "", result: null });
  const latest = useRef(0);
  const pythonPhase = usePythonPhase();

  const run = useCallback(async (code, collect) => {
    // Ask before the first download of Python (only once per visit).
    if (!(await requestPythonConsent())) {
      setState((s) => ({ ...s, status: "declined", error: "" }));
      return { declined: true };
    }
    const id = ++latest.current;
    setState((s) => ({ ...s, status: "running", error: "" }));
    try {
      const { stdout, result } = await runPython(code, collect);
      if (id === latest.current) setState({ status: "done", stdout, error: "", result });
    } catch (err) {
      if (id === latest.current) {
        setState((s) => ({ status: "error", stdout: err.stdout ?? "", error: err.message, result: s.result }));
      }
    }
  }, []);

  return { ...state, run, pythonPhase };
}
