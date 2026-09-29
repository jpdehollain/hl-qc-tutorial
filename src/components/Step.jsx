import "./Step.css";

/**
 * A collapsible derivation step. Renders as a native <details> element,
 * so it needs no state and is keyboard/screen-reader accessible for free.
 *
 *   <Step title="Step 1 — find the eigenvalues of X">
 *     ...content...
 *   </Step>
 */
export default function Step({ title, defaultOpen = false, children }) {
  return (
    <details className="step" open={defaultOpen}>
      <summary className="step-summary">{title}</summary>
      <div className="step-body">{children}</div>
    </details>
  );
}
