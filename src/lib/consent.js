// Asks the reader before Python is downloaded. Every Run button goes through
// requestPythonConsent(): the question is only asked the first time (and again
// if the reader said Cancel), and the answer is remembered for this visit.

const KEY = "qc-tutorial-python-ok";

let handler = null; // set by <PythonDownloadDialog>, which is always on screen
let pending = null; // the question currently being asked, shared by simultaneous Run presses
let granted = readRemembered();

function readRemembered() {
  try {
    return sessionStorage.getItem(KEY) === "yes";
  } catch {
    return false; // storage unavailable: we'll just ask again after a reload
  }
}

function remember() {
  try {
    sessionStorage.setItem(KEY, "yes");
  } catch {
    // storage unavailable: the answer is still kept until the page is reloaded
  }
}

/** Called by the dialog component so it can be shown on request. Returns an "unregister" function. */
export function registerConsentHandler(fn) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

/** Resolves to true if the reader is happy for Python to be downloaded, false if they cancelled. */
export async function requestPythonConsent() {
  if (granted) return true;
  if (!handler) return true; // no dialog on screen to ask with: don't block the demo
  if (!pending) {
    pending = handler()
      .then((ok) => {
        if (ok) {
          granted = true;
          remember();
        }
        return ok;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}
