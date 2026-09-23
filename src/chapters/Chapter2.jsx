import { lazy, Suspense } from "react";
import Equation, { X } from "../components/Equation";

// three.js is a heavy dependency - only load it once someone is actually
// reading this chapter, not as part of the initial page load.
const BlochSphere = lazy(() => import("../components/BlochSphere"));

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
        To predict the movement of our football we need: some properties that 
        we can observe or measure -- like its position in time, the ball's 
        velocity and forces acting on it -- which can be translated into 
        kinetic and potential energy, and a rule or equation -- Newton's second 
        law -- that tells us how to combine these quantities to obtain a 
        prediction of, e.g., the ball's position at a future time. 
      </p>
      
      <p>
        If our football lived in quantum land, we would need three analogous
        similar ingredients which in quantum land are called: 
        <ul>
          <li>the <strong>quantum state</strong> -- ;</li>
          <li>the <strong>Hamiltonian</strong> -- ;</li>
          <li>and the <strong>Schr&ouml;dinger equation</strong> -- </li>
        </ul>
        ,
        which we will represent with the symbol <X>|\psi\rangle</X>. 
        To know how that state changes over time, we use a rule called the 
        Schr&ouml;dinger equation -- which has nothing to do with his more 
        famous cat 😸. 
        For the purpose of this tutorial I will not show you what the equation 
        looks like, but you just need to know that the solution to the 
        Schr&ouml;dinger equation is a mathematical object called the{" "}
        <em>time-evolution operator</em>. 
        This operator is ver handy because if we multiply it by the quantum 
        state at point in time, we can predict what the state will be at any 
        other moment. 
        This last sentence is written mathematically as:
      </p>

      <Equation tex="|\psi(t)\rangle = e^{-iHt/\hbar}\,|\psi(0)\rangle" />

      <p>
        this equation has some terms you may or may not have seen before:{" "}
        <X>i</X> is the imaginary unit, which tells us we're working with complex
        numbers; <X>\hbar</X> is the Planck constant, a fundamental constant of
        nature that helps us work in manegeable units; and the most important
        part of the equation is the Hamiltonian <X>H</X>, which is a mathematical
        object that contains the sum of the kinetic and potential energy in the
        system. Just like with the soccer ball example, Hamiltonians can start
        simple, and we add things to it to get more detailed properties of a 
        system.
      </p>

      <p>
        The simplest possible quantum system is a single qubit: something
        with just two distinguishable states, written{" "}
        <Equation tex="|0\rangle" display={false} /> and{" "}
        <Equation tex="|1\rangle" display={false} />. Any state of a qubit is
        a combination of the two:
      </p>

      <Equation tex="|\psi\rangle = a\,|0\rangle + b\,|1\rangle \;=\; \begin{pmatrix} a \\ b \end{pmatrix}" />

      <p>
        A Hamiltonian for a single qubit is therefore just a{" "}
        <Equation tex="2\times2" display={false} /> matrix. Let's pick the
        simplest interesting one: the Pauli <Equation tex="X" display={false} />{" "}
        matrix.
      </p>

      <Equation tex="H = X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}" />

      <p>
        Before working with <Equation tex="X" display={false} /> specifically,
        let's solve the Schr&ouml;dinger equation once, for{" "}
        <em>any</em> Hamiltonian. Notice{" "}
        <Equation tex="i\frac{d}{dt}|\psi(t)\rangle = H|\psi(t)\rangle" display={false} />{" "}
        has exactly the shape of the simplest differential equation there is,{" "}
        <Equation tex="i\frac{d}{dt}c(t) = E\,c(t)" display={false} />, except
        the number <Equation tex="E" display={false} /> has been replaced by
        an operator <Equation tex="H" display={false} />. The scalar equation
        is solved by an exponential,{" "}
        <Equation tex="c(t) = e^{-iEt}c(0)" display={false} />, and remarkably
        the same trick works here &mdash; provided we generalise what
        "exponential of a matrix" means:
      </p>

      <Equation tex="e^{-iHt} \;=\; \sum_{n=0}^{\infty} \frac{(-iHt)^n}{n!} \;=\; I - iHt - \frac{H^2t^2}{2!} + \cdots" />

      <p>
        (we're setting <Equation tex="\hbar=1" display={false} />, as in
        Chapter&nbsp;1). This series defines <Equation tex="e^{-iHt}" display={false} />{" "}
        for any matrix <Equation tex="H" display={false} />, and it gives us
        the general solution to the Schr&ouml;dinger equation directly:
      </p>

      <Equation tex="\boxed{\;|\psi(t)\rangle = e^{-iHt}\,|\psi(0)\rangle\;}" />

      <p>
        You can check this is right: at <Equation tex="t=0" display={false} />{" "}
        it correctly gives <Equation tex="|\psi(0)\rangle" display={false} />,
        and differentiating the series term by term reproduces{" "}
        <Equation tex="i\frac{d}{dt}|\psi(t)\rangle = H|\psi(t)\rangle" display={false} />{" "}
        exactly. The entire problem has collapsed into computing one matrix
        exponential. For <Equation tex="H=X" display={false} /> and{" "}
        <Equation tex="|\psi(0)\rangle=|0\rangle" display={false} />, let's
        actually compute it.
      </p>

      <h3>Step 1 &mdash; find the eigenvectors of X</h3>
      <p>
        The trick to computing a matrix exponential is to work in the basis
        where the Hamiltonian is diagonal, because in that basis{" "}
        <Equation tex="e^{-iHt}" display={false} /> reduces to an ordinary
        number. <Equation tex="X" display={false} /> has two eigenvectors:
      </p>
      <Equation tex="|+\rangle = \frac{1}{\sqrt{2}}\big(|0\rangle+|1\rangle\big), \quad X|+\rangle = +1\,|+\rangle" />
      <Equation tex="|-\rangle = \frac{1}{\sqrt{2}}\big(|0\rangle-|1\rangle\big), \quad X|-\rangle = -1\,|-\rangle" />

      <h3>Step 2 &mdash; rewrite the starting state in that basis</h3>
      <p>Inverting the two lines above gives us:</p>
      <Equation tex="|0\rangle = \frac{1}{\sqrt{2}}\big(|+\rangle + |-\rangle\big)" />

      <h3>Step 3 &mdash; apply the exponential to each eigenvector</h3>
      <p>
        Because <Equation tex="X|+\rangle = |+\rangle" display={false} /> and{" "}
        <Equation tex="X|-\rangle = -|-\rangle" display={false} />, every
        power of <Equation tex="X" display={false} /> just multiplies each
        eigenvector by its eigenvalue raised to that power. Substitute that
        into the series for <Equation tex="e^{-iXt}" display={false} /> from
        before, and each series collapses back down to an ordinary scalar
        exponential:
      </p>
      <Equation tex="e^{-iXt}|+\rangle = \sum_{n=0}^{\infty}\frac{(-it)^n}{n!}|+\rangle = e^{-it}|+\rangle" />
      <Equation tex="e^{-iXt}|-\rangle = \sum_{n=0}^{\infty}\frac{(it)^n}{n!}|-\rangle = e^{+it}|-\rangle" />

      <h3>Step 4 &mdash; recombine</h3>
      <p>
        We now know how <Equation tex="e^{-iXt}" display={false} /> acts on
        each eigenvector. Recombine them using the decomposition from
        Step&nbsp;2 to get <Equation tex="e^{-iXt}|0\rangle" display={false} />:
      </p>
      <Equation tex="|\psi(t)\rangle = \frac{1}{\sqrt{2}}\Big(e^{-it}|+\rangle + e^{it}|-\rangle\Big)" />
      <p>
        Substitute <Equation tex="|+\rangle" display={false} /> and{" "}
        <Equation tex="|-\rangle" display={false} /> back in terms of{" "}
        <Equation tex="|0\rangle" display={false} /> and{" "}
        <Equation tex="|1\rangle" display={false} />, and collect terms
        (using <Equation tex="e^{-it}+e^{it}=2\cos t" display={false} /> and{" "}
        <Equation tex="e^{-it}-e^{it}=-2i\sin t" display={false} />):
      </p>
      <Equation tex="\boxed{\;|\psi(t)\rangle = \cos(t)\,|0\rangle \;-\; i\sin(t)\,|1\rangle\;}" />

      <p>
        That's <Equation tex="e^{-iXt}|0\rangle" display={false} /> computed
        completely by hand, using nothing more exotic than diagonalising a{" "}
        <Equation tex="2\times2" display={false} /> matrix. It's exactly the
        same matrix exponential a computer will compute for us in the next
        chapter &mdash; the only difference is that a computer doesn't need
        to spot a clever eigenvector trick first, which is what makes it
        worth using once the Hamiltonian gets bigger than{" "}
        <Equation tex="2\times2" display={false} />.
      </p>

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
        Solving the Schr&ouml;dinger equation for H&nbsp;=&nbsp;X turned out
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
