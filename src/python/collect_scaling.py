import json

json.dumps({
    "n": int(n_qubits),
    "seconds": float(step_time),
    "dim": int(H.shape[0]),
    "matrixBytes": int(H.nbytes),
}, allow_nan=False)
