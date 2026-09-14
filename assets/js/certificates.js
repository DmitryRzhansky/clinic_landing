(function initCertificatesBlock() {
  function init() {
    const root = document.querySelector("[data-certificates]");

    if (!root || root.dataset.certificatesReady === "true") {
      return;
    }

    root.dataset.certificatesReady = "true";

    const track = root.querySelector("[data-certificates-track]");
    const viewport = root.querySelector(".certificates__viewport");
    const slides = Array.from(root.querySelectorAll("[data-certificates-slide]"));
    const prevButton = root.querySelector("[data-certificates-prev]");
    const nextButton = root.querySelector("[data-certificates-next]");
    const lightbox = root.querySelector("[data-certificates-lightbox]");
    const lightboxImage = root.querySelector("[data-certificates-lightbox-image]");
    const lightboxClose = root.querySelector("[data-certificates-lightbox-close]");

    let index = 0;

    function getStep() {
      if (!track || !slides[0]) {
        return 0;
      }

      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;

      return slides[0].getBoundingClientRect().width + gap;
    }

    function fitsInViewport() {
      if (!track || !viewport || slides.length === 0) {
        return true;
      }

      track.classList.remove("is-centered");
      viewport.classList.remove("is-centered");
      track.style.transform = "";

      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const totalWidth = slides.reduce(function (sum, slide) {
        return sum + slide.getBoundingClientRect().width;
      }, 0) + gap * Math.max(0, slides.length - 1);

      return totalWidth <= viewport.clientWidth + 4;
    }

    function getMaxIndex() {
      if (!track || !viewport || slides.length === 0) {
        return 0;
      }

      const overflow = track.scrollWidth - viewport.clientWidth;

      if (overflow <= 4) {
        return 0;
      }

      const step = getStep();

      if (step <= 0) {
        return slides.length - 1;
      }

      return Math.max(0, Math.ceil(overflow / step));
    }

    function updateSlider() {
      if (!track || !viewport) {
        return;
      }

      if (fitsInViewport()) {
        index = 0;
        track.classList.add("is-centered");
        viewport.classList.add("is-centered");
        track.style.transform = "";

        if (prevButton) {
          prevButton.hidden = true;
        }

        if (nextButton) {
          nextButton.hidden = true;
        }

        return;
      }

      track.classList.remove("is-centered");
      viewport.classList.remove("is-centered");

      const maxIndex = getMaxIndex();
      index = Math.min(Math.max(0, index), maxIndex);
      track.style.transform = "translate3d(-" + index * getStep() + "px, 0, 0)";

      if (prevButton) {
        prevButton.hidden = index <= 0;
      }

      if (nextButton) {
        nextButton.hidden = index >= maxIndex;
      }
    }

    function goTo(nextIndex) {
      index = nextIndex;
      updateSlider();
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        goTo(index - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    window.addEventListener("resize", function () {
      updateSlider();
    });

    if (lightbox && lightboxImage) {
      function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        lightboxImage.alt = "";
        document.body.style.overflow = "";
      }

      function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt || "Документ клиники";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      }

      root.addEventListener("click", function (event) {
        const trigger = event.target.closest("[data-certificates-open]");

        if (!trigger || !root.contains(trigger)) {
          return;
        }

        event.preventDefault();
        openLightbox(
          trigger.getAttribute("data-certificates-open") || "",
          trigger.getAttribute("data-certificates-alt") || "Документ клиники",
        );
      });

      if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
      }

      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
          closeLightbox();
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !lightbox.hidden) {
          closeLightbox();
        }
      });
    }

    updateSlider();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
