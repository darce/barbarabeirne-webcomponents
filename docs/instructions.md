# Agent Instructions (AGENTS.md replacement)

This file is the single source of truth for assistant/agent guidance in this repo.
Read it before making changes.

## Project Overview

- Portfolio website with multiple gallery pages and static content.
- Development site: http://dev.test/barbarabeirne.com
- Source code lives in `src/`; compiled assets in `lib/`.
- Pages live at `index.html` (home), `*/index.html` (galleries), and `press/*.html`.

## Working Rules

- Web Components only; no runtime dependencies are shipped.
- Transpiling and polyfills are allowed in the build pipeline.
- All functions must be arrow functions; avoid `function` declarations.
- Prefer "this-less" function bodies where possible; use explicit state objects.
- Always terminate statements with `;`.
- Use 4 spaces for indentation.
- Stick to ASCII unless a file already uses Unicode.

## Source vs. Generated Files

- Do not edit `lib/` directly. It is generated output from `npm run build`.
- Only change source files in `src/` (and related inputs), then regenerate `lib/` via the build.

## Build and Lint

- `npm run lint` (eslint over `src/`)
- `npm run build` (CSS + babel + rollup)
- `npm run build:css` compiles SCSS files to `lib/styles.css` and component CSS

## Key Files and Entry Points

- `src/init.js` registers Web Components.
- `src/components/*` holds each component (`*.js` + `*.scss`).
- `src/styles/_variables.scss` design tokens (colors, spacing, breakpoints, etc.).
- `src/styles/_shared.scss` imports variables and mixins for component use.
- `src/styles/critical.scss` FOUC prevention styles for raw markup before JS runs.
- `src/styles/main.scss` global page styles.
- `src/styles/gallery.scss` gallery page styles.
- `rollup.config.js` defines bundles for `lib/`.

## Context Tips for Agents

- If you change shared markup (nav, layout), update all gallery pages.
- If you add a new component, add it to `src/init.js` and `rollup.config.js`.
- Critical/FOUC styles for raw markup go in `src/styles/critical.scss`.
- All HTML pages must link `lib/styles.css` in `<head>`.
