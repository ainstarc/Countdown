const toggleBtn = document.getElementById("toggle-mode");

export function updateToggleIcon() {
  if (toggleBtn) {
    if (document.body.classList.contains("light-mode")) {
      toggleBtn.textContent = "☀️";
    } else {
      toggleBtn.textContent = "🌙";
    }
  }
}

export function setupThemeToggle() {
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const rect = toggleBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.body.style.setProperty("--toggle-x", `${x}px`);
    document.body.style.setProperty("--toggle-y", `${y}px`);

    const isLight = !document.body.classList.contains("light-mode");
    const nextBg = isLight
      ? "linear-gradient(135deg, #f8fafc, #e0eafc, #f5f7fa)"
      : "linear-gradient(135deg, #0f2027, #2c5364, #36454f)";
    document.body.style.setProperty("--transition-bg", nextBg);

    document.body.classList.add("theme-transition");
    void document.body.offsetWidth; // force reflow

    setTimeout(() => {
      document.body.classList.toggle("light-mode");
      updateToggleIcon();
      document.body.classList.remove("theme-transition");
      document.body.style.removeProperty("--transition-bg");
      document.body.style.removeProperty("--toggle-x");
      document.body.style.removeProperty("--toggle-y");
    }, 1500);
  });
}
