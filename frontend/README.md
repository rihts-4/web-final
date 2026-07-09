# Frontend — Social Microblog App

This frontend is the React client for the `web-final` project. It connects to the backend API to handle authentication, feeds, profiles, search, likes, follows, and notifications.

## Run the frontend
1. Open a terminal tab and go to:
   ```bash
   cd /home/runner/work/web-final/web-final/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

Frontend default URL: `http://localhost:5173`

## Important: run backend separately
The frontend depends on the backend API, so also run:
- `/home/runner/work/web-final/web-final/backend` in a **different terminal tab**
- backend server (`npm run dev`) at the same time

## Tech stack
- React 18
- Vite 6
- React Router
- Tailwind CSS v4
- Radix/shadcn-style UI components

## Frontend structure
- `src/main.jsx` — app entrypoint
- `src/app/App.jsx` — route definitions and providers
- `src/app/context/UserContext.jsx` — authenticated user state
- `src/app/services/api.js` — API client wrapper
- `src/app/components/` — pages and reusable components
- `src/styles/` — global and theme styling
