"use client";

/* eslint-disable @next/next/no-img-element */
import { type ReactNode, useEffect, useState } from "react";

export interface RevealContent {
  title: string;
  /** A single image (shorthand for a one-item gallery). */
  image?: string;
  /** Multiple images shown as a gallery. */
  images?: string[];
  /** Which image to show first (0-based). */
  startIndex?: number;
  caption?: string;
  stepNavigation?: {
    previous?: RevealStepAction;
    next?: RevealStepAction;
  };
}

export interface RevealStepAction {
  label: string;
  title: string;
  onSelect: () => void;
}

interface RevealModalProps {
  content: RevealContent | null;
  onClose: () => void;
}

export default function RevealModal({ content, onClose }: RevealModalProps) {
  const images =
    content?.images && content.images.length
      ? content.images
      : content?.image
        ? [content.image]
        : [];

  const [index, setIndex] = useState(0);

  // Reset to the requested image whenever the modal content changes (React's
  // adjust-state-during-render pattern; no effect needed).
  const [seen, setSeen] = useState<RevealContent | null>(null);
  if (content !== seen) {
    setSeen(content);
    setIndex(
      Math.min(
        Math.max(content?.startIndex ?? 0, 0),
        Math.max(images.length - 1, 0),
      ),
    );
  }

  useEffect(() => {
    if (!content) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && images.length > 1)
        setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft" && images.length > 1)
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [content, onClose, images.length]);

  if (!content) return null;

  const hasGallery = images.length > 1;
  const hasStepNavigation = Boolean(content.stepNavigation);
  const hasDetails = Boolean(content.caption) || hasGallery || hasStepNavigation;
  const imageMaxHeight = hasGallery
    ? "max-h-[calc(100dvh-13rem)] md:max-h-[calc(100dvh-10rem)]"
    : "max-h-[calc(100dvh-9rem)] md:max-h-[calc(100dvh-6.5rem)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[min(96vw,1500px)] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="min-w-0 truncate pr-4 font-semibold text-white">
            {content.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            X
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-zinc-950 md:flex-row">
          <div className="relative flex min-h-[48vh] flex-1 items-center justify-center bg-black p-2 sm:p-3 md:min-h-0">
            {images.length ? (
              <img
                src={images[index]}
                alt={content.title}
                className={`h-auto w-auto max-w-full object-contain ${imageMaxHeight}`}
              />
            ) : (
              <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-center text-zinc-500">
                <span className="text-sm font-medium">No screenshot yet</span>
                <p className="text-sm">Screenshot coming soon.</p>
              </div>
            )}

            {hasGallery && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setIndex((i) => (i - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-xl text-white transition-colors hover:bg-black/85"
                  aria-label="Previous image"
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-xl text-white transition-colors hover:bg-black/85"
                  aria-label="Next image"
                >
                  {">"}
                </button>
              </>
            )}
          </div>

          {hasDetails && (
            <div className="flex max-h-48 shrink-0 flex-col gap-3 overflow-y-auto border-t border-white/10 bg-zinc-900 px-4 py-3 md:max-h-none md:w-80 md:border-l md:border-t-0 lg:w-96">
              {content.caption && (
                <FormattedDescription text={content.caption} />
              )}
              {hasGallery && (
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Image {index + 1} of {images.length}
                </p>
              )}
              {content.stepNavigation && (
                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                  <StepNavButton
                    action={content.stepNavigation.previous}
                    fallbackLabel="Previous step"
                  />
                  <StepNavButton
                    action={content.stepNavigation.next}
                    fallbackLabel="Next step"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {hasGallery && (
          <div className="shrink-0 border-t border-white/10 bg-zinc-950 px-3 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, thumbIndex) => (
                <button
                  key={`${src}-${thumbIndex}`}
                  type="button"
                  onClick={() => setIndex(thumbIndex)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded border transition ${
                    thumbIndex === index
                      ? "border-cyan-300 ring-2 ring-cyan-300/60"
                      : "border-white/15 opacity-70 hover:border-white/40 hover:opacity-100"
                  }`}
                  aria-label={`Show image ${thumbIndex + 1}`}
                  aria-current={thumbIndex === index ? "true" : undefined}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {thumbIndex + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormattedDescription({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split(/\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        const isList = lines.length > 1 && lines.every((line) => line.startsWith("- "));

        if (isList) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{formatInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={blockIndex}>{formatInline(lines.join(" "))}</p>;
      })}
    </div>
  );
}

function formatInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function StepNavButton({
  action,
  fallbackLabel,
}: {
  action?: RevealStepAction;
  fallbackLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={action?.onSelect}
      disabled={!action}
      className="min-w-0 rounded border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors enabled:hover:border-cyan-300/60 enabled:hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-35"
    >
      <span className="block text-[11px] font-medium uppercase text-zinc-500">
        {action?.label ?? fallbackLabel}
      </span>
      <span className="block truncate text-sm font-semibold text-zinc-100">
        {action?.title ?? "None"}
      </span>
    </button>
  );
}
