# Maze Robot Dashboard

A React + Vite dashboard for tracking maze-solving robot performance, team information, and run records.

## What this app includes

- Multi-page dashboard with React Router.
- Shared app shell (header, nav, content container, footer).
- Local auth context (demo sign-in + sign-up persistence via `localStorage`).
- Protected routes for authenticated-only pages.
- API-backed pages for runs and other robotics data.

## Tech stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 3

## Routes

### Public routes

- `/` → Dashboard
- `/runs` → Runs list/form (API-backed)
- `/gallery` → Gallery
- `/status` → Robot status
- `/mazes` → Maze list/details
- `/teams` → Teams
- `/signin` → Sign in (redirects to profile when already authenticated)
- `/signup` → Sign up (redirects to profile when already authenticated)

### Protected routes

- `/profile` → Signed-in user profile
- `/logbook` → Team/user logbook

Unauthenticated access to protected routes redirects to `/signin`.

## Local development

```bash
npm install
npm run dev
```

The app runs at the Vite dev URL shown in terminal (commonly `http://localhost:5173`).

## Build and preview

```bash
npm run build
npm run preview
```

## Linting

```bash
npm run lint
```

## Environment / API configuration

The frontend reads API configuration from `src/config.js`.

If you point this app to a deployed backend, update the config values there (or migrate them to Vite env vars when ready).

## Demo auth

A default demo user is available in `src/AuthContext.jsx`:

- Email: `team1@demo.com`
- Password: `pass123`

User session data is stored in `localStorage` under `mazeUser`.

## Suggested next improvements

- Move API URLs to environment variables (`VITE_*`).
- Replace demo auth with backend auth (JWT/session).
- Add route-level tests for auth redirects.
- Add CI checks for lint + build.
