import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Case 1 page animations — added per section as designs come in.

// Hero — the outer section is 200vh (see case-1.css: sticky 100vh
// stage inside it) so this scrub has room to breathe before Intro
// appears. As the user scrolls through the full 200vh, the title
// fades out (finishes by the halfway point) while the case image
// scrubs upward the whole way, ending close to — but not exactly on —
// the title's spot. Skipped under prefers-reduced-motion.
const hero = document.querySelector("[data-case-hero]");
const heroTitle = document.querySelector("[data-case-hero-title]");
const heroImg = document.querySelector("[data-case-hero-img]");

if (hero && heroTitle && heroImg) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(heroTitle, { opacity: 1 });
    gsap.set(heroImg, { y: 0 });

    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // Title: fades out over the first half of the scroll.
        const titleOpacity = 1 - Math.min(self.progress / 0.5, 1);
        gsap.set(heroTitle, { opacity: titleOpacity });

        // Image: rises the whole way through, from its resting spot
        // near the bottom (top: 62vh in CSS) up to roughly 40vh —
        // close to the title's center (50vh) without overlapping it.
        const y = gsap.utils.interpolate(0, -22, self.progress);
        gsap.set(heroImg, { y: `${y}vh` });
      },
    });

    return () => {
      st.kill();
      gsap.set([heroTitle, heroImg], { clearProps: "all" });
    };
  });
}
