import { lazy, Suspense } from "react";
import Equation, { X } from "../components/Equation";
import Step from "../components/Step";

// three.js is a heavy dependency - only load it once someone is actually
// reading this chapter, not as part of the initial page load.
const BlochSphere = lazy(() => import("../components/BlochSphere"));

export default function Chapter3() {
  return (
    <article>
      <h1>From football to Bloch sphere</h1>
      <p>
        We ended the previous chapter saying that we could plug in our quantum
        state and Hamiltonian into the Schr&ouml;dinger equation to predict how
        our state will change in time.
        For the purpose of this tutorial I don't need to show you what the equation 
        looks like (feel free to look it up &mdash; I find it quite pretty to look at 🤓),
        I just need to skip to its solution: a mathematical object called 
        the <strong>time-evolution operator</strong>.
        This operator is very handy because if we multiply it by a quantum 
        state known at an initial time, we can predict what the state will be at any 
        other moment.
        This last sentence is written mathematically as: 
      </p>

      <Equation tex="|\psi(t)\rangle = e^{-iHt}\,|\psi(t=0)\rangle" />

      <p>
        ...on the right hand side of this equation we have a state which we know 
        at some moment in time which we will call time zero or <X>t = 0</X>. It
        is being multiplied by the time-evolution operator{" "}
        <Equation tex="e^{-iHt}" display={false} /> using any value of <X>t</X>{" "}
        to find out what the state will become at that point in time.
        The time evolution operator has some terms you may or may not have seen 
        before: <X>e</X> is a mathematical constant called Euler's number &mdash; all
        you need to know for this tutorial is that it has many useful 
        mathematical properties; and <X>i</X> is the imaginary unit, which tells
        us we're working with complex numbers.
      </p>

      <p>
        Our job seems pretty straight forward at this point.
        We know a quantum state, we know the Hamiltonian, we just need to
        plug in the numbers into the equation... recall our state and Hamiltonian
        from the previous chapter:
      </p>

      <Equation tex="H = \frac{\pi}{2} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \;\; |\psi(t=0)\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}" />

      <Step title="... and this is probabbly a good point to check the answer to the quiz in the previous chapter">
      <p>
        Since the quantum state tells us about the probability that we will see
        the ball on the top left or bottom right of the goal, the specific
        state <Equation tex="\begin{pmatrix} 0 \\ 1 \end{pmatrix}" display={false} />{" "}
        is telling us that we will <strong>always</strong> &mdash; with a 100%
        probability &mdash; see the ball in the bottom right corner.
        Kicking the ball in way that prepares our quantum football in this state
        makes it behave like a classical football, since we always know where
        it is going to go!
      </p>
      </Step>

      <p>then plugging them into the time-evolution equation:</p>

      <Equation tex="|\psi(t)\rangle = e^{-\frac{i \pi}{2} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}t} \cdot \begin{pmatrix} 0 \\ 1 \end{pmatrix} =\,???" />

      <p>easy peasy right? 🤔</p>
      
      <h2>Linear algebra: vectors and matrices</h2>
      
      <p>
        What makes this equation more tricky to solve is the fact that quantum
        states are vectors and Hamiltonians are matrices.
        In fact, there an entire branch of mathematics, called{" "}
        <strong>linear algebra</strong> that is dedicated to vectors and
        matrices. 
        Linear algebra is not only used for quantum physics, but
        many applications across science, engineering and finance.
        Keep this in mind for when you reach the final chapter 😉
      </p>

      <p>
        This is as far into the maths as you need to go for this tutorial, but
        it was important to get to the matrix exponential, because it is one of
        the operations that becomes impossible for computers to do, when the
        matrix becomes too large. In constrast, since quantum systems naturally
        evolve following these maths, they effectively "solve" the matrix
        exponential by just letting them be on their own and only looking at
        them at the time we want to know about their state.
      </p>

      <h2>So what does the solution look like?</h2>

      <p>
        For small matrices like the one in our example, the time-evolution
        equation above is not too hard to solve by hand if you know have taken a
        basic linear algebra course.
        The solution is shown below, and if you are curious about how to get
        there, you can expand the box below the solution to see the step-by-step derivation.
      </p>

      <Equation tex="|\psi(t)\rangle = \begin{pmatrix} \cos \frac{\pi}{2} t \\ -i\sin \frac{\pi}{2} t \end{pmatrix}" />

      <Step title="Derivation of time evolution of the state">

      <p>
      <em>
        Note: in this derivation, we ignore the factor of <X>{"\\frac{\\pi}{2}"}</X> for
        simplicity.
      </em>
      </p>

      <h3>Step 1 &mdash; find the eigenvalues of <X>H</X></h3>
      <p>
        A vector <Equation tex="v" display={false} /> is an eigenvector of{" "}
        <Equation tex="H" display={false} /> with eigenvalue{" "}
        <Equation tex="\lambda" display={false} /> if{" "}
        <Equation tex="Hv=\lambda v" display={false} />, which we can
        rewrite as <Equation tex="(H-\lambda I)v = 0" display={false} />. A
        nonzero <Equation tex="v" display={false} /> solving that equation
        only exists when <Equation tex="H-\lambda I" display={false} /> is
        singular, i.e. when its determinant vanishes:
      </p>
      <Equation tex="\det(H-\lambda I) = \det\begin{pmatrix} -\lambda & 1 \\ 1 & -\lambda \end{pmatrix} = \lambda^2 - 1 = 0" />
      <p>
        which gives the two eigenvalues <Equation tex="\lambda = +1" display={false} />{" "}
        and <Equation tex="\lambda = -1" display={false} />.
      </p>

      <h3>Step 2 &mdash; find the eigenvectors of <X>H</X></h3>
      <p>
        For each eigenvalue, solve{" "}
        <Equation tex="(H-\lambda I)v=0" display={false} /> for{" "}
        <Equation tex="v=\begin{pmatrix}v_1\\v_2\end{pmatrix}" display={false} />.
        For <Equation tex="\lambda=+1" display={false} />:
      </p>
      <Equation tex="\begin{pmatrix} -1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} v_1 \\ v_2 \end{pmatrix} = \begin{pmatrix}0\\0\end{pmatrix} \;\;\Rightarrow\;\; v_2 = v_1" />
      <p>and for <Equation tex="\lambda=-1" display={false} />:</p>
      <Equation tex="\begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}\begin{pmatrix} v_1 \\ v_2 \end{pmatrix} = \begin{pmatrix}0\\0\end{pmatrix} \;\;\Rightarrow\;\; v_2 = -v_1" />
      <p>
        Either equation has a free choice of scale, so pick{" "}
        <Equation tex="v_1=1" display={false} /> and normalise the result to
        unit length. That gives the two eigenvectors:
      </p>
      <Equation tex="v_{+} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}, \;\; Hv_+ = +1\,v_+ \qquad\qquad v_{-} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix}, \;\; Hv_- = -1\,v_-" />

      <h3>Step 3 &mdash; diagonalise <X>H</X></h3>
      <p>
        Collect the eigenvectors as the columns of a matrix{" "}
        <Equation tex="P" display={false} />, and the eigenvalues as the
        entries of a diagonal matrix <Equation tex="D" display={false} />:
      </p>
      <Equation tex="P = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}, \qquad D = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}" />
      <p>
        These satisfy <Equation tex="H = P D P^{-1}" display={false} /> &mdash;
        that's what it means to diagonalise <Equation tex="H" display={false} />.
        This particular <Equation tex="P" display={false} /> has a convenient
        property, checkable directly by multiplying it by itself:{" "}
        <Equation tex="P^2 = I" display={false} />, so{" "}
        <Equation tex="P^{-1}=P" display={false} />.
      </p>

      <h3>Step 4 &mdash; exponentiate, and multiply the matrices back out</h3>
      <p>
        Diagonal matrices are the one case where the exponential series is
        easy: powers of a diagonal matrix just raise each diagonal entry to
        that power, so the series sums separately down each diagonal:
      </p>
      <Equation tex="e^{-iDt} = \begin{pmatrix} e^{-it} & 0 \\ 0 & e^{+it} \end{pmatrix}" />
      <p>
        Because <Equation tex="H=PDP^{-1}" display={false} />, the same
        relationship carries over to their exponentials:{" "}
        <Equation tex="e^{-iHt} = P\,e^{-iDt}\,P^{-1}" display={false} />.
        Multiplying the three matrices out (using{" "}
        <Equation tex="P^{-1}=P" display={false} /> from Step&nbsp;3):
      </p>
      <Equation tex="e^{-iHt} = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} e^{-it} & 0 \\ 0 & e^{+it} \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} = \begin{pmatrix} \cos t & -i\sin t \\ -i\sin t & \cos t \end{pmatrix}" />
      <p>
        (the last simplification just uses{" "}
        <Equation tex="e^{-it}+e^{it}=2\cos t" display={false} /> and{" "}
        <Equation tex="e^{-it}-e^{it}=-2i\sin t" display={false} />). We now
        have <Equation tex="e^{-iHt}" display={false} /> itself, as an
        explicit matrix &mdash; before applying it to any particular state.
      </p>

      <h3>Step 5 &mdash; apply it to the initial state</h3>
      <p>
        With the operator in hand, finding{" "}
        <Equation tex="\psi(t)" display={false} /> is just a matrix-vector
        multiplication &mdash; exactly what a computer will do for us in the
        next chapter:
      </p>
      <Equation tex="\psi(t) = e^{-iHt}\begin{pmatrix}1\\0\end{pmatrix} = \begin{pmatrix} \cos t & -i\sin t \\ -i\sin t & \cos t \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} \cos t \\ -i\sin t \end{pmatrix}" />
      <Equation tex="\boxed{\;\psi(t) = \begin{pmatrix} \cos t \\ -i\sin t \end{pmatrix}\;}" />
      </Step>

      <p>
        The <X>cos</X> and <X>sin</X> terms in the solution are the{" "}
        <strong>cosine</strong> and <strong>sine</strong> functions, which
        cycle between -1 and 1 every 2 seconds.
        The cycling happens is such a way that when the <X>cos</X> term
        is <X>\pm 1</X>, the <X>sin</X> term is 0, and vice versa.
        Furthermore, they cycle in such a way that at any point in time, the
        probabilities of seeing the ball in the top left or bottom right corners
        of the goal always add up to 1, as they should.
      </p>

      <p>
        The solution is telling us that when our quantum football starts in the
        bottom right corner of the goal, we don't look at it for a while and it
        is subjected to an energy described by this hamiltonian, the ball will
        start to "move" towards the top left corner.
        It doesn't move by traversing across the goal, but as time goes on, the
        probability of us seeing it in the top left corner increases.
        If we wait exactly 1 second, we know for sure that if we open our eyes
        we will see the ball in the top left corner.
      </p>

      <Step title="Can you now guess why we put the pi/2 in front of the Hamiltonian?">
      <p>
        Just for the convenience of making the ball moves from one corner to the
        other in exactly 1 second.
        If it wasn't there, there would be a factor of <X>\pi</X> in the cycling time.
      </p>
      </Step>

      <h2>Reading the answer on a sphere</h2>

      <p>
        A single qubit's state can always be pictured as a point on the
        surface of a unit sphere, called the <strong>Bloch sphere</strong>.
        The north pole is <Equation tex="|0\rangle" display={false} />, the
        south pole is <Equation tex="|1\rangle" display={false} />, and the
        equator holds every equal combination of the two, distinguished only
        by phase. For a state{" "}
        <Equation tex="|\psi\rangle=a|0\rangle+b|1\rangle" display={false} />,
        its position is:
      </p>
      <Equation tex="(x,y,z) = \big(2\,\mathrm{Re}(\bar a b),\;\; 2\,\mathrm{Im}(\bar a b),\;\; |a|^2-|b|^2\big)" />

      <p>
        Plug our solution in and something clean falls out:{" "}
        <Equation tex="x(t)=0" display={false} />,{" "}
        <Equation tex="y(t)=-\sin(2t)" display={false} />,{" "}
        <Equation tex="z(t)=\cos(2t)" display={false} />. The point never
        leaves the plane <Equation tex="x=0" display={false} /> &mdash; it
        simply <strong>rotates in a circle around the x-axis</strong> at
        twice the rate you might naively guess from the Hamiltonian.
        Solving the Schr&ouml;dinger equation for <X>H</X> turned out
        to mean: <em>spin around the x-axis</em>. Drag the slider below (or
        press play) to watch it happen.
      </p>

      <Suspense fallback={<div className="bloch-loading">Loading the sphere&hellip;</div>}>
        <BlochSphere />
      </Suspense>

      <p>
        This is the general pattern, not a coincidence of this particular{" "}
        <Equation tex="H" display={false} />: for a single qubit, every
        Hamiltonian generates a rotation of the Bloch sphere around some
        axis, at some rate, both fixed by the Hamiltonian. Two qubits will
        turn out to be a very different story.
      </p>

    </article>
  );
}
