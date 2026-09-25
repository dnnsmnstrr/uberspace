# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Configuration and code for the Uberspace asteroid `mnstrr` on `perseus.uberspace.de`. The repo contains:

- **Playground API** (`src/`) – a small Express app served at `https://mnstrr.uber.space/api/`
- **Portfolio page** (`src/index.html`) – served at `https://mnstrr.qzz.io/`
- **Dashboard** (`dashboard/config.yml`) – a [Homer](https://github.com/bastienwirtz/homer) page linking to all services, served at `https://mnstrr.uber.space/`

## Development Commands

```bash
npm install
npm start                 # run the API locally on port 1024 (or $PORT)
npm run build:dashboard   # build the dashboard into build/dashboard/
```

To preview the dashboard: `npx serve build/dashboard` (or any static file server).

## Deployment

Pushing to `main` runs `.github/workflows/deploy-to-uberspace.yml`, which:

1. Bundles `src/index.js` with esbuild and copies swagger-ui and `index.html` into `dist/`, then rsyncs it to `/var/www/virtual/mnstrr/html` and runs `supervisorctl restart express`.
2. Builds the dashboard and rsyncs it to `/var/www/virtual/mnstrr/mnstrr.uber.space` (Apache uses a per-domain folder instead of `html/` when one exists).

Prefer deploying via push over editing files on the server.

## Dashboard

Edit `dashboard/config.yml` to add, change or remove services (Homer config format). Add `hidden: true` to an item or group to keep it off the published page. `scripts/build-dashboard.js` strips hidden entries at build time, so they never reach the server. The Homer version is pinned in that script.

## Server

SSH access: `ssh uberspace` (see `~/.ssh/config`).

Supervisord services (`~/etc/services.d/*.ini`):

| Service | What | Web backend |
|---|---|---|
| `express` | This repo's API (`~/html/server.bundle.js`) | `/api` → port 1024, prefix removed (only reachable on `mnstrr.uber.space`) |
| `etherpad` | Etherpad (`~/etherpad`) | `pad.mnstrr.qzz.io` → 9001 |
| `pocketbase` | PocketBase | `db.mnstrr.uber.space` → 8090 |
| `vaultwarden` | Vaultwarden | `vault.mnstrr.qzz.io` → 8000 |
| `bring` | TRMNL Bring plugin (`~/trmnl/trmnl-bring-plugin`) | none |

Everything else (`/`, `mnstrr.qzz.io/`) is served by Apache. Useful commands: `supervisorctl status`, `supervisorctl restart express`, `uberspace web backend list`.

## API Endpoints

Paths are relative to the app; in production they are prefixed with `/api`.

- `GET /advice` – delightfully questionable life advice
- `GET /joke` – a random joke (data in `src/data.js`)
- `GET /docs` – Swagger UI
- `GET /swagger.json` – OpenAPI spec

## Notes

- All API code lives in `src/index.js`; there is no test or lint setup.
- Restart `express` after changing the API on the server (the deploy workflow does this automatically).
