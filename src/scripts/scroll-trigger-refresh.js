import { ScrollTrigger } from "./gsap-setup.js";

// Fonts, the hero video, and images can all finish loading after the
// initial render and shift page layout — refresh once everything has
// settled so every ScrollTrigger's cached trigger positions stay accurate.
if (document.readyState === "complete") {
  ScrollTrigger.refresh();
} else {
  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
}
