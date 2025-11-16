# Puppeteer Web Service - Turborepo

A monorepo for the Puppeteer web automation service using Turborepo.

## Quick Start

```bash
# Install dependencies
npm install

# Run all apps in development
npm run dev

# Build all apps
npm run build

# Run all tests
npm test

# Lint all code
npm run lint
```

## Project Structure

```
puppeteer-web-service/
├── apps/
│   ├── backend/     # Express + Puppeteer backend
│   └── frontend/    # React + Vite frontend
└── packages/
    └── shared/      # Shared utilities and constants
```

## Features

- 📸 Screenshot Capture
- 📄 PDF Generation
- 🔍 Web Scraping
- ℹ️ Page Information Extraction

## Technologies

- **Turborepo** - Build system with intelligent caching
- **Express** - Backend API
- **Puppeteer** - Browser automation
- **React 18** - Frontend UI
- **Vite** - Fast development and builds
- **Tailwind CSS** - Styling
- **Vitest** - Frontend testing
- **Jest** - Backend testing
