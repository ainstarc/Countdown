export const sounds = {
  day: new Audio("./sounds/day-change.mp3"),
  hour: new Audio("./sounds/hour-change.mp3"),
  minute: new Audio("./sounds/minute-change.mp3"),
  second: new Audio("./sounds/second-tick.mp3"),
};

export const QUOTE_CHANGE_INTERVAL = 30000; // 30 seconds in milliseconds
export const TARGET_DATE = new Date("2028-09-29T00:00:00+05:30");


// Stop words for quote highlighting
export const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "should",
  "can", "could", "may", "might", "must", "am", "i", "you", "he", "she",
  "it", "we", "they", "me", "him", "her", "us", "them", "my", "your",
  "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs",
  "to", "of", "in", "on", "at", "by", "for", "with", "about", "against",
  "between", "into", "through", "during", "before", "after", "above", "below",
  "from", "up", "down", "out", "off", "over", "under", "again", "further",
  "then", "once", "here", "there", "when", "where", "why", "how", "all",
  "any", "both", "each", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "s", "t", "just", "don", "shouldve", "now", "get"
]);
