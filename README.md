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
- `scripts/pregenerate-audio.mjs` can optionally render known Finnish phrases
  into MP3 files for static hosting.
- `vercel.json` deploys the static frontend directory on Vercel.
- `api/` contains Vercel serverless routes for optional ElevenLabs speech.

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
api/
  health.js
  tts.js
  voices.js
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
checked-in `.env.example` uses a fake placeholder; replace it with a real
ElevenLabs key for live speech. The backend serves the frontend and API from
`http://localhost:8787`.

## Audio

Speech playback tries these sources in order:

1. Generated files from `frontend/audio/<hash>.mp3` listed in
   `frontend/audio/manifest.json`.
2. ElevenLabs through same-origin Vercel routes (`api/tts.js`) when
   `ELEVENLABS_API_KEY` is configured, or through a custom backend when
   `frontend/js/config.js` points `apiBase` at one.
3. Browser speech synthesis as the final offline fallback.

The browser fallback can sound rough if the user has no Finnish system voice.
For production-quality speech on Vercel, set a real `ELEVENLABS_API_KEY` in
the Vercel project environment. The placeholder in this repository is
intentionally fake. Optional voice tuning variables are `ELEVENLABS_VOICE_ID`,
`ELEVENLABS_MODEL`, `ELEVENLABS_STABILITY`, `ELEVENLABS_SIMILARITY_BOOST`,
`ELEVENLABS_STYLE`, and `ELEVENLABS_SPEAKER_BOOST`.

To generate static audio locally from the deployed TTS API:

```bash
TTS_API_URL=https://finnishlanguage.vercel.app/api/tts node scripts/pregenerate-audio.mjs
```

For a small test run that writes outside the repo:

```bash
AUDIO_OUT_DIR=/tmp/sf-audio-test PREGEN_LIMIT=3 \
  TTS_API_URL=https://finnishlanguage.vercel.app/api/tts \
  node scripts/pregenerate-audio.mjs
```

You can also set `ELEVENLABS_API_KEY` locally and render directly. Without
`TTS_API_URL` or a real `ELEVENLABS_API_KEY`, or when a placeholder is used,
the script writes an empty manifest and the frontend still works through
backend or browser fallback audio.

## Freeze Static Audio

The API can be used as a temporary generator and then removed after the MP3
library is committed. The safe sequence is:

1. Keep `/api/tts` deployed and working.
2. Generate files locally with `TTS_API_URL=https://finnishlanguage.vercel.app/api/tts node scripts/pregenerate-audio.mjs`.
3. Commit `frontend/audio/manifest.json` and `frontend/audio/*.mp3`.
4. Switch `frontend/js/config.js` to disable live TTS, then remove `api/` and the Vercel `ELEVENLABS_API_KEY`.

The default static set covers fixed course phrases, flashcards, listen drills,
alphabet audio, clocks, and numbers `0..100`. If you want every number the
number trainer can currently generate, run with `PREGEN_NUM_MAX=9999`; that
creates thousands of MP3 files and uses much more ElevenLabs quota.

## Deploy Frontend With Vercel

The root `vercel.json` is configured for the static frontend:

- Framework: none
- Build command: `node scripts/pregenerate-audio.mjs`
- Output directory: `frontend`
- Serverless API routes: `api/health.js`, `api/tts.js`, `api/voices.js`

On Vercel, the build writes an empty audio manifest by default and uses live
`/api/tts` playback. Set `PREGENERATE_AUDIO=true` only if you intentionally
want the build to spend ElevenLabs quota generating static MP3 files.

Import the GitHub repository into Vercel and keep the production branch set to
`main`. Add a real `ELEVENLABS_API_KEY` as a Vercel environment variable for
better speech; do not use the fake placeholder for production voice. With the
key, the app can synthesize live phrases through `/api/tts` and can also
pre-generate static MP3 files at build time. Without the key, the app still
deploys and uses browser fallback audio.

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
