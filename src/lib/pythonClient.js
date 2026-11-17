// The page's side of the Python runtime: starts the worker (pyodide.worker.js),
// sends it code to run, and can stop it. Same interface as the old pyodide.js.
//
// To use a different Pyodide release, change PYODIDE_VERSION below.
const PYODIDE_VERSION = "0.29.5";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PACKAGES = ["numpy", "scipy"];

let worker = null;
let readyPromise = null;
let rejectReady = null;
let phase = "idle"; // "idle" | "loading" | "ready" | "error"
let nextId = 1;
const pending = new Map(); // run id -> { resolve, reject }
const listeners = new Set();

function setPhase(next) {
  phase = next;
  listeners.forEach((fn) => fn(next));
}

export function getPythonPhase() {
  return phase;
}

export function subscribePythonPhase(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function failAll(error) {
  pending.forEach(({ reject }) => reject(error));
  pending.clear();
}

function startWorker() {
  setPhase("loading");
  const w = new Worker(new URL("./pyodide.worker.js", import.meta.url));
  worker = w;

  readyPromise = new Promise((resolve, reject) => {
    rejectReady = reject;

    const giveUp = (message) => {
      if (worker !== w) return;
      w.terminate();
      worker = null;
      readyPromise = null; // allow a retry on the next Run
      setPhase("error");
      const error = new Error(message);
      failAll(error);
      reject(error);
    };

    w.onmessage = (event) => {
      const msg = event.data;
      if (msg.type === "ready") {
        setPhase("ready");
        resolve();
      } else if (msg.type === "init-error") {
        giveUp(msg.message);
      } else if (msg.type === "result") {
        pending.get(msg.id)?.resolve({ stdout: msg.stdout, result: msg.result });
        pending.delete(msg.id);
      } else if (msg.type === "error") {
        const error = new Error(msg.message);
        error.stdout = msg.stdout;
        pending.get(msg.id)?.reject(error);
        pending.delete(msg.id);
      }
    };
    w.onerror = () => giveUp("Python stopped unexpectedly. Please try again.");
    w.postMessage({ type: "init", indexURL: INDEX_URL, packages: PACKAGES });
  });
  readyPromise.catch(() => {}); // callers handle the error themselves
}

/** Start loading Python (safe to call many times). Resolves when it is ready. */
export function loadPython() {
  if (!readyPromise) startWorker();
  return readyPromise;
}

/**
 * Run `code` in a fresh Python namespace. If `collect` is given, it is run
 * afterwards in the same namespace and its last expression must be a JSON
 * string, which is parsed and returned as `result`.
 */
export async function runPython(code, collect) {
  await loadPython();
  const w = worker;
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    w.postMessage({ type: "run", id, code, collect });
  });
}

/** Stop whatever Python is doing. It restarts (a few seconds) on the next run. */
export function cancelPython() {
  if (!worker) return;
  worker.terminate();
  worker = null;
  readyPromise = null;
  const error = new Error("Stopped");
  error.name = "Cancelled";
  failAll(error);
  rejectReady?.(error);
  rejectReady = null;
  setPhase("idle");
}
