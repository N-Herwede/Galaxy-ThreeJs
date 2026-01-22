# Interactive 3D Solar System

An interactive, animated 3D solar system built with Three.js. Explore the planets, learn interesting facts, and control the simulation speed.

https://n-herwede.github.io/Galaxy-ThreeJs/

## Features

- **8 Planets** with accurate relative sizes and orbital distances (adjusted for visual clarity)
- **Interactive Controls** - Click on planets to learn more about them
- **Smooth Animations** - Continuous orbital motion with adjustable speed
- **Camera Controls** - Orbit around the scene, zoom in/out
- **Informative Panels** - Each planet displays distance, orbital period, and fun facts
- **Visual Effects** - Sun glow, starfield background, soft shadows

## How to Run Locally

Simply open `index.html` in a modern web browser. No build tools or server required!

```bash
# Or use a simple local server (optional, for best compatibility)
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

### Method 1: Direct Upload

1. Create a new repository on GitHub
2. Upload all three files:
   - `index.html`
   - `style.css`
   - `main.js`
3. Go to **Settings** → **Pages**
4. Under "Source", select **Deploy from a branch**
5. Choose `main` branch and `/ (root)` folder
6. Click **Save**
7. Wait 1-2 minutes, then visit `https://yourusername.github.io/repository-name/`

### Method 2: Using Git

```bash
# Initialize git repository
git init

# Add all files
git add index.html style.css main.js README.md

# Commit
git commit -m "Initial commit: 3D Solar System"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/solar-system.git

# Push to GitHub
git push -u origin main
```

Then enable GitHub Pages in repository settings as described above.

### Method 3: GitHub CLI

```bash
# Create and push repository
gh repo create solar-system --public --source=. --push

# Enable GitHub Pages
gh api repos/{owner}/solar-system/pages -X POST -f source.branch=main -f source.path=/
```

## Controls

| Action | Control |
|--------|---------|
| Rotate view | Left mouse drag |
| Zoom | Scroll wheel |
| Select planet | Click on planet |
| Pause/Resume | Click "Pause" button |
| Adjust speed | Use the time slider |

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Modules
- WebGL
- Import Maps

Tested in:
- Chrome 89+
- Firefox 108+
- Safari 16.4+
- Edge 89+

## Technology Stack

- **Three.js** (v0.160) - 3D rendering
- **ES Modules** - Modern JavaScript imports
- **CSS3** - Styling and animations
- **HTML5** - Structure

## File Structure

```
solar-system/
├── index.html    # Main HTML file
├── style.css     # Styles for UI overlay
├── main.js       # Three.js scene and logic
└── README.md     # This file
```

## Planet Data

All planets include:
- Relative size (adjusted for visibility)
- Orbital distance from the Sun
- Orbital speed
- Axial rotation speed
- Unique color and material
- Educational facts

## Credits

Created with Three.js. Planet data sourced from NASA.


