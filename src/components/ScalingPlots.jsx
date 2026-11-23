import { useId } from "react";
import {
  FIT_FROM,
  REFERENCES,
  fitExponential,
  fmtAxis,
  fmtBytes,
  fmtLong,
  fmtSeconds,
  fmtTick,
  matrixBytes,
  niceScale,
  tenToThe,
} from "../lib/scalingMath";
import "./ScalingPlots.css";

const W = 640;
const H = 380;
const M = { l: 86, r: 26, t: 22, b: 58 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

function scales(xMin, xMax, yMinK, yMaxK) {
  return {
    x: (n) => M.l + ((n - xMin) / (xMax - xMin)) * PW,
    y: (seconds) => M.t + (1 - (Math.log10(seconds) - yMinK) / (yMaxK - yMinK)) * PH,
    yk: (k) => M.t + (1 - (k - yMinK) / (yMaxK - yMinK)) * PH,
  };
}

/** The frame shared by both plots: grid, axes and their labels. */
function Frame({ sc, xTicks, yTicks, children, label, clipId, yTitle }) {
  return (
    <svg className="sp-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <clipPath id={clipId}>
          <rect x={M.l} y={M.t} width={PW} height={PH} />
        </clipPath>
      </defs>
      {yTicks.map((t) => (
        <g key={t.label}>
          <line className="sp-grid" x1={M.l} x2={W - M.r} y1={t.y} y2={t.y} />
          <text className="sp-tick" x={M.l - 10} y={t.y + 4} textAnchor="end">{t.label}</text>
        </g>
      ))}
      {xTicks.map((n) => (
        <text key={n} className="sp-tick" x={sc.x(n)} y={H - M.b + 20} textAnchor="middle">{n}</text>
      ))}
      <line className="sp-axis" x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} />
      <line className="sp-axis" x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} />
      <text className="sp-title" x={M.l + PW / 2} y={H - 10} textAnchor="middle">Number of qubits</text>
      <text className="sp-title" transform={`translate(18 ${M.t + PH / 2}) rotate(-90)`} textAnchor="middle">
        {yTitle}
      </text>
      {children}
    </svg>
  );
}

/** Plot 1: the measurements on a linear axis, so each new result dwarfs the ones before it. */
export function MeasuredPlot({ points }) {
  const clipId = "sp-clip-" + useId().replace(/:/g, "");
  const xMin = 1.5;
  const xMax = 10.5;
  const { top, ticks } = niceScale(points.length ? Math.max(...points.map((p) => p.seconds)) : 1);
  const x = (n) => M.l + ((n - xMin) / (xMax - xMin)) * PW;
  const y = (seconds) => M.t + (1 - seconds / top) * PH;
  const yTicks = ticks.map((v) => ({ y: y(v), label: fmtAxis(v) }));
  const xTicks = Array.from({ length: 9 }, (_, i) => i + 2);
  const showBand = points.some((p) => p.n < FIT_FROM);
  const biggest = points.length ? points.reduce((a, b) => (b.seconds > a.seconds ? b : a)) : null;

  // The fitted curve, drawn only over the range that has been measured so far.
  const fit = fitExponential(points);
  let fitPath = null;
  if (fit) {
    const fitted = points.filter((p) => p.n >= FIT_FROM).map((p) => p.n);
    const from = Math.min(...fitted);
    const to = Math.max(...fitted);
    const curve = [];
    for (let n = from; n <= to + 1e-9; n += 0.1) curve.push(`${x(n)},${y(fit.predict(n))}`);
    fitPath = curve.join(" ");
  }

  return (
    <Frame
      sc={{ x }}
      xTicks={xTicks}
      yTicks={yTicks}
      clipId={clipId}
      yTitle="Time for one step"
      label="Time for one step against number of qubits, on a linear scale"
    >
      {showBand && (
        <g>
          <rect className="sp-band" x={M.l} y={M.t} width={x(FIT_FROM - 0.5) - M.l} height={PH} />
          <text className="sp-note" x={(M.l + x(FIT_FROM - 0.5)) / 2} y={M.t + PH * 0.5} textAnchor="middle">
            mostly overhead
          </text>
        </g>
      )}
      <g clipPath={`url(#${clipId})`}>
        {fitPath && <polyline className="sp-fit" fill="none" points={fitPath} />}
        {points.length > 1 && (
          <polyline className="sp-line" points={points.map((p) => `${x(p.n)},${y(p.seconds)}`).join(" ")} />
        )}
      </g>
      {points.map((p) => (
        <circle key={p.n} className="sp-point" cx={x(p.n)} cy={y(p.seconds)} r="5.5">
          <title>{`${p.n} qubits: ${fmtSeconds(p.seconds)} per step`}</title>
        </circle>
      ))}
      {biggest && (
        <text
          className="sp-valuelabel"
          x={x(biggest.n) + (x(biggest.n) < M.l + 110 ? 12 : -12)}
          y={y(biggest.seconds) + 4}
          textAnchor={x(biggest.n) < M.l + 110 ? "start" : "end"}
        >
          {fmtSeconds(biggest.seconds)}
        </text>
      )}
      {fit && (
        <text className="sp-note sp-note-strong" x={M.l + 12} y={M.t + 20}>
          {`about \u00d7${Math.round(fit.factor)} slower for every extra qubit`}
        </text>
      )}
      {!points.length && (
        <text className="sp-note" x={M.l + PW / 2} y={M.t + PH / 2} textAnchor="middle">
          Run a simulation to add a point
        </text>
      )}
    </Frame>
  );
}

