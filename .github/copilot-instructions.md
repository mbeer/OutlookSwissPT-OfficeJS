# AI Agent Instructions for OutlookSwissPTTimetable

## Project Overview

**Swiss Public Transport Timetable** is a Microsoft Outlook add-in for planning travel journeys. Users specify origin and destination stops, and the add-in searches public transport connections from `search.ch` (Swiss timetable API), then inserts journey details into their Outlook calendar with emoji-based route chains.

### Core Architecture
- **Outlook Add-in** (taskpane + ribbon button) using Office JavaScript API
- **Service**: `FahrplanSearchCH.js` – port of C# library wrapping `fahrplan.search.ch` API
- **i18n**: Multi-locale support (en-GB, de-CH, de-DE, fr-CH, fr-FR, it-CH, it-IT, rm-CH)
- **Build**: Webpack 5 + Babel (targets IE 11 via `core-js` polyfills), dev server on `https://localhost:3000`
- **Desktop debugging**: Outlook/Excel/PowerPoint/Word via `office-addin-debugging` npm package
- **No framework**: Vanilla JavaScript with DOM manipulation, no React/Vue/Angular

## Directory Structure

```
assets/
  icon-*.png          # Add-in icons (16, 32, 64, 80, 128px)
  screenshots/        # Installation guide screenshots
    step-1-de.png
    step-2-de.png
    step-4.png
    step-5.png
    step-6.png
    step-7.png
src/
  taskpane/           # Main UI (Office.js context)
    taskpane.js       # Core logic: search, i18n, state management
    taskpane.html     # UI markup with data-i18n attributes
    taskpane.css      # Narrow sidebar layout + Fluent UI
    owpttTranslations.js  # Translation dictionary (all locales)
  services/
    FahrplanSearchCH.js   # Timetable search API client
  commands/
    commands.js       # Ribbon button callback (minimal)
  docs/
    de-CH.md          # German user documentation
manifest.xml          # Outlook manifest (ID, buttons, permissions)
webpack.config.js     # Webpack dev server + build config
babel.config.json     # Babel polyfills (IE 11 compatibility)
```

## Key Patterns & Conventions

### 1. **Internationalization (i18n)**
- All user-visible strings use `t(key, fallback)` function
- Strings are loaded from `owpttTranslations[locale]` dictionary
- Locale auto-detected from `Office.context.displayLanguage` (de→de-CH, fr→fr-CH, etc.)
- HTML attributes: `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria-label`
- **Always validate locales** via `validateLocaleTranslations()` before using

### 2. **State Management**
All global state in `taskpane.js`:
- `owpttInboundConnections`, `owpttOutboundConnections` – API responses (array of `Connection` objects)
- `owpttInboundSelectedIndex`, `owpttOutboundSelectedIndex` – selected row in table
- `owpttFavoriteStops` – array of {name, walkMinutes} persisted to localStorage

### 3. **API Client Pattern** (`FahrplanSearchCH.js`)
- `ConnectionsRequest` class: encapsulates search parameters (from, to, dateTime, isArrivalTime, limit)
- `getConnectionsAsync()`: returns `ConnectionsResponse` with parsed `Connection[]`
- Each `Connection` has `Legs[]` (segments) with emoji rendering methods:
  - `toEmojiSummary()` – detailed with times: "Bern (↗️14:15, 🚆 S2) → Lugano (↘️14:40) · (🚶‍➡️6′)"
  - `toEmojiRouteChain()` – compact: "🚆S2🚶‍➡️6′🚍11"
- **Do NOT** construct URLs directly; use `ConnectionsRequest._buildUrl()` for debugging

### 4. **Workflow: Search → Render → Create Appointment**
1. **Search**: `searchInboundConnections()` / `searchOutboundConnections()`
   - Get appointment info via `getCurrentItemInfo()` (handles Read/Compose modes)
   - Build `ConnectionsRequest` with calculated target time (±walking time)
   - Render results in table via `renderConnections(direction)`
   - On error, show status message via `showStatus(t(...))`

2. **Render**: `renderConnections(direction)`
   - Clear tbody, create rows with emoji route chain
   - First row auto-selected; selections tracked globally
   - Click handlers update global selected index

