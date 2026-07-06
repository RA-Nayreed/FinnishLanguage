# Survival Finnish - backend (ElevenLabs TTS proxy)

A small Express server that sits in front of the ElevenLabs text-to-speech API.
The browser asks this server for Finnish audio; the server synthesizes it (or
returns a previously cached MP3) and streams it back. **Your ElevenLabs API key
never leaves the server.**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET  | `/api/health` | `{ ok, keyConfigured, voice, model, cached }` |
| GET  | `/api/voices` | Proxied ElevenLabs voice list |
| GET  | `/api/tts?text=...&voice=<id>` | Returns `audio/mpeg` (cached on disk) |
| POST | `/api/tts` `{ text, voice }` | Returns `audio/mpeg` |

It also serves the sibling `../frontend` directory statically, so `npm start`
gives you the whole app on one port.

## Setup

```bash
cp .env.example .env      # add ELEVENLABS_API_KEY
npm install
npm start                 # http://localhost:8787
```

## Configuration (env)

| Variable | Default | Notes |
|----------|---------|-------|
| `ELEVENLABS_API_KEY` | - | required for synthesis (else `/api/tts` → 501) |
| `ELEVENLABS_VOICE_ID` | `JBFqnCBsd6RMkjVDRZzb` (George) | any ElevenLabs voice id |
| `ELEVENLABS_MODEL` | `eleven_multilingual_v2` | supports Finnish |
| `PORT` | `8787` | |
| `CACHE_DIR` | `./cache` | on-disk MP3 cache |
| `CORS_ORIGIN` | `*` | lock to your Vercel frontend origin in production |

## Caching

Each request is keyed by `sha1(voice|model|text)`. The first request for a
phrase hits ElevenLabs and is written to `CACHE_DIR`; subsequent requests are
served from disk. Responses carry a long immutable `Cache-Control`, so browsers
and CDNs cache them too.

## Deploy

Runs anywhere Node 18+ is available (Render, Railway, Fly.io, a VPS). Set the
env vars, expose the port, and point the frontend at it via `apiBase` in
`frontend/js/config.js`. For a persistent cache, mount a volume at `CACHE_DIR`.
