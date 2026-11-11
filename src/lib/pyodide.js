// Loads Python (Pyodide, i.e. Python compiled to WebAssembly) in the browser,
// once, and lets any component run code in it.
//
// To use a different Pyodide release, change PYODIDE_VERSION below.
const PYODIDE_VERSION = "0.29.5";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;
let phase = "idle"; // "idle" | "loading" | "ready" | "error"
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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing && window.loadPyodide) return resolve();
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("Could not download Python. Check your internet connection and try again."));
    document.head.appendChild(el);
  });
}

/** Start loading Python (safe to call many times). Resolves to the Pyodide instance. */
export function loadPython() {
  if (!pyodidePromise) {
    setPhase("loading");
    pyodidePromise = (async () => {
      await loadScript(`${INDEX_URL}pyodide.js`);
      const py = await window.loadPyodide({ indexURL: INDEX_URL });
      await py.loadPackage("numpy");
      await py.loadPackage("scipy");
      setPhase("ready");
      return py;
    })().catch((err) => {
      pyodidePromise = null; // allow a retry on the next Run
      setPhase("error");
      throw err;
    });
  }
  return pyodidePromise;
}

// Python tracebacks are long; the last few lines are the useful ones.
function tidyError(message) {
  const lines = String(message).trim().split("\n");
  const start = lines.findIndex((l) => l.startsWith("Traceback"));
  if (start === -1) return lines.join("\n");
  return ["Traceback (most recent call last):", ...lines.slice(-4)].join("\n");
}

/**
 * Run `code` in a fresh Python namespace. If `collect` is given, it is run
 * afterwards in the same namespace and its last expression must be a JSON
 * string, which is parsed and returned as `result`.
 */
export async function runPython(code, collect) {
  const py = await loadPython();
  const out = [];
  py.setStdout({ batched: (line) => out.push(line) });
  py.setStderr({ batched: (line) => out.push(line) });
  const ns = py.globals.get("dict")();
  try {
    await py.runPythonAsync(code, { globals: ns });
    const json = collect ? await py.runPythonAsync(collect, { globals: ns }) : null;
    return { stdout: out.join("\n"), result: json ? JSON.parse(json) : null };
  } catch (err) {
    const wrapped = new Error(tidyError(err.message ?? err));
    wrapped.stdout = out.join("\n");
    throw wrapped;
  } finally {
    ns.destroy();
  }
}
