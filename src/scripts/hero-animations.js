import { gsap } from "./gsap-setup.js";

// Hero section animations.
//
// The "Intro slides up over the hero" overlap is done in pure CSS —
// .c-hero is position:sticky and .c-intro sits above it (opaque, higher
// z-index), so Intro rides over the pinned hero on normal scroll. No JS
// needed for that; it lives here as a note so the behaviour is findable.
//
// This file only handles the video parallax.

const section = document.querySelector("[data-hero]");
const video = section?.querySelector("[data-hero-video]");

if (section && video) {
  const mm = gsap.matchMedia();

  // Parallax is pure transform/scroll motion — skip it entirely for
  // prefers-reduced-motion rather than tone it down.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Scale up first so the vertical translate below never reveals an
    // edge of the video underneath.
    gsap.set(video, { scale: 1.15, transformOrigin: "center center" });

    // Video drifts down slightly as the hero scrolls through view.
    gsap.to(video, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
