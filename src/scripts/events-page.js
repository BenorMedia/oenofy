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

// Beyond The Table — background parallax. The image layer drifts downward
// within its panel as the section scrolls up, so it travels slower than the
// page: the read that background-attachment: fixed would give, without that
// property's viewport-sized background (see the note in events.css).
//
// The layer overhangs the panel by --parallax-overscan top and bottom, and the
// shift is derived from that same value, expressed as a share of the LAYER's
// height (which is what yPercent is relative to). So the movement always
// consumes exactly the available slack — never less, never enough to expose an
// edge — whatever the overscan is set to.
const beyondMedia = document.querySelector("[data-events-beyond-media]");
const beyondBg = document.querySelector("[data-events-beyond-bg]");

if (beyondMedia && beyondBg) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const overscan =
      parseFloat(
        getComputedStyle(beyondMedia).getPropertyValue("--parallax-overscan")
      ) || 0;

    if (!overscan) return;

    const shift = (overscan / (100 + 2 * overscan)) * 100;

    const tween = gsap.fromTo(
      beyondBg,
      { yPercent: -shift },
      {
        yPercent: shift,
        ease: "none",
        scrollTrigger: {
          trigger: beyondMedia,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(beyondBg, { clearProps: "transform" });
    };
  });
}

// Cases — sticky-stacked cards (see events.css: position sticky, same
// top offset). Same behavior as Collection's .c-collection-cases (see
// collection-page.js): as the next card scrolls up and covers a card,
// that covered card scales down to 0.7, scrubbed exactly across the
// scroll distance it takes the next card to travel from just touching
// this card's bottom edge to reaching its own sticky resting spot. The
// last card is never covered, so it never scales.
const eventsCaseCards = gsap.utils.toArray(".c-events-cases__card");

if (eventsCaseCards.length > 1) {
  const mm2 = gsap.matchMedia();

  mm2.add("(prefers-reduced-motion: no-preference)", () => {
    const triggers = eventsCaseCards.slice(0, -1).map((card, i) => {
      const next = eventsCaseCards[i + 1];

      // Sticky "top" offset read live from computed style so this stays
      // correct across breakpoints without hardcoding a px value.
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
      gsap.set(eventsCaseCards, { clearProps: "scale" });
    };
  });

  mm2.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(eventsCaseCards, { scale: 1 });
  });
}
