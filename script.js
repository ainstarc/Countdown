const sounds = {
  day: new Audio("./sounds/day-change.mp3"),
  hour: new Audio("./sounds/hour-change.mp3"),
  minute: new Audio("./sounds/minute-change.mp3"),
  second: new Audio("./sounds/second-tick.mp3"),
};

// Stores the previous time values to detect changes for sound and animation triggers.
let prev = { days: null, hours: null, minutes: null, seconds: null };

// Helper function to pad numbers with a leading zero if they are less than 10.
function pad(num) {
  return num.toString().padStart(2, "0");
}

// Plays a sound of a given type with optional volume and playback rate.
function playSound(type, options = {}) {
  const audio = sounds[type];
  if (audio) {
    const { volume = 0.5, playbackRate = 1.0 } = options;

    audio.currentTime = 0; // Rewind to the start to allow re-playing quickly.
    audio.volume = volume; // Set volume (0.0 for mute, 1.0 for full).
    audio.playbackRate = playbackRate; // Set playback speed (1.0 is normal).

    // Attempt to play the sound and catch any errors (e.g., browser restrictions).
    audio.play().catch(error => {
      console.error(`Error playing sound '${type}':`, error);
      // Consider more user-facing error handling if sounds are critical.
    });
  }
}

function updateCountdown() {
  const targetDate = new Date("2028-09-29T00:00:00+05:30");
  const currentDate = new Date();
  // Calculate the difference in milliseconds.
  const timeDifference = targetDate - currentDate;

  if (timeDifference < 0) {
    clearInterval(countdownInterval);
    document.getElementById("countdown").textContent = "Event has passed";
    return;
  }

  // Convert time difference to days, hours, minutes, and seconds.
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Play sounds and trigger heartbeat animation if the corresponding time unit has changed.
  if (prev.days !== null && days !== prev.days) {
    playSound("day", { volume: 0.6 }); // Day sound slightly louder
    animateHeartbeat("days");
  }
  if (prev.hours !== null && hours !== prev.hours) {
    playSound("hour", { volume: 0.5 });
    animateHeartbeat("hours");
  }
  if (prev.minutes !== null && minutes !== prev.minutes) {
    playSound("minute", { volume: 0.4, playbackRate: 1.1 }); // Minute sound slightly softer and faster
    animateHeartbeat("minutes");
  }
  if (prev.seconds !== null && seconds !== prev.seconds) {
    playSound("second", { volume: 0.3, playbackRate: 1.0 }); // Second tick even softer
    animateHeartbeat("seconds");
  }

  // Update the 'prev' object with the current time values for the next tick's comparison.
  prev = { days, hours, minutes, seconds };

  // Update the displayed digits with an animation.
  animateDigits("days", pad(days));
  animateDigits("hours", pad(hours));
  animateDigits("minutes", pad(minutes));
  animateDigits("seconds", pad(seconds));
}

const countdownInterval = setInterval(updateCountdown, 1000);
// Initial call to display the countdown immediately without waiting for the first interval.
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
  // Get the toggle button's center coordinates for the theme transition animation.
  const rect = toggleBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Set CSS custom properties used by the theme transition animation.
  document.body.style.setProperty("--toggle-x", `${x}px`);
  document.body.style.setProperty("--toggle-y", `${y}px`);

  // Determine the next theme and set its background for the transition.
  const isLight = !document.body.classList.contains("light-mode");
  const nextBg = isLight
    ? "linear-gradient(135deg, #f8fafc, #e0eafc, #f5f7fa)"
    : "linear-gradient(135deg, #0f2027, #2c5364, #36454f)";
  document.body.style.setProperty("--transition-bg", nextBg);

  // Add a class to trigger the CSS transition.
  document.body.classList.add("theme-transition");

  // Force a reflow to ensure the browser picks up the initial state for the transition.
  void document.body.offsetWidth;

  // After the CSS transition completes (duration defined in CSS),
  // switch the theme class and clean up temporary styles and classes.
  setTimeout(() => {
    document.body.classList.toggle("light-mode");
    updateToggleIcon();
    document.body.classList.remove("theme-transition");
    document.body.style.removeProperty("--transition-bg");
    document.body.style.removeProperty("--toggle-x");
    document.body.style.removeProperty("--toggle-y");
  }, 1500);
});

// Sets the correct sun/moon icon for the theme toggle button on initial page load.
updateToggleIcon();

// Triggers a heartbeat animation on the parent element of the specified ID.
function animateHeartbeat(id) {
  const el = document.getElementById(id).parentElement;
  el.classList.remove("heartbeat"); // Remove class to reset animation if it's already running.
  void el.offsetWidth; // Force reflow to ensure the class removal is processed before re-adding.
  el.classList.add("heartbeat");
}

// Animates individual digits within a time unit (days, hours, etc.)
// to provide a smooth visual update when numbers change.
function animateDigits(id, value) {
  const el = document.getElementById(id);
  const prevSpans = Array.from(el.querySelectorAll(".animated-digit"));
  // Ensure the new value string is padded to match the expected number of digits.
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

  // Iterate over each character (digit) in the new value string.
  for (let i = 0; i < valueStr.length; i++) {
    const digit = valueStr[i];
    const prevSpan = prevSpans[i];

    if (!prevSpan) {
      // If no previous span exists for this position, it's a new digit (e.g., countdown from 10 to 9, or 9 to 10).
      const newSpan = document.createElement("span");
      newSpan.className = "animated-digit enter";
      newSpan.textContent = digit;
      el.appendChild(newSpan);
      requestAnimationFrame(() => newSpan.classList.add("enter-active"));
    } else if (prevSpan.textContent !== digit) {
      // Digit changed, animate out old first
      // If the digit has changed, animate out the old digit.
      prevSpan.classList.add("exit");
      requestAnimationFrame(() => prevSpan.classList.add("exit-active"));
      setTimeout(() => {
        if (prevSpan.parentNode) prevSpan.parentNode.removeChild(prevSpan);

        // After the old digit is removed, animate in the new digit.
        const newSpan = document.createElement("span");
        newSpan.className = "animated-digit enter";
        newSpan.textContent = digit;
        // Insert the new span at the correct position relative to other digits.
        if (el.children[i]) {
          el.insertBefore(newSpan, el.children[i]);
        } else {
          el.appendChild(newSpan);
        }
        requestAnimationFrame(() => newSpan.classList.add("enter-active"));
      }, 300);
    }
    // If the digit is the same as before, do nothing and keep the existing span.
  }
}

// Auto-detect user's OS color scheme preference on first load and apply it.
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
