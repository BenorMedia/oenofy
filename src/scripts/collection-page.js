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

// Cases — sticky stacked-cards effect. Card 1 holds centered; as the
// user scrolls, it scales down toward center while the next card
// slides up from below into its place, then that card becomes the one
// that recedes, and so on. Fully scroll-scrubbed (not one-shot), so it
// reverses cleanly on scroll-up. Desktop-only — mobile drops the
// effect for cards in normal flow (see collection.css); also skipped
// under prefers-reduced-motion.
const casesSection = document.querySelector(".c-collection-cases");
const caseCards = gsap.utils.toArray("[data-case-card]");

if (casesSection && caseCards.length > 1) {
  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      const total = caseCards.length;
      const segment = 1 / (total - 1); // scroll progress "slice" per transition

      // Initial state before any scroll: card 0 centered, everything
      // else parked just below the viewport, waiting its turn.
      gsap.set(caseCards[0], { scale: 1, y: 0 });
      gsap.set(caseCards.slice(1), { scale: 1, y: "100vh" });

      const st = ScrollTrigger.create({
        trigger: casesSection,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // Which transition we're currently in, and how far through it.
          const active = Math.min(
            Math.floor(self.progress / segment),
            total - 2
          );
          const t = Math.min(
            (self.progress - active * segment) / segment,
            1
          );

          caseCards.forEach((card, i) => {
            if (i < active) {
              // Already receded from an earlier transition — settled.
              gsap.set(card, { scale: 0.7, y: 0 });
            } else if (i === active) {
              // Outgoing card for this transition: shrinks to center.
              gsap.set(card, {
                scale: gsap.utils.interpolate(1, 0.7, t),
                y: 0,
              });
            } else if (i === active + 1) {
              // Incoming card: slides up from below into place.
              gsap.set(card, {
                scale: 1,
                y: `${gsap.utils.interpolate(100, 0, t)}vh`,
              });
            } else {
              // Not its turn yet — parked just below the viewport.
              gsap.set(card, { scale: 1, y: "100vh" });
            }
          });
        },
      });

      return () => {
        st.kill();
        gsap.set(caseCards, { clearProps: "all" });
      };
    }
  );
}
