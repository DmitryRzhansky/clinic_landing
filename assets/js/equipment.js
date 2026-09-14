(function initEquipmentBlock() {
  function init() {
    const root = document.querySelector("[data-equipment]");

    if (!root || root.dataset.equipmentReady === "true") {
      return;
    }

    root.dataset.equipmentReady = "true";

    const inputs = Array.from(root.querySelectorAll('input[name="equipment-item"]'));
    const panels = Array.from(root.querySelectorAll("[data-equipment-panel]"));

    if (!inputs.length || !panels.length) {
      return;
    }

    function activate(itemId) {
      panels.forEach(function (panel) {
        const isActive = panel.getAttribute("data-equipment-panel") === itemId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
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
