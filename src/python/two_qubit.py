import numpy as np
from scipy.linalg import expm

# Define the same matrices as before, but now we will use them to define a Hamiltonian for two qubits.

X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

# We need two starting states, one for each qubit

psi_1 = np.array([1, 0], dtype=complex)
psi_2 = np.array([0, 1], dtype=complex)

# np.kron glues small vectors and matrices together into bigger ones
# so the starting state will become a 4-number vector instead of a 2-number vector

psi0 = np.kron(psi_1, psi_2)

# Now we create a Hamiltonian for two qubits. It will be a 4x4 matrix instead of a 2x2 matrix.
# This particular expression creates the Heisenberg Hamiltonian explained in the text.

H = (np.pi / 4) * (np.kron(X, X) + np.kron(Y, Y) + np.kron(Z, Z))

# Finally, we run the time-evolution simulation just like in the single-qubit case.

times = np.linspace(0, 2, 101)
states = [expm(-1j * H * t) @ psi0 for t in times]
