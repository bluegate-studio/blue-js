> **⚠️ AGENT NOTICE:** This file tracks implementation history. For active development, read `__CORE__.md` + `__PROJECT__.md` first.

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

- [ ] Re-enable `from_csv()`, `from_xml()`, `nearest_in_array()` with vanilla implementations (no external deps)
