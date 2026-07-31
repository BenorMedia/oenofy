import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Collection reveal. Two modes, chosen by matchMedia:
//
// DESKTOP — a pinned, scroll-scrubbed sequence. When the Quote stage
// reaches the top it pins for ~150vh; that scroll distance drives a
// timeline instead of moving the page: a short lead-in, then a dark
// overlay fades in over the quote, then the three cards slide up one by
// one. scrub:true means scrolling up reverses the whole thing. When the
// timeline finishes the pin releases and the stage scrolls away to the
// Slider.
//
// MOBILE — no pin/scroll-jacking. The cards sit in normal flow below the
// quote and simply fade up (staggered) as they enter view.
//
// prefers-reduced-motion gets neither — the cards stay in their default
// (visible) CSS state.

const stage = document.querySelector("[data-collection-stage]");
const overlay = stage?.querySelector("[data-collection-overlay]");
const cards = stage ? gsap.utils.toArray("[data-collection-card]", stage) : [];

if (stage && overlay && cards.length) {
  const mm = gsap.matchMedia();

  // ---- Desktop: pinned scrub sequence ----
  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      // Cards start just below the stage; overlay starts transparent.
      gsap.set(cards, { yPercent: 120 });
      gsap.set(overlay, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: true,
        },
      });

      tl.to({}, { duration: 0.12 }) // lead-in — the "couple of wheel turns"
        .to(overlay, { opacity: 1, duration: 0.18 }) // dark overlay fades in
        .to(cards[0], { yPercent: 0, duration: 0.2 }) // card 1 up
        .to(cards[1], { yPercent: 0, duration: 0.2 }) // card 2 up
        .to(cards[2], { yPercent: 0, duration: 0.2 }) // card 3 up
        .to({}, { duration: 0.1 }); // brief settle before the pin releases

      // Reset inline styles when leaving this breakpoint.
      return () => {
        gsap.set([cards, overlay], { clearProps: "all" });
      };
    }
  );

  // ---- Mobile: simple staggered fade-up, no pin ----
  mm.add(
    "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(cards, { autoAlpha: 0, y: 40 });

      const reveal = gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        paused: true,
      });

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top 60%",
        onEnter: () => reveal.play(),
      });

      return () => {
        st.kill();
        gsap.set(cards, { clearProps: "all" });
      };
    }
  );
}
