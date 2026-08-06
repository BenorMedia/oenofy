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

// Cases — 3 sticky-stacked cards (see collection.css: position sticky,
// same top offset). As the next card scrolls up and covers a card, that
// covered card scales down to 0.7, scrubbed exactly across the scroll
// distance it takes the next card to travel from just touching this
// card's bottom edge to reaching its own sticky resting spot (i.e. the
// full cover transition, no more/less). The last card is never covered,
// so it never scales.
const caseCards = gsap.utils.toArray(".c-collection-cases__card");

if (caseCards.length > 1) {
  const mm2 = gsap.matchMedia();

  mm2.add("(prefers-reduced-motion: no-preference)", () => {
    const triggers = caseCards.slice(0, -1).map((card, i) => {
      const next = caseCards[i + 1];

      // Sticky "top" offset read live from computed style so this stays
      // correct across breakpoints (desktop 6rem vs any future mobile
      // override) without hardcoding a px value.
      const nextStickyTop = () => parseFloat(getComputedStyle(next).top) || 0;

      const tween = gsap.fromTo(
        card,
        { scale: 1 },
        {
          scale: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            // Next card's top touching this card's bottom edge (0% covered).
            start: () => `top ${nextStickyTop() + card.offsetHeight}px`,
            // Next card's top reaching its own sticky spot (100% covered).
            end: () => `top ${nextStickyTop()}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      return tween.scrollTrigger;
    });

    return () => {
      triggers.forEach((st) => st.kill());
      gsap.set(caseCards, { clearProps: "scale" });
    };
  });

  mm2.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(caseCards, { scale: 1 });
  });
}
