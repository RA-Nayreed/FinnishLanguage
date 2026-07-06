# Survival Finnish Extended Programme

An interactive web app for practicing the University of Oulu Survival Finnish
booklet content (course `900017Y`, level A1.1). The app includes seven course
modules, drills, listening practice, live number and clock trainers,
spaced-repetition flashcards, a final exam, and Finnish speech playback.

Booklet content is credited to Koskela, Starck, Pohjola-Effe, Isohätälä,
Käräjäoja, Sarajärvi, Haapakoski, and Niskanen (University of Oulu / TOPIK).
This repository is a personal study tool.

## Current Project

- `frontend/` is a static HTML/CSS/JavaScript app.
- `backend/` is an optional Node/Express ElevenLabs text-to-speech proxy.
- `scripts/pregenerate-audio.mjs` can render known Finnish phrases into MP3
  files for static hosting.
- `vercel.json` deploys the static frontend directory on Vercel.

## Project Layout

```text
frontend/
  index.html
  css/styles.css
  shared/lingua.js
  js/config.js
  js/utils.js
  js/audio.js
  js/data.js
  js/app.js
  audio/                generated MP3 files and manifest.json
backend/
  server.js
  package.json
  .env.example
scripts/
  pregenerate-audio.mjs
vercel.json
```

## Run Locally

Frontend only:

```bash
cd frontend
python3 -m http.server 8099
```

Open `http://localhost:8099`.

With the optional ElevenLabs backend:

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Add `ELEVENLABS_API_KEY` to `backend/.env` before starting the backend. The
backend serves the frontend and API from `http://localhost:8787`.

## Audio

Speech playback tries these sources in order:

1. Generated files from `frontend/audio/<hash>.mp3` listed in
   `frontend/audio/manifest.json`.
2. The optional backend when `frontend/js/config.js` has `apiBase` set.
3. Browser speech synthesis as an offline fallback.

To generate static audio locally:

```bash
export ELEVENLABS_API_KEY=sk_...
node scripts/pregenerate-audio.mjs
```

Without `ELEVENLABS_API_KEY`, the script writes an empty manifest and the
frontend still works through backend or browser fallback audio.

## Deploy Frontend With Vercel

The root `vercel.json` is configured for the static frontend:

- Framework: none
- Build command: `node scripts/pregenerate-audio.mjs`
- Output directory: `frontend`

Import the GitHub repository into Vercel and keep the production branch set to
`main`. Add `ELEVENLABS_API_KEY` as a Vercel environment variable only if you
want MP3 files generated during deployment; otherwise the app deploys and uses
fallback audio.

CLI deployment:

```bash
vercel
vercel --prod
```

## Optional Backend Deployment

Deploy `backend/` to any Node 18+ host. Set the variables from
`backend/.env.example`, expose the server port, then set `apiBase` in
`frontend/js/config.js` to the deployed backend URL.

## Course Modules

| # | Module | Focus |
|---|--------|-------|
| 0 | Suomen kieli & ääntäminen | language, alphabet, pronunciation, vowel harmony |
| 1 | Hei, hauska tavata! | greetings, university places, signs |
| 2 | Hei, mitä kuuluu? | how are you, sorry, thank you, repair phrases |
| 3 | Minä olen... | introductions, `olla`, possessives, numbers, prices |
| 4 | Viikonpäivät & kello | days, telling time, questions, verb conjugation |
| 5 | Haluaisin kahvia | polite requests, food and drink, partitive |
| 6 | Missä on...? | `-ssa/-ssä` and `-lla/-llä`, `käydä`, university vocabulary |

Progress is saved in `localStorage`.
