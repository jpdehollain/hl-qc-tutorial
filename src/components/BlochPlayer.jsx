import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./BlochPlayer.css";

// Bloch coordinates (x, y, z) -> three.js (x, z, -y): z points up, and the
// picture keeps the right-handed orientation of the real Bloch sphere.
const toThree = ([x, y, z]) => new THREE.Vector3(x, z, -y);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function cssColor(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || fallback);
}

function makeLabel(text, color, scale) {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 52px 'IBM Plex Serif', serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 96, 50);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale * 2, scale, 1);
  return sprite;
}

const HEIGHT = 300;

/** One Bloch sphere. `vector` is the arrow (any length up to 1), `trail` the path it has followed. */
function BlochView({ title, vector, trail }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / HEIGHT, 0.1, 100);
    camera.position.set(2.6, 1.6, 3.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, HEIGHT);
    mount.appendChild(renderer.domElement);

    // Draw only when something changes, there are several spheres on the page.
    const render = () => renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false; // so scrolling the page over a sphere still scrolls the page
    controls.addEventListener("change", render);

    const sphereColor = cssColor("--accent-1", "#7F8CE8");
    const arrowColor = cssColor("--accent-4", "#FFFD73");
    const trailColor = cssColor("--accent-2", "#4AB680");

    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1, 24, 16),
        new THREE.MeshBasicMaterial({ color: sphereColor, wireframe: true, transparent: true, opacity: 0.2 })
      )
    );
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.995, 24, 16),
        new THREE.MeshBasicMaterial({ color: 0x1b1730, transparent: true, opacity: 0.5, depthWrite: false })
      )
    );

    const axisMaterial = new THREE.LineBasicMaterial({ color: 0x6f6790 });
    [
      [new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)],
      [new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)],
      [new THREE.Vector3(0, 0, -1.2), new THREE.Vector3(0, 0, 1.2)],
    ].forEach((points) => scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), axisMaterial)));

    // Labels: the poles matter most, the equator ones are fainter.
    [
      { text: "|0\u27e9", at: [0, 0, 1], color: "#f1eefa", scale: 0.26 },
      { text: "|1\u27e9", at: [0, 0, -1], color: "#f1eefa", scale: 0.26 },
      { text: "|+\u27e9", at: [1, 0, 0], color: "#a89fc9", scale: 0.2 },
      { text: "|\u2212\u27e9", at: [-1, 0, 0], color: "#a89fc9", scale: 0.2 },
      { text: "|+i\u27e9", at: [0, 1, 0], color: "#a89fc9", scale: 0.2 },
      { text: "|\u2212i\u27e9", at: [0, -1, 0], color: "#a89fc9", scale: 0.2 },
    ].forEach(({ text, at, color, scale }) => {
      const sprite = makeLabel(text, color, scale);
      sprite.position.copy(toThree(at.map((v) => v * 1.3)));
      scene.add(sprite);
    });

    const trailLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: trailColor, transparent: true, opacity: 0.7 })
    );
    trailLine.visible = false;
    scene.add(trailLine);

    const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1, arrowColor, 0.16, 0.09);
    arrow.visible = false;
    scene.add(arrow);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshBasicMaterial({ color: arrowColor }));
    tip.visible = false;
    scene.add(tip);

    sceneRef.current = { render, arrow, tip, trailLine };

    const observer = new ResizeObserver(() => {
      const w = mount.clientWidth;
      if (!w) return;
      camera.aspect = w / HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(w, HEIGHT);
      render();
    });
    observer.observe(mount);
    render();

    return () => {
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    if (!vector) {
      s.arrow.visible = false;
      s.tip.visible = false;
    } else {
      const v = toThree(vector);
      const length = v.length();
      s.tip.visible = true;
      s.tip.position.copy(v);
      if (length > 0.04) {
        s.arrow.visible = true;
        s.arrow.setDirection(v.clone().normalize());
        s.arrow.setLength(length, Math.min(0.16, length * 0.4), Math.min(0.09, length * 0.25));
      } else {
        s.arrow.visible = false; // arrow has shrunk to nothing, only the dot at the centre remains
      }
    }
    s.render();
  }, [vector]);

  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.trailLine.geometry.dispose();
    s.trailLine.geometry = new THREE.BufferGeometry().setFromPoints((trail ?? []).map(toThree));
    s.trailLine.visible = Boolean(trail?.length);
    s.render();
  }, [trail]);

  return (
    <div className="bp-sphere">
      {title && <div className="bp-title">{title}</div>}
      <div className="bp-canvas" ref={mountRef} />
    </div>
  );
}

/**
 * Plays precomputed Bloch-sphere trajectories in real time, with a slider.
 *
 *   titles   one entry per sphere, e.g. ["Qubit 1", "Qubit 2"]
 *   times    sample times in seconds (evenly spaced), from the Python code
 *   data     one array of [x, y, z] points per sphere (same length as `times`), or null
 *   readout  ({ t, index }) => node, shown above the slider
 */
export default function BlochPlayer({ titles = [""], times, data, readout, idleText = "Press Run to simulate" }) {
  const ready = Boolean(data && times && times.length > 1 && data.every((d) => d.length === times.length));
  const duration = ready ? times[times.length - 1] - times[0] : 0;

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  // New data (a new Run): start again from the beginning.
  const [seenTimes, setSeenTimes] = useState(times);
  if (seenTimes !== times) {
    setSeenTimes(times);
    setT(0);
    setPlaying(ready && !prefersReducedMotion());
  }

  useEffect(() => {
    if (!playing || !duration) return;
    let frame;
    let last = null;
    const tick = (now) => {
      // requestAnimationFrame timestamps can be slightly *earlier* than
      // performance.now(), so make sure time never runs backwards.
      const dt = last === null ? 0 : Math.max(0, (now - last) / 1000);
      last = now;
      setT((prev) => {
        const next = prev + dt;
        return next >= duration ? next % duration : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration]);

  const n = ready ? times.length : 0;
  const position = ready ? Math.min(Math.max((t / duration) * (n - 1), 0), n - 1) : 0;
  const i0 = ready ? Math.min(Math.floor(position), n - 2) : 0;
  const frac = position - i0;
  const current = (points) => points[i0].map((v, k) => v + (points[i0 + 1][k] - v) * frac);

  return (
    <div className="bp">
      <div className="bp-spheres" data-count={titles.length}>
        {titles.map((title, k) => (
          <BlochView
            key={k}
            title={title}
            vector={ready ? current(data[k]) : null}
            trail={ready ? data[k] : null}
          />
        ))}
        {!ready && <div className="bp-idle">{idleText}</div>}
      </div>

      <div className="bp-controls">
        {ready && readout && <div className="bp-readout">{readout({ t, index: Math.round(position) })}</div>}
        <div className="bp-slider-row">
          <button
            className="bp-play"
            onClick={() => setPlaying((p) => !p)}
            disabled={!ready}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "\u23f8" : "\u25b6"}
          </button>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.001}
            value={t}
            disabled={!ready}
            aria-label="Time"
            onChange={(e) => {
              setPlaying(false);
              setT(parseFloat(e.target.value));
            }}
          />
          <span className="bp-time">{t.toFixed(2)} s</span>
        </div>
      </div>
    </div>
  );
}
