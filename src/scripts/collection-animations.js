import { gsap, ScrollTrigger } from "./gsap-setup.js";

// Collection reveal. Two modes, chosen by matchMedia:
//
// DESKTOP — the Quote stage pins for ~150vh. The dark overlay fades in
// over the first ~10% of that scroll. At ~15% a SELF-PLAYING (time-based,
// not scroll-scrubbed) timeline reveals the three cards one by one; once
// shown they stay put for the rest of the pinned section. Scrolling back
// up past the trigger fades the cards out (opacity only — they don't
// slide back down) and arms the timeline to replay 1-by-1 on the way
// down again.
//
// MOBILE — no pin. The cards sit in normal flow below the quote and
// simply fade up (staggered) as they enter view.
//
// prefers-reduced-motion gets neither — cards stay in default CSS state.

const stage = document.querySelector("[data-collection-stage]");
const overlay = stage?.querySelector("[data-collection-overlay]");
const cards = stage ? gsap.utils.toArray("[data-collection-card]", stage) : [];

if (stage && overlay && cards.length) {
  const mm = gsap.matchMedia();

  // ---- Desktop: pinned section, self-playing card reveal ----
  mm.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(cards, { yPercent: 120, autoAlpha: 0 });
      gsap.set(overlay, { opacity: 0 });

      // Self-playing 1-by-1 reveal. fromTo so every (re)play restarts
      // cleanly from hidden/below regardless of the cards' current state.
      const cardsTl = gsap.timeline({ paused: true });
      cardsTl
        .fromTo(
          cards[0],
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }
        )
        .fromTo(
          cards[1],
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          cards[2],
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        );

      const PLAY_AT = 0.15; // reveal fires ~15% into the pin
      const RESET_AT = 0.1; // hysteresis so it can't flicker at the edge
      let revealed = false;

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=150%",
        pin: true,
        onUpdate: (self) => {
          // Dark overlay fades in over the first ~10% of the pin.
          gsap.set(overlay, {
            opacity: gsap.utils.clamp(0, 1, self.progress / 0.1),
          });

          if (self.progress >= PLAY_AT && !revealed) {
            // Scrolling down past the trigger: play the 1-by-1 reveal,
            // then the cards hold for the rest of the pin.
            revealed = true;
            gsap.killTweensOf(cards);
            cardsTl.restart();
          } else if (self.progress <= RESET_AT && revealed) {
            // Scrolling back up: fade the cards out in place (no
            // slide-down); timeline stays armed to replay from the start.
            revealed = false;
            cardsTl.pause();
            gsap.to(cards, { autoAlpha: 0, duration: 0.3, overwrite: true });
          }
        },
      });

      return () => {
        st.kill();
        cardsTl.kill();
        gsap.killTweensOf(cards);
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
