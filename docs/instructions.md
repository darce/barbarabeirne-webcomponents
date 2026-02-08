# Agent Instructions (AGENTS.md replacement)

This file is the single source of truth for assistant/agent guidance in this repo.
Read it before making changes.

## Project Overview

- Portfolio website with multiple gallery pages and static content.
- Development site: http://dev.test/barbarabeirne.com
- Source code lives in `src/`; build output goes to `dist/`.
- Pages live at `index.html` (home), `*/index.html` (galleries), and `press/*.html`.

## Working Rules

- Web Components only; no runtime dependencies are shipped.
- Transpiling and polyfills are allowed in the build pipeline.
- All functions must be arrow functions; avoid `function` declarations.
- Prefer "this-less" function bodies where possible; use explicit state objects.
- Always terminate statements with `;`.
- Use 4 spaces for indentation.
- Stick to ASCII unless a file already uses Unicode.
- Use `forEach` instead of `for...of` (ESLint `no-restricted-syntax` rule).

## Source vs. Generated Files

- Do not edit `dist/` or `.build/` directly. Both are generated output from `npm run build`.
- Only change source files in `src/` (and related inputs), then regenerate via the build.

## Build and Lint

- `npm run lint` — ESLint over `src/` and `scripts/`.
- `npm run build` — Full production build (clean → webp → CSS → rollup → copy → inline).
- `npm run build:css` — Compiles SCSS to `.build/css/` (for rollup imports) and assembles `dist/lib/styles.css`.
- `npm run build:bundle` — Rollup transpiles + bundles `src/` → `dist/lib/`.
- `scripts/inline-critical.js` — Post-build step that inlines CSS into HTML files in `dist/`, rewrites font URLs relative to each page's directory depth, and strips redundant `<link rel="preload" as="font">` tags.

## Key Files and Entry Points

- `src/init.js` — Lazy-loads Web Components via dynamic `import()` when their tags are found in the DOM. This is the single script entry point; do not add redundant `<script>` tags for individual components on HTML pages.
- `src/components/*` — Each component (`*.js` + `*.scss`).
- `src/components/base/base-component.js` — BaseComponent mixin providing managed listeners, managed timers (intervals + timeouts), style injection, and shadow DOM init. All resources are auto-cleaned via `cleanup()`.
- `src/styles/_variables.scss` — Design tokens (colors, spacing, breakpoints, etc.).
- `src/styles/_shared.scss` — Imports variables and mixins for component use.
- `src/styles/critical.scss` — FOUC prevention styles for raw markup before JS runs.
- `src/styles/main.scss` — Global page styles.
- `src/styles/gallery.scss` — Gallery page styles.
- `rollup.config.js` — Defines bundles for `dist/lib/`.

## Context Tips for Agents

- If you change shared markup (nav, layout), update all gallery pages.
- If you add a new component, add it to `src/init.js` and `rollup.config.js`.
- Critical/FOUC styles for raw markup go in `src/styles/critical.scss`.
- All HTML pages must link `lib/styles.css` in `<head>`.

## Web Component Guidelines

These rules are distilled from bugs and anti-patterns fixed in this codebase.

### Custom Element Lifecycle

- **Never read attributes in `constructor()`**. Per the custom elements spec, attributes are not available until the element is connected to the DOM. Move `getAttribute()`, `getNumberAttr()`, and `getBooleanAttr()` calls to `connectedCallback()`.
- In `disconnectedCallback()`, call `this.cleanup()` (from BaseComponent) to release all managed listeners and timers.

### Timer Management

- **Always use `setManagedInterval` / `setManagedTimeout`** from BaseComponent instead of raw `setInterval` / `setTimeout`. Managed timers are automatically cleared on disconnect, preventing leaks.
- **Use `clearManagedInterval` / `clearManagedTimeout`** to cancel timers early.

### Event Listeners

- **Always use `addManagedListener`** from BaseComponent instead of raw `addEventListener`. Managed listeners are automatically removed on disconnect.

### Avoiding Duplication

- If the same callback is used in multiple places (e.g., an interval callback in both `start()` and `restart()`), extract it into a named private method.
- Bind event handlers during DOM injection rather than querying for elements after the fact with `querySelectorAll`. This avoids stale NodeList references.

### Performance

- Throttle high-frequency event handlers (e.g., `mousemove`). Use a simple boolean flag to skip redundant work when the desired state is already applied.
- Only call `history.replaceState()` or similar URL updates from manual user interactions (clicks, keyboard, swipe), not from autoplay/timer advances.

### Component Loading

- `init.js` handles all component loading. Do not add `<script type="module" src="...component.js">` tags to HTML pages — they cause duplicate registration attempts.
