import { gsap, ScrollTrigger } from "./gsap-setup.js";

// News reveal. A single sticky image stage on the left holds all images
// stacked; the text blocks scroll on the right. Only one image is visible
// at a time.
//
// - The first image is shown by default (visible the moment you reach
//   the section).
// - Every following image wipes in BOTTOM-TO-TOP over the previous one.
// - Each reveal lasts exactly one body-height of scroll and starts as
//   that body enters the stage. Because the bodies are stacked and the
//   reveal duration equals a body's height, each image finishes revealing
//   exactly as the next one begins — one clean animation per item.

const media = document.querySelector("[data-news-media]");
const imgs = media ? gsap.utils.toArray(".c-news__media-img", media) : [];
const bodies = gsap.utils.toArray("[data-news-body]");

const HIDDEN = "inset(100% 0 0 0)"; // 0-height strip at the bottom
const SHOWN = "inset(0% 0 0 0)"; // full image

// The stage's on-screen top when stuck (its CSS top offset + top margin),
// read live so it stays correct across breakpoints / on resize.
function stageScreenTop() {
  const cs = getComputedStyle(media);
  return (parseFloat(cs.top) || 0) + (parseFloat(cs.marginTop) || 0);
}

if (media && imgs.length && imgs.length === bodies.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // First image visible by default; the rest start clipped.
    gsap.set(imgs[0], { clipPath: SHOWN });
    imgs.slice(1).forEach((img) => gsap.set(img, { clipPath: HIDDEN }));

    const triggers = [];
    imgs.forEach((img, i) => {
      if (i === 0) return; // first image is always shown
      const tween = gsap.fromTo(
        img,
        { clipPath: HIDDEN },
        {
          clipPath: SHOWN,
          ease: "none",
          scrollTrigger: {
            trigger: bodies[i],
            // Start as this block's top reaches the TOP of the stage; run
            // for exactly one body-height of scroll. Anchoring to the
            // stage top (read live) keeps the reveal parallel to the body
            // regardless of the stage's `top` offset.
            start: () => `top ${stageScreenTop()}px`,
            end: () => `+=${bodies[i].offsetHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t && t.kill());
      gsap.set(imgs, { clearProps: "clipPath" });
    };
  });
}
