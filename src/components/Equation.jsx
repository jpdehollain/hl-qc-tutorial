import { useEffect, useRef } from "react";
import katex from "katex";

/**
 * Renders a LaTeX string with KaTeX.
 * `display` (default true) renders as a centered block equation;
 * pass display={false} for inline math within a sentence.
 */
export default function Equation({ tex, display = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    katex.render(tex, ref.current, {
      throwOnError: false,
      displayMode: display,
    });
  }, [tex, display]);

  return display ? (
    <div ref={ref} />
  ) : (
    <span ref={ref} />
  );
}
