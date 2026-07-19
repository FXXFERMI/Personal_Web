"use client";

/**
 * EnvelopeGate
 *
 * Shown once per browser session for each `/IBM/[name]` page.
 * The sessionStorage key is `ibm-envelope-opened-<lowercased name>`,
 * so opening Alvin's page never marks Vivian's as seen.
 *
 * Interaction model:
 *  • Hover / focus-within  → CSS-only: flap opens, letter peeks.
 *                            No React state change. No sessionStorage write.
 *  • Click / Enter / Space → Phase: idle → clicked → done.
 *                            Letter rises fully, text appears, overlay fades.
 *                            sessionStorage written only here.
 *
 * Phase machine:
 *  idle     — envelope sealed, floating
 *  clicked  — letter rising (flap already open via CSS hover)
 *  done     — overlay dismissed, page revealed
 *
 * On touch/mobile (no hover) the first click plays the full sequence:
 * CSS :hover fires on tap-start, then the click handler fires immediately
 * after, so the flap and letter animate in the same gesture.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "idle"     // envelope sealed, floating
  | "clicked"  // letter rising; flap open via CSS
  | "done";    // overlay dismissed

export type EnvelopeGateProps = {
  personName: string;
  children: React.ReactNode;
};

// ─── EnvelopeGate (orchestration — unchanged logic) ───────────────────────────

export function EnvelopeGate({ personName, children }: EnvelopeGateProps) {
  const storageKey = `ibm-envelope-opened-${personName.toLowerCase()}`;

  // Always start "idle" on both server and client so SSR output matches the
  // initial hydration pass. A useEffect then fast-forwards to "done" when
  // sessionStorage indicates the envelope was already opened this session.
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (sessionStorage.getItem(storageKey) === "true") {
      setPhase("done");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function handleOpen() {
    if (phase !== "idle") return;
    // CSS :hover already opened the flap. Jump to clicked — letter rises fully.
    setPhase("clicked");

    // Letter transition: 0.5s delay + 0.5s duration = 1 000 ms.
    // Add 300 ms buffer before dismissing the overlay.
    setTimeout(() => {
      sessionStorage.setItem(storageKey, "true");
      setPhase("done");
    }, 1300);
  }

  return (
    <>
      {/* Page content — always in DOM, blurred until gate clears */}
      <div
        aria-hidden={phase !== "done"}
        style={{
          filter: phase !== "done" ? "blur(6px)" : "none",
          transition: "filter 0.6s ease",
          pointerEvents: phase !== "done" ? "none" : undefined,
        }}
      >
        {children}
      </div>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="envelope-overlay"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          >
            {/* Dot-grid background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, oklch(0.556 0 0 / 10%) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* "A message for …" label */}
            <motion.p
              className="relative z-10 mb-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
              initial={{ opacity: 0, y: 6 }}
              animate={
                phase === "idle"
                  ? { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }
                  : { opacity: 0, y: -6, transition: { duration: 0.25 } }
              }
            >
              A message for {personName}
            </motion.p>

            {/* Envelope button */}
            <motion.button
              type="button"
              aria-label={`Open your letter, ${personName}. Press Enter or Space to open.`}
              onClick={handleOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpen();
                }
              }}
              disabled={phase !== "idle"}
              className={[
                "relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-xl",
                phase === "idle" ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
              animate={
                phase === "idle"
                  ? { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
                  : { y: 0 }
              }
            >
              <EnvelopeVisual clicked={phase === "clicked"} personName={personName} />
            </motion.button>

            {/* "Click to open" prompt */}
            <motion.p
              className="relative z-10 mt-10 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={
                phase === "idle"
                  ? { opacity: 1, transition: { delay: 0.8, duration: 0.6 } }
                  : { opacity: 0, transition: { duration: 0.2 } }
              }
            >
              Click to open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── EnvelopeVisual ───────────────────────────────────────────────────────────
//  Exact CodePen DOM — one wrapper, four children.
//  .ibm-envelope--clicked added by React for the full-rise state.

type VisualProps = { clicked: boolean; personName: string };

function EnvelopeVisual({ clicked, personName }: VisualProps) {
  return (
    <div
      className={[
        "ibm-envelope-wrap",
        clicked ? "ibm-envelope--clicked" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="ibm-envelope-lid-one" />
      <div className="ibm-envelope-lid-two" />
      <div className="ibm-envelope-body" />
      <div className="ibm-envelope-letter">
        <p className="ibm-envelope-letter-text">Dear {personName},</p>
        <p className="ibm-envelope-letter-text">...</p>
      </div>
    </div>
  );
}
