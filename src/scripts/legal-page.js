// Legal page — TOC scrollspy. Plain IntersectionObserver, no GSAP
// needed for this. Highlights the TOC link matching whichever
// .c-legal-section is currently most in view.

function setupLegalToc() {
  const sections = document.querySelectorAll("[data-legal-section]");
  const links = document.querySelectorAll("[data-toc-link]");

  if (!sections.length || !links.length) return;

  const linkByTarget = new Map();
  links.forEach((link) => {
    linkByTarget.set(link.getAttribute("href").slice(1), link);
  });

  const setActive = (id) => {
    links.forEach((link) => link.classList.remove("is-active"));
    const active = linkByTarget.get(id);
    if (active) active.classList.add("is-active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      // Fires once a section's heading has crossed the upper third of
      // the viewport, and stays "active" until the next one crosses.
      rootMargin: "-15% 0px -70% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", setupLegalToc);
