# Why we want quantum computers

An interactive tutorial explaining what makes quantum computers powerful,
built around one worked example: solving the Schrödinger equation for a
single qubit by hand, then watching a computer take over as the system
gets bigger.

## Status

The full tutorial is functional and the text is pretty much complete.
TODOs:
- Add more visuals
- One more chapter with some nuances about how quantum computers will
actually work

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

## Project structure

```
src/
  chapters/       one file per tutorial chapter
  components/     Sidebar, Equation (KaTeX), BlochSphere (Three.js)
  styles/         design tokens (colour, type, spacing)
```
