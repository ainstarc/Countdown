import { pad, playSound, animateHeartbeat, animateDigits } from "./utils.js";
import { TARGET_DATE } from "./config.js";

let prev = { days: null, hours: null, minutes: null, seconds: null };

export function updateCountdown() {
  const currentDate = new Date();
  const timeDifference = TARGET_DATE - currentDate;

  if (timeDifference < 0) {
    clearInterval(window.countdownInterval);
    document.getElementById("countdown").textContent = "Event has passed";
    return;
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  if (prev.days !== null && days !== prev.days) {
    playSound("day", { volume: 0.6 });
    animateHeartbeat("days");
  }
  if (prev.hours !== null && hours !== prev.hours) {
    playSound("hour", { volume: 0.5 });
    animateHeartbeat("hours");
  }
  if (prev.minutes !== null && minutes !== prev.minutes) {
    playSound("minute", { volume: 0.4, playbackRate: 1.1 });
    animateHeartbeat("minutes");
  }
  if (prev.seconds !== null && seconds !== prev.seconds) {
    playSound("second", { volume: 0.3, playbackRate: 1.0 });
    animateHeartbeat("seconds");
  }

  prev = { days, hours, minutes, seconds };

  animateDigits("days", pad(days));
  animateDigits("hours", pad(hours));
  animateDigits("minutes", pad(minutes));
  animateDigits("seconds", pad(seconds));
}
