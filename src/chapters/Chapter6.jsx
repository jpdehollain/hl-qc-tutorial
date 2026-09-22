import Equation, { X } from "../components/Equation";

export default function Chapter6() {
  return (
    <article>
      <h1>For the maths hungry</h1>
      <p>
        If you weren't satisfied with some of the mathematical assumptions 
        made along the way in this tutorial, this chapter should ease your
        mind.
      </p>

      <h2>From the Schr&ouml;dinger equation to the time-evolution operator</h2>
      <p>
        TBC
      </p>

      <Equation tex="i \hbar \frac{d}{dt} |\psi\rangle = H \, |\psi\rangle" />
      
    </article>
  );
}
