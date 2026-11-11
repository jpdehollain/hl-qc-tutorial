import time
import numpy as np
from scipy.linalg import expm

X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)


def time_one_step(H, psi0, dt=0.01, repeats=2000):
    """Average time, in seconds, to take one step of the time evolution."""
    expm(-1j * H * dt) @ psi0          # warm-up run, not timed
    start = time.perf_counter()
    for _ in range(repeats):
        psi = expm(-1j * H * dt) @ psi0
    return (time.perf_counter() - start) / repeats


# One qubit: a 2x2 matrix
H_one = (np.pi / 2) * X
psi_one = np.array([1, 0], dtype=complex)

# Two qubits: a 4x4 matrix
H_two = (np.pi / 4) * (np.kron(X, X) + np.kron(Y, Y) + np.kron(Z, Z))
psi_two = np.kron(psi_one, psi_one)

load_run = time_one_step(H_one, psi_one)
time_one = time_one_step(H_one, psi_one)
time_two = time_one_step(H_two, psi_two)

print(f"1 qubit : {time_one * 1e6:.1f} microseconds per step")
print(f"2 qubits: {time_two * 1e6:.1f} microseconds per step")