/** Plot 2: the measurements, with the straight-line fit. */
export function MeasuredPlotLog({ points }) {
  const clipId = "sp-clip-" + useId().replace(/:/g, "");
  const xMin = 1.5;
  const xMax = 10.5;
  let lo = -4;
  let hi = 2;
  if (points.length) {
    lo = Math.floor(Math.log10(Math.min(...points.map((p) => p.seconds))));
    hi = Math.max(Math.ceil(Math.log10(Math.max(...points.map((p) => p.seconds)))), lo + 3);
  }
  const sc = scales(xMin, xMax, lo, hi);
  const step = hi - lo > 8 ? 2 : 1;
  const yTicks = [];
  for (let k = lo; k <= hi; k += step) yTicks.push({ y: sc.yk(k), label: fmtTick(k) });
  const xTicks = Array.from({ length: 9 }, (_, i) => i + 2);
  const fit = fitExponential(points);
  const showBand = points.some((p) => p.n < FIT_FROM);

  return (
    <Frame sc={sc} xTicks={xTicks} yTicks={yTicks} clipId={clipId} yTitle="Time for one step (log scale)" label="Time for one step against number of qubits, on a logarithmic scale">
      {showBand && (
        <g>
          <rect className="sp-band" x={M.l} y={M.t} width={sc.x(FIT_FROM - 0.5) - M.l} height={PH} />
          <text className="sp-note" x={(M.l + sc.x(FIT_FROM - 0.5)) / 2} y={M.t + PH * 0.5} textAnchor="middle">
            mostly overhead
          </text>
        </g>
      )}
      <g clipPath={`url(#${clipId})`}>
        {fit && (
          <line
            className="sp-fit"
            x1={sc.x(FIT_FROM)} y1={sc.y(fit.predict(FIT_FROM))}
            x2={sc.x(xMax)} y2={sc.y(fit.predict(xMax))}
          />
        )}
        {points.length > 1 && (
          <polyline className="sp-line" points={points.map((p) => `${sc.x(p.n)},${sc.y(p.seconds)}`).join(" ")} />
        )}
      </g>
      {points.map((p) => (
        <circle key={p.n} className="sp-point" cx={sc.x(p.n)} cy={sc.y(p.seconds)} r="5.5">
          <title>{`${p.n} qubits: ${fmtSeconds(p.seconds)} per step`}</title>
        </circle>
      ))}
      {fit && (
        <text className="sp-note sp-note-strong" x={M.l + 12} y={M.t + 20}>
          {`about \u00d7${Math.round(fit.factor)} slower for every extra qubit`}
        </text>
      )}
      {!points.length && (
        <text className="sp-note" x={M.l + PW / 2} y={M.t + PH / 2} textAnchor="middle">
          Run a simulation to add a point
        </text>
      )}
    </Frame>
  );
}

