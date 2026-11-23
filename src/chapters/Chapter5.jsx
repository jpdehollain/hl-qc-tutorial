import { lazy, Suspense } from "react";
import Equation, { X } from "../components/Equation";
import Step from "../components/Step";
import "../components/ScalingPlots.css";

// The demos talk to Python and draw the plots, so only load them when
// someone actually reaches this chapter.
const ScalingDemo = lazy(() => import("../components/ScalingDemo"));
const ScalingLog = lazy(() => import("../components/ScalingLog"));
const ExtrapolationChart = lazy(() => import("../components/ExtrapolationChart"));

const Loading = () => <div className="bloch-loading">Loading&hellip;</div>;

export default function Chapter5() {
  return (
    <article>
      <h1>How much harder can it get?</h1>

      <p>
        You now know how to write a time-evolution simulation for a single
        qubit, and how to expand it to two qubits.
        Let's keep expanding and see what happens!
        Expanding the quantum state is straight forward&mdash;just keep
        joining more qubits with tensor product.
        For the Hamiltonian, there are a few different ways to expand the
        exchange Hamiltonian.
        I have chosen to model a linear array with nearest neighbour
        interactions.
        For those who are curious, this is what it looks like:
      </p>

      <Equation tex="H = \frac{\pi}{4}\sum_{i=1}^{n-1}\left( X_i X_{i+1} + Y_i Y_{i+1} + Z_i Z_{i+1} \right)" />

      <p>
        Chains and lattices like this are how physicists model
        real magnets, so it's also a system that is genuinely interesting
        to simulate.
      </p>

      <p>
        Next we have a script that lets you choose a number of qubits to
        simulate. You can choose either by using the dropdown box or entering
        a number next to <code>n_qubits = </code> in the code.
        After running it will print below how long one step of the simulation
        took on average, just like the last script that we ran in the previous chapter.
        Below the script is a plot of simulation time vs number of qubits,
        which is initiall empty.
        Every time you run a simulation the plot will add a point for that
        number of qubits.
        The idea is for you to get a sense of how quickly the simulation
        time blows up as you increase the number of qubits.{" "}
        <strong>Beware</strong> that beyond 10 qubits, you might be waiting
        a long time for it to finish, so I would advise against that!
        You can always just press <code>Stop</code> if it's taking too long.
      </p>

      <p>
        Finally, if you don't want to run the simulations one by one, you can
        press <code>Run 2 to 9 for me</code> and just watch the plot get filled;
        and if you want to clear the plot and start over you can press <code>Clear results</code>.
      </p>

      <Step title="Python download warning" >
        <p>
          If you didn't run simulations in chapter 4, pressing{" "}
          <code>Run</code> below will silently download Python and necessary
          software packages (around 25MB total) to your device.
          This is unnoticeable on most laptops and PCs, but may cause older
          mobile devices to struggle.
          If you prefer not to run the simulations, you can press{" "}
          <code>Run example results</code> to load the plots with sample data.
        </p>
      </Step>

      <Suspense fallback={<Loading />}>
        <ScalingDemo />
      </Suspense>

      <p>
        Watch what happens to the plot as you run simulations and points get
        added. 
        Up to about 5 qubits time increases slowly, since the simulation time
        is dominated by the computer's housekeeping&mdash;also known as <em>overhead</em>. 
        Add more qubits and the curve takes off. 
        Every time you run a bigger system the vertical axis has to stretch to
        fit the new point, and all the results before it get squashed towards zero.
        That is what exponential growth looks like:{" "}
        <em>every extra qubit multiplies the time by a large factor</em>, so the
        latest step always dwarfs everything before it. 
        The table below the plot shows another thing that is growing exponentially: 
        the computer memory needed just to store the matrix.
      </p>

      <h2>Log scales for exponential growth</h2>

      <p>
        There's another way to plot this data that is more informative.
        Instead having equal spacing between time values in the <code>y</code>
        -axis of the plot, we can have a spacing that grows by a factor of 10
        every tick.
        Let's see what that looks like:
      </p>

      <Suspense fallback={<Loading />}>
        <ScalingLog />
      </Suspense>

      <p>
        It is much clearer to see how the simulation time grows for every point.
        Moreover, using this scale, we can see that beyond 6 qubits the growth
        clearly follows a straight line.
        This line shown as a dotted line in the plot, is called a{" "}
        <strong>fit</strong> to the data, and in this case all the measured 
        points fall almost perfectly on the line, which means it is a very good fit!
      </p>

      <h2>Following the line to the end of the universe</h2>

      <p>
        Having a very good fit to our data means that we can very confidently 
        predict how the simulation time will keep growing with number of qubits,
        without having to actually take the data, which would take a very long time!
        So let's extend our line and see how the simulation time grows.
        In the following plot I have extended it as far as the age of the
        universe, about 13.8 billion years!
      </p>

      <p>
        What do you notice about the number of qubits?
      </p>

      <Suspense fallback={<Loading />}>
        <ExtrapolationChart />
      </Suspense>

      <p>
        On my computer the line passes an hour at about 12 qubits and a year at
        about 16. By around 26 qubits a single 0.01 second step would take
        longer than the age of the universe to calculate. The exact numbers
        depend on your computer, a faster one just shifts the line a little, but
        even the fastest supercomputer only buys about three more qubits,
        because each qubit costs a factor of ten.
      </p>

      <Step title="Couldn't we be cleverer?">
      <p>
        Fair question, and the answer is yes. What we timed is the most direct
        way to do it: build the whole <X>2^n \times 2^n</X> matrix and
        exponentiate it. There are much smarter classical methods. We don't
        really need the full matrix, only the state, which has{" "}
        <X>2^n</X> numbers instead of <X>4^n</X>, and we can take advantage
        of the fact that most of the entries in <X>H</X> are zero. With tricks
        like this, supercomputers have simulated around 45 qubits. In 2017 one
        of the world's largest machines did it by using half a petabyte of
        memory, just to hold the state. For some special systems, like chains
        that are only weakly entangled, other methods can go further still.
      </p>

      <p>
        But look at the scale. Our straightforward method was already struggling
        at 10 qubits &mdash; a matrix that fits comfortably on a laptop. All
        the cleverness in the world buys a few dozen more qubits, not a
        different kind of growth: even for the cleverest method, every extra
        qubit doubles the memory. Somewhere around 45 to 50 qubits the state
        alone no longer fits in the memory of the biggest supercomputers, and
        the molecules and materials we would like to understand need
        hundreds.
      </p>
      </Step>


      <h2>What does a quantum computer do differently?</h2>

      <p>
        A quantum computer doesn't build any matrices. The state of{" "}
        <X>n</X> qubits <em>is</em> the <X>2^n</X> numbers, stored in the qubits
        themselves. And because the interactions in our chain are local, one
        step of the evolution only needs one exchange operation for each
        neighbouring pair, so <X>n-1</X> of them, each of the kind we met in
        the last chapter. Compare what each side has to deal with:
      </p>

      <table className="sp-table">
        <thead>
          <tr>
            <th>Qubits</th>
            <th>Numbers in the state</th>
            <th>Numbers in the matrix</th>
            <th>Exchange operations per step on a quantum computer</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>10</td><td>1,024</td><td>1,048,576</td><td>9</td></tr>
          <tr><td>20</td><td>1,048,576</td><td>&asymp; 1.1 &times; 10<sup>12</sup></td><td>19</td></tr>
          <tr><td>30</td><td>&asymp; 1.1 &times; 10<sup>9</sup></td><td>&asymp; 1.2 &times; 10<sup>18</sup></td><td>29</td></tr>
          <tr><td>50</td><td>&asymp; 1.1 &times; 10<sup>15</sup></td><td>&asymp; 1.3 &times; 10<sup>30</sup></td><td>49</td></tr>
          <tr><td>100</td><td>&asymp; 1.3 &times; 10<sup>30</sup></td><td>&asymp; 1.6 &times; 10<sup>60</sup></td><td>99</td></tr>
        </tbody>
      </table>

      <p>
        On the left the work grows by a factor of two or four with every qubit;
        on the right it grows by one operation. That is the power of a quantum
        computer, and it is real. (To simulate for a longer time, or with
        higher accuracy, you need more steps, but the cost of each step stays
        proportional to <X>n</X>.) There is one catch worth knowing about: you
        can't read out all <X>2^n</X> numbers at the end. Measuring a quantum
        computer gives you just <X>n</X> bits each time, so the art is to ask
        questions with short answers &mdash; what is the energy of this
        molecule? how magnetic is this material? &mdash; rather than asking for
        the whole state.
      </p>

      <h3>So what are quantum computers good for?</h3>

      <p>
        Here we need to be careful, because it is easy to read &ldquo;exponential
        speed-up&rdquo; and conclude that quantum computers will be better at
        everything. They won't. The power we have just seen applies to a
        specific kind of problem, and the list is short, but it is a list of
        problems that matter a great deal:
      </p>

      <ul>
        <li>
          <strong>Simulating quantum systems.</strong> This is what Feynman
          suggested all those years ago, and it is the most natural use. Better
          batteries, better catalysts, new drugs and new materials all depend on
          how electrons behave in molecules and solids. A famous target is
          FeMoco, the molecule at the heart of the enzyme that nature uses to
          turn nitrogen from the air into fertiliser, which we still do
          industrially in a much more energy-hungry way. Estimates for simulating
          it on a quantum computer range from around a hundred to over a
          thousand error-corrected qubits, depending on the algorithm.
        </li>
        <li>
          <strong>Factoring large numbers.</strong> Shor's algorithm is another
          exponential speed-up, and it would break much of today's encryption.
          Recent estimates suggest that a 2048-bit RSA key could be broken with
          under a million noisy physical qubits running for under a week.
        </li>
        <li>
          <strong>Searching.</strong> Grover's algorithm helps with searching an
          unsorted list, but only by a square root: a million items take about a
          thousand steps instead of a million. Useful, but nothing like the
          speed-ups above.
        </li>
      </ul>

      <p>
        For almost everything else a computer does &mdash; browsing the web,
        spreadsheets, games, most of what we call data processing &mdash; there
        is no known quantum advantage, and nobody expects your phone to be
        replaced by a quantum computer. Claims about speed-ups in areas like
        optimisation and machine learning are an active area of research, but
        so far they are much less clear cut. And everything above comes with a
        big caveat: today's quantum computers have hundreds of qubits and make
        too many errors to run the algorithms that really matter. Building
        machines that can will take a lot more engineering, because every
        useful &ldquo;logical&rdquo; qubit has to be protected by many physical
        ones.
      </p>

      <p>
        So the honest summary is this. Quantum computers are not faster
        computers; they are a different kind of tool, extraordinarily powerful
        for one family of problems, namely following the behaviour of quantum
        systems (and a handful of special mathematical problems), and not
        obviously helpful for the rest. It is a narrow list, but the problems
        on it &mdash; understanding molecules and materials &mdash; are exactly
        the ones that our classical computers hit the exponential wall on, and
        exactly the ones we most want to solve.
      </p>

      <Step title="Where do the numbers in this chapter come from?">
        <p>
          The timings are measured live, on your device. The other figures come
          from published work (mostly preprints on arXiv):
        </p>
        <ul>
          <li>
            45-qubit classical simulation using 0.5 petabytes of memory: T.
            H&auml;ner and D. S. Steiger, &ldquo;0.5 Petabyte Simulation of a
            45-Qubit Quantum Circuit&rdquo;, 2017 (arXiv:1704.01127).
          </li>
          <li>
            Factoring 2048-bit RSA with under a million noisy qubits in under a
            week: C. Gidney, &ldquo;How to factor 2048 bit RSA integers with less
            than a million noisy qubits&rdquo;, 2025 (arXiv:2505.15917).
          </li>
          <li>
            FeMoco resource estimates, from around 100 to over 1000 logical
            qubits depending on the algorithm, are summarised in the
            appendix of arXiv:2506.13332.
          </li>
        </ul>
      </Step>
    </article>
  );
}
