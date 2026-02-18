# 🎙️ Swar — Audio Text Reader

> A sleek, browser-based text-to-speech reader with word-by-word highlighting, voice controls, and audio recording & download — all in a single HTML file. No installation. No dependencies. No internet required after loading.

---

## ✨ Features

- **▶ Text-to-Speech Playback** — Converts any typed or pasted text to natural speech using the browser's built-in Web Speech API
- **Word-by-Word Highlighting** — Each word lights up in real time as it is spoken, making it easy to follow along
- **Play / Pause / Stop / Restart** — Full playback control at your fingertips
- **Progress Bar** — Visual indicator showing how far through the text the reader is
- **Animated Waveform** — Live pulsing waveform animation during speech
- **🎛 Speed Control** — Adjust reading rate from 0.5× (slow) to 2.0× (fast)
- **🎵 Pitch Control** — Fine-tune the voice pitch from 0.5 to 2.0
- **🔊 Volume Control** — Set playback volume from 0% to 100%
- **🎤 Voice Selector** — Choose from all available system voices and languages
- **📥 Record & Download** — Record the speech session and download it as a `.webm` audio file
- **Quick Sample Texts** — Load a famous quote, science fact, or poem instantly with one click
- **Word Counter** — Live word count of the input text
- **Dark Aesthetic UI** — Premium dark theme with gold accents, smooth animations, and a refined editorial look

---

## 🚀 Getting Started

### No Installation Needed

Swar is a single self-contained HTML file. Just open it in your browser and it works.

```bash
# Option 1: Simply open the file
double-click  swar-audio-text-reader.html

# Option 2: Serve locally (optional)
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080` in your browser.

---

## 🖥️ Browser Compatibility

| Browser | TTS Playback | Recording & Download |
|---|---|---|
| Chrome 80+ | ✅ Full support | ✅ Best support |
| Edge 80+ | ✅ Full support | ✅ Full support |
| Firefox | ✅ Full support | ⚠️ Limited (no tab audio capture) |
| Safari | ✅ Full support | ⚠️ Limited |

> **Recommended:** Use **Google Chrome** or **Microsoft Edge** for the best experience, especially for audio recording.

---

## 🎙️ How to Record & Download Audio

1. Type or paste your text into the input box
2. Adjust voice, speed, pitch, and volume to your preference
3. Click the **🔴 Record** button
4. When the browser prompts you to share your screen/tab, select your **current tab** and make sure **"Share tab audio"** is checked
5. Speech plays automatically while recording
6. Recording stops automatically when speech ends — or click **Stop** manually
7. Click **↓ Download WAV** to save the audio file to your device

> The downloaded file is saved in `.webm` format, which is playable in VLC, Chrome, Firefox, and most modern media players. You can convert it to MP3 using tools like [CloudConvert](https://cloudconvert.com) or Audacity.

---

## 📁 Project Structure

```
swar-audio-text-reader.html   ← Entire app in one file
README.md                     ← You are here
```

The project is intentionally a single HTML file with no external dependencies (except Google Fonts loaded from CDN). This makes it maximally portable — copy the file anywhere and it works.

---

## 🛠️ Customization

All styling uses CSS variables at the top of the file, making it easy to retheme:

```css
:root {
  --bg: #0a0a0f;          /* Main background */
  --surface: #12121a;     /* Card background */
  --accent: #e8c547;      /* Gold highlight color */
  --accent2: #f07060;     /* Red/coral accent */
  --text: #e8e8f0;        /* Primary text */
  --muted: #7a7a9a;       /* Secondary text */
}
```

To add more sample texts, find the `samples` object in the `<script>` section:

```js
const samples = {
  quote: "Your custom quote here...",
  science: "Your science fact here...",
  poem: "Your poem here..."
};
```

---

## 🧠 How It Works

Swar uses three native browser APIs — no external libraries required:

| API | Purpose |
|---|---|
| `window.speechSynthesis` | Converts text to speech and fires word boundary events |
| `MediaRecorder` | Records the audio stream into chunks |
| `getDisplayMedia` | Captures tab audio for the downloadable recording |

Word highlighting works by listening to the `boundary` event on each `SpeechSynthesisUtterance`, which fires as each word is spoken. The app maps these events to `<span>` elements wrapping each word in the display area.

---

## ⚠️ Known Limitations

- **Recording quality** depends on browser support for tab audio capture. Chrome and Edge work best.
- The Web Speech API voice list varies by operating system and browser. More voices are available on Windows and macOS.
- Very long texts may cause some browsers to cut off speech mid-way — if this happens, break the text into smaller chunks.
- Firefox does not support `getDisplayMedia` audio capture, so recorded files may be silent. TTS playback still works normally.

---

## 📜 License

This project is open source and free to use for personal and commercial projects. No attribution required.

---

## 💡 Tips

- For the **clearest recordings**, use Chrome, open the app in a standalone tab, and allow tab audio sharing when prompted.
- Use a **slower rate (0.7–0.8×)** for educational content or language learning.
- The **pitch slider** can make the voice sound more natural on different systems — experiment with values between 0.9 and 1.1.
- Click **"Famous Quote"**, **"Science Fact"**, or **"Poetry"** chips to instantly load sample content and test the reader.

---

<div align="center">
  Made with ♥ using pure HTML, CSS & JavaScript
</div>
