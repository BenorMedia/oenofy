import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Case 1 page animations — added per section as designs come in.

// Hero — the outer section is 200vh (see case-1.css: sticky 100vh
// stage inside it) so this scrub has room to breathe before Intro
// appears. As the user scrolls through the full 200vh, the title
// fades out (finishes by the halfway point) while the case image
// scrubs upward the whole way, ending close to — but not exactly on —
// the title's spot. Skipped under prefers-reduced-motion.
const hero = document.querySelector("[data-case-hero]");
const heroTitle = document.querySelector("[data-case-hero-title]");
const heroImg = document.querySelector("[data-case-hero-img]");

if (hero && heroTitle && heroImg) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(heroTitle, { opacity: 1 });
    gsap.set(heroImg, { y: 0 });

    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // Title: fades out over the first half of the scroll.
        const titleOpacity = 1 - Math.min(self.progress / 0.5, 1);
        gsap.set(heroTitle, { opacity: titleOpacity });

        // Image: rises the whole way through, from its resting spot
        // near the bottom (top: 62vh in CSS) up closer to the title's
        // center (50vh).
        const y = gsap.utils.interpolate(0, -47, self.progress);
        gsap.set(heroImg, { y: `${y}vh` });
      },
    });

    return () => {
      st.kill();
      gsap.set([heroTitle, heroImg], { clearProps: "all" });
    };
  });
}

// Video gallery — replicates Collection's grow-on-scroll: the media
// grows 70% -> 100% width as the sticky stage scrolls through, then
// locks once fully expanded. Desktop-only (mobile keeps it static
// full-width, see case-1.css); also skipped under prefers-reduced-motion.
const galleryWrap = document.querySelector("[data-case-gallery]");
const galleryMedia = document.querySelector("[data-case-gallery-media]");

if (galleryWrap && galleryMedia) {
  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(galleryMedia, { width: "70%" });

      const st = ScrollTrigger.create({
        trigger: galleryWrap,
        start: "top 45%", // fires a little above viewport middle
        end: "bottom bottom", // fully grown by the time the stage ends
        scrub: true,
        onUpdate: (self) => {
          const width = gsap.utils.interpolate(70, 100, self.progress);
          gsap.set(galleryMedia, { width: `${width}%` });

          if (self.progress >= 1) {
            st.kill();
          }
        },
      });

      return () => {
        st.kill();
        gsap.set(galleryMedia, { clearProps: "width" });
      };
    }
  );
}

// Video gallery — play the video only while it's in view, pause when
// it leaves. Runs regardless of motion preference (it's content, not
// motion decoration), on all viewports.
const galleryVideo = document.querySelector("[data-case-gallery-video]");

if (galleryVideo) {
  ScrollTrigger.create({
    trigger: galleryVideo,
    start: "top bottom",
    end: "bottom top",
    onEnter: () => galleryVideo.play(),
    onEnterBack: () => galleryVideo.play(),
    onLeave: () => galleryVideo.pause(),
    onLeaveBack: () => galleryVideo.pause(),
  });
}

// Technical details — one panel open at a time, matching the design (the
// first is open on load, set in the markup).
//
// Opening a panel changes the height of everything below it, and the
// .cc-fade-up reveals resolve absolute scroll positions from an offsetTop
// chain, so ScrollTrigger has to be handed fresh measurements once the panel
// has finished growing or shrinking.
const accordionItems = Array.from(
  document.querySelectorAll("[data-case-accordion]")
);

accordionItems.forEach((item) => {
  const trigger = item.querySelector("[data-case-accordion-trigger]");
  const panel = item.querySelector("[data-case-accordion-panel]");
  if (!trigger || !panel) return;

  trigger.addEventListener("click", () => {
    const opening = !item.classList.contains("is-open");

    accordionItems.forEach((other) => {
      other.classList.remove("is-open");
      const otherTrigger = other.querySelector("[data-case-accordion-trigger]");
      if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
    });

    if (opening) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  panel.addEventListener("transitionend", (event) => {
    if (event.propertyName === "grid-template-rows") ScrollTrigger.refresh();
  });
});
