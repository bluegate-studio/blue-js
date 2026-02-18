> **⚠️ AGENT NOTICE:** This file tracks implementation history. For active development, read `__CORE__.md` + `__PROJECT__.md` first.

## 0.0.5 — 2026-02-18 — Frontend-Safe Console

### ✅ Completed

- [x] Fixed crash when importing blue-js in browser environments (`process.env` is not available in frontend)
- [x] Guarded env var check with `typeof process !== 'undefined'` and optional chaining
- [x] Added `console.silence( silent )` — programmatic API for suppressing logs (frontend and server)
- [x] Moved `window.console` nuke block from module-level into `silence()` (on-demand, no longer dead code)

## 0.0.4 — 2026-02-18 — Vanilla Reimplementations & Cleanup

### ✅ Completed

- [x] Re-enabled `nearest_in_array()` with vanilla O(n) implementation (was disabled due to lodash dependency)
- [x] Removed dead `abs_objs` variables from `nearest_next()` and `nearest_prev()`
- [x] Renamed internal import alias `kp` → `utils` across all hench sub-modules
- [x] Reformatted `number.js` (4-space indentation, brace style)

## 0.0.3 — 2026-02-18 — Repo Cleanup & Public Release

### ✅ Completed

- [x] Renamed env var `BLUE_NO_CONSOLE` → `BLUE_CONSOLE_SILENT` for clearer intent
- [x] Removed `playground/` folder
- [x] Flattened project structure: removed `app/` wrapper, moved `package.json`, `bun.lock`, `src/` to project root
- [x] Fixed GitHub URL in README: `nicetomytyuk` → `bluegate-studio`
- [x] Added MIT licence (`LICENSE`)
- [x] Configured branch protection on `main` (linear history, no force pushes, no deletions)
- [x] Removed "separate entry points" from pending (consuming developer's responsibility)

## 0.0.2 — 2026-02-18 — British English & Public Prep

### ✅ Completed

- [x] Renamed all exported functions to British English: `latinize` → `latinise`, `sanitize` → `sanitise`, `tokenize` → `tokenise`, `sanitize_input` → `sanitise_input`, `listen_to_sanitize` → `listen_to_sanitise`
- [x] Renamed source files: `latinizations.js` → `latinisations.js`, `localizations.js` → `localisations.js`, `sanitizer.js` → `sanitiser.js`
- [x] Renamed all internal variables: `sanitized` → `sanitised`, `sanitization` → `sanitisation`
- [x] Updated sanitisation pipeline criteria strings: `'latinize'` → `'latinise'` across all modules
- [x] Changed DOM attribute from `kp-sanitization` to `data-sanitisation`
- [x] Removed usage examples comment block from entry point (`src/_.js`)
- [x] Added `.gitignore` (`node_modules/`, `.DS_Store`)

## 0.0.1 — 2026-02-18 — Initial Package Setup

### ✅ Completed

- [x] Initialised package (`package.json`, entry point `src/_.js`)
- [x] Ported `hench` module — type safety & utilities (string, array, object, number, bool, url, regex, currency, moment)
- [x] Ported `linguist` module — i18n, latinisation (500+ char mappings), sanitisation pipeline DSL (20+ operations)
- [x] Ported `console` module — structured logging with chalk, timed start/log/end
- [x] Ported `shell` module — Node.js file ops, shell command execution
- [x] Removed external dependencies: fuse.js, papaparse, lodash, fast-xml-parser
- [x] Added chalk as the sole dependency
- [x] Replaced `env/dev.js` import with `process.env.BLUE_CONSOLE_SILENT` environment variable
- [x] Removed all Bun-specific references from shell (`Bun.file()`, `Bun.spawn()`)
- [x] Moved `dir()` from `hench` to `shell` (uses `node:fs`)
- [x] Removed `resized_base64()` from `hench` (browser-only, uses `document.createElement`)
- [x] Removed `window` references from `linguist`; `navigator` and `document` refs are guarded with try-catch
- [x] Written `__PROJECT__.md` — full API reference and architecture docs

### 🔲 Pending

- [ ] Re-enable `from_csv()`, `from_xml()` with vanilla implementations (no external deps)

