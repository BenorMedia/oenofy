import { gsap, ScrollTrigger } from "./gsap-setup.js";

// News reveal. A single sticky image stage on the left holds all images
// stacked; the text blocks scroll on the right. Only one image is visible
// at a time. As each text block scrolls into place, its image wipes in
// from top to bottom (clip-path) over the previous one — so the current
// image is progressively hidden while the next is revealed. Scroll up
// reverses it (scrub).

const media = document.querySelector("[data-news-media]");
const imgs = media ? gsap.utils.toArray(".c-news__media-img", media) : [];
const bodies = gsap.utils.toArray("[data-news-body]");

const HIDDEN = "inset(0 0 100% 0)"; // 0-height strip at the top
const SHOWN = "inset(0 0 0% 0)"; // full image

if (media && imgs.length && imgs.length === bodies.length) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // First image shown; the rest start clipped to nothing.
    gsap.set(imgs[0], { clipPath: SHOWN });
    imgs.slice(1).forEach((img) => gsap.set(img, { clipPath: HIDDEN }));

    const triggers = [];
    imgs.forEach((img, i) => {
      if (i === 0) return;
      const tween = gsap.fromTo(
        img,
        { clipPath: HIDDEN },
        {
          clipPath: SHOWN,
          ease: "none",
          scrollTrigger: {
            // Reveal image i as its text block rises through the upper
            // half of the viewport.
            trigger: bodies[i],
            start: "top 75%",
            end: "top 30%",
            scrub: true,
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
