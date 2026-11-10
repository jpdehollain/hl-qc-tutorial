import { useState } from "react";
import CodeRunner from "./CodeRunner";
import BlochPlayer from "./BlochPlayer";
import { useCodeRun } from "../lib/usePython";
import { fmtComplex } from "../lib/format";
import rawCode from "../python/single_qubit.py?raw";
import collect from "../python/collect_single.py?raw";
import "./Demos.css";

const defaultCode = rawCode.replace(/\r\n/g, "\n");

// Each preset is one line of the Python code above. Picking one swaps that line;
// editing the code by hand makes the menu show "custom".
const HAMILTONIANS = {
  "X": {
    line: "H = (np.pi / 2) * X",
    hint: "X spins the arrow around the x axis (the line through |+\u27e9 and |\u2212\u27e9). Starting from a pole, the arrow flips between |0\u27e9 and |1\u27e9 every second, like our quantum football.",
  },
  "Y": {
    line: "H = (np.pi / 2) * Y",
    hint: "Y spins the arrow around the y axis. Starting from |0\u27e9 it still flips to |1\u27e9 in exactly one second, but it takes a different route round the sphere.",
  },
  "Z": {
    line: "H = (np.pi / 2) * Z",
    hint: "Z spins the arrow around the vertical axis. If the arrow already points at a pole there is nothing to spin, so the state doesn't change at all. Try starting from |+\u27e9 and watch the arrow circle the equator.",
  },
  "X + Z": {
    line: "H = (np.pi / 2) * (X + Z) / np.sqrt(2)",
    hint: "Adding X and Z gives a spin around an axis halfway between them. From |0\u27e9 the arrow only gets as far as the equator before heading back.",
  },
};

const STATES = {
  "|0\u27e9 (north pole)": "psi0 = np.array([1, 0], dtype=complex)",
  "|1\u27e9 (south pole)": "psi0 = np.array([0, 1], dtype=complex)",
  "|+\u27e9 (on the equator)": "psi0 = np.array([1, 1], dtype=complex) / np.sqrt(2)",
};

const replaceLine = (code, start, line) => code.replace(new RegExp(`^${start}.*$`, "m"), () => line);

function selected(code, presets, pick) {
  const lines = code.split("\n");
  return Object.keys(presets).find((key) => lines.includes(pick(presets[key]))) ?? "custom";
}

export default function SingleQubitDemo() {
  const [code, setCode] = useState(defaultCode);
  const { status, stdout, error, result, pythonPhase, run } = useCodeRun();

  const hKey = selected(code, HAMILTONIANS, (p) => p.line);
  const sKey = selected(code, STATES, (p) => p);

  function apply(next) {
    setCode(next);
    if (pythonPhase === "ready") run(next, collect); // Python already loaded: show the result straight away
  }

  return (
    <div className="demo">
      <div className="demo-controls">
        <label>
          Hamiltonian
          <select value={hKey} onChange={(e) => apply(replaceLine(code, "H = ", HAMILTONIANS[e.target.value].line))}>
            {Object.keys(HAMILTONIANS).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
            {hKey === "custom" && <option value="custom" disabled>custom (edited)</option>}
          </select>
        </label>
        <label>
          Starting state
          <select value={sKey} onChange={(e) => apply(replaceLine(code, "psi0 = ", STATES[e.target.value]))}>
            {Object.keys(STATES).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
            {sKey === "custom" && <option value="custom" disabled>custom (edited)</option>}
          </select>
        </label>
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
        titles={[""]}
        times={result?.times}
        data={result ? [result.bloch] : null}
        readout={({ t, index }) => {
          const [ar, ai, br, bi] = result.amps[index];
          return (
            <>
              <span>t = {t.toFixed(2)} s</span>
              <span>state = ({fmtComplex(ar, ai)}, {fmtComplex(br, bi)})</span>
              <span>P(0) = {(ar * ar + ai * ai).toFixed(2)}</span>
              <span>P(1) = {(br * br + bi * bi).toFixed(2)}</span>
            </>
          );
        }}
      />

      {HAMILTONIANS[hKey] && <p className="demo-hint">{HAMILTONIANS[hKey].hint}</p>}
    </div>
  );
}
