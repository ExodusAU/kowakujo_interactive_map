import type { EggStep } from "./types";

/**
 * Distinct accent colors cycled per step within a stage, so an expanded stage's
 * markers (and the nav badges that mirror them) stay legible when several steps
 * reuse the same 1/2/3 numbering. A step's explicit `color` always wins; this is
 * just the per-step fallback. Shared by the map and the sidebar so they match.
 */
export const STEP_PALETTE = [
  "#ec4899", // pink
  "#38bdf8", // sky
  "#a3e635", // lime
  "#f59e0b", // amber
  "#a78bfa", // violet
  "#2dd4bf", // teal
  "#fb7185", // rose
  "#facc15", // yellow
  "#60a5fa", // blue
  "#f97316", // orange
  "#4ade80", // green
  "#e879f9", // fuchsia
];

/** Per-step accent: explicit override, else a palette color keyed to its order. */
export function stepColorFor(step: EggStep, stepIndex: number): string {
  return step.color ?? STEP_PALETTE[stepIndex % STEP_PALETTE.length];
}
