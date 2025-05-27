import { sounds } from "./config.js";

let isMuted = false; // Global mute state

const toggleSoundBtn = document.getElementById("toggle-sound");

export function updateSoundIcon() {
  if (toggleSoundBtn) {
    toggleSoundBtn.textContent = isMuted ? "🔇" : "🔊";
  }
}

export function setupSoundToggle() {
  if (!toggleSoundBtn) return;
  toggleSoundBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    updateSoundIcon();

    // Pause all sounds if muted
    if (isMuted) {
      Object.values(sounds).forEach((audio) => {
        if (!audio.paused) audio.pause();
      });
    }
  });
}

// Optionally, export isMuted if needed elsewhere
export { isMuted };
