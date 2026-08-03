import { gsap, ScrollTrigger } from "./gsap-setup.js";

// News reveal. A single sticky image stage on the left holds all images
// stacked; the text blocks scroll on the right. Only one image is visible
// at a time.
//
// Each image wipes in BOTTOM-TO-TOP, and — crucially — the reveal is tied
// to when that image's own text block passes through the sticky stage:
// it starts as the block's top reaches the bottom of the stage and
// finishes as it reaches the top. So image N reveals while you're on
// block N, not early during block N-1.

const media = document.querySelector("[data-news-media]");
const imgs = media ? gsap.utils.toArray(".c-news__media-img", media) : [];
const bodies = gsap.utils.toArray("[data-news-body]");

const HIDDEN = "inset(100% 0 0 0)"; // 0-height strip at the bottom
const SHOWN = "inset(0% 0 0 0)"; // full image

// The sticky stage's on-screen top and height (reads the resolved CSS,
// so it stays correct across breakpoints / on resize).
function stageTop() {
  return parseFloat(getComputedStyle(media).top) || 0;
}
function stageHeight() {
  return media.offsetHeight;
}

if (media && imgs.length && imgs.length === bodies.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Everything starts clipped; each block reveals its own image as it
    // enters the stage.
    gsap.set(imgs, { clipPath: HIDDEN });

    const triggers = imgs.map((img, i) => {
      const tween = gsap.fromTo(
        img,
        { clipPath: HIDDEN },
        {
          clipPath: SHOWN,
          ease: "none",
          scrollTrigger: {
            trigger: bodies[i],
            // Start when the block's top reaches the BOTTOM of the stage,
            // end when it reaches the TOP — i.e. as the block sweeps
            // through the pinned image.
            start: () => `top ${stageTop() + stageHeight()}px`,
            end: () => `top ${stageTop()}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      return tween.scrollTrigger;
    });

    return () => {
      triggers.forEach((t) => t && t.kill());
      gsap.set(imgs, { clearProps: "clipPath" });
    };
  });
}
