import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Global, reusable scroll reveal. Any element on any page tagged with
// .cc-fade-up gets this same fade-in-from-bottom treatment — no per-page
// wiring needed, just add the class in the markup.
//
// Two rules define the behaviour:
//
// 1. REVEAL THRESHOLD — the element has to be REVEAL_RATIO of the way into
//    the viewport before it animates, rather than the sliver of visibility
//    the old "top 85%" start required. The threshold is capped at a share
//    of the viewport (see revealDistance) so a section taller than the
//    screen doesn't have to be scrolled halfway past before it appears.
//
// 2. REPLAY — the reveal is not a one-shot. Once an element has left the
//    viewport completely it is armed again, so coming back to it (from
//    either direction) plays the animation from the start.
//
// That takes two ScrollTriggers per element, deliberately: one boundary
// decides when to PLAY (a generous threshold, symmetric in both scroll
// directions) and a separate, wider boundary decides when to RESET. Folding
// them into one trigger's toggleActions would force the same boundary to do
// both, and resetting on the play boundary would visibly blank an element
// that is still on screen.
//
// IMPORTANT: setup is deferred to DOMContentLoaded. This script loads from
// BaseLayout, which executes before a page's own trailing <script> block
// (e.g. collection-animations.js's pinned sections). Pins insert a spacer
// that shifts everything below them further down the page — if we measured
// trigger positions before that spacer exists, elements below a pin would
// fire way too early. DOMContentLoaded only fires once every module script
// (regardless of its position in the document) has already run, so waiting
// for it guarantees pins are already in place first.

// How much of the element must be on screen before it animates.
const REVEAL_RATIO = 0.4;

// How far the element sits below its resting place while hidden.
const RISE = 40;

// Shared look for both reveals, so scroll-triggered and on-load elements
// move identically. Exported because a page occasionally needs to drive the
// same reveal from its own trigger (see conciergerie-page.js, where the
// closing copy is sequenced off the gallery's grow rather than off a viewport
// threshold) — importing the values keeps every fade on the site identical
// instead of scattering copies of these numbers.
export const FADE_DURATION = 0.8;
export const FADE_EASE = "power2.out";
export const FADE_RISE = RISE;

const DURATION = FADE_DURATION;
const EASE = FADE_EASE;

// Gap between successive .cc-fade-up-load elements on the same page.
const LOAD_STAGGER = 0.12;

// Longest the on-load reveal will wait for webfonts before running anyway.
const FONT_WAIT_MS = 1200;

// Capped against the viewport: for anything shorter than the screen this is
// a true 40% of the element, and for taller sections it settles at 40% of
// the viewport instead of 40% of a very long block.
function revealDistance(el) {
  return Math.min(el.offsetHeight, window.innerHeight) * REVEAL_RATIO;
}

// The element's resting top in document coordinates.
//
// Walks the offsetParent chain rather than using getBoundingClientRect,
// because offsetTop reports the element's LAYOUT position: it ignores the
// element's own transform (the tween's y offset) and it ignores a sticky
// element's stuck displacement. Both matter here — .c-legal-toc is
// position: sticky and carries .cc-fade-up, so a rect-based reading taken
// while it was stuck (any refresh after a resize partway down the page)
// would place its boundary somewhere else entirely.
//
// This is also why the boundaries below are absolute scroll positions rather
// than ScrollTrigger's usual "top 60%" strings: whether ScrollTrigger's
// cached measurement of a trigger includes that element's own transform
// depends on when it last refreshed relative to the tween's immediateRender,
// so the same string boundary resolved 40px apart between runs. Computing
// the scroll position ourselves removes the ambiguity.
function layoutTop(el) {
  let top = 0;
  let node = el;

  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }

  return top;
}

