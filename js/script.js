/*
  T-10 Robotics — shared site behavior

  This file runs on every page. It controls the mobile menu, the footer year,
  the fallback blocks for broken images, the contact form submission flow, and
  the gallery carousels. If a change affects more than one page, edit here.
*/

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- mobile nav toggle ---------- */
  // The nav toggle is hidden on larger screens and used to show/hide links on mobile.
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Set the current year in any element with data-year; useful for a dynamic footer label.
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Replace broken image tags with a styled placeholder so the layout doesn't collapse.
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

  // Contact form behavior: validate fields, send to the Cloudflare function, and show status text.
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
        const result = await res.json().catch(() => ({}));

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

  // Initialize every image carousel found on the page using a manifest.json in each image folder.
  document.querySelectorAll(".carousel").forEach((el) => initCarousel(el));
});

const CAROUSEL_INTERVAL_MS = 10000;

// Build each carousel from a folder's manifest.json. Each image is loaded from the folder
// and rotated automatically every 10 seconds unless the user hovers or clicks controls.
async function initCarousel(el) {
  const folder = el.dataset.folder;
  if (!folder) return;

  let files;
  try {
    const res = await fetch(`${folder}/manifest.json`);
    if (!res.ok) throw new Error("no manifest");
    files = await res.json();
  } catch {
    el.innerHTML = `<div class="img-missing">no manifest.json in ${folder}</div>`;
    return;
  }

  if (!files.length) {
    el.innerHTML = `<div class="img-missing">no images in ${folder}</div>`;
    return;
  }

  buildCarousel(el, folder, files);
}

function buildCarousel(el, folder, files) {
  // The carousel stores one image per slide and toggles the "active" class to crossfade between them.
  let index = 0;
  let timer = null;

  el.innerHTML = `
    <div class="carousel-track"></div>
    ${files.length > 1 ? `
      <button class="carousel-btn prev" aria-label="Previous image">&#8249;</button>
      <button class="carousel-btn next" aria-label="Next image">&#8250;</button>
      <div class="carousel-dots"></div>
    ` : ""}
  `;

  const track = el.querySelector(".carousel-track");
  const dotsWrap = el.querySelector(".carousel-dots");

  // preload one <img> per slide, stacked and crossfaded via CSS opacity
  const imgs = files.map((file) => {
    const img = document.createElement("img");
    img.src = `${folder}/${file}`;
    img.alt = "";
    track.appendChild(img);
    return img;
  });

  const dots = files.map((_, i) => {
    if (!dotsWrap) return null;
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to image ${i + 1}`);
    dot.addEventListener("click", () => {
      show(i);
      resetTimer();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(i) {
    index = (i + files.length) % files.length;
    imgs.forEach((im, di) => im.classList.toggle("active", di === index));
    dots.forEach((d, di) => d && d.classList.toggle("active", di === index));
  }

  function startTimer() {
    if (files.length <= 1) return;
    timer = setInterval(() => show(index + 1), CAROUSEL_INTERVAL_MS);
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    startTimer();
  }

  el.querySelector(".prev")?.addEventListener("click", () => {
    show(index - 1);
    resetTimer();
  });
  el.querySelector(".next")?.addEventListener("click", () => {
    show(index + 1);
    resetTimer();
  });

  // pause on hover so people can actually read/look without it jumping mid-glance
  el.addEventListener("mouseenter", () => timer && clearInterval(timer));
  el.addEventListener("mouseleave", startTimer);

  show(0);
  startTimer();
}