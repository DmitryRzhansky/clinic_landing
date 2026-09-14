function bindHeaderScrollState() {
  const header = document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  const update = () => {
    header.classList.toggle("hero-header--scrolled", window.scrollY > 24);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

export function initSmoothScroll() {
  bindHeaderScrollState();
}

export function pauseScroll() {}

export function resumeScroll() {}
