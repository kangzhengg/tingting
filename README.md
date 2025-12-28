# Ting-Ting - Digital Hopscotch Game

A fun, interactive digital hopscotch game built with React and TypeScript.

## 🚀 Quick Start

### Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app will be available at `http://localhost:3000`
   - The terminal will show the exact URL

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with all the files ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## 📦 Deploy to Website

The app is ready to deploy to any static hosting service:

### Option 1: Netlify (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist/` folder onto their deploy area
3. Your site is live!

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod` in the project directory
3. Follow the prompts

### Option 3: GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist/` folder contents to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 4: Any Static Host
- Upload the contents of the `dist/` folder to your hosting service
- The app uses hash-based routing, so it works on any static host without configuration

## 🎮 How to Play

1. Click "Play" to start the game
2. Throw your marker into the target box
3. Hop through the boxes following the rules
4. Complete all 10 levels to become a champion!

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- React Router (HashRouter for static hosting compatibility)
- Tailwind CSS

## 📝 Notes

- The game doesn't require any API keys to run
- All game logic runs entirely in the browser
- Fully responsive design works on mobile and desktop
