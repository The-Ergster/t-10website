/* T-10 Robotics — shared site behavior */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";

      const filename = img.getAttribute("src").split("/").pop();
      const box = document.createElement("div");
      box.className = "img-missing";
      box.style.width = "100%";
      box.style.height = "100%";
      box.style.aspectRatio = getComputedStyle(img).aspectRatio || "1";
      box.textContent = filename;

      img.replaceWith(box);
    });
  });

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-note");
      const button = form.querySelector('button[type="submit"]');

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      button.disabled = true;
      note.classList.remove("success", "error");
      note.textContent = "Sending…";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
        });
        const result = await res.json();

        if (res.ok && result.ok) {
          note.textContent = "Thanks — your message has been sent.";
          note.classList.add("success");
          form.reset();
        } else {
          note.textContent = result.error || "Something went wrong. Please try again.";
          note.classList.add("error");
        }
      } catch (err) {
        note.textContent = "Something went wrong. Please try again.";
        note.classList.add("error");
      } finally {
        button.disabled = false;
      }
    });
  }
});
