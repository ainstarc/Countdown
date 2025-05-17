const sounds = {
  day: new Audio(
    "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7e7.mp3"
  ),
  hour: new Audio(
    "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7e7.mp3"
  ),
  minute: new Audio(
    "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7e7.mp3"
  ),
  second: new Audio(
    "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7e7.mp3"
  ),
};

let prev = { days: null, hours: null, minutes: null, seconds: null };

function pad(num) {
  return num.toString().padStart(2, "0");
}

function playSound(type) {
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
}

function updateCountdown() {
  const targetDate = new Date("2028-09-29T00:00:00+05:30");
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;

  if (timeDifference < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").textContent = "Event has passed";
    return;
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Play sounds and heartbeat on change
  if (prev.days !== null && days !== prev.days) {
    playSound("day");
    animateHeartbeat("days");
  }
  if (prev.hours !== null && hours !== prev.hours) {
    playSound("hour");
    animateHeartbeat("hours");
  }
  if (prev.minutes !== null && minutes !== prev.minutes) {
    playSound("minute");
    animateHeartbeat("minutes");
  }
  if (prev.seconds !== null && seconds !== prev.seconds) {
    playSound("second");
    animateHeartbeat("seconds");
  }

  prev = { days, hours, minutes, seconds };

  animateDigits("days", pad(days));
  animateDigits("hours", pad(hours));
  animateDigits("minutes", pad(minutes));
  animateDigits("seconds", pad(seconds));
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Theme & mode toggle
const toggleBtn = document.getElementById("toggle-mode");

function updateToggleIcon() {
  if (document.body.classList.contains("light-mode")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
}

toggleBtn.addEventListener("click", (e) => {
  // Get button center coordinates relative to viewport
  const rect = toggleBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Set CSS vars for the animation
  document.body.style.setProperty("--toggle-x", `${x}px`);
  document.body.style.setProperty("--toggle-y", `${y}px`);

  // Determine the next theme and its background
  const isLight = !document.body.classList.contains("light-mode");
  const nextBg = isLight
    ? "linear-gradient(135deg, #f8fafc, #e0eafc, #f5f7fa)"
    : "linear-gradient(135deg, #0f2027, #2c5364, #36454f)";
  document.body.style.setProperty("--transition-bg", nextBg);

  // Add transition class
  document.body.classList.add("theme-transition");

  // Force reflow to apply initial clip-path
  void document.body.offsetWidth;

  // Animate to full circle (large enough to cover the viewport)
  // (If you use ::before for the radial, update accordingly)
  // Here, ::after is used as in your CSS
  // No need to update --clip-path if not using clip-path

  // After the animation, switch the theme and clean up
  setTimeout(() => {
    document.body.classList.toggle("light-mode");
    updateToggleIcon();
    document.body.classList.remove("theme-transition");
    document.body.style.removeProperty("--transition-bg");
    document.body.style.removeProperty("--toggle-x");
    document.body.style.removeProperty("--toggle-y");
  }, 1500);
});

updateToggleIcon(); // Set correct icon on load

function animateHeartbeat(id) {
  const el = document.getElementById(id).parentElement;
  el.classList.remove("heartbeat"); // Reset if already animating
  void el.offsetWidth; // Force reflow
  el.classList.add("heartbeat");
}

// Digit-level animation: only animate digits that change
function animateDigits(id, value) {
  const el = document.getElementById(id);
  const prevSpans = Array.from(el.querySelectorAll(".animated-digit"));
  const prevValue = prevSpans.map((span) => span.textContent).join("");
  const valueStr = value
    .toString()
    .padStart(prevSpans.length || value.length, "0");

  // Remove extra spans if new value is shorter
  while (prevSpans.length > valueStr.length) {
    const span = prevSpans.pop();
    span.classList.add("exit");
    requestAnimationFrame(() => span.classList.add("exit-active"));
    setTimeout(() => span.remove(), 300);
  }

  // For each digit
  for (let i = 0; i < valueStr.length; i++) {
    const digit = valueStr[i];
    const prevSpan = prevSpans[i];

    if (!prevSpan) {
      // New digit (e.g., going from 9 to 10)
      const newSpan = document.createElement("span");
      newSpan.className = "animated-digit enter";
      newSpan.textContent = digit;
      el.appendChild(newSpan);
      requestAnimationFrame(() => newSpan.classList.add("enter-active"));
    } else if (prevSpan.textContent !== digit) {
      // Digit changed, animate out old first
      prevSpan.classList.add("exit");
      requestAnimationFrame(() => prevSpan.classList.add("exit-active"));
      setTimeout(() => {
        if (prevSpan.parentNode) prevSpan.parentNode.removeChild(prevSpan);

        // After old is gone, animate in new
        const newSpan = document.createElement("span");
        newSpan.className = "animated-digit enter";
        newSpan.textContent = digit;
        // Insert at the correct position
        if (el.children[i]) {
          el.insertBefore(newSpan, el.children[i]);
        } else {
          el.appendChild(newSpan);
        }
        requestAnimationFrame(() => newSpan.classList.add("enter-active"));
      }, 300);
    }
    // If digit is the same, do nothing (keep the span)
  }
}

// Auto-detect dark/light mode on first load
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches
) {
  document.body.classList.add("light-mode");
}

// Register service worker for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}
