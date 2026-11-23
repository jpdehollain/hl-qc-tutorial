import "./ExampleNote.css";

/** A reminder that the plots are showing saved example results, not the reader's own measurements. */
export default function ExampleNote({ points }) {
  if (!points.some((p) => p.example)) return null;
  return (
    <p className="example-note">
      These are example results from the author's computer, not measured on yours. Press Run to measure your own.
    </p>
  );
}
