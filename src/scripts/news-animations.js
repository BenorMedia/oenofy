import { gsap } from "./gsap-setup.js";

// News scroll flow. The text on the right stays put; each row's left
// image (the whole frame) slides vertically as the row travels through
// the viewport. Earlier rows are layered above later ones, so as an
// upper image drifts down it overlaps into the next row's image — the
// images slide over one another instead of just panning in place.

const rows = gsap.utils.toArray(".c-news__row");

if (rows.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const frames = [];

    rows.forEach((row, i) => {
      const frame = row.querySelector(".c-news__image");
      if (!frame) return;
      frames.push(frame);

      // Earlier rows sit above later ones so their image overlaps the
      // one below during the slide.
      frame.style.zIndex = String(rows.length - i);

      // Whole frame slides down as the row scrolls past: at rest (row
      // centered) it's ~0; entering it sits higher, leaving it sits lower
      // and overlaps into the next row's image.
      gsap.fromTo(
        frame,
        { yPercent: -22 },
        {
          yPercent: 22,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => {
      frames.forEach((f) => {
        f.style.zIndex = "";
      });
      gsap.set(frames, { clearProps: "transform" });
    };
  });
}
