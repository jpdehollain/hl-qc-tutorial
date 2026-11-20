import Equation, { X } from "../components/Equation";
import Step from "../components/Step";

export default function Chapter1() {
  return (
    <article>
      <h1>Predicting the world around us</h1>

      <p>
        If you have read news articles about quantum computers but don't really
        get what makes them different from ordinary computers, this tutorial is
        here to help. 
        It is not aimed at people who are proficient in quantum 
        mechanics, but who are willing to do (or at least look at) some hands 
        on maths and simple programming to understand what makes quantum 
        computers powerful.
      </p>

      <Step title="Temporary warning">
        <p>
          Part of this tutorial involves the use of code to run a few simulations
          of quantum systems.
          This when you open chapters 4 and 5, the browser will silently download the
          software packages to run these simulations locally in your device.
          The download size is around 30MB, which is fine for laptops and PCs,
          but may cause older mobile devices to struggle.
          I will soon add an option to get through the tutorial without requiring
          this download, though it will not be as fun!
        </p>
      </Step>

      <h2>What do we use physics for?</h2>

      <p>
        Physics gives us mathematical tools to describe the world around us. 
        If you remember one thing from high school physics, it is probably how to
        predict the motion of a ball, using Newton's laws. 
        For example, if a football is kicked from the penalty spot with a 
        velocity <X>v</X> of 25 metres per second, we can calculate the
        time <X>t</X> it will take to reach the goal from a distance{" "}
        <X>d</X> of 11 metres away, with some simple maths:{" "}
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
