import time
import numpy as np

X = np.array([[0, 1], [1, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)


def evolution_operator(H, t):
    energies, P = np.linalg.eigh(H)
    D = np.diag(np.exp(-1j * energies * t))
    return P @ D @ P.conj().T


def time_one_step(H, psi0, dt=0.01, repeats=2000):
    """Average time, in seconds, to take one step of the time evolution."""
    evolution_operator(H, dt) @ psi0          # warm-up run, not timed
    start = time.perf_counter()
    for _ in range(repeats):
        psi = evolution_operator(H, dt) @ psi0
    return (time.perf_counter() - start) / repeats


# One qubit: a 2x2 matrix
H_one = (np.pi / 2) * X
psi_one = np.array([1, 0], dtype=complex)

# Two qubits: a 4x4 matrix
H_two = (np.pi / 4) * np.kron(Z, Z)
psi_two = np.kron(psi_one, psi_one)

time_one = time_one_step(H_one, psi_one)
time_two = time_one_step(H_two, psi_two)

print(f"1 qubit : {time_one * 1e6:.1f} microseconds per step")
print(f"2 qubits: {time_two * 1e6:.1f} microseconds per step")
