import numpy as np
from scipy.linalg import expm

# Here are three different matrices we can use to define the Hamiltonian.
# Can you find the one we used in our derivation?

X = np.array([[0, 1], 
              [1, 0]], dtype=complex)

Y = np.array([[0, -1j], 
              [1j, 0]], dtype=complex)

Z = np.array([[1, 0], 
              [0, -1]], dtype=complex)

# The lines below define the Hamiltonian and the starting state of our qubit

H = (np.pi / 2) * X
psi0 = np.array([1, 0], dtype=complex)

# In the next two lines we will compute the time-evolution operator over a range of times...
# We first create 101 time values between 0 and 2 seconds:

times = np.linspace(0, 2, 101)

# And then we compute the final states at each of those times, by applying the operator to
# the starting state. Recall the time-evolution operator is e^(-iHt), which in Python is
# implemented with expm(-1j * H * t). The @ symbol is used for matrix multiplication.

states = [expm(-1j * H * t) @ psi0 for t in times]
