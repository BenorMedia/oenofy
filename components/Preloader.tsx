"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "../lib/gsap";
import styles from "./Preloader.module.css";

// Extracted from the client's old Webflow "coming soon" custom-code section.
// Only the logo intro animation is kept: the split OENOFY wordmark dims,
// morphs its two "O" glyphs into rings, fades the remaining letters, moves
// the mark up, swaps to the final logo image, then fades the whole overlay
// out to reveal the real homepage (and the real nav ring) underneath.
// The original section's background image + "coming soon" copy + button
// were page content, not part of the preloader, and are not reproduced here.

type StepKey =
  | "dimmed"
  | "osHidden"
  | "osConverging"
  | "lettersHidden"
  | "iconUp"
  | "finalLogoVisible"
  | "fadingOut";

// Timings match the original sequence up through the icon-up / final-logo
// swap. "fadingOut" is new: it replaces the original's page-content reveal
// steps, since here the job is to disappear, not show more content.
const STEPS: [StepKey, number][] = [
  ["dimmed", 1280],
  ["osHidden", 1640],
  ["osConverging", 1700],
  ["lettersHidden", 1760],
  ["iconUp", 3050],
  ["finalLogoVisible", 3400],
  ["fadingOut", 3900],
];

const FADE_OUT_DURATION = 500;

export default function Preloader() {
  const [active, setActive] = useState<Set<StepKey>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (prefersReducedMotion) {
      // Skip the choreographed morph, but still hold branding briefly
      // before fading out rather than yanking it away instantly.
      timers.push(
        setTimeout(() => {
          setActive(
            new Set<StepKey>([
              "dimmed",
              "osHidden",
              "osConverging",
              "lettersHidden",
              "iconUp",
              "finalLogoVisible",
            ])
          );
        }, 0)
      );
      timers.push(
        setTimeout(() => {
          setActive((prev) => new Set(prev).add("fadingOut"));
        }, 400)
      );
      timers.push(
        setTimeout(() => setDone(true), 400 + FADE_OUT_DURATION)
      );
      return () => timers.forEach(clearTimeout);
    }

    STEPS.forEach(([key, delay]) => {
      timers.push(
        setTimeout(() => {
          setActive((prev) => new Set(prev).add(key));
        }, delay)
      );
    });

    const lastStepDelay = STEPS[STEPS.length - 1][1];
    timers.push(
      setTimeout(() => setDone(true), lastStepDelay + FADE_OUT_DURATION)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const lenis = useLenis();

  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
    if (done) {
      lenis?.start();
      // Sections behind the overlay (e.g. Hero's parallax) may have had
      // their ScrollTrigger created while scroll was locked — positions
      // can be stale until we force a recalculation here.
      ScrollTrigger.refresh();
    } else {
      lenis?.stop();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [done, lenis]);

  if (done) return null;

  const cls = (...keys: StepKey[]) =>
    keys.filter((k) => active.has(k)).map((k) => styles[k]);

  return (
    <div
      className={[
        styles.root,
        ...cls(
          "dimmed",
          "osHidden",
          "osConverging",
          "lettersHidden",
          "iconUp",
          "finalLogoVisible",
          "fadingOut"
        ),
      ].join(" ")}
      aria-hidden="true"
    >
      <div className={styles.logoStage}>
        <div className={styles.splitLogo}>
          <svg
            className={`${styles.glyph} ${styles.glyphO} ${styles.glyphO1}`}
            viewBox="0 0 93.096 80.136"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M46.548 0C20.88 0 0 17.964 0 40.068C0 62.172 20.88 80.136 46.548 80.136C72.216 80.136 93.096 62.172 93.096 40.068C93.096 17.964 72.216 0 46.548 0ZM86.652 40.104C86.652 58.68 68.652 73.764 46.512 73.764C24.372 73.764 6.37199 58.644 6.37199 40.104C6.37199 21.564 24.372 6.444 46.512 6.444C68.652 6.444 86.652 21.564 86.652 40.104Z"
              fill="var(--color-icon)"
            />
          </svg>

          <svg
            className={`${styles.glyph} ${styles.glyphLetter} ${styles.glyphE}`}
            viewBox="130 0 62 81"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M136.432 71.6581V43.47H182.512V38.214H136.432V8.44203H186.616V3.22205H130.096V76.914H189.82V71.6581H136.432Z"
              fill="var(--color-icon)"
            />
          </svg>

          <svg
            className={`${styles.glyph} ${styles.glyphLetter} ${styles.glyphN}`}
            viewBox="225 0 76 81"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M292.412 3.22205V65.79L230.852 3.22205H230.816H226.82V76.914H233.192V14.31L294.752 76.914H298.784V3.22205H292.412Z"
              fill="var(--color-icon)"
            />
          </svg>

          <svg
            className={`${styles.glyph} ${styles.glyphO} ${styles.glyphO2}`}
            viewBox="335.784 0 93.096 80.136"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M382.332 0C356.664 0 335.784 17.964 335.784 40.068C335.784 62.172 356.664 80.136 382.332 80.136C408 80.136 428.88 62.172 428.88 40.068C428.88 17.964 408 0 382.332 0ZM422.472 40.104C422.472 58.68 404.472 73.764 382.332 73.764C360.192 73.764 342.192 58.644 342.192 40.104C342.192 21.564 360.192 6.444 382.332 6.444C404.472 6.444 422.472 21.564 422.472 40.104Z"
              fill="var(--color-icon)"
            />
          </svg>

          <svg
            className={`${styles.glyph} ${styles.glyphLetter} ${styles.glyphF}`}
            viewBox="465 0 60 81"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M522.4 8.44203V3.22205H465.88V76.914H472.252V43.47H518.332V38.214H472.252V8.44203H522.4Z"
              fill="var(--color-icon)"
            />
          </svg>

          <svg
            className={`${styles.glyph} ${styles.glyphLetter} ${styles.glyphY}`}
            viewBox="558 0 77 81"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M625.496 3.22205L597.272 40.41L567.5 3.22205H559.4L594.176 46.494V76.914H600.548V46.494L633.596 3.22205H625.496Z"
              fill="var(--color-icon)"
            />
          </svg>
        </div>

        <div className={styles.transitionOs}>
          <span className={`${styles.transitionO} ${styles.transitionO1}`} />
          <span className={`${styles.transitionO} ${styles.transitionO2}`} />
        </div>

        {/*
          External Webflow CDN asset, kept as a plain <img> (not next/image):
          intrinsic dimensions are unknown from this repo, and only `width`
          is set here (height auto) so the browser preserves its real aspect
          ratio. Once this file is downloaded into the repo we can migrate
          it to next/image with real width/height.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.finalLogo}
          src="https://cdn.prod.website-files.com/69fdd0067f429dab904ad307/6a1811a528eb23cff2aff983_logo.png"
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
