# Swiss Public Transport Timetable for Outlook

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

An Outlook add-in that shows **Swiss public transport connections** for the current appointment.  
It uses the [search.ch timetable API](https://search.ch/timetable/api/help.en.html) to query real-time and timetable data and displays convenient outbound/return journeys directly in the Outlook task pane.

> **Note:** This project is not affiliated with, endorsed by, or in any way officially connected to SBB, search.ch, Microsoft, or any Swiss transport operator.

---

## Documentation

**User Guides:**
- 🇩🇪 [Fahrplanabfrage für Outlook – Benutzerhandbuch (Deutsch)](src/docs/de-CH.md)
- 🇫🇷 [Recherche d'horaires pour Outlook – Guide d'utilisation (Français)](src/docs/fr-CH.md)

Additional language documentation pending. Contributions welcome!

---

## Features

- Display **outbound** and **return** connections for the current Outlook appointment.
- Support for multiple Swiss languages (de-CH, fr-CH, it-CH, rm-CH) and en-GB.
- User-defined **favourite stops** with walking times.
- Autocompletion for stops using the search.ch completion API.
- Compact connection tables with duration, route chain and easy selection of the desired connection.
- Works in Outlook for Windows and, where supported, in the new Outlook / Outlook on the web.

---

## Tech Stack

- Outlook Add-in (Office.js)
- HTML / CSS / JavaScript (no framework)
- [search.ch timetable API](https://search.ch/timetable/api/help.en.html)
- Icon based on [Lucide](https://lucide.dev) (see below for licensing)

---

## Getting Started (Development)

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Outlook desktop (Microsoft 365) and/or Outlook on the web with sideloading enabled

### Installation

```bash
# Install dependencies
npm install
```

### Run the dev server

```bash
npm start
```

This will:

- start the local web server (typically on `https://localhost:3000/`)
- build and serve the task pane (`taskpane.html`, `taskpane.js`, assets, …)

### Sideload into Outlook

1. Ensure `manifest.xml` points to your local dev URLs (e.g. `https://localhost:3000/...`).
2. In Outlook, sideload the add-in by adding `manifest.xml` via  
   **File → Manage Add-ins** (or **Get Add-ins → My add-ins → Add from file**, depending on Outlook version).
3. Open a calendar appointment and start the add-in from the ribbon.

Alternatively, follow Microsoft’s official sideload guide: https://aka.ms/olksideload
Trust the development certificate via `npx office-addin-dev-certs install`.

### Troubleshooting (Dev Server / OWA)

- 403 Forbidden on `https://localhost:3000/assets/...` in Outlook/OWA:
   - Ensure webpack dev server allows cross-origin requests:
      - `allowedHosts: "all"`, and CORS headers in `devServer.headers`
   - Restart dev server: `npm run dev-server`
   - Restart Outlook: `npm stop` then `npm start -- desktop --app outlook`
- Icons missing in ribbon/taskpane:
   - Verify asset URLs resolve in browser (`https://localhost:3000/assets/icon-32.png` etc.)
   - Trust dev cert (`npx office-addin-dev-certs install`)
- OWA caching:
   - Remove and re-add the add-in, then hard refresh (Ctrl+F5)

---

## Build for Production

```bash
npm run build
```

This should create an optimised production build (depending on your build setup).  
Update the URLs in `manifest.xml` to point to your production host, e.g.:

- `https://timetable.mbeer.ch/taskpane.html`
- `https://timetable.mbeer.ch/assets/icon-32.png`
- …

Then deploy the built files to your web server and redistribute / upload the updated `manifest.xml`.

---

## Configuration

### search.ch API

This add-in uses the search.ch route search and completion APIs.  
No API key is required. Please comply with the terms and conditions of search.ch.

### Default / Favourite Stops

Users can define a list of favourite stops with walking times.  
These favourites are used as editable dropdowns in the task pane for:

- meeting location
- outbound "from"
- inbound "to"

Favourite stops are stored in browser localStorage under key `owpttFavoriteStopsV1` as a JSON array with the format:
```json
[{"name": "Stop Name", "walkMinutes": 5}]
```

### Translations

All UI texts are centralised in `owpttTranslations` (in `src/taskpane/owpttTranslations.js`).  
Currently supported:

- German (Switzerland) - de-CH
- French (Switzerland) - fr-CH
- Italian (Switzerland) - it-CH
- Romansh (Switzerland) - rm-CH
- English (UK) - en-GB

**Adding new languages**: Copy the en-GB object from `owpttTranslations` and translate all values to the target language. Add locale override to `manifest.xml` under DisplayName and Description sections. Create installation screenshots (steps 1-3) for the new locale.

---

## Project Structure

```text
.
├─ assets/
│  ├─ icon-16.png
│  ├─ icon-32.png
│  ├─ icon-64.png
│  ├─ icon-80.png
│  ├─ icon-128.png
│  └─ screenshots/
│     ├─ step-1-de.png
│     ├─ step-2-de.png
│     └─ step-4.png
│     └─ step-5.png
│     └─ step-6.png
│     └─ step-7.png
├─ src/
│  ├─ commands/
│  │  ├─ commands.html
│  │  └─ commands.js
│  ├─ docs/
│  │  ├─ de-CH.md
│  │  └─ fr-CH.md
│  ├─ services/
│  │  └─ FahrplanSearchCH.js
│  └─ taskpane/
│     ├─ taskpane.html
│     ├─ taskpane.js
│     ├─ taskpane.css
│     └─ owpttTranslations.js
├─ manifest.xml
├─ package.json
├─ webpack.config.js
├─ babel.config.json
├─ LICENSE
└─ LICENSE-icons-lucide.txt
```

---

## Contributing

Bug reports, feature suggestions, and pull requests are welcome!

**Translation contributions**: Help translate the documentation and add support for additional languages. See the Translations section under Configuration for details.

⚠️ **Translation Quality Note**: The initial translations for fr-CH, it-CH, and rm-CH were generated using AI language models and may contain inaccuracies or lack precision in context-specific terminology. Reviews and corrections by native speakers are highly appreciated and welcome via pull requests.

---

## Legacy Version

Looking for the classic **Windows-only VSTO add-in**? It's still available at:
- **Repository**: https://github.com/mbeer/OutlookSwissPTTimetable
- **Download**: https://timetable.mbeer.ch/setup.exe

⚠️ **Note**: The legacy VSTO version is no longer actively maintained. Critical security fixes may still be applied, but new features will only be added to the Office.js version.

---

## License

### Project Code

The code in this repository is licensed under the **MIT License**.

Please see the [`LICENSE`](LICENSE) file for the full text.

Copyright (c) 2018–2026 Michael Beer

### Icons (Lucide)

This project uses icons from **[Lucide](https://lucide.dev)**.

Lucide is licensed under the **ISC License**, with portions derived from Feather under the **MIT License**.  
The full license texts are included in [`LICENSE-icons-lucide.txt`](LICENSE-icons-lucide.txt).

You must comply with these licenses if you reuse the icon assets from this repository.

---
