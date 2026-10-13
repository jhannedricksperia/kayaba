<div align="center">

<img src="public/logo.jpg" alt="Kaya Ba? logo" width="140" />

# Kaya Ba?

**Kaya ba ang kalsada niyo? Alamin kung gaano kataas ang baha sa lugar mo, bago ka umalis.**

Created by **Jhann Edrick Peria**.

A playful, cartoon-style flood forecast web app for the Philippines. It combines live rainfall and wind forecasts, local terrain elevation and an AI assessment to estimate how high floodwater could rise on your street.

<br />

![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r125-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-data-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)

![Status](https://img.shields.io/badge/status-prototype-00C6FF?style=flat-square)
![Estimates only](https://img.shields.io/badge/not_an_official_warning-0F2B48?style=flat-square)

</div>

---

## What it does

| | |
|---|---|
| **Kaya pa! / Ingat! / Hindi na kaya!** | A friendly risk badge and one big number: the predicted flood height in metres, shown beside a 3D cartoon character standing in animated water. |
| **Live conditions** | Rainfall (mm/h), wind, gusts, an estimated typhoon wind signal and the point's elevation, refreshed every 30 minutes. |
| **Terrain-aware** | A 7×7 elevation grid (±1.2 km) tells whether you sit in a bowl or on a rise. Low ground collects water, high ground sheds it. |
| **AI Flood Check** | Gemini turns the forecast and terrain into per-time-step flood depths, a risk level and short advice in Taglish. |
| **Real map** | OpenStreetMap tiles, nearby rivers and canals, and real nearby schools, halls, hospitals and shelters. Switch Now / +3h / +6h / +12h / +24h. |
| **Forecast strip** | Horizontal 24-hour cards with weather icons and a water-level bar. |
| **Responsive** | Phone column, tablet, and a two-column desktop dashboard with a floating nav. |

## How it works

```
 search a place ─▶ Open-Meteo geocoding
        │
        ├─▶ Open-Meteo forecast   rain · wind · weather codes (next 24 h)
        ├─▶ Open-Meteo elevation  7×7 terrain grid around the point
        ├─▶ Overpass (OSM)        nearby rivers + shelters
        │
        ▼
   formula estimate  (rain over 3 h  ×  elevation  ×  terrain factor)
        │
        ▼
   POST /api/assess ─▶ Gemini      depth per step · risk · advice
        │
        ▼
   UI: 3D scene · risk badge · map · forecast strip
```

If the AI function is unavailable (no key, quota, network), the app keeps working with the elevation-based formula and says so on the AI card.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 18, Tailwind CSS 3 (design tokens from the Stitch export) |
| Build | Vite 5 |
| 3D | Three.js r125 (lazy-loaded) |
| Maps | Leaflet 1.9 + OpenStreetMap tiles |
| Weather, geocoding, elevation | [Open-Meteo](https://open-meteo.com) (no API key) |
| Shelters, waterways | [Overpass API](https://overpass-api.de) (OpenStreetMap) |
| AI | Google Gemini via a Vercel serverless function (`api/assess.js`) |
| Hosting | Vercel |
| Design | Google Stitch (cartoon hydro style, blue / cyan / white palette) |

## Getting started

```bash
npm install
npm run dev        # UI only, AI card falls back to the formula
```

To run the AI endpoint locally too, use the Vercel CLI so `/api/*` is served:

```bash
npm i -g vercel
cp .env.example .env.local   # then add GEMINI_API_KEY
vercel dev
```

### Environment variables

| Name | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | for AI | Google AI Studio / Gemini API key. Server-side only, never exposed to the browser. |
| `GEMINI_MODEL` | no | Defaults to `gemini-3.8-flash`. |

## Deploy to Vercel

1. Push the repo and import it in Vercel (framework preset: **Vite**), or run `npx vercel`.
2. Add `GEMINI_API_KEY` under *Project → Settings → Environment Variables*.
3. Deploy. `vercel.json` already routes everything except `/api/*` to the SPA.

## Project structure

```
api/assess.js            Gemini flood assessment (serverless)
src/
  App.jsx                hash-based screen switching + live data provider
  screens/               Home · Map · Forecast · Alerts (converted from Stitch)
  components/            LiveMap, ThreeScene, AiAssessment, TimeSteps, …
  lib/
    weather.js           forecast, depth formula, wind signal
    terrain.js           elevation grid + basin factor
    nearby.js            shelters + waterways from Overpass
    live.jsx             data orchestration + AI call
  scenes/homeScene.js    the cartoon flood scene
public/                  logo and bundled images
```

## Known limits

- **Flood depth is an estimate.** There is no free street-level flood-depth service. The number comes from a simple formula plus an AI judgement and has not been validated against real flood events. Do not use it as the basis for evacuation decisions.
- **Typhoon signal is derived** from forecast wind speed using PAGASA's thresholds. It is not the official bulletin.
- **Flood zones on the map are illustrative** circles that grow with the estimated depth, not surveyed flood extents.
- **Still demo content:** the Forecast and Alerts screens, the barangay details panel on the Map screen, and the Report / Hotlines buttons.
- Shelter data is only as complete as OpenStreetMap in your area.

Always follow official advisories from **PAGASA**, **NDRRMC** and your local **LGU / barangay**.

## Credits

Weather data by [Open-Meteo](https://open-meteo.com) (CC BY 4.0). Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Interface designed with Google Stitch.
