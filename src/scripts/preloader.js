import { ScrollTrigger } from "./gsap-setup.js";

// Extracted from the client's old Webflow "coming soon" custom-code section.
// Only the logo intro animation is kept: the split OENOFY wordmark dims,
// morphs its two "O" glyphs into rings, fades the remaining letters, moves
// the mark up, swaps to the final logo image, then fades the whole overlay
// out to reveal the real homepage (and the real nav ring) underneath.

// Timings match the original sequence up through the icon-up / final-logo
// swap. "fadingOut" replaces the original's page-content reveal steps,
// since here the job is to disappear, not show more content.
const STEPS = [
  ["is-dimmed", 1280],
  ["is-os-hidden", 1640],
  ["is-os-converging", 1700],
  ["is-letters-hidden", 1760],
  ["is-icon-up", 3050],
  ["is-final-logo-visible", 3400],
  ["is-fading-out", 3900],
];

const FADE_OUT_DURATION = 500;

const root = document.querySelector("[data-preloader]");

if (root) {
  // QA hold mode: play the morph but stop at the final-logo state (skip
  // the fade-out + removal) so alignment vs the nav logo can be checked.
  const hold = root.hasAttribute("data-preloader-hold");
  const timers = [];

  function finish() {
    document.body.style.overflow = "";
    root.remove();
    // Hero's parallax ScrollTrigger gets created while scroll is still
    // locked here — recalculate its positions now that the real,
    // scrollable page is what's actually behind it.
    ScrollTrigger.refresh();
  }

  if (!hold) document.body.style.overflow = "hidden";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion && !hold) {
    // Skip the choreographed morph, but still hold branding briefly
    // before fading out rather than yanking it away instantly.
    timers.push(
      setTimeout(() => {
        root.classList.add(
          "is-dimmed",
          "is-os-hidden",
          "is-os-converging",
          "is-letters-hidden",
          "is-icon-up",
          "is-final-logo-visible"
        );
      }, 0)
    );
    timers.push(
      setTimeout(() => {
        root.classList.add("is-fading-out");
      }, 400)
    );
    timers.push(setTimeout(finish, 400 + FADE_OUT_DURATION));
  } else {
    const steps = hold
      ? STEPS.filter(([className]) => className !== "is-fading-out")
      : STEPS;

    steps.forEach(([className, delay]) => {
      timers.push(
        setTimeout(() => {
          root.classList.add(className);
        }, delay)
      );
    });

    if (!hold) {
      const lastStepDelay = STEPS[STEPS.length - 1][1];
      timers.push(setTimeout(finish, lastStepDelay + FADE_OUT_DURATION));
    }
  }
}
