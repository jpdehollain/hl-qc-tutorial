// Example results for Chapter 5, shown when someone presses "Use example results"
// (for instance when Python can't be loaded on their network).
//
// n = number of qubits, seconds = time for one step of the evolution on the
// author's computer. Replace the numbers with your own measurements if you like;
// the matrix size and memory are worked out from n.
const MEASURED = [
  [2, 0.00025],
  [3, 0.00019],
  [4, 0.00031],
  [5, 0.00072],
  [6, 0.00447],
  [7, 0.02735],
  [8, 0.14235],
  [9, 2.688],
  [10, 39.67],
];

export const EXAMPLE_POINTS = MEASURED.map(([n, seconds]) => ({
  n,
  seconds,
  dim: 2 ** n,
  matrixBytes: 16 * 4 ** n, // a 2^n x 2^n matrix of complex numbers, 16 bytes each
}));
