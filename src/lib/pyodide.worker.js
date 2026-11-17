// Runs Python (Pyodide) in a background thread, so the page stays responsive
// while a long simulation is running. Talks to pythonClient.js by messages.
//
//   page -> worker:  { type: "init", indexURL, packages }
//                    { type: "run", id, code, collect }
//   worker -> page:  { type: "ready" } | { type: "init-error", message }
//                    { type: "result", id, stdout, result }
//                    { type: "error", id, message, stdout }

let pyodide = null;
let queue = Promise.resolve(); // run one piece of Python at a time

// Python tracebacks are long and mention Pyodide's own internals. Keep only
// the frames from the user's code, plus the final error message.
function tidyError(message) {
  const lines = String(message).trim().split("\n");
  if (!lines.some((l) => l.startsWith("Traceback"))) return lines.join("\n");
  const out = ["Traceback (most recent call last):"];
  for (let i = 1; i < lines.length - 1; i++) {
    if (lines[i].includes('File "<exec>"')) out.push(lines[i]);
  }
  out.push(lines[lines.length - 1]);
  return out.join("\n");
}

async function init({ indexURL, packages }) {
  try {
    importScripts(`${indexURL}pyodide.js`);
    pyodide = await self.loadPyodide({ indexURL });
    await pyodide.loadPackage(packages);
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({
      type: "init-error",
      message: "Could not download Python. Check your internet connection and try again.",
      detail: String(err && err.message ? err.message : err),
    });
  }
}

async function run({ id, code, collect }) {
  const out = [];
  pyodide.setStdout({ batched: (line) => out.push(line) });
  pyodide.setStderr({ batched: (line) => out.push(line) });
  const ns = pyodide.globals.get("dict")(); // a fresh namespace for every run
  try {
    await pyodide.runPythonAsync(code, { globals: ns });
    const json = collect ? await pyodide.runPythonAsync(collect, { globals: ns }) : null;
    self.postMessage({ type: "result", id, stdout: out.join("\n"), result: json ? JSON.parse(json) : null });
  } catch (err) {
    self.postMessage({
      type: "error",
      id,
      message: tidyError(err && err.message ? err.message : err),
      stdout: out.join("\n"),
    });
  } finally {
    ns.destroy();
  }
}

self.onmessage = (event) => {
  const msg = event.data;
  if (msg.type === "init") {
    queue = queue.then(() => init(msg));
  } else if (msg.type === "run") {
    queue = queue.then(() => run(msg));
  }
};
