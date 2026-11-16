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
        quantum bit or <strong>qubit</strong>.
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
          usually <strong>transistors</strong>, tiny electronic switches in
          which the 0 or 1 value of the bit corresponds to the absence or 
          presence of an electrical current flowing through them.
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
        We have used our analytical maths skills to show how a single
        qubit behaves. 
        In the rest of this chapter we will learn how to program a computer
        to numerically reach the same result and then use the same approach
        study the behaviour of more complex quantum systems.
      </p>

      <h3>Programming Quantum Systems</h3>

      <p>
        Let's write some code that will make the computer solve the time
        evolution problem that we tackled in the previous chapter.
        We will use a coding language called <strong>Python</strong>, which
        is the language of choice for many scientific and quantum computing code.
        Have a look at the code below and try to identify the ingredients and
        equations of our quantum system.
        I have added comments on the lines that start with a <code>#</code> to
        help you understand the code.
        If you have never seen code and this is hard to follow don't worry,
        all you need to know is that these lines of codes are telling the
        computer to apply the required mathematical operations to solve the
        time evolution of our quantum system.
      </p>

      <p>
        Best of all, you can run this code right here. Just press the Run button
        and the browser will run the Python code and plot the results on the Bloch
        sphere below.
        To make it more fun, I have added some additional Hamiltonians and
        starting states for you to play with.
        Just pick them from the dropdown menus and watch how it changes the
        arrow moves around the Bloch sphere.
        Can you find where the code gets changed when you pick a different
        Hamiltonian or starting state?
        Lastly, if you are familiar with the code, you can also edit it directly and
        press run.
      </p>

      <Suspense fallback={<Loading />}>
        <SingleQubitDemo />
      </Suspense>

      <Step title="Where do these Hamiltonians come from?">
        <p>
          <X>X</X>, <X>Y</X> and <X>Z</X> are known as the{" "}
          <strong>Pauli matrices</strong>: the simplest <X>2\times2</X>{" "}
          matrices that can act as a qubit Hamiltonian. 
          Each one makes the Bloch arrow spin around the axis with the same 
          name &mdash; <X>X</X> around the x axis, <X>Y</X> around the y axis, 
          and <X>Z</X> around the vertical axis through the poles. 
          Every possible Hamiltonian can be broken down into a linear 
          combination of the Pauli matrices.
          The last option in the menu adds <X>X</X> and <X>Z</X>{" "}
          together, which spins the arrow around an axis halfway between them.
        </p>
      </Step>

      <h3>Adding a second qubit</h3>

      <p>
        With classical bits, combining two bits gives four possibilities:
        00, 01, 10 and 11.
        In quantum land, we can also combine two qubits to create a system that
        has four possible measurement outcomes.
        In our quantum football analogy, this is equivalent to now being able
        to see the ball in any of the four corners of the goal.
      </p>

      <p>
        Two qubits can be separate entities and can be measured separately, but
        to describe what happens when they interact with each other, we need to
        consider them as a single quantum system with a single state that
        describes the two qubits together.
        What do the state and Hamiltonian look like?
        Well if one qubit needs a two-number vector to describe it, then for a
        two-qubit state we need a four-number vector and a correponding{" "}
        <X>4\times4</X> Hamiltonian matrix:
      </p>

      <Equation tex="|\psi\rangle = \begin{pmatrix} c_{00} \\ c_{01} \\ c_{10} \\ c_{11} \end{pmatrix}, \;\; H = \begin{pmatrix} h_{00} & h_{01} & h_{02} & h_{03} \\ h_{10} & h_{11} & h_{12} & h_{13} \\ h_{20} & h_{21} & h_{22} & h_{23} \\ h_{30} & h_{31} & h_{32} & h_{33} \end{pmatrix}" />

      <p>
        For our concrete example, let's assume that for our initial state,
        qubit 1 is in the <X>|0\rangle</X> state and qubit 2 is in the{" "}
        <X>|1\rangle</X> state.
      </p>

      <Step title="Can you guess what the vector looks like?">
        <p>
          The answer is:
        </p>
        
        <Equation tex="|\psi\rangle = \begin{pmatrix} 0 \\ 1 \\ 0 \\ 0 \end{pmatrix}" />
        
        <p>
          Notice that the position of the 1 in the vector corresponds to{" "}
          <Equation tex="c_{01}" display={false} /> above, meaning that there is 100% probability 
          the two qubits combined are in 01.
        </p>
        
        <p>
          Linear algebra gives us a clever way to construct two-qubit states from separate
          single-qubit states, through a operation called the <strong>tensor product</strong>,
          which is denoted by the symbol <X>\otimes</X>:
        </p>
        
        <Equation tex="|\psi\rangle = |0\rangle \otimes |1\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix} \otimes \begin{pmatrix} 0 \\ 1 \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \\ 0 \\ 0 \end{pmatrix}" />

        <p>
          As you'll see below, we can also use this to construct two-qubit Hamiltonians.
        </p>
      </Step>
      
      <p>
        For our example two-qubit simulation, we will use a Hamiltonian that
        describes an interaction known as <strong>exchange</strong>.
        See if you can guess why it has that name after you run the simulation and see
        its effect on the Bloch spheres.
        The Hamiltonian can be constructed from the Pauli matrices in the following way:
      </p>

      <Equation tex="\begin{aligned} H = \frac{\pi}{4}\left( X \otimes X + Y \otimes Y + Z \otimes Z \right) = \frac{\pi}{4}\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & -1 & 2 & 0 \\ 0 & 2 & -1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \end{aligned}" />

      <p>
        Ok, lets write the code and run this simulation!
        In Python, we can use the <code>np.kron</code> function to calculate
        the tensor product of two matrices.
        All the other steps should be familiar from the previous simulation you wrote 😜
      </p>

      <p>
        For this one, I only gave you menus to play with the starting state
        for each qubit.
        If you want to try a different Hamiltonian, you can edit the code 
        directly and press run.
      </p>

      <Suspense fallback={<Loading />}>
        <TwoQubitDemo />
      </Suspense>

      <p>
        Play around with the initial states and see if you can figure out why
        we call this the exchange interaction.
        Then open the box below to read the answer.
      </p>

      <Step title="Hint: What happens after exactly one second?">
        <p>
          The two qubits undergo an evolution that swaps
          &mdash;or exchanges&mdash;their states back and forth.
          At the one second mark, the two qubits have perfectly swapped their
          initial states.
          In quantum computing lingo, this is called a{" "}
          <strong>SWAP gate</strong>, for obvious reasons.
        </p>
      </Step>

      <p>
        Next, let's look at what happens <em>half-way through the swap</em>,
        at half a second.
        With the default start, both arrows have shrunk to nothing: they have vanished into the
        centre of their spheres!
      </p>

      <p>
        There are two reasons why we might see arrows "shrink" in the Bloch sphere.
        The first is related to the qubit losing information to its environment,
        something that quantum computing engineers work really hard to avoid,
        because it makes the quantum computers perform badly.
        But in this case, we are simulating perfect qubits, so no information
        has been lost.
        The qubits have gone into a state&mdash;described by a phenomenom
        called <strong>entanglement</strong>&mdash;where they can no longer be
        described independently.
        They cannot be drawn in separate Bloch spheres but would need to be drawn
        in a single one, but we would need 5 dimensions to draw it.
        It some sense, the shrinking arrows are dissapearing into another
        dimension! 🫠 
      </p>

      <p>
        You might have noticed that both of these simulations run almost
        almost instantly in your browser.
        As soon as you click run, the arrows in the Bloch spheres start to
        spin.
        As the matrices that we need to exponentiate become larger and larger,
        our computer will very quickly (and noticeably) begin to struggle.
        We will see this in action and discuss it in the next chapter, but I
        will end this one showing you the framework we will use to measure how
        hard the computer is working to solve our quantum simulations.
      </p>

      <h3>How much work was that?</h3>

      <p>
        Look at what the computer had to handle when we went from one qubit to
        two: the state grew from 2 numbers to 4, and the Hamiltonian from a{" "}
        <X>2\times2</X> matrix (4 numbers) to a <X>4\times4</X> matrix (16
        numbers). 
        Let's add some lines to our code that shows us how long the computer
        takes to do one step of the time evolution in each case &mdash; building
        the time-evolution operator and multiplying it by the state. 
        A single step is far too fast to time on its own, so the code repeats it
        2000 times and works out the average.
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
        size of the matrix. Now we're ready to add more qubits and see what
        happens to that timing.
      </p>
    </article>
  );
}
