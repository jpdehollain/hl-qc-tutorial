import { lazy, Suspense } from "react";
import Equation, { X } from "../components/Equation";

// three.js is a heavy dependency - only load it once someone is actually
// reading this chapter, not as part of the initial page load.
const BlochSphere = lazy(() => import("../components/BlochSphere"));

export default function Chapter3() {
  return (
    <article>
      <h1>From football to Bloch sphere</h1>
      <p>
        This chapter is the next piece of the build. Come back once it's
        wired in.
      </p>

      <h3>Step 1 &mdash; find the eigenvalues of X</h3>
      <p>
        A vector <Equation tex="v" display={false} /> is an eigenvector of{" "}
        <Equation tex="X" display={false} /> with eigenvalue{" "}
        <Equation tex="\lambda" display={false} /> if{" "}
        <Equation tex="Xv=\lambda v" display={false} />, which we can
        rewrite as <Equation tex="(X-\lambda I)v = 0" display={false} />. A
        nonzero <Equation tex="v" display={false} /> solving that equation
        only exists when <Equation tex="X-\lambda I" display={false} /> is
        singular, i.e. when its determinant vanishes:
      </p>
      <Equation tex="\det(X-\lambda I) = \det\begin{pmatrix} -\lambda & 1 \\ 1 & -\lambda \end{pmatrix} = \lambda^2 - 1 = 0" />
      <p>
        which gives the two eigenvalues <Equation tex="\lambda = +1" display={false} />{" "}
        and <Equation tex="\lambda = -1" display={false} />.
      </p>

      <h3>Step 2 &mdash; find the eigenvectors of X</h3>
      <p>
        For each eigenvalue, solve{" "}
        <Equation tex="(X-\lambda I)v=0" display={false} /> for{" "}
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
      <Equation tex="v_{+} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}, \;\; Xv_+ = +1\,v_+ \qquad\qquad v_{-} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix}, \;\; Xv_- = -1\,v_-" />

      <h3>Step 3 &mdash; diagonalise X</h3>
      <p>
        Collect the eigenvectors as the columns of a matrix{" "}
        <Equation tex="P" display={false} />, and the eigenvalues as the
        entries of a diagonal matrix <Equation tex="D" display={false} />:
      </p>
      <Equation tex="P = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}, \qquad D = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}" />
      <p>
        These satisfy <Equation tex="X = P D P^{-1}" display={false} /> &mdash;
        that's what it means to diagonalise <Equation tex="X" display={false} />.
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
        Because <Equation tex="X=PDP^{-1}" display={false} />, the same
        relationship carries over to their exponentials:{" "}
        <Equation tex="e^{-iXt} = P\,e^{-iDt}\,P^{-1}" display={false} />.
        Multiplying the three matrices out (using{" "}
        <Equation tex="P^{-1}=P" display={false} /> from Step&nbsp;3):
      </p>
      <Equation tex="e^{-iXt} = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} e^{-it} & 0 \\ 0 & e^{+it} \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} = \begin{pmatrix} \cos t & -i\sin t \\ -i\sin t & \cos t \end{pmatrix}" />
      <p>
        (the last simplification just uses{" "}
        <Equation tex="e^{-it}+e^{it}=2\cos t" display={false} /> and{" "}
        <Equation tex="e^{-it}-e^{it}=-2i\sin t" display={false} />). We now
        have <Equation tex="e^{-iXt}" display={false} /> itself, as an
        explicit matrix &mdash; before applying it to any particular state.
      </p>

      <h3>Step 5 &mdash; apply it to the initial state</h3>
      <p>
        With the operator in hand, finding{" "}
        <Equation tex="\psi(t)" display={false} /> is just a matrix-vector
        multiplication &mdash; exactly what a computer will do for us in the
        next chapter:
      </p>
      <Equation tex="\psi(t) = e^{-iXt}\begin{pmatrix}1\\0\end{pmatrix} = \begin{pmatrix} \cos t & -i\sin t \\ -i\sin t & \cos t \end{pmatrix}\begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} \cos t \\ -i\sin t \end{pmatrix}" />
      <Equation tex="\boxed{\;\psi(t) = \begin{pmatrix} \cos t \\ -i\sin t \end{pmatrix}\;}" />

      <p>
        That's <Equation tex="e^{-iXt}\begin{pmatrix}1\\0\end{pmatrix}" display={false} />{" "}
        computed completely by hand: find the eigenvalues and eigenvectors
        of <Equation tex="X" display={false} />, use them to diagonalise it,
        exponentiate the (trivial) diagonal part, multiply the three
        matrices back out, then multiply the result by the initial state
        vector. That's also <em>exactly</em> the sequence a computer follows
        in the next chapter &mdash; diagonalise, exponentiate, multiply
        &mdash; the only difference being that it can do it for matrices far
        too big to diagonalise by hand.
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
