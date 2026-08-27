// CTA form — required-field validation.
//
// Travels with the component, so every page that drops <CtaForm /> gets the
// same behaviour. The form carries `novalidate`, so the browser's own bubbles
// never appear and the messages built here are the only ones shown.
//
// There is no endpoint yet. A form that passes validation dispatches a
// bubbling `ctaform:submit` event and stops there — whatever needs to react
// to a successful submit (the configurator's confirmation screen today, a
// real POST later) listens for that instead of reaching into the form.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.querySelectorAll(".c-form__form").forEach((form) => {
  // The markup is the source of truth for what is required, so adding a
  // constraint is an attribute in CtaForm.astro, not a list in here.
  const fields = Array.from(form.querySelectorAll("[required]"));
  if (!fields.length) return;

  function errorFor(field) {
    const wrap = field.closest(".c-form__field");
    return wrap ? wrap.querySelector("[data-form-error]") : null;
  }

  // "First Name *" -> "First Name", so editing a label can never leave its
  // message behind.
  function nameOf(field) {
    const label = form.querySelector(`label[for="${field.id}"]`);
    const text = label ? label.textContent : field.name;
    return text.replace("*", "").trim();
  }

  function problemWith(field) {
    const value = field.value.trim();
    if (!value) return `${nameOf(field)} is required.`;
    if (field.type === "email" && !EMAIL.test(value)) {
      return "Enter a valid email address.";
    }
    return "";
  }

  function show(field, message) {
    field.classList.toggle("is-invalid", !!message);
    field.setAttribute("aria-invalid", message ? "true" : "false");

    const error = errorFor(field);
    if (!error) return;
    error.textContent = message;
    error.hidden = !message;
  }

  fields.forEach((field) => {
    // Only ever re-check a field that is already flagged: nobody should be
    // told their email is wrong while they are still typing it.
    const recheck = () => {
      if (field.classList.contains("is-invalid")) show(field, problemWith(field));
    };
    field.addEventListener("input", recheck);
    field.addEventListener("blur", recheck);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      const message = problemWith(field);
      show(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    form.dispatchEvent(
      new CustomEvent("ctaform:submit", { bubbles: true, detail: { form } })
    );
  });
});
