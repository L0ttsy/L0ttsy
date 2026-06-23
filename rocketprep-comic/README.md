# RocketPrep.Comic - Flipbook Website

Welcome! This is a beautiful flipbook-style website for RocketPrep.Comic featuring:

## Features 🦆

- **Interactive Flipbook**: Navigate through 48 pages of RocketPrep.Comic with a realistic book layout
- **Dark Teal & Purple Theme**: Sophisticated dark mode design with vibrant accents
- **Q&A System**: Visitors can submit questions about the comic
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Keyboard Navigation**: Use arrow keys to flip through pages

## Getting Started

### 1. Add Your Comic Pages

Place your 48 comic pages in the `pages/` directory with names:
- `page-000.jpg` (page 1)
- `page-001.jpg` (page 2)
- ...
- `page-047.jpg` (page 48)

**File Format**: JPG, PNG, or WebP recommended
**Aspect Ratio**: 9:12 (portrait) works best
**Image Size**: 1000x1333 pixels recommended

### 2. Deploy to GitHub Pages

1. In your repository settings, go to **Pages**
2. Set the source to `main` branch
3. Your site will be live at `https://l0ttsy.github.io`

### 3. Customize

Edit the following files to personalize your site:

- **index.html** - Home page content
- **rocketprep-comic/index.html** - Comic viewer page
- **styles.css** - Main theme colors and styling
- **rocketprep-comic/comic.css** - Comic page styling

## Q&A System

The Q&A system uses browser localStorage by default, so submissions are saved locally. 

To enable email notifications or a backend, you can:
1. Create a simple Node.js/Python backend
2. Connect it by modifying the `submitQuestion()` function in `comic.js`
3. Or integrate with services like Formspree, Netlify Forms, or Firebase

## Color Palette Reference

- **Dark Theme**: Teal (#16a085) and Purple (#8e44ad)
- **Comic Colors**: 
  - Red (#e74c3c)
  - Orange (#e67e22)
  - Seafoam (#1abc9c)
  - Royal Blue (#3498db)
  - Lime Green (#2ecc71)

## Controls

- **Arrow Buttons**: Navigate through pages
- **Keyboard Arrows**: ← → keys to flip pages
- **Slider**: Jump to any page
- **Click Pages**: Left page goes back, right page goes forward

## Support

Questions? Feel free to submit them through the Q&A section on the website!

---

Made with 🦆 by L0ttsy
