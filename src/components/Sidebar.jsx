import "./Sidebar.css";

const CHAPTERS = [
  { id: 1, title: "Physics in the quantum world", accent: "var(--accent-1)" },
  { id: 2, title: "Quantum footballs", accent: "var(--accent-2)" },
  { id: 3, title: "Two qubits, one script", accent: "var(--accent-3)" },
  { id: 4, title: "Scaling up", accent: "var(--accent-4)" },
  { id: 5, title: "Where this goes", accent: "var(--accent-5)" },
  { id: 6, title: "Appendix: Derivations", accent: "var(--accent-6)" },
];

export default function Sidebar({ current, onSelect }) {
  return (
    <nav className="sidebar" aria-label="Chapters">
      <div className="sidebar-mark">
        <span className="sidebar-mark-dot" aria-hidden="true" />
        Why we want quantum computers
      </div>

      <ol className="ladder">
        {CHAPTERS.map((ch, i) => {
          const isCurrent = ch.id === current;
          const isPast = ch.id < current;
          return (
            <li key={ch.id}>
              <button
                className={`rung ${isCurrent ? "is-current" : ""}`}
                style={{ "--rung-color": ch.accent }}
                onClick={() => onSelect(ch.id)}
                aria-current={isCurrent ? "true" : undefined}
              >
                <span className={`rung-dot ${isPast || isCurrent ? "is-lit" : ""}`} />
                <span className="rung-text">
                  <span className="rung-num">{String(ch.id).padStart(2, "0")}</span>
                  <span className="rung-title">{ch.title}</span>
                </span>
              </button>
              {i < CHAPTERS.length - 1 && <span className="rung-line" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
