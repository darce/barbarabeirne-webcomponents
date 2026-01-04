# Agent Instructions (AGENTS.md replacement)

This file is the single source of truth for assistant/agent guidance in this repo.
Read it before making changes.

## Project Overview

- Portfolio website with multiple gallery pages and static content.
- Source code lives in `src/`; compiled assets in `lib/`.
- Pages live at `index.html` (home), `*/index.html` (galleries), and `press/*.html`.

## Working Rules

- Web Components only; no runtime dependencies are shipped.
- Transpiling and polyfills are allowed in the build pipeline.
- All functions must be arrow functions; avoid `function` declarations.
- Prefer "this-less" function bodies where possible; use explicit state objects.
- Always terminate statements with `;`.
- Use four spaces for indentation.
- Stick to ASCII unless a file already uses Unicode.

## Source vs. Generated Files

- Prefer editing `src/` and rebuilding to update `lib/`.
- When a component or shared style changes, keep `src/` and `lib/` in sync.
- `main.css` and `gallery.css` are legacy global styles referenced by pages.

## Build and Lint

- `npm run lint` (eslint over `src/`)
- `npm run build` (babel + rollup)

## Key Files and Entry Points

- `src/init.js` registers Web Components.
- `src/components/*` holds each component (`*.js` + `*.scss`).
- `src/styles/_variables.scss` and `src/styles/_shared.scss` are shared tokens.
- `rollup.config.js` defines bundles for `lib/`.

## Context Tips for Agents

- If you change shared markup (nav, layout), update all gallery pages.
- If you add a new component, add it to `src/init.js` and `rollup.config.js`.
