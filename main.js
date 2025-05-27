import { updateCountdown } from "./js/countdown.js";
import { initializeQuotes } from "./js/quotes.js";
import { setupThemeToggle, updateToggleIcon } from "./js/themeToggle.js";
import { setupSoundToggle, updateSoundIcon } from "./js/soundToggle.js"; // <-- Import

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  window.countdownInterval = setInterval(updateCountdown, 1000);

  initializeQuotes();

  setupThemeToggle();
  updateToggleIcon();

  setupSoundToggle(); // <-- Initialize sound toggle
  updateSoundIcon(); // <-- Set initial icon

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches &&
    !document.body.classList.contains("light-mode")
  ) {
    document.body.classList.add("light-mode");
    updateToggleIcon();
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed: ", error);
        });
    });
  }
});
