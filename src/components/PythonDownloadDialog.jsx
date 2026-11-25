import { useEffect, useRef } from "react";
import { PYTHON_DOWNLOAD_MB } from "../config";
import { registerConsentHandler } from "../lib/consent";
import "./PythonDownloadDialog.css";

/**
 * The "download Python?" question. Mounted once, near the top of the app; it
 * opens when any Run button is pressed for the first time (see lib/consent.js).
 */
export default function PythonDownloadDialog() {
  const dialogRef = useRef(null);
  const answerRef = useRef(null);

  useEffect(
    () =>
      registerConsentHandler(
        () =>
          new Promise((resolve) => {
            answerRef.current = resolve;
            dialogRef.current?.showModal();
          })
      ),
    []
  );

  function answer(ok) {
    dialogRef.current?.close();
    answerRef.current?.(ok);
    answerRef.current = null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="py-dialog"
      aria-labelledby="py-dialog-title"
      onCancel={(e) => {
        e.preventDefault(); // Esc: treat it as Cancel
        answer(false);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) answer(false); // a click on the dimmed background
      }}
    >
      <div className="py-dialog-box">
        <h2 id="py-dialog-title">Download Python to run this code?</h2>
        <p>
          To run code, your browser needs to download Python (about {PYTHON_DOWNLOAD_MB} MB).
          Nothing is installed: Python runs inside this page, and stops when you close it.
        </p>
        <p>Press Continue to download it, or Cancel to carry on with the tutorial without
          running the simulations &mdash; you can press {" "}
          <code>Use example results</code> to load example data on the figures in chapter 5.
        </p>
        <div className="py-dialog-buttons">
          <button onClick={() => answer(false)}>Cancel</button>
          <button className="py-dialog-primary" onClick={() => answer(true)} autoFocus>
            Continue
          </button>
        </div>
      </div>
    </dialog>
  );
}
