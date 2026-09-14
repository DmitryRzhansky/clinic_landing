(function initRefusalBlock() {
  function init() {
    const root = document.querySelector("[data-refusal]");

    if (!root || root.dataset.refusalReady === "true") {
      return;
    }

    root.dataset.refusalReady = "true";

    const inputs = Array.from(root.querySelectorAll('input[name="refusal-case"]'));
    const panels = Array.from(root.querySelectorAll("[data-refusal-panel]"));

    if (!inputs.length || !panels.length) {
      return;
    }

    function activate(caseId) {
      panels.forEach(function (panel) {
        const isActive = panel.getAttribute("data-refusal-panel") === caseId;
        panel.classList.toggle("is-active", isActive);
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) {
          activate(input.value);
        }
      });
    });

    const checked = inputs.find(function (input) {
      return input.checked;
    });

    activate(checked ? checked.value : inputs[0].value);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
