document.addEventListener("DOMContentLoaded", function () {

  const intro = document.querySelector("[data-oenofy-intro]");
  if (!intro) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {

    intro.classList.add(
      "is-dimmed",
      "is-os-hidden",
      "is-letters-hidden",
      "is-os-converging",
      "is-icon-up",
      "is-hero-visible",
      "is-content-visible",
      "is-final-logo-visible"
    );

    return;
  }

  const steps = [

    // initial logo hold
    ["is-dimmed", 1280],

    // original O letters disappear
    ["is-os-hidden", 1640],

    // morph starts
    ["is-os-converging", 1700],

    // letters fade
    ["is-letters-hidden", 1760],

    // icon moves upward
    ["is-icon-up", 3050],

    // WAIT until movement is fully finished,
    // then swap to PNG instantly
    ["is-final-logo-visible", 3400],

    // bg reveal
    ["is-hero-visible", 3550],

    // content reveal
    ["is-content-visible", 4150]

  ];

  steps.forEach(function ([className, delay]) {

    window.setTimeout(function () {
      intro.classList.add(className);
    }, delay);

  });

});
