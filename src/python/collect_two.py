import json
import numpy as np

# Hidden helper: finds where each qubit's arrow points if we look at it on its own.
def _bloch(rho):
    return [2 * rho[0, 1].real, 2 * rho[1, 0].imag, (rho[0, 0] - rho[1, 1]).real]

_states = np.asarray(states, dtype=complex)
if _states.ndim != 2 or _states.shape[1] != 4:
    raise ValueError("`states` should be a list with one 4-number state vector for each time in `times`.")

_b1, _b2, _ent = [], [], []
for _s in _states:
    _M = _s.reshape(2, 2)                                # rows: qubit 1, columns: qubit 2
    _b1.append([float(v) for v in _bloch(_M @ _M.conj().T)])
    _b2.append([float(v) for v in _bloch(_M.T @ _M.conj())])
    _ent.append(float(min(1.0, 2 * abs(np.linalg.det(_M)))))

json.dumps({
    "times": [float(t) for t in times],
    "bloch1": _b1,
    "bloch2": _b2,
    "entanglement": _ent,
    "amps": [[float(v) for a in s for v in (a.real, a.imag)] for s in _states],
}, allow_nan=False)
