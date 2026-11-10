import json
import numpy as np

# Hidden helper: turns the user's `states` into points on the Bloch sphere.
def _bloch(rho):
    return [2 * rho[0, 1].real, 2 * rho[1, 0].imag, (rho[0, 0] - rho[1, 1]).real]

_states = np.asarray(states, dtype=complex)
if _states.ndim != 2 or _states.shape[1] != 2:
    raise ValueError("`states` should be a list with one 2-number state vector for each time in `times`.")

json.dumps({
    "times": [float(t) for t in times],
    "bloch": [[float(v) for v in _bloch(np.outer(s, s.conj()))] for s in _states],
    "amps": [[float(s[0].real), float(s[0].imag), float(s[1].real), float(s[1].imag)] for s in _states],
}, allow_nan=False)
