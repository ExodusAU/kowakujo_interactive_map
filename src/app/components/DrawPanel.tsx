"use client";

import { useState } from "react";
import type { MapPoint } from "@/lib/maps/types";

/** "zone" = closed polygon outline · "path" = open route polyline. */
export type DrawShape = "zone" | "path";

interface DrawPanelProps {
  points: MapPoint[];
  shape: DrawShape;
  onShapeChange: (s: DrawShape) => void;
  onUndo: () => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * Floating panel for the draw tool. Click points on the map to build either a
 * closed zone polygon or an open route path; this panel shows the live
 * coordinate list ready to paste into an area's `outline` or an egg step's
 * `path` (or to hand to Claude).
 */
export default function DrawPanel({
  points,
  shape,
  onShapeChange,
  onUndo,
  onClear,
  onClose,
}: DrawPanelProps) {
  const [copied, setCopied] = useState(false);

  const outputText =
    points.length === 0
      ? "[]"
      : `[\n${points
          .map((p) => `  { x: ${p.x}, y: ${p.y} }`)
          .join(",\n")}\n]`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; the textarea is selectable as a fallback */
    }
  };

  return (
    <div className="absolute bottom-4 left-4 w-72 rounded-xl border border-cyan-400/40 bg-zinc-900/95 p-3 text-sm text-zinc-200 shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-cyan-300">
          Draw · {points.length} pt{points.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
          aria-label="Close draw tool"
        >
          ✕
        </button>
      </div>

      {/* Shape mode */}
      <div className="mb-2 flex gap-1 rounded-lg bg-white/5 p-1">
        {(
          [
            ["zone", "Zone (closed)"],
            ["path", "Path (route)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onShapeChange(id)}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              shape === id
                ? "bg-cyan-500 text-black"
                : "text-zinc-300 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs leading-snug text-zinc-400">
        {shape === "zone"
          ? "Click the map to drop points (orange = start). The shape auto-closes."
          : "Click the map in order along the route. Open line — the last point is where an egg icon would sit."}
      </p>

      <textarea
        readOnly
        value={outputText}
        onFocus={(e) => e.currentTarget.select()}
        className="mb-2 h-28 w-full resize-none rounded-md border border-white/10 bg-black/60 p-2 font-mono text-[11px] text-cyan-200"
      />

      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={points.length === 0}
          className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={points.length === 0}
          className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={points.length === 0}
          className="rounded-md bg-cyan-500 px-2 py-1.5 text-xs font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-40"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