/** Plot 3: the same line, extended until it passes the age of the universe. */
export function ExtrapolationPlot({ points }) {
  const examples = points.some((p) => p.example);
  const clipId = "sp-clip-" + useId().replace(/:/g, "");
  const fit = fitExponential(points);
  const universe = REFERENCES.find((r) => r.key === "universe");
  const crossing = fit ? fit.qubitsFor(universe.seconds) : null;

  const xMin = 1.5;
  const xMax = crossing ? Math.min(60, Math.max(20, Math.ceil(crossing) + 5)) : 30;
  const yMinK = -4;
  const yMaxK = 20;
  const sc = scales(xMin, xMax, yMinK, yMaxK);
  const yTicks = [-4, 0, 4, 8, 12, 16, 20].map((k) => ({ y: sc.yk(k), label: k === 0 ? "1 s" : `${tenToThe(k)} s` }));
  const xTicks = [];
  for (let n = 5; n <= xMax; n += 5) xTicks.push(n);
  const lastMeasured = points.length ? Math.max(...points.map((p) => p.n)) : null;

  return (
    <div className="sp-wrap">
      <Frame sc={sc} xTicks={xTicks} yTicks={yTicks} clipId={clipId} yTitle="Time for one step (log scale)" label="Extrapolated time for one step against number of qubits, on a logarithmic scale, compared with the age of the universe">
        <rect className="sp-beyond" x={M.l} y={M.t} width={PW} height={sc.y(universe.seconds) - M.t} />
        {REFERENCES.map((r) => (
          <g key={r.key}>
            <line className={`sp-ref sp-ref-${r.key}`} x1={M.l} x2={W - M.r} y1={sc.y(r.seconds)} y2={sc.y(r.seconds)} />
            <text className="sp-reflabel" x={M.l + 8} y={sc.y(r.seconds) - 6}>{r.label}</text>
          </g>
        ))}
        <g clipPath={`url(#${clipId})`}>
          {fit && lastMeasured && (
            <>
              <line
                className="sp-fit-solid"
                x1={sc.x(FIT_FROM)} y1={sc.y(fit.predict(FIT_FROM))}
                x2={sc.x(lastMeasured)} y2={sc.y(fit.predict(lastMeasured))}
              />
              <line
                className="sp-fit"
                x1={sc.x(lastMeasured)} y1={sc.y(fit.predict(lastMeasured))}
                x2={sc.x(xMax)} y2={sc.y(fit.predict(xMax))}
              />
            </>
          )}
        </g>
        {fit &&
          REFERENCES.map((r) => {
            const xc = fit.qubitsFor(r.seconds);
            if (!(xc > xMin && xc < xMax)) return null;
            return (
              <g key={r.key}>
                <line className="sp-drop" x1={sc.x(xc)} x2={sc.x(xc)} y1={sc.y(r.seconds)} y2={H - M.b} />
                <circle className="sp-cross" cx={sc.x(xc)} cy={sc.y(r.seconds)} r="4.5" />
                <text className="sp-crosslabel" x={sc.x(xc) - 26} y={sc.y(r.seconds) + 18} textAnchor="end">
                  {`\u2248 ${Math.round(xc)} qubits`}
                </text>
              </g>
            );
          })}
        {points.map((p) => (
          <circle
            key={p.n}
            className={`sp-point${p.n < FIT_FROM ? " sp-point-faded" : ""}`}
            cx={sc.x(p.n)} cy={sc.y(p.seconds)} r="5"
          >
            <title>{`${p.n} qubits: ${fmtSeconds(p.seconds)} per step`}</title>
          </circle>
        ))}
        {!fit && (
          <text className="sp-note" x={M.l + PW / 2} y={M.t + PH / 2 + 40} textAnchor="middle">
            Run simulations with 6 or more qubits above to draw the line
          </text>
        )}
      </Frame>
      {fit && (
        <p className="sp-caption">
            {examples ? "In the example results" : "On this device"} every extra qubit makes a step about <strong>{`\u00d7${Math.round(fit.factor)}`}</strong>{" "}
          slower. A single step would take longer than the age of the universe at around{" "}
          <strong>{Math.round(crossing)} qubits</strong>, where the matrix alone would need{" "}
          {fmtBytes(matrixBytes(Math.round(crossing)))} of memory.
        </p>
      )}
    </div>
  );
}

/** The numbers behind plot 1. */
export function PointsTable({ points }) {
  if (!points.length) return null;
  return (
    <table className="sp-table">
      <thead>
        <tr>
          <th>Qubits</th>
          <th>Matrix size</th>
          <th>Memory for the matrix</th>
          <th>One step</th>
        </tr>
      </thead>
      <tbody>
        {points.map((p) => (
          <tr key={p.n}>
            <td>{p.n}</td>
            <td>{`${p.dim ?? 2 ** p.n} \u00d7 ${p.dim ?? 2 ** p.n}`}</td>
            <td>{fmtBytes(p.matrixBytes)}</td>
            <td>{p.seconds < 60 ? fmtSeconds(p.seconds) : fmtLong(p.seconds)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
