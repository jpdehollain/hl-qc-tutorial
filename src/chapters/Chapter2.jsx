import { lazy, Suspense } from "react";
import Equation from "../components/Equation";

// three.js is a heavy dependency - only load it once someone is actually
// reading this chapter, not as part of the initial page load.
const BlochSphere = lazy(() => import("../components/BlochSphere"));

export default function Chapter2() {
  return (
    <article>
      <h1>What does a quantum system look like?</h1>

      <p>
        Just like Newton's laws define the rules for how everyday things move,
        the physical behaviour of quantum <em>things</em> is completely
        described by 5 foundational postulates. For the purposes of this
        tutorial, we will only need to learn about postulates 1 and 5.
      </p>

      <p>
        Postulate 1 says that something that lives in the quantum world by a
        set of numbers called a <strong>state</strong>, which we will represent
        with the symbol <Equation tex="|\psi\rangle" display={false} />.
        Postulate 5 presents one of the most famous equations that you may have
        heard of -- the Schr&ouml;dinger equation -- which we can use to
        predict how a state changes over time. It is the quantum analogue of
        using Newton's second law to predict the ball's trajectory.
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
        We're going to solve the Schr&ouml;dinger equation{" "}
        <Equation tex="i\frac{d}{dt}|\psi(t)\rangle = X|\psi(t)\rangle" display={false} />{" "}
        for this Hamiltonian, by hand, starting from{" "}
        <Equation tex="|\psi(0)\rangle = |0\rangle" display={false} />.
      </p>

      <h3>Step 1 &mdash; find the eigenvectors of X</h3>
      <p>
        The trick to solving any Schr&ouml;dinger equation is to work in the
        basis where the Hamiltonian is diagonal, because in that basis each
        piece of the state just picks up a phase. <Equation tex="X" display={false} />{" "}
        has two eigenvectors:
      </p>
      <Equation tex="|+\rangle = \frac{1}{\sqrt{2}}\big(|0\rangle+|1\rangle\big), \quad X|+\rangle = +1\,|+\rangle" />
      <Equation tex="|-\rangle = \frac{1}{\sqrt{2}}\big(|0\rangle-|1\rangle\big), \quad X|-\rangle = -1\,|-\rangle" />

      <h3>Step 2 &mdash; rewrite the starting state in that basis</h3>
      <p>Inverting the two lines above gives us:</p>
      <Equation tex="|0\rangle = \frac{1}{\sqrt{2}}\big(|+\rangle + |-\rangle\big)" />

      <h3>Step 3 &mdash; evolve each eigenvector</h3>
      <p>
        For an eigenvector of <Equation tex="H" display={false} /> with
        eigenvalue <Equation tex="E" display={false} />, the Schr&ouml;dinger
        equation collapses to a single ordinary differential equation,{" "}
        <Equation tex="i\frac{d}{dt}c(t) = E\,c(t)" display={false} />, whose
        solution is just a spinning phase:
      </p>
      <Equation tex="|+\rangle \rightarrow e^{-it}|+\rangle, \qquad |-\rangle \rightarrow e^{+it}|-\rangle" />

      <h3>Step 4 &mdash; recombine</h3>
      <p>Putting the evolved pieces back together:</p>
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
        That's the full, exact solution &mdash; solved with nothing more
        exotic than diagonalising a <Equation tex="2\times2" display={false} />{" "}
        matrix.
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
