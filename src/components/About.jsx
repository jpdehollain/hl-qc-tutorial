import { AUTHOR, ISSUES_URL, PYTHON_DOWNLOAD_MB, REPO_URL } from "../config";

const Link = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

export default function About() {
  return (
    <article>
      <h1>About this tutorial</h1>

      <p>
        <em>Computing the quantum world</em> is a free, interactive introduction
        to why quantum computers are powerful, and what they are (and aren't)
        good for, built around some interactive examples that run code locally
        through your browser.
      </p>

      <p>
        It was written by me, {AUTHOR} with coding help from Claude.
        I am an experimental physicist and engineer who helps develop hardware
        for quantum computers.
      </p>

      <h3>Found a mistake, have an idea or want to ask me a question?</h3>

      <p>
        Please post an issue on <Link href={ISSUES_URL}>GitHub</Link>.
        The source code is at{" "}
        <Link href={REPO_URL}>{REPO_URL.replace("https://", "")}</Link> and is 
        released under the MIT licence (see the LICENSE file there). The mascot
        and the other artwork are not covered by that licence, so please ask
        before reusing them.
      </p>

      <h3>Privacy</h3>

      <p>
        There are no accounts, no cookies and no analytics. The results you
        collect in the Python demos are kept only in your browser's session 
        storage, and never leave your device.
      </p>
      <p>
        Python and its libraries (about {PYTHON_DOWNLOAD_MB} MB) is downloaded
        after you consent from the{" "}
        <Link href="https://www.jsdelivr.com">jsDelivr</Link> content delivery
        network, which, like any site you visit, can see your IP address.
        Once downloaded, Python is run locally on your device from the browser.
        The tutorial site itself is hosted on{" "}
        <Link href="https://pages.github.com">GitHub Pages</Link>, which keeps 
        its own standard server logs.
      </p>

      <h3>Credits</h3>

      <p>This tutorial is built on free and open-source software:</p>

      <ul>
        <li><Link href="https://pyodide.org">Pyodide</Link> runs Python in your browser (Mozilla Public Licence 2.0).</li>
        <li><Link href="https://numpy.org">NumPy</Link> and <Link href="https://scipy.org">SciPy</Link> do the numerical work (BSD licence).</li>
        <li><Link href="https://threejs.org">three.js</Link> draws the Bloch spheres (MIT licence).</li>
        <li><Link href="https://katex.org">KaTeX</Link> typesets the equations (MIT licence).</li>
        <li><Link href="https://react.dev">React</Link> and <Link href="https://vite.dev">Vite</Link> build the site (MIT licence).</li>
        <li>
          The <Link href="https://github.com/IBM/plex">IBM Plex</Link> typefaces, served through{" "}
          <Link href="https://fontsource.org">Fontsource</Link> (SIL Open Font Licence 1.1).
        </li>
        <li>The mascot illustration was created with Microsoft Copilot.</li>
      </ul>
    </article>
  );
}
