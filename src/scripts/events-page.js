import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Events page animations — added per section as designs come in.

// Intro grid — items are hidden by default and reveal in sequence
// (bottom to top, staggered) once the grid is ~15% scrolled into view.
// Fires once; skipped under prefers-reduced-motion.
const eventsGrid = document.querySelector("[data-events-grid]");
const eventsGridItems = eventsGrid
  ? gsap.utils.toArray("[data-events-grid-item]", eventsGrid)
  : [];

if (eventsGrid && eventsGridItems.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(eventsGridItems, { autoAlpha: 0, y: 40 });

    const st = ScrollTrigger.create({
      trigger: eventsGrid,
      start: "top 85%", // ~15% into the element entering the viewport
      once: true,
      onEnter: () => {
        gsap.to(eventsGridItems, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.2,
        });
      },
    });

    return () => {
      st.kill();
      gsap.set(eventsGridItems, { clearProps: "all" });
    };
  });
}
