import { gsap } from "./gsap-setup.js";

// Hero section animations.
//
// The hero is position:fixed and never moves on scroll — the rest of
// the page (.c-page-flow) rides up and over it. That reveal is pure CSS
// (see home.css); this file only handles the video parallax inside the
// fixed hero.

const section = document.querySelector("[data-hero]");
const video = section?.querySelector("[data-hero-video]");

if (section && video) {
  const mm = gsap.matchMedia();

  // Parallax is pure transform/scroll motion — skip it entirely for
  // prefers-reduced-motion rather than tone it down.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Scale up first so the vertical drift below never reveals an edge
    // of the video underneath.
    gsap.set(video, { scale: 1.15, transformOrigin: "center center" });

    // The hero box is fixed, so its own scroll position never changes —
    // we can't trigger off it. Instead scrub the video's internal drift
    // across the reveal window: from when .c-page-flow's top sits at the
    // bottom of the viewport (scroll 0) to when it reaches the top
    // (scrolled one full viewport, hero fully covered).
    gsap.to(video, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: ".c-page-flow",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  });
}
