(function initCalculator() {
  function formatPrice(value) {
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  }

  function getCheckedValue(form, name) {
    const field = form.querySelector('input[name="' + name + '"]:checked');
    return field ? field.value : "";
  }

  function init() {
    const root = document.querySelector("[data-calculator]");

    if (!root || root.dataset.calculatorReady === "true") {
      return;
    }

    root.dataset.calculatorReady = "true";

    const form = root.querySelector("[data-calculator-form]");
    const whenGroup = root.querySelectorAll('input[name="when"]');
    const datetimeWrap = root.querySelector("[data-calculator-datetime]");
    const datetimeInput = root.querySelector("#calculator-datetime");
    const result = root.querySelector("[data-calculator-result]");
    const priceNode = root.querySelector("[data-calculator-price]");
    const factorsNode = root.querySelector("[data-calculator-factors]");

    if (!form || !result || !priceNode || !factorsNode) {
      return;
    }

    function syncDatetimeVisibility() {
      const when = getCheckedValue(form, "when");
      const showDatetime = when === "schedule";

      if (datetimeWrap) {
        datetimeWrap.hidden = !showDatetime;
      }

      if (datetimeInput) {
        datetimeInput.required = showDatetime;
        if (!showDatetime) {
          datetimeInput.value = "";
        }
      }
    }

    function calculate() {
      const address = String(form.address.value || "").trim();
      const when = getCheckedValue(form, "when");
      const type = getCheckedValue(form, "type");
      const night = Boolean(form.night && form.night.checked);
      const drip = Boolean(form.drip && form.drip.checked);
      const severe = Boolean(form.severe && form.severe.checked);

      let total = 0;
      const factors = [];

      if (type === "visit") {
        total += 2000;
        factors.push("тип обращения: вызов нарколога");
      } else if (type === "detox") {
        total += 7000;
        factors.push("тип обращения: вывод из запоя");
      } else {
        total += 3500;
        factors.push("тип обращения: другая выездная помощь");
      }

      if (when === "now") {
        total += 1000;
        factors.push("срочность: выезд сейчас");
      } else if (when === "today") {
        factors.push("срочность: выезд сегодня");
      } else {
        factors.push("срочность: выбранное время");
      }

      if (night) {
        total += 1500;
        factors.push("ночной выезд с 22:00 до 08:00");
      }

      if (drip) {
        total += 5000;
        factors.push("капельница на месте");
      }

      if (severe) {
        total += 5000;
        factors.push("осложнённое / тяжёлое состояние");
      }

      const nearBelorusskaya = /белорусск/i.test(address);
      if (address && !nearBelorusskaya) {
        total += 1000;
        factors.push("адрес вне ближайшей зоны у Белорусской");
      } else {
        factors.push("адрес в зоне метро Белорусская");
      }

      return { total: total, factors: factors };
    }

    function renderResult() {
      const estimate = calculate();

      priceNode.textContent = formatPrice(estimate.total) + "\u00a0₽";

      factorsNode.innerHTML = "";
      estimate.factors.forEach(function (factor) {
        const item = document.createElement("li");
        item.className = "calculator__factor";
        item.textContent = factor;
        factorsNode.appendChild(item);
      });
    }

    whenGroup.forEach(function (input) {
      input.addEventListener("change", function () {
        syncDatetimeVisibility();
        renderResult();
      });
    });

    form.addEventListener("change", renderResult);
    form.addEventListener("input", renderResult);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      renderResult();
      result.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    syncDatetimeVisibility();
    renderResult();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
