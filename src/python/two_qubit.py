import numpy as np

# The Pauli matrices again, plus the 2x2 identity matrix ("do nothing")
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)
I = np.eye(2, dtype=complex)

# Each qubit starts on the equator of its own Bloch sphere
plus = np.array([1, 1], dtype=complex) / np.sqrt(2)

# np.kron glues small vectors and matrices together into bigger ones
psi0 = np.kron(plus, plus)            # the pair's state: 4 numbers instead of 2
H = (np.pi / 4) * np.kron(Z, Z)       # the interaction: a 4x4 matrix instead of 2x2


def evolution_operator(H, t):
    """Exactly the same function as for one qubit, it doesn't care about the size."""
    energies, P = np.linalg.eigh(H)
    D = np.diag(np.exp(-1j * energies * t))
    return P @ D @ P.conj().T


times = np.linspace(0, 2, 101)
states = [evolution_operator(H, t) @ psi0 for t in times]
