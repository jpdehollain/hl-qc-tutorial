import { useState } from "react";
import CodeRunner from "./CodeRunner";
import { useCodeRun } from "../lib/usePython";
import { fmtDuration } from "../lib/format";
import rawCode from "../python/timing.py?raw";
import collect from "../python/collect_timing.py?raw";
import "./Demos.css";

const defaultCode = rawCode.replace(/\r\n/g, "\n");

export default function TimingDemo() {
  const [code, setCode] = useState(defaultCode);
  const { status, stdout, error, result, pythonPhase, run } = useCodeRun();

  const rows = result && [
    { label: "1 qubit", size: result.sizeOne, seconds: result.one },
    { label: "2 qubits", size: result.sizeTwo, seconds: result.two },
  ];
  const slowest = rows ? Math.max(...rows.map((r) => r.seconds)) : 1;

  return (
    <div className="demo">
      <CodeRunner
        code={code}
        onChange={setCode}
        onRun={() => run(code, collect)}
        onReset={() => setCode(defaultCode)}
        status={status}
        pythonPhase={pythonPhase}
        stdout={stdout}
        error={error}
      />

      <div className="timing" aria-live="polite">
        {!rows && <p className="timing-idle">Press Run to time one step of the evolution on your device.</p>}
        {rows &&
          rows.map((r) => (
            <div className="timing-row" key={r.label}>
              <div className="timing-label">
                {r.label}
                <span>{r.size}&times;{r.size} matrix, {r.size * r.size} numbers</span>
              </div>
              <div className="timing-track">
                <div className="timing-bar" style={{ width: `${Math.max(2, (r.seconds / slowest) * 100)}%` }} />
              </div>
              <div className="timing-value">{fmtDuration(r.seconds)}</div>
            </div>
          ))}
        {rows && (
          <p className="timing-ratio">
            Two qubits took <strong>{(rows[1].seconds / rows[0].seconds).toFixed(1)}&times;</strong> as long as one
            qubit, per step.
          </p>
        )}
      </div>
    </div>
  );
}
