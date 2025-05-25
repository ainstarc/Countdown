import json
import random
import os
import difflib

def is_similar(q1, q2, threshold=0.9):
    return difflib.SequenceMatcher(None, q1.lower(), q2.lower()).ratio() > threshold

def clean_quotes(quotes):
    cleaned = []
    removed = []

    for entry in quotes:
        quote_text = entry.get("q", "").strip()
        author = entry.get("a", "").strip()

        if author.lower() == "unknown":
            author = "Anonymous"

        # Check similarity with all quotes in cleaned
        similar_to = None
        for existing in cleaned:
            if is_similar(quote_text, existing['q']):
                similar_to = existing
                break

        if similar_to:
            # If removed quote has a better author, update kept quote's author
            if author.lower() not in ("unknown", "anonymous") and similar_to['a'].lower() in ("unknown", "anonymous"):
                similar_to['a'] = author

            removed.append({
                "q": quote_text,
                "a": author,
                "similar_to": {
                    "q": similar_to['q'],
                    "a": similar_to['a']
                }
            })
            continue

        cleaned.append({"q": quote_text, "a": author})

    return cleaned, removed

def reshuffle_quotes(quotes, flag=False):
    if flag:
        random.shuffle(quotes)
    return quotes

if __name__ == "__main__":
    input_file = "quotes.json"
    removed_file = "removed_quotes.json"

    with open(input_file, "r", encoding="utf-8") as f:
        quotes = json.load(f)

    cleaned_quotes, removed_quotes = clean_quotes(quotes)
    # Reshuffle the cleaned quotes - Set flag to True to reshuffle
    reshuffled_quotes = reshuffle_quotes(cleaned_quotes, flag=False)

    # Delete the original file
    os.remove(input_file)

    # Save the cleaned and reshuffled quotes
    with open(input_file, "w", encoding="utf-8") as f:
        json.dump(reshuffled_quotes, f, ensure_ascii=False, indent=2)

    # Save the removed quotes with reference to what they matched
    with open(removed_file, "w", encoding="utf-8") as f:
        json.dump(removed_quotes, f, ensure_ascii=False, indent=2)

    print(f"Original count: {len(quotes)}")
    print(f"Cleaned count: {len(cleaned_quotes)}")
    print(f"Removed count: {len(removed_quotes)}")
    print(f"Cleaned quotes saved to '{input_file}'")
    print(f"Removed quotes saved to '{removed_file}' with reference to similar kept quotes")
    print("Processing complete.")
# This script processes a JSON file of quotes, cleans it by removing duplicates, and reshuffles the remaining quotes.