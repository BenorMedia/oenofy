import { gsap } from "./gsap-setup.js";

// Reusable "next section slides up and covers this one" scroll effect.
// Used for Hero -> Intro; safe to reuse for any other section pair later
// (just call it again with the two elements involved).
//
// HOW IT WORKS:
// - `nextSection` gets its margin-top animated from 0 down to
//   -overlapPx, scrubbed across the exact scroll range `section` is
//   visible for (its own "top top" -> "bottom top"). Margin, not
//   transform: a real layout change, so everything after `nextSection`
//   reflows to follow it smoothly — no leftover gap once it settles.
// - Because the animation is spread across `section`'s entire visible
//   duration (not squeezed into a short window near the top), the
//   overlap grows in step with real scroll the whole time `section` is
//   on screen — no snap/jump when it finishes, since by the time
//   `section` has fully scrolled away it's already at its resting
//   -overlapPx margin.
// - `nextSection` needs a higher z-index and an opaque background (it
//   already has one) so it visibly paints over `section`'s bottom edge
//   as the margin closes in, instead of just sitting at the same
//   z-level.
// - Default (no JS, prefers-reduced-motion) state is margin-top: 0 —
//   i.e. no overlap at all — so nothing needs a fallback style.
// - Scrolling back up reverses automatically — scrub just plays the
//   same tween backwards.
//
// `overlapPx` is how much visual overlap you get at most — keep it
// small (~100-150px) for a subtle "overpass", since this is meant to
// read as a slight layering, not a big reveal.
export function createSectionOverlap(section, nextSection, overlapPx = 120) {
  if (!section || !nextSection) return null;

  return gsap.to(nextSection, {
    marginTop: -overlapPx,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}
