(function initCasesBlock() {
  function init() {
    const root = document.querySelector("[data-cases]");

    if (!root || root.dataset.casesReady === "true") {
      return;
    }

    root.dataset.casesReady = "true";

    const track = root.querySelector("[data-cases-track]");
    const slides = Array.from(root.querySelectorAll("[data-cases-slide]"));
    const prevButton = root.querySelector("[data-cases-prev]");
    const nextButton = root.querySelector("[data-cases-next]");

    if (!track || slides.length === 0) {
      return;
    }

    let index = 0;

    function update() {
      const maxIndex = slides.length - 1;

      index = Math.min(Math.max(0, index), maxIndex);
      track.style.transform = "translate3d(-" + index * 100 + "%, 0, 0)";

      if (prevButton) {
        prevButton.hidden = index <= 0;
      }

      if (nextButton) {
        nextButton.hidden = index >= maxIndex;
      }

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === index;
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.toggleAttribute("inert", !isActive);
      });
    }

    function goTo(nextIndex) {
      index = nextIndex;
      update();
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

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        goTo(index - 1);
      }

      if (event.key === "ArrowRight") {
        goTo(index + 1);
      }
    });

    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
