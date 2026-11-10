import numpy as np

# The three Pauli matrices: the building blocks of single-qubit Hamiltonians
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

# The Hamiltonian and the starting state of our qubit
H = (np.pi / 2) * X
psi0 = np.array([1, 0], dtype=complex)


def evolution_operator(H, t):
    """Build the time-evolution operator e^(-iHt), just like in our derivation."""
    energies, P = np.linalg.eigh(H)           # steps 1-3: eigenvalues and eigenvectors of H
    D = np.diag(np.exp(-1j * energies * t))   # step 4: exponentiate the diagonal matrix
    return P @ D @ P.conj().T                 # step 4: multiply back out, P D P^-1


# Step 5: apply the operator to the starting state at 101 moments between 0 and 2 seconds
times = np.linspace(0, 2, 101)
states = [evolution_operator(H, t) @ psi0 for t in times]
