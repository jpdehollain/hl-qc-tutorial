import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Equation from "./Equation";
import "./BlochSphere.css";

// Bloch-vector trajectory for |psi(t)> = cos(t)|0> - i sin(t)|1>,
// the solution derived in the text for H = X.
// (x, y, z) = (0, -sin(2t), cos(2t))
function blochVector(t) {
  return {
    x: 0,
    y: -Math.sin(2 * t),
    z: Math.cos(2 * t),
  };
}

function makeLabelSprite(text, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 56px 'IBM Plex Serif', serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 68);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.5, 0.5);
  return sprite;
}

export default function BlochSphere() {
  const mountRef = useRef(null);
  const arrowRef = useRef(null);
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const [playing, setPlaying] = useState(true);

  // keep a ref in sync so the render loop can read the latest slider value
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.4, 1.6, 2.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.8;
    controls.maxDistance = 6;

    // sphere (wireframe)
    const sphereGeo = new THREE.SphereGeometry(1, 24, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x4d8dfb,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    scene.add(new THREE.Mesh(sphereGeo, sphereMat));

    // faint solid sphere underneath so the wireframe reads as a surface
    const fillMat = new THREE.MeshBasicMaterial({
      color: 0x1b1730,
      transparent: true,
      opacity: 0.55,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 24, 16), fillMat));

    // axes
    const axisMat = new THREE.LineBasicMaterial({ color: 0x6f6790 });
    [
      [new THREE.Vector3(-1.3, 0, 0), new THREE.Vector3(1.3, 0, 0)],
      [new THREE.Vector3(0, -1.3, 0), new THREE.Vector3(0, 1.3, 0)],
      [new THREE.Vector3(0, 0, -1.3), new THREE.Vector3(0, 0, 1.3)],
    ].forEach(([a, b]) => {
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), axisMat));
    });

    // trajectory ring: the great circle traced out in the Bloch y-z plane
    const ringPoints = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(0, Math.sin(a), Math.cos(a)));
    }
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ringPoints),
      new THREE.LineBasicMaterial({ color: 0x33c98f, transparent: true, opacity: 0.5 })
    );
    scene.add(ring);

    // axis labels (three.js: x, y, z <- bloch: x, z, y, see mapping below)
    const labels = [
      { text: "|0\u27e9", pos: [0, 1.25, 0], color: "#f1eefa" },
      { text: "|1\u27e9", pos: [0, -1.25, 0], color: "#f1eefa" },
      { text: "+", pos: [1.25, 0, 0], color: "#a89fc9" },
      { text: "\u2212", pos: [-1.25, 0, 0], color: "#a89fc9" },
      { text: "+i", pos: [0, 0, 1.25], color: "#a89fc9" },
      { text: "\u2212i", pos: [0, 0, -1.25], color: "#a89fc9" },
    ];
    labels.forEach((l) => {
      const sprite = makeLabelSprite(l.text, l.color);
      sprite.position.set(...l.pos);
      scene.add(sprite);
    });

    // state vector arrow
    const arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      1,
      0x9d6dfb,
      0.16,
      0.09
    );
    scene.add(arrow);
    arrowRef.current = arrow;

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const bv = blochVector(tRef.current);
      // map Bloch (x, y, z) -> three.js (x, z, y) so |0> (bloch +z) points up
      const dir = new THREE.Vector3(bv.x, bv.z, bv.y).normalize();
      arrow.setDirection(dir);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // autoplay
  useEffect(() => {
    if (!playing) return;
    let raf;
    const step = () => {
      setT((prev) => (prev + 0.008) % (2 * Math.PI));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const bv = blochVector(t);
  const a = Math.cos(t);
  const b = Math.sin(t);

  return (
    <div className="bloch">
      <div className="bloch-canvas" ref={mountRef} />
      <div className="bloch-controls">
        <div className="bloch-readout">
          <Equation tex={`|\\psi(t)\\rangle = \\cos(t)\\,|0\\rangle \\; - \\; i\\sin(t)\\,|1\\rangle`} />
          <div className="bloch-readout-values">
            <span>t = {t.toFixed(2)}</span>
            <span>a = {a.toFixed(2)}</span>
            <span>b = {(-b).toFixed(2)}i</span>
          </div>
        </div>
        <div className="bloch-slider-row">
          <button
            className="bloch-play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "\u23f8" : "\u25b6"}
          </button>
          <input
            type="range"
            min={0}
            max={2 * Math.PI}
            step={0.001}
            value={t}
            onChange={(e) => {
              setPlaying(false);
              setT(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="bloch-ticks">
          <span>0</span>
          <span>&pi;/2</span>
          <span>&pi;</span>
          <span>3&pi;/2</span>
          <span>2&pi;</span>
        </div>
      </div>
    </div>
  );
}
