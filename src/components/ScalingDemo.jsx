import { useRef, useState } from "react";
import CodeRunner from "./CodeRunner";
import { MeasuredPlot, PointsTable } from "./ScalingPlots";
import { useCodeRun } from "../lib/useWorkerPython";
import { loadPython } from "../lib/pythonClient";
import { addPoint, clearPoints, usePoints } from "../lib/scalingStore";
import rawCode from "../python/scaling.py?raw";
import collect from "../python/collect_scaling.py?raw";
import "./Demos.css";
import "./ScalingDemo.css";

const defaultCode = rawCode.replace(/\r\n/g, "\n");

const SIZES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const SWEEP_FROM = 2;
const SWEEP_TO = 9; // 10 qubits can take about a minute, so it is left for the user to choose

const sizeLabel = (n) => {
  if (n >= 10) return `${n} qubits (slow: up to a minute or more)`;
  if (n === 9) return `${n} qubits (a few seconds)`;
  return `${n} qubits`;
};

// The number of qubits lives in one line of the Python code: `n_qubits = 6`.
const setQubits = (code, n) => code.replace(/^n_qubits = .*$/m, () => `n_qubits = ${n}`);
const readQubits = (code) => {
  const match = /^n_qubits = (\d+)\s*$/m.exec(code);
  return match ? Number(match[1]) : null;
};

export default function ScalingDemo() {
  const [code, setCode] = useState(defaultCode);
  const { status, stdout, error, pythonPhase, run, cancel } = useCodeRun();
  const points = usePoints();
  const [sweeping, setSweeping] = useState(false);
  const stopRequested = useRef(false);

  const n = readQubits(code);
  const busy = status === "running" || sweeping;

  // Run the code once, and add the measurement to the plot.
  async function runOnce(source) {
    const outcome = await run(source, collect);
    if (outcome?.result) addPoint(outcome.result);
    return outcome;
  }

  // Run every size from 2 to 9 one after another.
  async function runSweep() {
    stopRequested.current = false;
    setSweeping(true);
    for (let k = SWEEP_FROM; k <= SWEEP_TO && !stopRequested.current; k++) {
      const next = setQubits(code, k);
      setCode(next);
      const outcome = await runOnce(next);
      if (!outcome?.result) break; // an error, or the user pressed Stop
    }
    setSweeping(false);
  }

  function stop() {
    stopRequested.current = true;
    cancel();
  }

  return (
    <div className="demo scaling" style={{ "--demo-accent": "var(--accent-5)" }}>
      <div className="demo-controls">
        <label>
          Number of qubits
          <select
            value={SIZES.includes(n) ? n : "custom"}
            disabled={busy}
            onChange={(e) => setCode(setQubits(code, e.target.value))}
          >
            {SIZES.map((k) => (
              <option key={k} value={k}>{sizeLabel(k)}</option>
            ))}
            {!SIZES.includes(n) && <option value="custom" disabled>custom (edited)</option>}
          </select>
        </label>
        <button className="demo-button" onClick={runSweep} disabled={busy}>
          Run {SWEEP_FROM} to {SWEEP_TO} for me
        </button>
        {points.length > 0 && (
          <button className="demo-button demo-button-quiet" onClick={clearPoints} disabled={busy}>
            Clear results
          </button>
        )}
      </div>

      <CodeRunner
        code={code}
        onChange={setCode}
        onRun={() => runOnce(code)}
        onReset={() => setCode(defaultCode)}
        onStop={stop}
        preload={loadPython}
        status={status}
        pythonPhase={pythonPhase}
        stdout={stdout}
        error={error}
      />

      {sweeping && n && <p className="scaling-progress">Simulating {n} qubits&hellip;</p>}

      <MeasuredPlot points={points} />
      <PointsTable points={points} />
    </div>
  );
}
