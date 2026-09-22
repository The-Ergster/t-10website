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

//Image Carousel 
  document.querySelectorAll(".carousel").forEach((el) => initCarousel(el));
});

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
  let index = 0;

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

  const img = document.createElement("img");
  img.alt = "";
  track.appendChild(img);

  const dots = files.map((_, i) => {
    if (!dotsWrap) return null;
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to image ${i + 1}`);
    dot.addEventListener("click", () => show(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(i) {
    index = (i + files.length) % files.length;
    img.src = `${folder}/${files[index]}`;
    dots.forEach((d, di) => d && d.classList.toggle("active", di === index));
  }

  el.querySelector(".prev")?.addEventListener("click", () => show(index - 1));
  el.querySelector(".next")?.addEventListener("click", () => show(index + 1));

  show(0);
}