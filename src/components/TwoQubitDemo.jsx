import { useState } from "react";
import CodeRunner from "./CodeRunner";
import BlochPlayer from "./BlochPlayer";
import { useCodeRun } from "../lib/usePython";
import { fmtComplex } from "../lib/format";
import rawCode from "../python/two_qubit.py?raw";
import collect from "../python/collect_two.py?raw";
import "./Demos.css";

const defaultCode = rawCode.replace(/\r\n/g, "\n");

// Each preset is the right-hand side of one line of the Python code above
// (`psi_1 = ...` or `psi_2 = ...`). `bloch` is where that state sits on the sphere.
const STATES = {
  "|0\u27e9 (north pole)": { line: "np.array([1, 0], dtype=complex)", bloch: [0, 0, 1] },
  "|1\u27e9 (south pole)": { line: "np.array([0, 1], dtype=complex)", bloch: [0, 0, -1] },
  "|+\u27e9 (equator, +x)": { line: "np.array([1, 1], dtype=complex) / np.sqrt(2)", bloch: [1, 0, 0] },
  "|\u2212\u27e9 (equator, \u2212x)": { line: "np.array([1, -1], dtype=complex) / np.sqrt(2)", bloch: [-1, 0, 0] },
  "|+i\u27e9 (equator, +y)": { line: "np.array([1, 1j], dtype=complex) / np.sqrt(2)", bloch: [0, 1, 0] },
  "|\u2212i\u27e9 (equator, \u2212y)": { line: "np.array([1, -1j], dtype=complex) / np.sqrt(2)", bloch: [0, -1, 0] },
};

const replaceLine = (code, n, line) => code.replace(new RegExp(`^psi_${n} = .*$`, "m"), () => `psi_${n} = ${line}`);

function selected(code, n) {
  const lines = code.split("\n");
  return Object.keys(STATES).find((key) => lines.includes(`psi_${n} = ${STATES[key].line}`)) ?? "custom";
}

// What to expect, from how the two starting states sit relative to each other.
function hintFor(k1, k2) {
  if (!STATES[k1] || !STATES[k2]) return null;
  const dot = STATES[k1].bloch.reduce((sum, v, i) => sum + v * STATES[k2].bloch[i], 0);
  if (dot > 0.99) {
    return "Both qubits start in the same state, so exchanging them changes nothing: nothing moves and the entanglement stays at zero. (Swapping two identical footballs changes nothing.)";
  }
  if (dot < -0.99) {
    return "Opposite states: the two arrows trade places at 1 s. Half-way, at 0.5 s, both arrows have vanished and the pair is fully entangled (entanglement 1).";
  }
  return "These states are neither the same nor opposite. The arrows still trade places at 1 s, but half-way the pair is only partly entangled (entanglement 0.5), so the arrows shrink without vanishing.";
}

export default function TwoQubitDemo() {
  const [code, setCode] = useState(defaultCode);
  const { status, stdout, error, result, pythonPhase, run } = useCodeRun();

  const key1 = selected(code, 1);
  const key2 = selected(code, 2);

  function apply(next) {
    setCode(next);
    if (pythonPhase === "ready") run(next, collect); // Python already loaded: show the result straight away
  }

  const menu = (n, key) => (
    <label>
      Qubit {n} starts in
      <select value={key} onChange={(e) => apply(replaceLine(code, n, STATES[e.target.value].line))}>
        {Object.keys(STATES).map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
        {key === "custom" && <option value="custom" disabled>custom (edited)</option>}
      </select>
    </label>
  );

  const hint = hintFor(key1, key2);

  return (
    <div className="demo">
      <div className="demo-controls">
        {menu(1, key1)}
        {menu(2, key2)}
      </div>

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

      {hint && <p className="demo-hint">{hint}</p>}
    </div>
  );
}
