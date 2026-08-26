import { gsap, ScrollTrigger } from "./gsap-setup.js";
import { FADE_DURATION, FADE_EASE, FADE_RISE } from "./fade-up.js";

// La Conciergerie page animations — added per section as designs come in.

// Intro — Part 2 gallery. Two beats on one sticky stage:
//
//   1. The image grows from 70% -> 100% width as the stage scrolls through.
//      Width only ever increases, so once 100% is reached it holds there for
//      good, including on the way back up.
//   2. Once the image is at 100%, the closing copy it contains fades up over
//      it — the same fade as .cc-fade-up elsewhere (the timing constants are
//      imported rather than copied), and it re-arms the same way: leave the
//      stage entirely and it plays again on return.
//
// The copy can't use .cc-fade-up itself. That utility derives its threshold
// from the element's layout position, and this copy rides inside a sticky
// stage — its layout position sits at the top of the 150vh track while it is
// painted in the middle of the viewport, so the generic threshold would fire
// it long before the image finished growing. Sequencing it off the grow's own
// progress is the point: the reveal is meant to follow the image, not the
// viewport.
//
// Desktop-only (mobile drops the effect for a static full-width image, see
// conciergerie.css); also skipped under prefers-reduced-motion.

const galleryWrap = document.querySelector("[data-conciergerie-gallery]");
const galleryImage = document.querySelector(
  "[data-conciergerie-gallery-image]"
);
const introBottom = document.querySelector("[data-conciergerie-intro-bottom]");

const START_WIDTH = 70;
const END_WIDTH = 100;

if (galleryWrap && galleryImage) {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.set(galleryImage, { width: `${START_WIDTH}%` });

    const reveal = introBottom
      ? gsap.fromTo(
          introBottom,
          { opacity: 0, y: FADE_RISE },
          {
            opacity: 1,
            y: 0,
            duration: FADE_DURATION,
            ease: FADE_EASE,
            paused: true,
          }
        )
      : null;

    // Highest progress reached so far. The width is driven from this rather
    // than from the live progress, which is what makes the growth one-way:
    // scrolling back up leaves the image at its full size instead of
    // shrinking it again.
    let peak = 0;

    const growST = ScrollTrigger.create({
      trigger: galleryWrap,
      start: "top 45%", // fires a little above viewport middle
      end: "bottom bottom", // fully grown by the time the stage ends
      onUpdate: (self) => {
        if (self.progress <= peak) return;

        peak = self.progress;
        gsap.set(galleryImage, {
          width: `${gsap.utils.interpolate(START_WIDTH, END_WIDTH, peak)}%`,
        });
      },
    });

    // Second beat, on its own trigger rather than hung off the grow's
    // onUpdate. Its range opens exactly where the grow ends, so the copy
    // arrives at the same scroll position every time — including on a later
    // approach, when the image is already locked at 100% and there is no
    // growth left to follow. Reading it as a state change also means it
    // survives landing precisely on the boundary, which a scroll-tick check
    // does not.
    const revealST = ScrollTrigger.create({
      trigger: galleryWrap,
      start: "bottom bottom", // the moment the image reaches 100%
      end: "bottom top", // ...until the stage has cleared the viewport
      onToggle: (self) => {
        if (self.isActive && reveal) reveal.play();
      },
      // Covers arriving inside the range without crossing a boundary.
      onRefresh: (self) => {
        if (self.isActive && reveal) reveal.play();
      },
    });

    // Re-arm once the whole stage has cleared the viewport — the same rule
    // .cc-fade-up uses, so this reveal behaves like every other one. It has
    // to be a wider boundary than revealST's: rewinding the moment that one
    // goes inactive would blank the copy while it was still on screen.
    const resetST = ScrollTrigger.create({
      trigger: galleryWrap,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (!self.isActive && reveal) reveal.pause(0);
      },
    });

    return () => {
      growST.kill();
      revealST.kill();
      resetST.kill();
      if (reveal) reveal.kill();
      gsap.set(galleryImage, { clearProps: "width" });
      if (introBottom) {
        gsap.set(introBottom, { clearProps: "opacity,transform" });
      }
    };
  });

  // Mobile / reduced motion never run the reveal above, so make sure the copy
  // is simply visible (it's held at opacity 0 only inside the matching
  // breakpoint in conciergerie.css, but GSAP may have left inline values
  // behind when crossing the breakpoint).
  mm.add("(max-width: 768px), (prefers-reduced-motion: reduce)", () => {
    if (introBottom) gsap.set(introBottom, { opacity: 1, y: 0 });
  });
}
