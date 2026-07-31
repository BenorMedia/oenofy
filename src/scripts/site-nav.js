// Navbar scroll behaviour. This only toggles state classes — all the
// visual transitions (background, blur, logo resize, slide) live in
// site-nav.css.
//
// - At the very top of the page: no state classes -> transparent,
//   full-size logo, visible.
// - Scrolled down at all (> TOP_THRESHOLD): .is-scrolled -> dark blurred
//   bar + smaller logo.
// - Scrolling DOWN past HIDE_AFTER: .is-hidden -> slides up out of view.
// - Scrolling UP: .is-hidden removed -> slides back into place.

const nav = document.querySelector("[data-nav]");

if (nav) {
  const TOP_THRESHOLD = 10; // px — below this we treat the page as "at top"
  const HIDE_AFTER = 120; // px — only start hiding once scrolled this far

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;

    // Styled bar whenever we're not pinned at the very top.
    nav.classList.toggle("is-scrolled", y > TOP_THRESHOLD);

    if (y <= TOP_THRESHOLD) {
      // At the top: always fully visible.
      nav.classList.remove("is-hidden");
    } else if (y > lastY && y > HIDE_AFTER) {
      // Scrolling down, past the threshold: hide.
      nav.classList.add("is-hidden");
    } else if (y < lastY) {
      // Scrolling up: reveal.
      nav.classList.remove("is-hidden");
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update(); // set correct state on load (e.g. refreshed mid-page)
}
