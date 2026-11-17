// The measurements made in Chapter 5, shared between the demo and the plots.
// Kept in sessionStorage so they survive switching chapters or a page reload.
import { useSyncExternalStore } from "react";

const KEY = "qc-tutorial-scaling-points";
const EMPTY = [];

function load() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((p) => Number.isFinite(p?.n) && Number.isFinite(p?.seconds) && Number.isFinite(p?.matrixBytes))
      : [];
  } catch {
    return [];
  }
}

let points = load();
const listeners = new Set();

function emit() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(points));
  } catch {
    // storage unavailable (private mode, etc.): the plots still work for this visit
  }
  listeners.forEach((fn) => fn());
}

/** Add (or replace) the measurement for p.n qubits. */
export function addPoint(p) {
  points = [...points.filter((q) => q.n !== p.n), p].sort((a, b) => a.n - b.n);
  emit();
}

export function clearPoints() {
  points = [];
  emit();
}

export function usePoints() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => points,
    () => EMPTY
  );
}
