import Equation, { X } from "../components/Equation";

export default function Chapter1() {
  return (
    <article>
      <h1>Physics in the quantum world</h1>

      <h2>Intro to this tutorial</h2>
      
      <p>
        If you have read news articles about quantum computers but don't really
        get what makes them different from ordinary computers, this tutorial is
        here to help. 
        It is aimed at people who are not necessarily proficient in quantum 
        mechanics, but who are willing to do (or at least look at) some hands 
        on maths and simple programming to understand what makes quantum 
        computers powerful.
      </p>

      <h2>What do we use physics for?</h2>

      <p>
        Physics gives us mathematical tools to describe the world around us. 
        If you remember one thing from high school physics, it is probably how to
        predict the motion of a ball, using Newton's laws. 
        For example, if a football is kicked from the penalty spot with a 
        velocity of 25 metres per second, we can calculate how long it will take 
        to reach the goal 11 metres away, with some simple maths:{" "}
        <Equation tex="t = \frac{d}{v} = \frac{11\text{ m}}{25\text{ m/s}}
        = 0.44\text{ s}" display={false} />.
        With sligthly more complicated maths, we can predict the entire 
        trajectory of the ball. 
        This process of using a mathematical model to predict how a physical 
        system evolves over time is called <strong>simulation</strong>.
      </p>

      <h2>Simulating physics with computers</h2>
      
      <p>
        If we want to add more physics to our soccer ball model &mdash; like the
        spin and aerodynamics of the ball &mdash; to simulate more complex 
        trajectories, the maths will eventually become too difficult to solve 
        by hand. 
        Luckily, computers are great at doing these types of maths and
        we can program them to perform these simulations very quickly.
        Richard Feynman was not only a quantum genius, he also knew a lot about
        the inner workings of computers. 
        When he decided to write his seminal paper "Simulating Physics with 
        Computers", it was because he realized that the type of maths required to
        simulate the physics of the quantum world was not only difficult to
        solve by hand, but also <em>impossible</em> to solve on a classical computer.
      </p>

      <p>
        In the next three chapters of the tutorial, I will introduce a very
        basic model of a quantum system, which we will first solve by hand and
        then program a computer to simulate, while increasing the complexity of
        the model. 
        In the final chapter, we will explore the levels of complexity required 
        to perform some useful quantum computations, what I meant by{" "}
        <em>impossible</em> in the previous paragraph, and how this all relates 
        to the current state of quantum computing technology.
      </p>

    </article>
  );
}