3. **Create**: `createAppointmentFromConnection(conn, context, direction)`
   - Extract times, stations, walking times
   - Compute appointment start/end (±walking time buffer)
   - Format subject ("Transfer Bern–Lugano"), location (emoji chain), body (emoji summary)
   - Call `mailbox.displayNewAppointmentForm(params)` or async variant

### 5. **Office.js Context Handling** (Critical Pattern)
This is the most error-prone aspect of the codebase. The add-in must work in both Read and Compose modes:

- **Read mode** (viewing existing appointment): `item.subject` is a `string`, `item.start` is a `Date`
- **Compose mode** (creating appointment): All properties have `.getAsync(callback)` methods
- **ALWAYS** use the `getItemProperty(value)` helper (in `taskpane.js`) to abstract this difference
- Pattern: `await Promise.all([getItemProperty(item.subject), getItemProperty(item.start), ...])`
- Never directly access `item.subject` or `item.start` without the helper
- `mailbox.displayNewAppointmentForm()` (sync) vs `displayNewAppointmentFormAsync()` (callback) – try sync first, fall back to async

### 6. **localStorage Persistence**
- **Favorite stops**: stored as JSON array in `owpttFavoriteStopsV1` key
- **Display settings**: stored as JSON object in `owpttDisplaySettingsV1` key
- Always validate/sanitize on load (check types, null-coalesce, set defaults)
- Call `saveFavoriteStops()` or `saveDisplaySettings()` after mutations

### 7. **Date/Time Handling**
- API returns: `"YYYY-MM-dd HH:mm:ss"` string format → parsed by `parseSearchChDateTime()`
- Stored internally as native `Date` objects
- Display: `formatTime(date)` → "HH:mm", `formatDateTime(date)` → "dd/mm/yyyy HH:mm"
- Duration: `formatDuration(depDate, arrDate)` → "2h 28′" (human-readable)
- When building requests, format via `formatDateCH()` and `formatTime()`

### 8. **Emoji Route Chains** (New Pattern)
Instead of text-based routes, connections render as visual emoji chains:
- Transport type: 🚆 (train), 🚍 (bus), 🚊 (tram), ⛴️ (ship)
- Walking: 🚶‍➡️XX′ (minutes rounded, use U+2032 prime symbol, not apostrophe)
- Arrows: ↗️ (departure), ↘️ (arrival)
- Time: HH:mm in 24h format
- Example appointment body: `(🚶‍➡️15′) · 🚆S2 (↗️14:15, S2) → Lugano (↘️14:45) · (🚶‍➡️10′)`

