# DAA ELTE – Design and Analysis of Algorithms (Exam Prep)

Interactive exam preparation web app for **ELTE MSc – Design and Analysis of Algorithms (DAA)**.

## About
This repository contains a React + TypeScript single-page application built with **Vite**. It is intended to help with DAA exam preparation (e.g., mock exams, explanations, and study materials).

## Tech Stack
- **Vite** (dev server & bundler)
- **React 18**
- **TypeScript**
- **React Router**

## Getting Started (Run Locally)

### Prerequisites
- **Node.js** (recommended: latest LTS)
- **npm** (included with Node)

### Install
```bash
git clone git@github.com:Goodwill-Khoa/DAA_ELTE-Desgin-and-Analysis-of-Algorithms-Exam-Prep.git
cd DAA_ELTE-Desgin-and-Analysis-of-Algorithms-Exam-Prep
npm install
```

### Launch (Development)
```bash
npm run dev
```

Then open the URL printed in your terminal (usually):
- http://localhost:5173

## Build & Preview (Production)

### Build
```bash
npm run build
```
This runs TypeScript type-checking (`tsc`) and then builds using Vite.

### Preview the build
```bash
npm run preview
```
Then open the URL printed in your terminal (usually):
- http://localhost:4173

## GitHub Pages / Base Path Note
This project sets a Vite base path in `vite.config.ts`:

- `base: '/DAA_ELTE-Desgin-and-Analysis-of-Algorithms-Exam-Prep/'`

That is correct for deploying under GitHub Pages at:
`https://<username>.github.io/DAA_ELTE-Desgin-and-Analysis-of-Algorithms-Exam-Prep/`

If you deploy to a root domain (or a different path), you may need to change/remove the `base` value.

## Project Structure
- `index.html` – app entry HTML
- `src/` – React + TypeScript source code
- `public/` – static assets
- `Documents/` – additional study materials

## Scripts
- `npm run dev` – start dev server
- `npm run build` – type-check + production build
- `npm run preview` – preview production build locally

## License
No license file is included yet. If you want others to reuse this code, add a `LICENSE` file (e.g., MIT).