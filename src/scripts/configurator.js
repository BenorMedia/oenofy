// Configurator — step-by-step case builder.
//
// Markup and data come from src/components/Configurator.astro +
// src/data/cases.js. Every screen is already in the DOM, so this file only
// decides *when* a state changes: all the motion lives in configurator.css,
// the same split the preloader uses.
//
// Screens, in order: one per step in the data, then "overview", "form" and
// "success". It is always a popup — it starts closed and opens from any
// [data-configurator-open] element, so /configurator and /case-n behave
// identically.

const root = document.querySelector("[data-configurator]");

if (root) {
  const stepPanels = Array.from(root.querySelectorAll("[data-step-index]"));
  const summaryParts = Array.from(root.querySelectorAll("[data-summary-part]"));
  const summaryValues = Array.from(root.querySelectorAll("[data-summary-step]"));
  const thumbs = Array.from(root.querySelectorAll("[data-thumb]"));
  const detailViews = Array.from(root.querySelectorAll("[data-detail-view]"));
  const renderViews = Array.from(root.querySelectorAll("[data-render-view]"));

  const cta = root.querySelector("[data-configurator-cta]");
  const title = root.querySelector("[data-configurator-title]");
  const overview = root.querySelector("[data-configurator-overview]");
  const selectionLine = root.querySelector("[data-configurator-selection]");
  const info = root.querySelector("[data-configurator-info]");
  const formConfig = root.querySelector("[data-form-configuration]");
  const formConfigInput = root.querySelector("[data-form-configuration-input]");

  const CASE_NAME = root.dataset.caseName || "";
  const BASE_RENDER = root.dataset.baseRender || "";
  const OVERVIEW_CTA = root.dataset.overviewCta || "Send a request";

  const OVERVIEW = stepPanels.length;
  const FORM = stepPanels.length + 1;
  const SUCCESS = stepPanels.length + 2;

  let screen = 0;

  // One selected option button per step. The component pre-selects the first
  // option of each step, matching the designs (Stainless / Mirror / Domaine).
  const chosen = stepPanels.map((panel) =>
    panel.querySelector(".c-configurator__option.is-selected")
  );

  function optionsOf(panel) {
    return Array.from(panel.querySelectorAll(".c-configurator__option"));
  }

  function labelOf(index) {
    return chosen[index] ? chosen[index].dataset.optionLabel : "";
  }

  // "A, B and C" — the overview reads as a sentence, unlike the comma list in
  // the summary bar.
  function sentence(values) {
    if (values.length < 2) return values.join("");
    return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
  }

  // The last step at or before the current screen that names its own render
  // wins; the overview and the form keep whatever the last step was showing.
  function activeRender() {
    const upTo = Math.min(screen, stepPanels.length - 1);
    let id = BASE_RENDER;
    for (let i = 0; i <= upTo; i += 1) {
      if (stepPanels[i].dataset.render) id = stepPanels[i].dataset.render;
    }
    return id;
  }

  function render() {
    const onStep = screen < stepPanels.length;
    const isOverview = screen === OVERVIEW;

    root.dataset.screen = onStep
      ? "step"
      : isOverview
        ? "overview"
        : screen === FORM
          ? "form"
          : "success";

    const renderId = activeRender();
    renderViews.forEach((view) => {
      view.classList.toggle("is-active", view.dataset.renderView === renderId);
    });

    stepPanels.forEach((panel, i) => {
      const active = onStep && i === screen;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
      // Keep hidden panels out of the tab order — they stay in the DOM so
      // they can crossfade, but they must not be reachable.
      optionsOf(panel).forEach((button) => {
        button.tabIndex = active ? 0 : -1;
      });
    });

    // Only answered steps appear in the summary: on step 0 that is just the
    // material, on step 1 material + finish, and so on.
    const answered = onStep ? screen + 1 : stepPanels.length;
    summaryParts.forEach((part, i) => {
      part.hidden = i >= answered;
      if (i < answered) summaryValues[i].textContent = labelOf(i);
      summaryValues[i].tabIndex = i < answered && onStep ? 0 : -1;
    });

    cta.textContent = onStep ? stepPanels[screen].dataset.cta : OVERVIEW_CTA;

    // The step title and the overview headline both carry the case name, so
    // only the visible one is exposed to assistive tech.
    title.setAttribute("aria-hidden", isOverview ? "true" : "false");
    overview.setAttribute("aria-hidden", isOverview ? "false" : "true");

    const values = stepPanels.map((_, i) => labelOf(i));
    selectionLine.textContent = sentence(values);

    const configuration = `${CASE_NAME} — ${values.join(", ")}`;
    if (formConfig) formConfig.textContent = configuration;
    if (formConfigInput) formConfigInput.value = configuration;
  }

  // --- Detail views -------------------------------------------------------

  function resetDetail() {
    root.dataset.detail = "";
    detailViews.forEach((view) => view.classList.remove("is-active"));
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === 0);
      thumb.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    });
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const isDetail = thumb.dataset.thumbDetail === "true";

      thumbs.forEach((other) => {
        other.classList.toggle("is-active", other === thumb);
        other.setAttribute("aria-pressed", other === thumb ? "true" : "false");
      });

      root.dataset.detail = isDetail ? "on" : "";
      detailViews.forEach((view) => {
        view.classList.toggle(
          "is-active",
          isDetail && view.dataset.detailView === thumb.dataset.thumb
        );
      });
    });
  });

  // --- Selections and navigation -----------------------------------------

  stepPanels.forEach((panel, i) => {
    optionsOf(panel).forEach((button) => {
      button.addEventListener("click", () => {
        optionsOf(panel).forEach((other) => {
          other.classList.toggle("is-selected", other === button);
          other.setAttribute(
            "aria-selected",
            other === button ? "true" : "false"
          );
        });
        chosen[i] = button;
        render();
      });
    });
  });

  function goTo(next) {
    screen = next;
    // Leaving a step always returns to the configured render: the overview
    // has no thumbs, and a detail shot would otherwise survive the move.
    resetDetail();
    render();
  }

  cta.addEventListener("click", () => {
    if (screen >= FORM) return;
    goTo(screen + 1);
  });

  // cta-form.js validates the form and, only when it passes, dispatches this
  // event. Nothing is transmitted yet — the confirmation screen stands in for
  // the response until there is an endpoint to POST to.
  root.addEventListener("ctaform:submit", () => goTo(SUCCESS));

  summaryValues.forEach((button, i) => {
    button.addEventListener("click", () => goTo(i));
  });

  const back = root.querySelector("[data-configurator-back]");
  if (back) back.addEventListener("click", () => goTo(OVERVIEW));

  // --- Info modal ---------------------------------------------------------

  function openInfo() {
    root.classList.add("is-info-open");
    const close = info.querySelector("[data-configurator-info-close]");
    if (close) close.focus();
  }

  function closeInfo() {
    root.classList.remove("is-info-open");
  }

  root.querySelectorAll("[data-configurator-info-open]").forEach((button) => {
    button.addEventListener("click", openInfo);
  });

  root.querySelectorAll("[data-configurator-info-close]").forEach((button) => {
    button.addEventListener("click", closeInfo);
  });

  // --- Scroll lock --------------------------------------------------------
  //
  // Input blocking, never `overflow: hidden` — that drops the scrollbar,
  // widens the viewport ~15px and shifts the nav's centre mark, which the
  // overview screen puts back on display.

  const SCROLL_KEYS = new Set([
    " ",
    "PageUp",
    "PageDown",
    "End",
    "Home",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);

  let lockedY = 0;

  function scrollsInternally(target) {
    return !!(
      target &&
      target.closest &&
      target.closest("[data-configurator-scroll]")
    );
  }

  function blockEvent(event) {
    // ctrl+wheel is browser zoom, not a scroll.
    if (event.ctrlKey) return;
    if (scrollsInternally(event.target)) return;
    event.preventDefault();
  }

  function blockKeys(event) {
    if (!SCROLL_KEYS.has(event.key)) return;
    const el = event.target;
    if (
      el &&
      (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
    ) {
      return;
    }
    if (scrollsInternally(el)) return;
    event.preventDefault();
  }

  // Pinned to wherever the page was when the overlay opened — not to 0 like
  // the preloader: on a /case-n page the configurator opens mid-page and
  // closing has to leave the reader where they were.
  function clampScroll() {
    window.scrollTo(0, lockedY);
  }

  function lockScroll() {
    lockedY = window.scrollY;
    document.documentElement.classList.add("is-configurator-open");
    window.addEventListener("wheel", blockEvent, { passive: false });
    window.addEventListener("touchmove", blockEvent, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", clampScroll);
  }

  function unlockScroll() {
    document.documentElement.classList.remove("is-configurator-open");
    window.removeEventListener("wheel", blockEvent);
    window.removeEventListener("touchmove", blockEvent);
    window.removeEventListener("keydown", blockKeys);
    window.removeEventListener("scroll", clampScroll);
  }

  // --- Open / close -------------------------------------------------------

  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    lockScroll();
    // Selections survive a close/reopen, but the flow always restarts at the
    // first step — reopening straight onto the form would be disorienting.
    goTo(0);
    const first = root.querySelector(
      ".c-configurator__step.is-active .c-configurator__option.is-selected"
    );
    if (first) first.focus({ preventScroll: true });
  }

  function close() {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    closeInfo();
    unlockScroll();
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus({ preventScroll: true });
    }
  }

  document.querySelectorAll("[data-configurator-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });
  });

  root.querySelectorAll("[data-configurator-close]").forEach((button) => {
    button.addEventListener("click", close);
  });

  // The overlay covers the page but the page is still in the tab order
  // behind it, so keep focus inside — and inside the info modal while that
  // is up, since it sits above every screen.
  const FOCUSABLE =
    "a[href], button:not([disabled]), input, select, textarea, [tabindex]";

  function trapFocus(event) {
    if (event.key !== "Tab") return;
    if (!root.classList.contains("is-open")) return;

    const scope = root.classList.contains("is-info-open")
      ? root.querySelector(".c-configurator__info-panel")
      : root;

    const reachable = Array.from(scope.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.tabIndex !== -1 && el.offsetParent !== null
    );
    if (!reachable.length) return;

    const first = reachable[0];
    const last = reachable[reachable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !scope.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !scope.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", trapFocus);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (root.classList.contains("is-info-open")) {
      closeInfo();
      return;
    }
    if (root.classList.contains("is-open")) close();
  });

  render();
}
