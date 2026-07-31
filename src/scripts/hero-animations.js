import { gsap } from "./gsap-setup.js";
import { createSectionOverlap } from "./section-overlap.js";

const section = document.querySelector("[data-hero]");
const video = section?.querySelector("[data-hero-video]");
const nextSection = document.querySelector(".c-intro");

if (section && video) {
  const mm = gsap.matchMedia();

  // Parallax is pure transform/scroll motion — skip it entirely for
  // prefers-reduced-motion rather than tone it down.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Scale up first so the vertical translate below never reveals an
    // edge of the video underneath.
    gsap.set(video, { scale: 1.15, transformOrigin: "center center" });

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

    // Intro slides up and covers the last 120px of the hero as the
    // reader scrolls past — see section-overlap.js for how/why.
    createSectionOverlap(section, nextSection, 120);
  });
}
