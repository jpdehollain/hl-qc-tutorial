import time
import numpy as np
from scipy.linalg import expm

# The Pauli matrices again
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

# How many qubits do we want to simulate?
n_qubits = 6


def heisenberg_chain(n):
    """n qubits in a row, where each neighbouring pair has the exchange interaction."""
    H = np.zeros((2**n, 2**n), dtype=complex)
    for i in range(n - 1):                        # one term for each neighbouring pair
        for P in (X, Y, Z):
            before = np.eye(2**i)                 # qubits before the pair: do nothing
            after = np.eye(2**(n - i - 2))        # qubits after the pair: do nothing
            H += np.kron(np.kron(before, np.kron(P, P)), after)
    return (np.pi / 4) * H


# The starting state: qubits alternate 0, 1, 0, 1, ...
psi0 = np.zeros(2**n_qubits, dtype=complex)
psi0[int(("01" * n_qubits)[:n_qubits], 2)] = 1

H = heisenberg_chain(n_qubits)


def time_one_step(H, psi0, dt=0.01):
    """How long does one step of the time evolution take? Small cases are repeated for 0.2 s."""
    small = -1j * heisenberg_chain(3) * dt        # warm-up: the first few calls are slower than normal
    for _ in range(200):
        expm(small)
    elapsed, runs = 0.0, 0
    while elapsed < 0.2:
        start = time.perf_counter()
        psi = expm(-1j * H * dt) @ psi0
        elapsed += time.perf_counter() - start
        runs += 1
    return elapsed / runs


step_time = time_one_step(H, psi0)

print(f"{n_qubits} qubits: the matrix is {2**n_qubits} x {2**n_qubits} ({H.nbytes / 1e6:.2f} MB)")
print(f"One step of the evolution took {step_time:.5f} seconds")
