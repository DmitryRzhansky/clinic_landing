import { initSmoothScroll } from "./modules/scroll.js";

function safeInit(label, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[clinic] ${label} failed:`, error);
  }
}

safeInit("header-scroll", initSmoothScroll);
