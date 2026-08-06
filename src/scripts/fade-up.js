import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Global, reusable scroll reveal. Any element on any page tagged with
// .cc-fade-up gets this same fade-in-from-bottom treatment — no per-page
// wiring needed, just add the class in the markup.
//
// Trigger fires at "top 85%": the animation plays once the element's top
// has crossed 85% down the viewport, i.e. roughly 15% of the element is
// already in view. Plays once (toggleActions "play none none none") —
// it doesn't reverse on scroll-up.

const elements = document.querySelectorAll(".cc-fade-up");

if (elements.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });

  // Reduced motion: skip the animation entirely, just show the element
  // (global.css already sets opacity:1 for this case, this covers the
  // inline y-transform GSAP would otherwise leave at rest).
  mm.add("(prefers-reduced-motion: reduce)", () => {
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
  });
}
