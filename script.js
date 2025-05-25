// Sound assets and management
const sounds = {
  day: new Audio("./sounds/day-change.mp3"),
  hour: new Audio("./sounds/hour-change.mp3"),
  minute: new Audio("./sounds/minute-change.mp3"),
  second: new Audio("./sounds/second-tick.mp3"),
};

// Stores the previous time values to detect changes for sound and animation triggers.
let prev = { days: null, hours: null, minutes: null, seconds: null };
let quotesData = []; // To store quotes from quotes.json
const QUOTE_CHANGE_INTERVAL = 30000; // 30 seconds in milliseconds

// DOM Element References
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const toggleBtn = document.getElementById("toggle-mode"); // For theme toggle

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
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.play().catch((error) => {
      console.error(`Error playing sound '${type}':`, error);
    });
  }
}

// Updates the countdown timer display, plays sounds, and triggers animations.
function updateCountdown() {
  const targetDate = new Date("2028-09-29T00:00:00+05:30"); // Target date for the countdown
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

// Triggers a heartbeat animation on the parent element of the specified ID.
function animateHeartbeat(id) {
  const el = document.getElementById(id)?.parentElement; // Added optional chaining
  if (el) {
    el.classList.remove("heartbeat");
    void el.offsetWidth; // Force reflow
    el.classList.add("heartbeat");
  }
}

// Animates individual digits within a time unit.
function animateDigits(id, value) {
  const DIGIT_EXIT_ANIMATION_DURATION = 300; // ms
  const el = document.getElementById(id);
  if (!el) return; // Guard clause if element not found

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

// Quote display functions
function showQuote(quoteObj) {
  if (
    quoteElement &&
    authorElement &&
    quoteObj &&
    typeof quoteObj.q === "string" &&
    typeof quoteObj.a === "string"
  ) {
    const rawQuote = quoteObj.q;
    const authorString = quoteObj.a ? `– ${quoteObj.a}` : "";

    // Clear author while quote animates
    authorElement.textContent = "";
    const stopWords = new Set([
      "a",
      "an",
      "the",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "can",
      "could",
      "may",
      "might",
      "must",
      "am",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "her",
      "us",
      "them",
      "my",
      "your",
      "his",
      "its",
      "our",
      "their",
      "mine",
      "yours",
      "hers",
      "ours",
      "theirs",
      "to",
      "of",
      "in",
      "on",
      "at",
      "by",
      "for",
      "with",
      "about",
      "against",
      "between",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "from",
      "up",
      "down",
      "out",
      "off",
      "over",
      "under",
      "again",
      "further",
      "then",
      "once",
      "here",
      "there",
      "when",
      "where",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "s",
      "t",
      "just",
      "don",
      "shouldve",
      "now",
      "get",
    ]);

    animateLetterShuffle(quoteElement, rawQuote, () => {
      // This callback runs after the shuffle animation for the quote is complete.
      // Now, apply highlighting to the final quote text.
      const finalQuoteHTML = rawQuote.replace(
        /\b([a-zA-Z']+)\b/g,
        (match, word) => {
          const lowerWord = word.toLowerCase();
          if (!stopWords.has(lowerWord) && lowerWord.length > 3) {
            return `<span class="highlighted-word">${word}</span>`;
          }
          return word;
        }
      );
      quoteElement.innerHTML = `“${finalQuoteHTML}”`; // Set the highlighted version
      authorElement.textContent = authorString; // Set the author
    });
  } else if (quoteElement) {
    // Handle case where quoteObj is invalid but element exists
    quoteElement.textContent = "“Could not load quote.”";
    if (authorElement) authorElement.textContent = "";
  }
}

function animateLetterShuffle(element, finalString, onComplete) {
  const shuffleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*%$#@"; // Characters to shuffle through
  const durationPerChar = 70; // Total time each character takes to "settle" (ms)
  const shufflesPerSettle = 4; // How many random characters are shown before settling
  const intervalTime = durationPerChar / shufflesPerSettle;
  const staggerDelay = 35; // Delay to start animation for the next character (ms)

  let displayedChars = Array(finalString.length).fill(" "); // Start with spaces or a placeholder

  // Prevent multiple animations running on the same element if triggered quickly
  if (element.dataset.isAnimating === "true") {
    // Optionally, clear existing animation artifacts or just return
    // For simplicity, we'll just let the current call proceed, but a more robust solution might cancel previous ones.
  }
  element.dataset.isAnimating = "true";
  element.innerHTML = `“${displayedChars.join("")}”`; // Initial empty-ish display

  finalString.split("").forEach((char, index) => {
    setTimeout(() => {
      let shuffleCount = 0;
      const shuffleIntervalId = setInterval(() => {
        if (shuffleCount < shufflesPerSettle) {
          displayedChars[index] =
            shuffleChars[Math.floor(Math.random() * shuffleChars.length)];
          element.innerHTML = `“${displayedChars.join("")}”`;
          shuffleCount++;
        } else {
          clearInterval(shuffleIntervalId);
          displayedChars[index] = char; // Set the correct character
          element.innerHTML = `“${displayedChars.join("")}”`;

          if (index === finalString.length - 1) {
            // If this is the last character
            delete element.dataset.isAnimating;
            if (onComplete) onComplete();
          }
        }
      }, intervalTime);
    }, index * staggerDelay); // Stagger the start of each character's animation
  });
}

function getRandomQuoteAndDisplay() {
  if (!quotesData.length) {
    // Optionally show a default or loading message if quotes haven't loaded
    // showQuote({ q: "Loading quotes...", a: "" });
    return;
  }
  const index = Math.floor(Math.random() * quotesData.length);
  showQuote(quotesData[index]);
}

// Load quotes from JSON and initialize automatic quote changes
async function initializeQuotes() {
  try {
    const response = await fetch("./quotes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    quotesData = await response.json();
    getRandomQuoteAndDisplay(); // Show one on startup
    setInterval(getRandomQuoteAndDisplay, QUOTE_CHANGE_INTERVAL); // Change quote automatically by interval

    if (quoteElement) {
      // Add click listener to the quote itself
      // click listener disabled for now
      // quoteElement.addEventListener("click", getRandomQuoteAndDisplay);
    }
  } catch (error) {
    console.error("Error loading quotes:", error);
    showQuote({
      q: "Oops! The quotes went on vacation without telling us.",
      a: "The Missing Quote Squad",
    });
  }
}

// Theme & mode toggle functions
function updateToggleIcon() {
  if (toggleBtn) {
    // Check if button exists
    if (document.body.classList.contains("light-mode")) {
      toggleBtn.textContent = "☀️";
    } else {
      toggleBtn.textContent = "🌙";
    }
  }
}

function setupThemeToggle() {
  if (!toggleBtn) return; // Don't proceed if button isn't found

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
    void document.body.offsetWidth; // Force reflow

    setTimeout(() => {
      document.body.classList.toggle("light-mode");
      updateToggleIcon();
      document.body.classList.remove("theme-transition");
      document.body.style.removeProperty("--transition-bg");
      document.body.style.removeProperty("--toggle-x");
      document.body.style.removeProperty("--toggle-y");
    }, 1500); // Duration should match CSS animation
  });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initial Countdown Call
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Initialize Quotes
  initializeQuotes();

  // Setup Theme Toggle
  setupThemeToggle();
  updateToggleIcon(); // Set initial icon state

  // Auto-detect user's OS color scheme preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches &&
    !document.body.classList.contains("light-mode")
  ) {
    // Only apply if not already set, to respect theme toggle state if it was used before full load
    document.body.classList.add("light-mode");
    updateToggleIcon(); // Update icon if theme changed
  }

  // Register service worker
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
