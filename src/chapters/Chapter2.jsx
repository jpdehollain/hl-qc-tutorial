import Equation, { X } from "../components/Equation";
import Step from "../components/Step"

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
        where each <X>c</X> is <em>related</em> to the probability of the ball being in 
        the top left (<X>tl</X>) and bottom right (<X>br</X>) corners, respectively.
        I say "related" because quantum complicates things further and
        requires these numbers to be complex, but the probabilities can be
        extracted by a simple mathematical operation on the state.
      </p>

      <Step title="Quiz time!" defaultOpen={true}>
      <p>Here is one of the simplest quantum states we can have:</p>

      <Equation tex="|\psi\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}" />

      <p>
        Using our quantum football example, can you explain what this state is
        telling us?
      </p>

      <Step title="Hint">
        What does it tell us about what we will see when we open our
        eyes after kicking the ball?
      </Step>

      <p>Check your answer in the next chapter!</p>

      </Step>

      <p>
        It's harder to think about a football analogy for the{" "}
        <strong>Hamiltonian</strong> &mdash; the next ingredient of our quantum 
        model; all I will say is that it contains information about the potential 
        and kinetic energy that our quantum football is subjected to.
        It is represented by a square matrix, which needs to have the same{" "}
        <em>dimension</em> as the quantum state &mdash; for our example, it will
        need to be a <X>2\times2</X> matrix.
        A simple Hamiltonian &mdash; which we will work with in the next chapter{" "} 
        &mdash; can look like this:
      </p>

      <Equation tex="H = \frac{\pi}{2} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}" />

      <p>
        The <X>{"\\frac{\\pi}{2}"}</X> in front of the matrix &mdash; the constant
        <strong>pi</strong> divided by 2 &mdash; just means that every value
        inside the matrix is multiplied by that constant.
        It is there for a convience that will become clear in the next chapter.
      </p>

      <p>
        The quantum state <X>|\psi\rangle</X> and Hamiltonian <X>H</X> can now be fed into the{" "} 
        Schr&ouml;dinger equation to predict what our quantum 
        state will be at a later point in time.
        Let's do that in the next chapter, where we will try to understand what
        means for a quantum state to change.
      </p>

    </article>
  );
}
