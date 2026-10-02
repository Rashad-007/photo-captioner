# 📸 SnapCaption AI - Smart Photo Captioner & Visual Analytics

SnapCaption AI is a modern web application that generates intelligent, creative photo captions, hashtag recommendations, color palettes, and visual analytics using browser-based AI vision transformers.

---

## ✨ Key Features

- 📷 **Live Webcam Capture**: Take real-time snapshots with a 3-second countdown timer, grid overlay, and camera flash effect.
- 📁 **File Upload & Drag-and-Drop**: Easily upload images or paste directly from your clipboard (`Ctrl+V`).
- 🖼️ **Sample Gallery**: Test sample photos with 1-click presets.
- 🎭 **7 Custom Caption Tones**:
  - 📸 **Instagram & TikTok**: Catchy intro + curated hashtags.
  - 😂 **Funny & Witty**: Humorous perspectives.
  - 🧘 **Poetic & Aesthetic**: Philosophical quotes.
  - ⚡ **Short & Punchy**: Bold 1-3 word titles.
  - 🤖 **Cyberpunk AI**: Matrix vision data style.
  - 📖 **Storyteller**: Narrative background stories.
  - 📝 **Standard AI**: Clean visual summary.
- 🎨 **Visual Analytics & Color Palette**: Extract top 5 dominant color swatches, brightness levels, color temperature, and frame aspect ratios.
- 🔊 **Text-to-Speech (TTS)**: Built-in voice player to listen to generated captions.
- 🖼️ **Graphic Poster Export**: Export stylish HD shareable posters containing your photo, caption, and palette swatches.
- 📜 **History Storage**: Save and revisit past captions locally.

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Installation
Open your terminal in the project directory and run:

```bash
npm install
```

### 3. Start Development Server
Run the local dev server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📤 How to Upload to GitHub

If you want to push this repository to your GitHub account:

### Option A: Using Git Terminal
1. Create a new repository on [GitHub](https://github.com/new) named `snap-caption-ai` (do not initialize with a README).
2. Copy the remote URL provided by GitHub (e.g. `https://github.com/YOUR_USERNAME/snap-caption-ai.git`).
3. Run the following commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/snap-caption-ai.git
git push -u origin main
```

---

## 🛠️ Built With

- **Framework**: React + Vite
- **Icons**: Lucide React
- **Effects**: Canvas Confetti
- **Styling**: Vanilla CSS with Glassmorphism & Custom Properties
