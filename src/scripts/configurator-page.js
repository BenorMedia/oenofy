// Configurator page — DRAFT.
// Minimal interactivity for the first pass: material tabs toggle
// active state + update the summary line; thumbnails toggle active
// ring. No real pricing/3D-preview logic yet — wire in once the client
// locks direction.

const materialButtons = document.querySelectorAll(
  ".c-configurator-hero__material"
);
const summaryMaterial = document.querySelector("[data-summary-material]");

materialButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    materialButtons.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");

    if (summaryMaterial) {
      summaryMaterial.textContent = btn.dataset.material;
    }
  });
});

const thumbButtons = document.querySelectorAll(".c-configurator-hero__thumb");

thumbButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    thumbButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});
