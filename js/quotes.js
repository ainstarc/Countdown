import { STOP_WORDS } from "./config.js";

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");

let quotesData = [];

export function showQuote(quoteObj) {
  if (
    quoteElement &&
    authorElement &&
    quoteObj &&
    typeof quoteObj.q === "string" &&
    typeof quoteObj.a === "string"
  ) {
    const rawQuote = quoteObj.q;
    const authorString = quoteObj.a ? `– ${quoteObj.a}` : "";

    authorElement.textContent = "";

    animateLetterShuffle(quoteElement, rawQuote, () => {
      const finalQuoteHTML = rawQuote.replace(
        /\b([a-zA-Z']+)\b/g,
        (match, word) => {
          const lowerWord = word.toLowerCase();
          if (!STOP_WORDS.has(lowerWord) && lowerWord.length > 3) {
            return `<span class="highlighted-word">${word}</span>`;
          }
          return word;
        }
      );
      quoteElement.innerHTML = `“${finalQuoteHTML}”`;
      authorElement.textContent = authorString;
    });
  } else if (quoteElement) {
    quoteElement.textContent = "“Could not load quote.”";
    if (authorElement) authorElement.textContent = "";
  }
}

function animateLetterShuffle(element, finalString, onComplete) {
  const shuffleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*%$#@";
  const durationPerChar = 70;
  const shufflesPerSettle = 4;
  const intervalTime = durationPerChar / shufflesPerSettle;
  const staggerDelay = 35;

  let displayedChars = Array(finalString.length).fill(" ");

  if (element.dataset.isAnimating === "true") {
    // Already animating; let it proceed
  }
  element.dataset.isAnimating = "true";
  element.innerHTML = `“${displayedChars.join("")}”`;

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
          displayedChars[index] = char;
          element.innerHTML = `“${displayedChars.join("")}”`;

          if (index === finalString.length - 1) {
            delete element.dataset.isAnimating;
            if (onComplete) onComplete();
          }
        }
      }, intervalTime);
    }, index * staggerDelay);
  });
}

export async function initializeQuotes() {
  try {
    const response = await fetch("./quotes.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    quotesData = await response.json();
    getRandomQuoteAndDisplay();
    setInterval(getRandomQuoteAndDisplay, 30000);

  } catch (error) {
    console.error("Error loading quotes:", error);
    showQuote({
      q: "Oops! The quotes went on vacation without telling us.",
      a: "The Missing Quote Squad",
    });
  }
}

function getRandomQuoteAndDisplay() {
  if (!quotesData.length) return;
  const index = Math.floor(Math.random() * quotesData.length);
  showQuote(quotesData[index]);
}
