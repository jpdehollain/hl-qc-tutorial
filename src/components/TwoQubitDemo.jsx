import { useState } from "react";
import CodeRunner from "./CodeRunner";
import BlochPlayer from "./BlochPlayer";
import { useCodeRun } from "../lib/usePython";
import { fmtComplex } from "../lib/format";
import rawCode from "../python/two_qubit.py?raw";
import collect from "../python/collect_two.py?raw";
import "./Demos.css";

const defaultCode = rawCode.replace(/\r\n/g, "\n");

export default function TwoQubitDemo() {
  const [code, setCode] = useState(defaultCode);
  const { status, stdout, error, result, pythonPhase, run } = useCodeRun();

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

      <BlochPlayer
        titles={["Qubit 1", "Qubit 2"]}
        times={result?.times}
        data={result ? [result.bloch1, result.bloch2] : null}
        readout={({ t, index }) => {
          const e = result.entanglement[index];
          const a = result.amps[index];
          return (
            <>
              <span>t = {t.toFixed(2)} s</span>
              <span className="meter-wrap">
                entanglement
                <span className="meter" role="img" aria-label={`Entanglement ${e.toFixed(2)} out of 1`}>
                  <span className="meter-fill" style={{ width: `${Math.round(e * 100)}%` }} />
                </span>
                {e.toFixed(2)}
              </span>
              <span className="readout-wide">
                state = ({[0, 1, 2, 3].map((k) => fmtComplex(a[2 * k], a[2 * k + 1])).join(", ")})
              </span>
            </>
          );
        }}
      />
    </div>
  );
}
