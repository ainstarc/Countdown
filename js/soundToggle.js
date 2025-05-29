import { sounds } from "./config.js";

let isMuted = localStorage.getItem("isMuted") === "true"; // Initialize from localStorage

const toggleSoundBtn = document.getElementById("toggle-sound");

export function updateSoundIcon() {
  if (toggleSoundBtn) {
    // Update icon
    toggleSoundBtn.innerHTML = isMuted ? "🔇" : "🔊";
    
    // Base classes for all states
    const baseClasses = [
      "flex", "items-center", "justify-center",
      "w-12", "h-12", "rounded-full", // Default size
      "md:w-10", "md:h-10", "md:text-xl", // Smaller on mobile (<480px)
      "text-2xl", "shadow-lg",
      "hover:scale-105", "transition-all", "duration-300"
    ];

    // Theme and state-specific classes
    const themeClasses = document.body.classList.contains("light-mode")
      ? ["bg-white", "border", "border-gray-200", isMuted ? "text-gray-400" : "text-blue-600"]
      : ["bg-gray-800", "border", "border-gray-600", isMuted ? "text-gray-400" : "text-yellow-400"];

    // Hover classes based on theme
    const hoverClasses = document.body.classList.contains("light-mode")
      ? "hover:bg-gray-100"
      : "hover:bg-gray-700";

    // Combine all classes
    toggleSoundBtn.className = [...baseClasses, ...themeClasses, ...hoverClasses].join(" ");
  }
}

export function setupSoundToggle() {
  if (!toggleSoundBtn) return;
  
  // Update icon on theme change
  const observer = new MutationObserver(() => {
    updateSoundIcon();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  toggleSoundBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    localStorage.setItem("isMuted", isMuted); // Persist state
    updateSoundIcon();

    // Pause all sounds if muted
    if (isMuted) {
      Object.values(sounds).forEach((audio) => {
        if (!audio.paused) audio.pause();
      });
    }
  });

  // Set initial state
  updateSoundIcon();
}

export { isMuted };