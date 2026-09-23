import Equation, { X } from "../components/Equation";

export default function Chapter2() {
  return (
    <article>
      <h1>Quantum footballs</h1>

      <p>
        When we think of quantum, we often think about tiny things like
        electrons, photons and atoms. 
        But what makes something quantum is not its size, but the way it 
        behaves, or more formally, the type of mathematics that we need to 
        use to describe it.
      </p>

      <p>
        <strong>Quick warning:</strong> this will be the most theory-heavy chapter of the 
        tutorial, so strap in 🤯.. it will get more fun as we progress.
      </p>

      <p>
        In our previous football example, we required the following ingredients
        to formulate our problem: a property that 
        we can observe or measure &mdash; like its position in time; the ball's 
        velocity and forces acting on it &mdash; which can be translated into 
        kinetic and potential energy; and a rule or equation &mdash; Newton's second 
        law &mdash; that tells us how to combine these quantities to obtain a 
        prediction of the ball's position at a future time.
      </p>
      
      <p>
        If our football lived in quantum land, we would need three analogous
        similar ingredients which in quantum land are called the{" "}
        <strong>quantum state</strong> &mdash; which in our maths will be
        shown as <X>|\psi\rangle</X>; the{" "}
        <strong>Hamiltonian</strong> &mdash; <X>H</X>; and 
        the <strong>Schr&ouml;dinger equation</strong>, which has nothing to do 
        with his more famous cat 😸.
      </p>

      <h2>Vectors and Matrices</h2>

      <p>
        To understand a bit about quantum states, let's make the following
        thought experiment: you kick the football from the penalty spot, but
        just as you kick it, you close your eyes and open them again at the exact
        moment the ball reaches the goal.
        Now imagine you had the ability to repeat the penalty kick with the exact
        same force, angle and spin.
        You start taking a few penalty kicks and realize that every time you open
        your eyes and look at the ball crossing the goal, it is either in the top left 
        or bottom right corner of the goal.
        There is nothing external affecting the different outcomes, no changes in wind
        or placement of the ball, it is an instrinsically probabilistic outcome.
        This is a very simplified example of what quantum measurements are like.
      </p>
        
      <p>
        The position of the ball just before we open our eyes can no longer be
        described by a single number, instead we need a number that relates to
        the probability of the ball being in one of the two corners of the goal.
        A <strong>quantum state</strong> is therefore represented by a vector of 
        numbers, which in our example may look like this:
      </p>

      <Equation tex="|\psi\rangle = \begin{pmatrix} c_{tl} \\ c_{br} \end{pmatrix}" />

      <p>
        where each <X>c</X> is related to the probabilities
        of the ball being in the top left (<X>tl</X>) and bottom right (<X>br</X>) corners, respectively.
        I say it in this way because quantum complicates things further and
        requires these numbers to be complex, but the probabilities can be
        extracted by a simple mathematical operation on the state.
      </p>

      <p>
        This will be as far as I can take our quantum football example (which was 
        probably already too far for the comfort of most physicists 😹).
        I can't say many intuitive things about the <strong>Hamiltonian</strong> &mdash;{" "} 
        the next ingredient of our quantum model, except to explain that it 
        contains information about the potential and kinetic energy that our
        quantum football is subjected to.
        It is represented by a square matrix, which needs to have the same{" "}
        <em>dimension</em> as the quantum state &mdash; for our example, it will
        need to be a <X>2\times2</X> matrix.
        A simple Hamiltonian &mdash; which we will work with in the next chapter{" "} 
        &mdash; can look like this:
      </p>

      <Equation tex="H = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}" />

      <p>
        The quantum state and Hamiltonian can now be fed into the{" "} 
        <strong>Schr&ouml;dinger equation</strong> to predict what our quantum 
        state will be at a later point in time.
        For the purpose of this tutorial I will not show you what the equation 
        looks like, but you just need to know that the solution to the 
        Schr&ouml;dinger equation is a mathematical object called the{" "}
        <strong>time-evolution operator</strong>. 
        This operator is ver handy because if we multiply it by the quantum 
        state at point in time, we can predict what the state will be at any 
        other moment. 
        This last sentence is written mathematically as:
      </p>

      <Equation tex="|\psi(t)\rangle = e^{-iHt/\hbar}\,|\psi(t=0)\rangle" />

      <p>
        this equation has some terms you may or may not have seen before:{" "}
        <X>e^x</X> is the exponential function;{" "}
        <X>i</X> is the imaginary unit, which tells us we're working with complex
        numbers; 
        and <X>\hbar</X> is the Planck constant, a fundamental constant of
        nature that helps us work in manegeable units.
      </p>

      <p>
        Now that we now how to contruct a quantum system, let's start using the
        time-evolution operator to compute some quantum trajectories...
      </p>

    </article>
  );
}
