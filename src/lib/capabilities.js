// Checks for browser features the interactive parts need, and the messages to
// show when they are missing.

export const NO_WASM_MESSAGE =
  "Your browser can't run the interactive Python demos because it doesn't support WebAssembly. " +
  "A recent version of Chrome, Firefox, Safari or Edge will.";

export const PYTHON_DOWNLOAD_FAILED =
  "Could not download Python. Check your internet connection and try again. " +
  "(Some school and work networks block the site that Python is downloaded from.)";

export function hasWebAssembly() {
  return typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function";
}

let webglSupported;

/** Can this browser draw 3D graphics? (Checked once, with a throwaway canvas.) */
export function hasWebGL() {
  if (webglSupported === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      webglSupported = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext(); // free the test context straight away
    } catch {
      webglSupported = false;
    }
  }
  return webglSupported;
}