### 9. **Typographic Characters Standard**
All text must use correct Unicode typographic characters for professional appearance:
- **Apostrophes in contractions**: Use U+2019 (') for English "you'll", "it's", French "l'insertion", "d'horaire"
- **Minutes markers**: Use U+2032 (′) for time/duration like "15′ walking time", "2h 28′ duration" (NOT the ASCII straight apostrophe `'`)
- **Quotation marks**: 
  - English/French/Italian: Use U+2018/U+2019 (' ') for single quotes around button/menu names (e.g., 'Edit', 'Importer la liste')
  - **German**: Use U+00AB/U+00BB («…») for quotation marks in German text (e.g., «Bearbeiten»-Button, «Liste importieren»)
- **Always verify** when adding new text that apostrophes and minutes use the correct characters
- Search files for straight apostrophes `'` to catch mistakes; should only appear in code strings, comments explaining the difference

## Critical Development Commands

| Task | Command |
|------|---------|
| **Install** | `npm install` |
| **Dev build** | `npm run build:dev` |
| **Watch** | `npm run watch` |
| **Dev server** | `npm run dev-server` (runs on 3000) |
| **Debug: Outlook** | `npm start -- desktop --app outlook` |
| **Stop debug** | `npm stop` |
| **Lint check** | `npm run lint` |
| **Auto-fix lint** | `npm run lint:fix` |

**Default debug target**: `manifest.xml` specifies Outlook, desktop app on localhost:3000

Sideloading (OWA/Outlook): Follow Microsoft’s guide at https://aka.ms/olksideload to install the add-in via the manifest. Ensure dev URLs point to `https://localhost:3000/` and trust the dev certificate.

### Troubleshooting (Dev Server / OWA)
- 403 Forbidden from `https://localhost:3000/assets/...` in Outlook/OWA:
  - Ensure webpack dev server allows cross-origin requests: `allowedHosts: "all"` and permissive CORS headers in `devServer.headers`.
  - Restart dev server: `npm run dev-server` and restart Outlook: `npm stop` then `npm start -- desktop --app outlook`.
- Icons missing in ribbon/taskpane:
  - Verify asset URLs resolve in a browser (`https://localhost:3000/assets/icon-32.png`, etc.).
  - Trust the dev cert (`npx office-addin-dev-certs install`).
- OWA caching:
  - Remove and re-add the add-in, then hard refresh (Ctrl+F5).

## Common Pitfalls & Best Practices

1. **Always validate i18n**: Missing keys fallback to en-GB. Log warnings if incomplete.
2. **localStorage is user-scoped**: Favorite stops sync only within the same browser profile.
3. **Compose mode ≠ Read mode**: Use `getItemProperty()` for all item property access.
4. **No hardcoded URLs**: Build search.ch URLs only via `ConnectionsRequest._buildUrl()`.
5. **Async errors in handlers**: Wrap in `.catch()` and call `showStatus()` for UX feedback.
6. **Connection objects are classes**: Use `instanceof Connection` not JSON; they have methods.
7. **Emoji rendering**: Always use `.toEmojiSummary()` or `.toEmojiRouteChain()` for display, not manual string building.
8. **CSS namespacing**: All classes start with `owptt-` to avoid conflicts with Office Fabric UI.
9. **Webpack dev server**: HTTPS required for Office add-ins; self-signed certs auto-generated via `office-addin-dev-certs`
10. **IE 11 compatibility**: No arrow functions in HTML attributes, no modern JS in inline scripts, use Babel-transpiled bundles only

## Testing & Debugging

- **Sideload**: Manifest registers add-in on first `npm start` run
- **Logs**: Browser console (F12 in Outlook) shows `taskpane.js` errors and `console.log()`
- **Error tracking**: `showStatus()` displays user-facing error messages
- **Request inspection**: Check browser Network tab to see actual search.ch API requests
- **Locale testing**: Manually set `owpttCurrentLocale` in console to test translation fallback

## Integration with search.ch API

The `search.ch` timetable API (`https://search.ch/fahrplan/api/`) returns:
- **Route API** (`/route.json`): Takes from/to stations + date/time, returns connections
- **Completion API** (`/completion.json`): Autocomplete for station names
- **Response format**: Case-insensitive (API uses lowercase; parser handles both)
- **No authentication required**; public API
- **API Documentation**: Detailed endpoint reference available at https://search.ch/timetable/api/help.en.html

**Rate-limiting**: No documented limits, but cache aggressively in UI (favorites) to avoid repeated identical queries.

## Manifest & Office Add-in Registration

`manifest.xml` defines the add-in's identity and integration points:
- **ID**: `60b89384-dd2d-4394-aebe-cc94450f10b0` (immutable GUID)
- **SourceLocation**: Points to `taskpane.html` (dev: localhost:3000, prod: timetable.mbeer.ch)
- **Permissions**: `ReadWriteItem` required for appointment creation
- **FormSettings**: Defines when add-in appears (Read mode on appointments via `ItemIs` rule)
- **VersionOverrides**: Defines ribbon button (`AppointmentOrganizerCommandSurface`) for Compose mode
- **Localization**: DisplayName and Description translated inline via `<Override Locale="de-CH">` elements
- **Dev URLs**: Change localhost references to production URLs before deployment using webpack's manifest transform

## Version Management

When releasing a new version, update version numbers in **all three files**:
1. `package.json` – "version" field (semantic versioning: x.y.z)
2. `manifest.xml` – `<Version>` element (four-part version: x.y.z.0)
3. `src/docs/de-CH.md` – **Version** field in footer (x.y.z)

Follow semantic versioning:
- **Major (x.0.0)**: Breaking changes, incompatible API changes
- **Minor (0.x.0)**: New features, backwards-compatible
- **Patch (0.0.x)**: Bug fixes, minor improvements

After version bump: build production artifacts, commit, tag with `vx.y.z`, and push to GitHub.
