import { lazy, Suspense } from "react";
import Equation, { X } from "../components/Equation";
import Step from "../components/Step";

// The demos pull in three.js and talk to Python, so only load them when
// someone actually reaches this chapter.
const SingleQubitDemo = lazy(() => import("../components/SingleQubitDemo"));
const TwoQubitDemo = lazy(() => import("../components/TwoQubitDemo"));
const TimingDemo = lazy(() => import("../components/TimingDemo"));

const Loading = () => <div className="bloch-loading">Loading&hellip;</div>;

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
          <em>spin</em> of an electron or ion, or the polarization of a
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

      <p>
        Let's translate the steps of our hand derivation into Python, the
        programming language behind most scientific and quantum computing code.
        The program below has the same ingredients as the maths: a Hamiltonian{" "}
        <X>H</X> and a starting state, which are just arrays of numbers (a
        matrix and a vector) handled by a library called NumPy; and a function
        that builds the time-evolution operator{" "}
        <Equation tex="e^{-iHt}" display={false} /> by following the same
        recipe as before &mdash; find the eigenvalues and eigenvectors,
        exponentiate the diagonal part, and multiply everything back together.
        The last line multiplies the operator by the starting state to find the
        state at 101 different moments in time.
      </p>

      <p>
        Best of all, you can run this code right here. Python is running inside
        your browser &mdash; no servers involved &mdash; thanks to a project
        called Pyodide. The first time you press <strong>Run</strong> it needs
        to download Python itself (a one-off download of a few megabytes), after
        that it is instant.
      </p>

      <p>
        I've added menus to pick the Hamiltonian and the starting state. Choose
        one and watch how the arrow moves on the Bloch sphere (the animation
        plays in real time, so one second on the clock is one second of quantum
        evolution). Then try editing the code yourself. What happens if you
        change the <X>\pi/2</X> in front of the Hamiltonian?
      </p>

      <Suspense fallback={<Loading />}>
        <SingleQubitDemo />
      </Suspense>

      <Step title="Where do these Hamiltonians come from?">
        <p>
          <X>X</X>, <X>Y</X> and <X>Z</X> are known as the{" "}
          <strong>Pauli matrices</strong>: the simplest <X>2\times2</X>{" "}
          matrices that can act as a qubit Hamiltonian. Each one makes the Bloch
          arrow spin around the axis with the same name &mdash; <X>X</X> around
          the x axis, <X>Y</X> around the y axis, and <X>Z</X> around the
          vertical axis through the poles. Any single-qubit Hamiltonian is a
          combination of these three (plus a constant, which has no observable
          effect). The last option in the menu adds <X>X</X> and <X>Z</X>{" "}
          together, which spins the arrow around an axis halfway between them.
        </p>
      </Step>

      <Step title="What is P.conj().T doing in the code?">
        <p>
          In our hand derivation the matrix <X>P</X> turned out to be its own
          inverse, but that was a lucky coincidence of that particular matrix.
          For matrices that work as Hamiltonians, the inverse of <X>P</X> is
          always its <em>conjugate transpose</em>: flip the matrix over its
          diagonal and flip the sign of every imaginary part. In NumPy that is
          written <code>P.conj().T</code>, and it is much cheaper for the
          computer than working out an inverse from scratch. And{" "}
          <code>np.linalg.eigh</code> is NumPy's ready-made tool for finding the
          eigenvalues and eigenvectors of this kind of matrix.
        </p>
      </Step>

      <h3>Adding a second qubit</h3>

      <p>
        Time to add a second quantum football. Each qubit can be seen as 0 or 1,
        so a pair can come out as 00, 01, 10 or 11 &mdash; four possibilities.
        The state needs one number for each of them, so the state of the pair
        is a vector with four numbers instead of two:
      </p>

      <Equation tex="|\psi\rangle = \begin{pmatrix} c_{00} \\ c_{01} \\ c_{10} \\ c_{11} \end{pmatrix}" />

      <p>
        The Hamiltonian has to match, so it becomes a <X>4\times4</X> matrix. It
        can contain terms that act on each qubit separately &mdash; like the
        ones we just played with &mdash; and terms that connect the two: an{" "}
        <strong>interaction</strong>. We'll use the simplest kind of
        interaction, built from one <X>Z</X> matrix for each qubit:
      </p>

      <Equation tex="H = \frac{\pi}{4}\, Z \otimes Z" />

      <p>
        The symbol <X>\otimes</X> means &ldquo;glue these together into one big
        matrix&rdquo;, which NumPy does with <code>np.kron</code>. Remember that{" "}
        <X>Z</X> gives +1 for a qubit in 0 and &minus;1 for a qubit in 1, so{" "}
        <X>Z \otimes Z</X> is +1 when the two qubits agree (both 0 or both 1)
        and &minus;1 when they disagree. That is an energy that depends on the{" "}
        <em>relationship</em> between the two footballs, not on what either of
        them is doing on its own &mdash; which is exactly what an interaction
        is.
      </p>

      <p>
        We start both qubits on the equator of their Bloch spheres, as two
        completely independent footballs, and let the computer work out how
        the pair evolves. Since each qubit has its own Bloch sphere, we show
        one for each.
      </p>

      <Suspense fallback={<Loading />}>
        <TwoQubitDemo />
      </Suspense>

      <p>
        Press play and watch the two arrows. At the start each qubit is
        perfectly ordinary, with its own arrow of full length. But as the
        interaction does its work, the arrows <em>shrink</em>. At exactly one
        second they have vanished into the centre of their spheres, and by two
        seconds they have grown back, pointing the opposite way.
      </p>

      <p>
        Shrinking arrows are the signature of <strong>entanglement</strong>. At
        one second the pair is in a perfectly well-defined state (look at the
        four numbers in the readout), yet neither qubit has an arrow to show:
        whichever way you measured qubit 1 by itself, you would get a coin
        toss. The information is hidden in the connection between the two
        qubits, in how their results line up, and an arrow can only describe a
        qubit on its own. Once the qubits are entangled there is no pair of
        arrows, on any number of Bloch spheres, that describes the pair. The
        entanglement meter in the readout goes from 0 (independent qubits) to 1
        (fully entangled), and tells the same story: the shorter the arrows,
        the more entangled the pair.
      </p>

      <p>
        This is the point where quantum systems stop fitting into pictures we
        can draw, and where the full list of numbers &mdash; and the computer
        that handles it &mdash; becomes essential.
      </p>

      <Step title="How do you draw an arrow for a qubit that is part of a pair?">
        <p>
          To draw the arrow for qubit 1, we ask what we would see if we only
          ever looked at qubit 1 and ignored qubit 2 completely (the maths for
          this is called a <em>partial trace</em>). A qubit that isn't entangled
          gets an arrow of length one, an entangled qubit gets a shorter one.
          This is done by a small helper that runs after your code, which you
          can find in <code>src/python/collect_two.py</code>.
        </p>
      </Step>

      <h3>How much work was that?</h3>

      <p>
        Look at what the computer had to handle when we went from one qubit to
        two: the state grew from 2 numbers to 4, and the Hamiltonian from a{" "}
        <X>2\times2</X> matrix (4 numbers) to a <X>4\times4</X> matrix (16
        numbers). Let's find out how long the computer takes to do one step of
        the time evolution in each case &mdash; building the time-evolution
        operator and multiplying it by the state. A single step is far too fast
        to time on its own, so the code repeats it 2000 times and works out the
        average.
      </p>

      <Suspense fallback={<Loading />}>
        <TimingDemo />
      </Suspense>

      <p>
        The two numbers are probably very close. At this tiny size most of the
        time goes on the computer's housekeeping rather than on the maths
        itself, so going from one qubit to two hardly shows up (your exact
        numbers depend on your device and browser). But hold on to what happened
        to the matrix: adding one qubit made it four times bigger. In general,
        every extra qubit doubles the length of the state and quadruples the
        size of the matrix. In the next chapter we'll keep adding qubits and
        see what happens to that timing.
      </p>
    </article>
  );
}
