/** Format a complex number for display, e.g. 0.71-0.71i */
export function fmtComplex(re, im) {
  const r = Math.abs(re) < 5e-3 ? 0 : re;
  const i = Math.abs(im) < 5e-3 ? 0 : im;
  if (i === 0) return r.toFixed(2);
  if (r === 0) return `${i.toFixed(2)}i`;
  return `${r.toFixed(2)}${i < 0 ? "\u2212" : "+"}${Math.abs(i).toFixed(2)}i`;
}

/** Format a duration given in seconds as µs / ms / s. */
export function fmtDuration(seconds) {
  if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(1)} \u00b5s`;
  if (seconds < 1) return `${(seconds * 1e3).toFixed(1)} ms`;
  return `${seconds.toFixed(2)} s`;
}