// PLAY boundaries. Both are expressed in terms of what is actually PAINTED:
// while hidden the element sits RISE px below its resting place, so that
// offset is part of the sum. Entering from the bottom and re-entering from
// the top therefore use the same visible threshold.
//
// The RISE term is not a rounding detail. .c-slider__title measures 61px, so
// it wants a 24px threshold — less than RISE — and ignoring the offset would
// start its reveal while the element was still below the fold, leaving it to
// scroll into view already faded in with the animation wasted.
function playStart(el) {
  return layoutTop(el) + RISE - window.innerHeight + revealDistance(el);
}

function playEnd(el) {
  return layoutTop(el) + el.offsetHeight + RISE - revealDistance(el);
}

// RESET boundaries — the widest possible reading of "off screen", so a
// rewind can never be witnessed. The top edge assumes the element is at rest
// (y 0) and the bottom edge assumes it is still offset (y RISE), which is the
// conservative choice at each end.
function resetStart(el) {
  return layoutTop(el) - window.innerHeight;
}

function resetEnd(el) {
  return layoutTop(el) + el.offsetHeight + RISE;
}

function setupScrollReveal() {
  // :not() guards against an element carrying both classes, which would
  // otherwise be animated twice by two independent mechanisms.
  const elements = gsap.utils.toArray(".cc-fade-up:not(.cc-fade-up-load)");

  if (!elements.length) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tweens = [];
    const triggers = [];

    elements.forEach((el) => {
      // Paused and driven by the triggers below rather than attached to one,
      // so it can be rewound and replayed on demand. fromTo renders its
      // start state immediately, matching the opacity:0 in global.css.
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: RISE },
        {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: EASE,
          // Opt-in per element via data-fade-delay (seconds), for ordering
          // siblings that come into view together — e.g. a heading and the
          // copy beside it, where the copy should follow rather than race.
          delay: parseFloat(el.dataset.fadeDelay) || 0,
          paused: true,
        }
      );

      tweens.push(tween);

      // PLAY boundary — revealDistance of the element painted on screen,
      // from either scroll direction.
      triggers.push(
        ScrollTrigger.create({
          start: () => playStart(el),
          end: () => playEnd(el),
          onToggle: (self) => {
            if (self.isActive) tween.play();
          },
          // Covers elements already past the threshold when the page loads
          // (a reload partway down the page), which onToggle can't catch
          // because no state change happens. play() on a finished tween is
          // a no-op, so refreshes are harmless.
          onRefresh: (self) => {
            if (self.isActive) tween.play();
          },
        })
      );

      // RESET boundary — going inactive here means the element has cleared
      // the viewport entirely, so rewinding it can't be seen; that arms the
      // reveal for the next approach, from either direction.
      triggers.push(
        ScrollTrigger.create({
          start: () => resetStart(el),
          end: () => resetEnd(el),
          onToggle: (self) => {
            if (!self.isActive) tween.pause(0);
          },
        })
      );
    });

    return () => {
      triggers.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      gsap.set(elements, { clearProps: "opacity,transform" });
    };
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

// .cc-fade-up-load — runs once, on load, with no scroll involvement at all:
// no trigger, no threshold, no replay. Scroll position when the page opens is
// irrelevant, and returning to the element later does nothing.
//
// Plain matchMedia rather than gsap.matchMedia() here: a matchMedia context
// re-runs its setup whenever the query flips, which for a one-shot load
// animation would replay it mid-session.
function setupLoadReveal() {
  const elements = gsap.utils.toArray(".cc-fade-up-load");

  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

  let started = false;

  function reveal() {
    if (started) return;
    started = true;

    gsap.fromTo(
      elements,
      { opacity: 0, y: RISE },
      {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: EASE,
        // Several on one page (multiple titles) come in one after another
        // rather than all at once.
        stagger: LOAD_STAGGER,
      }
    );
  }

  // Hold for webfonts first. These are display titles set in Conso, which
  // loads with font-display: swap — starting the fade against the fallback
  // face means the glyphs visibly change shape partway through it. The
  // timeout is the backstop: a slow or failed font load must not leave a
  // page's title stuck at opacity 0.
  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(reveal);
    window.setTimeout(reveal, FONT_WAIT_MS);
  } else {
    reveal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupScrollReveal();
  setupLoadReveal();
});
