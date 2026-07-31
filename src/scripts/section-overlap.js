import { ScrollTrigger } from "./gsap-setup.js";

// Reusable "next section slides up and covers this one" scroll effect.
// Used for Hero → Intro; safe to reuse for any other section pair later
// (just call it again with the two elements involved).
//
// HOW IT WORKS (read this before touching the numbers below):
// - `section` gets pinned (held fixed on screen) for a short scroll
//   distance (`overlapPx`).
// - Pinning normally inserts an invisible spacer so whatever comes next
//   in the page holds its position while the pin is active. We pass
//   `pinSpacing: false` to skip that spacer on purpose.
// - Without the spacer, `nextSection` keeps scrolling up at the normal
//   rate while `section` stays frozen underneath it — so for the
//   `overlapPx` distance, `nextSection`'s top edge visibly slides up
//   and over the still-frozen `section`.
// - `nextSection` needs a higher z-index and an opaque background so it
//   actually covers `section` instead of just occupying the same space.
// - Scrolling back up reverses this automatically — ScrollTrigger
//   un-pins on its own, so there is no separate "scroll up" case to
//   write; the un-scrolled layout already is the default state.
//
// `overlapPx` is how much visual overlap you get — keep it small
// (~100–150px) for a subtle "overpass", since this is meant to read as
// a slight layering, not a big reveal.
export function createSectionOverlap(section, nextSection, overlapPx = 120) {
  if (!section || !nextSection) return null;

  return ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: `+=${overlapPx}`,
    pin: true,
    pinSpacing: false,
  });
}
