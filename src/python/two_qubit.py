import numpy as np

# The Pauli matrices again
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

# The starting state of each qubit
psi_1 = np.array([1, 0], dtype=complex)
psi_2 = np.array([0, 1], dtype=complex)

# np.kron glues small vectors and matrices together into bigger ones
psi0 = np.kron(psi_1, psi_2)    # the pair's state: 4 numbers instead of 2

# The Heisenberg exchange interaction: a 4x4 matrix instead of 2x2
H = (np.pi / 4) * (np.kron(X, X) + np.kron(Y, Y) + np.kron(Z, Z))


def evolution_operator(H, t):
    """Exactly the same function as for one qubit, it doesn't care about the size."""
    energies, P = np.linalg.eigh(H)
    D = np.diag(np.exp(-1j * energies * t))
    return P @ D @ P.conj().T


times = np.linspace(0, 2, 101)
states = [evolution_operator(H, t) @ psi0 for t in times]
