import { sounds } from "./config.js";
import { isMuted } from "./soundToggle.js";

export function pad(num) {
  return num.toString().padStart(2, "0");
}

export function playSound(type, options = {}) {
  if (document.hidden || isMuted) {
    // ⛔ Skip if tab hidden or muted
    console.warn(
      `Cannot play sound '${type}' while the document is hidden or muted.`
    );
    return;
  }
  if (!sounds[type]) {
    console.warn(`Sound type '${type}' not found.`);
    return;
  }
  if (!(sounds[type] instanceof Audio)) {
    console.warn(`Sound type '${type}' is not an Audio instance.`);
    return;
  }
  const audio = sounds[type];
  if (audio) {
    const { volume = 0.5, playbackRate = 1.0 } = options;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.play().catch((error) => {
      console.error(`Error playing sound '${type}':`, error);
    });
  }
}

export function animateHeartbeat(id) {
  const el = document.getElementById(id)?.parentElement;
  if (el) {
    el.classList.remove("heartbeat");
    void el.offsetWidth; // force reflow
    el.classList.add("heartbeat");
  }
}

export function animateDigits(id, value) {
  const DIGIT_EXIT_ANIMATION_DURATION = 300;
  const el = document.getElementById(id);
  if (!el) return;

  const prevSpans = Array.from(el.querySelectorAll(".animated-digit"));
  const valueStr = value.toString();

  while (prevSpans.length > valueStr.length) {
    const span = prevSpans.pop();
    span.classList.add("exit");
    requestAnimationFrame(() => span.classList.add("exit-active"));
    setTimeout(() => span.remove(), DIGIT_EXIT_ANIMATION_DURATION);
  }

  for (let i = 0; i < valueStr.length; i++) {
    const digit = valueStr[i];
    const prevSpan = prevSpans[i];

    if (!prevSpan) {
      const newSpan = document.createElement("span");
      newSpan.className = "animated-digit enter";
      newSpan.textContent = digit;
      el.appendChild(newSpan);
      requestAnimationFrame(() => newSpan.classList.add("enter-active"));
    } else if (prevSpan.textContent !== digit) {
      prevSpan.classList.add("exit");
      requestAnimationFrame(() => prevSpan.classList.add("exit-active"));
      setTimeout(() => {
        if (prevSpan.parentNode) prevSpan.parentNode.removeChild(prevSpan);
        const newSpan = document.createElement("span");
        newSpan.className = "animated-digit enter";
        newSpan.textContent = digit;
        if (el.children[i]) {
          el.insertBefore(newSpan, el.children[i]);
        } else {
          el.appendChild(newSpan);
        }
        requestAnimationFrame(() => newSpan.classList.add("enter-active"));
      }, DIGIT_EXIT_ANIMATION_DURATION);
    }
  }
}
