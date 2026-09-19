# Why we want quantum computers

An interactive tutorial explaining what makes quantum computers powerful,
built around one worked example: solving the Schrödinger equation for a
single qubit by hand, then watching a computer take over as the system
gets bigger.

## Status

Chapters 1–2 are built (the Hamiltonian/Newtonian analogy, and the
pen-and-paper H=X derivation with an interactive Bloch sphere). Chapters
3–5 (the Python/Pyodide simulator, scaling to more qubits, and the
resource-extrapolation plot) are stubbed placeholders, to be built next.

## Stack

- **Vite + React** — no router; chapter navigation is plain React state,
  which avoids GitHub Pages' well-known problem with deep-linked routes
  on a static host.
- **KaTeX** for equations, **Three.js** for the Bloch sphere.
- **Pyodide** (added in a later stage) for the in-browser Python/NumPy
  simulations in chapters 3–4 — no backend server, so there's nothing to
  pay for or rate-limit.
- Fonts (IBM Plex family) are self-hosted via `@fontsource` so the app
  still looks right when installed and opened offline as a PWA.

## Local development

1. Install [Node.js](https://nodejs.org/) 20 or later, if you don't have
   it already.
2. From this folder, install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```
   It will print a local URL (usually `http://localhost:5173`) — open
   that in your browser. Changes to any file under `src/` hot-reload
   automatically.

## Icons

This project doesn't ship any icons. Add your own as
`public/icons/icon-192.png` and `public/icons/icon-512.png` (see the
note in that folder) before deploying — `manifest.json` and
`index.html` already reference those two filenames.

## Deploying to GitHub Pages

1. Push this folder to a new GitHub repository.
2. In the repo, go to **Settings → Pages** and set the source to
   **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds the site with
   `npm run build` and publishes the `dist/` folder automatically. Check
   the **Actions** tab for progress; the deployed URL appears there and
   under Settings → Pages once the workflow finishes.

No other configuration is needed — `vite.config.js` uses a relative
`base: "./"` so the build works under whatever the repo's Pages URL
turns out to be.

## Project structure

```
src/
  chapters/       one file per tutorial chapter
  components/     Sidebar, Equation (KaTeX), BlochSphere (Three.js)
  styles/         design tokens (colour, type, spacing)
```
