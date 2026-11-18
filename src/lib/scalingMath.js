// Numbers and formatting for the Chapter 5 plots.

/** Below this many qubits a step takes so little time that overhead dominates, so we don't fit those points. */
export const FIT_FROM = 6;

export const SECONDS_PER_YEAR = 365.25 * 24 * 3600;

/** Landmarks to compare the extrapolated time against. */
export const REFERENCES = [
  { key: "hour", label: "1 hour", seconds: 3600 },
  { key: "year", label: "1 year", seconds: SECONDS_PER_YEAR },
  { key: "universe", label: "age of the universe", seconds: 13.8e9 * SECONDS_PER_YEAR },
];

/** Memory needed to store the 2^n x 2^n complex matrix (16 bytes per entry). */
export const matrixBytes = (n) => 16 * 4 ** n;

/**
 * Fit  log10(seconds) = intercept + slope * n  to the points with n >= fitFrom.
 * Returns null if there aren't enough points, or if the times aren't growing.
 */
export function fitExponential(points, fitFrom = FIT_FROM) {
  const pts = points.filter((p) => p.n >= fitFrom && p.seconds > 0);
  if (pts.length < 2) return null;
  const xs = pts.map((p) => p.n);
  const ys = pts.map((p) => Math.log10(p.seconds));
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const mx = mean(xs);
  const my = mean(ys);
  const sxx = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  if (sxx === 0) return null;
  const slope = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / sxx;
  if (!(slope > 0.1)) return null; // not growing: the measurement is too noisy to extrapolate
  const intercept = my - slope * mx;
  return {
    slope,
    intercept,
    factor: 10 ** slope, // how many times slower each extra qubit makes a step
    count: pts.length,
    predict: (n) => 10 ** (intercept + slope * n),
    qubitsFor: (seconds) => (Math.log10(seconds) - intercept) / slope,
  };
}

/**
 * Round-number axis for a linear plot: ticks 0, step, 2*step ... up to a top
 * just above `max`, e.g. niceScale(39.7) -> { top: 40, ticks: [0, 10, 20, 30, 40] }.
 */
export function niceScale(max, target = 5) {
  const raw = max / target;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalised = raw / magnitude;
  const step = (normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10) * magnitude;
  const top = Math.ceil(max / step - 1e-9) * step;
  const ticks = [];
  for (let v = 0; v <= top + step / 1000; v += step) ticks.push(+v.toPrecision(12));
  return { top: +top.toPrecision(12), ticks };
}

const SUPERSCRIPT = { "-": "\u207b", 0: "\u2070", 1: "\u00b9", 2: "\u00b2", 3: "\u00b3", 4: "\u2074", 5: "\u2075", 6: "\u2076", 7: "\u2077", 8: "\u2078", 9: "\u2079" };
/** 10^k written with a superscript, e.g. "10\u207b\u00b3". */
export const tenToThe = (k) => "10" + String(k).split("").map((c) => SUPERSCRIPT[c]).join("");

/** Label for a tick on the linear axis: always seconds above 1 s, so 80 s doesn't become "1.33 min". */
export function fmtAxis(s) {
  if (s === 0) return "0";
  if (s < 1e-3) return `${+(s * 1e6).toPrecision(3)} \u00b5s`;
  if (s < 1) return `${+(s * 1e3).toPrecision(3)} ms`;
  return `${+s.toPrecision(3)} s`;
}

/** Short label for a time in seconds, for axes and tables. */
export function fmtSeconds(s) {
  if (s < 1e-3) return `${+(s * 1e6).toPrecision(3)} \u00b5s`;
  if (s < 1) return `${+(s * 1e3).toPrecision(3)} ms`;
  if (s < 60) return `${+s.toPrecision(3)} s`;
  if (s < 3600) return `${+(s / 60).toPrecision(3)} min`;
  return `${+(s / 3600).toPrecision(3)} hours`;
}

/** Axis label for the time 10^k seconds, e.g. "100 \u00b5s", "10 ms", "1 s", "100 s". */
export function fmtTick(k) {
  const v = 10 ** k;
  if (v < 1e-3) return `${Math.round(v * 1e6)} \u00b5s`;
  if (v < 1) return `${Math.round(v * 1e3)} ms`;
  return `${v} s`;
}

/** Friendly label for very long times, e.g. "5 days" or "3 billion years". */
export function fmtLong(s) {
  if (s < 60) return fmtSeconds(s);
  if (s < 86400) return fmtSeconds(s);
  const days = s / 86400;
  if (days < 365) return `${+days.toPrecision(2)} days`;
  const years = s / SECONDS_PER_YEAR;
  if (years < 1e6) return `${+years.toPrecision(2)} years`;
  if (years < 1e9) return `${+(years / 1e6).toPrecision(2)} million years`;
  if (years < 1e12) return `${+(years / 1e9).toPrecision(2)} billion years`;
  return `${(years / 1e9).toExponential(1)} billion years`;
}

export function fmtBytes(b) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  let v = b;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  return `${i === 0 ? v : +v.toPrecision(3)} ${units[i]}`;
}
