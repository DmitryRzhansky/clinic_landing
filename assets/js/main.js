import { initFadeMotion } from "./modules/motion.js";
import { initSmoothScroll } from "./modules/scroll.js";

function safeInit(label, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[clinic] ${label} failed:`, error);
  }
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("has-motion");
}

safeInit("header-scroll", initSmoothScroll);
safeInit("fade-motion", initFadeMotion);
