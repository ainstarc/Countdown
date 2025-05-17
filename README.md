# Countdown

A stylish, animated countdown timer with digit-level animation, theme toggle (dark/light), and responsive design.

## Features

- **Animated digits:** Only the changing digits animate out and in.
- **Heartbeat effect:** Time boxes pulse when their value changes.
- **Dark/Light mode:** Auto-detects system preference, with manual toggle.
- **Responsive:** Looks great on all devices.
- **Theme presets:** Easily extendable for more color themes.
- **Accessible:** ARIA attributes and keyboard navigation support.

## Usage

1. Clone or download this repository.
2. Open `index.html` in your browser.

## Customization

- Change the target date in `script.js` (`const targetDate = ...`).
- Edit styles in `styles.css` for your own color themes or effects.

## License

MIT

## Preview

![Screenshot of Countdown Timer](screenshot.png)

<script>
// In script.js, look for:
const targetDate = new Date("2028-09-29T00:00:00+05:30");
</script>
