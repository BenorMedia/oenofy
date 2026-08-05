import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Collection page animations — added per section as designs come in.

// Intro — Part 2 gallery image. Grows from 70% -> 100% width as the
// sticky stage scrolls through; once it hits 100% the ScrollTrigger is
// killed, so the width holds even if the user scrolls back up.
// Desktop-only (mobile drops the effect for a static full-width image,
// see collection.css); also skipped under prefers-reduced-motion.
const galleryWrap = document.querySelector("[data-intro-gallery]");
const galleryImage = document.querySelector("[data-intro-gallery-image]");

if (galleryWrap && galleryImage) {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.set(galleryImage, { width: "70%" });

    const st = ScrollTrigger.create({
      trigger: galleryWrap,
      start: "top 45%", // fires a little above viewport middle
      end: "bottom bottom", // fully grown by the time the stage ends
      scrub: true,
      onUpdate: (self) => {
        const width = gsap.utils.interpolate(70, 100, self.progress);
        gsap.set(galleryImage, { width: `${width}%` });

        if (self.progress >= 1) {
          st.kill();
        }
      },
    });

    return () => {
      st.kill();
      gsap.set(galleryImage, { clearProps: "width" });
    };
  });
}

// Cases — each card is naturally stacked in the document (own wrap,
// native sticky; see collection.css), so the baseline works with zero
// JS. This just adds the shrink: for each wrap, the first half of its
// scroll is a plain hold (card stays scale 1), the second half scales
// it down to .7 while the next card rises up over it via ordinary
// scroll flow underneath. Desktop-only; skipped under
// prefers-reduced-motion.
const caseWraps = gsap.utils.toArray(".c-collection-cases__card-wrap");

if (caseWraps.length > 1) {
  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      // Last wrap has no "next" card to transition into, so it's
      // excluded — nothing to shrink there.
      const triggers = caseWraps.slice(0, -1).map((wrap) => {
        const card = wrap.querySelector("[data-case-card]");

        return ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const t = self.progress < 0.5 ? 0 : (self.progress - 0.5) / 0.5;
            gsap.set(card, { scale: gsap.utils.interpolate(1, 0.7, t) });
          },
        });
      });

      return () => {
        triggers.forEach((st) => st.kill());
        caseWraps.forEach((wrap) => {
          gsap.set(wrap.querySelector("[data-case-card]"), {
            clearProps: "scale",
          });
        });
      };
    }
  );
}
