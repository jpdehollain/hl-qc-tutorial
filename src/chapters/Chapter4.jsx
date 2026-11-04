import Equation, { X } from "../components/Equation";
import Step from "../components/Step";

export default function Chapter4() {
  return (
    <article>
      <h1>Qubits and simulations</h1>
      <p>
        So far I have been using the football analogy to provide an intuitive
        visualisation of quantum systems.
        Although real quantum systems are very different, the Bloch sphere
        representation that we used for our quantum football, can be used
        to describe any arbitrary physical two-level system.
        If fact, in quantum computing land, we can abstract away the physical
        system and just talk about any generic two-level quantum system as a
        quantum bit or <em>qubit</em>.
      </p>

      <p>
        The analogy to classical bits comes from the fact that the measurement
        can only return one of two possible outcomes, like a bit can only
        assume the values 0 or 1.
        In the qubit formalism, we now represent states at the north and south 
        poles of the Bloch sphere as <X>|0\rangle</X> and <X>|1\rangle</X>,
        respectively.
      </p>

      <Step title="What are the physical systems of bits and qubits?">
        <p>
          In classical computing, the physical systems that implement bits are
          usually transistors, tiny electronic switches in which the 0 or 1
          value of the bit corresponds to the absence or presence of an
          electrical current flowing through them.
        </p>
        <p>
          In quantum computing, there are currently several physical systems
          being explored for implementing qubits, such as special properties
          of the current in a superconductor, a magnetic property called the
          <emph>spin</emph> of an electron or ion, or the polarization of a
          photon.
          The jury is still out on whether only one of these will be used in
          all the quantum computers of the future, or perhaps we can have
          different types of quantum computers for different applications.
        </p>
      </Step>

      <p>
        We have seen used our analytical maths skills to show how a single
        qubit behaves. 
        In the rest of this chapter we will learn how to program a computer
        to numerically reach the same result and then use the same approach
        study the behaviour of more complex quantum systems.
      </p>

      <h3>Programming Quantum Systems</h3>
    </article>
  );
}
