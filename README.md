# ⏳ TickTock, Quote O’Clock

A stylish, animated countdown timer with inspirational quotes, dynamic visuals, and full offline support. Built with responsiveness, customization, and motivation in mind.

---

## 🌟 Features

- **🎞️ Animated Digits:** Only the digits that change animate, for smooth, subtle transitions.
- **💬 Animated Quotes:** Inspirational quotes appear with a letter-shuffling animation.
- **🔍 Keyword Highlighting:** Automatically bolds key words in quotes to draw attention.
- **❤️ Heartbeat Effect:** Time blocks pulse when their value changes — a subtle nod to urgency.
- **🌓 Dark/Light Mode:** Auto-detects system preference with manual override.
- **🔔 Audible Alerts:** Unique sounds for each unit change (day, hour, minute, second) with adjustable volume.
- **📱 Responsive Design:** Works beautifully on all screen sizes and orientations.
- **🎨 Theme Presets:** Easily extend or customize color themes.
- **♿ Accessibility-Friendly:** Includes ARIA tags and full keyboard navigation support.
- **🌐 Offline Ready:** Full PWA support — works offline and installable on desktop/mobile.

---

## 🚀 Usage

1. Clone or download this repository.
2. Serve the project locally:
   ```bash
   npx serve .
   ```
   Or use **Live Server** in VS Code.
3. Open `index.html` in your browser.

> **Note:** For full offline support and PWA functionality, serving via a local server is required.

---

## ⚙️ Customization

### 🎯 Changing the Countdown Target

Open `script.js` and update the target date:

```js
const targetDate = new Date("2028-09-29T00:00:00+05:30");
```

---

## 💬 Managing Quotes

Inspirational quotes are stored in `quotes.json`. You can add, clean, and organize them using the built-in Python script.

### ➕ Adding New Quotes

Edit `quotes.json` manually using this format:

```json
{
  "q": "Your inspiring quote goes here.",
  "a": "Author's Name"
}
```

> If the author is unknown, use `"a": "Unknown"` — the script will normalize it to `"Anonymous"`.

---

### 🧹 Cleaning and Fixing Quotes

The included `quote.py` script performs the following:

- ✅ **Deduplication by Similarity:** Removes quotes that are _almost identical_ (90% similarity threshold).
- ✍️ **Author Correction:** Replaces `"Anonymous"` with a specific author if found in a duplicate.
- ♻️ **"Unknown" Normalization:** Converts `"Unknown"` to `"Anonymous"`.
- 📁 **Archiving Removed Quotes:** Stores removed quotes in `removed_quotes.json` along with their matched counterparts.
- 🔀 **Optional Shuffling:** Enable shuffling by setting `flag=True` in the script.

#### ▶️ How to Run the Script

1. Ensure Python 3 is installed.
2. Place `quote.py` in the same directory as `quotes.json`.
3. Run the script:
   ```bash
   python quote.py
   ```

The script will output:

- Original quote count
- Cleaned quote count
- Removed quote count

---

### 🤖 Error Handling Fallback

If quotes cannot be loaded, a fallback quote is shown:

```js
  {
    "q": "Oops! The quotes went on vacation without telling us.",
    "a": "The Missing Quote Squad"
  }
```

---

# 📝 Changelog

Keep track of notable changes and new features here. For detailed future plans and bug tracking, please refer to the [GitHub Issues](https://github.com/ainstarc/countdown/issues).

---

## 0.3.2 — May 25, 2025

- Added a script to clean and reshuffle quotes (Quote Count: 1119)
- Updated cache version and added `quotes.json` to cached files
- Introduced quote functionality and enhanced UI/UX of the timer

---

## 0.3.1 — May 24, 2025

- Fixed countdown animation to ensure correct digit count ([#3](https://github.com/ainstarc/Countdown/issues/2))

---

## 0.3.0 — May 23, 2025

- Improved audio experience with refined sound effects

---

## 0.2.0 — May 17, 2025

- Initial countdown start functionality
- Modified color scheme and updated title
- Animated countdown digits at the digit level for smooth transitions
- Improved responsive grid layout and enhanced theme toggle
- Responsive container and time-box sizing enhancements
- Added full PWA offline support and responsiveness improvements
- Enhanced accessibility features

---

## 0.1.0 — Initial Release Jul 28, 2024

- Project setup with a basic countdown timer

---

## 🖼️ Preview

- Light Theme
  ![Screenshot of Countdown Timer](preview-light.png)
- Dark Theme
  ![Screenshot of Countdown Timer](preview-dark.png)

---

## 📄 License

MIT License
