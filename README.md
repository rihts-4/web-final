# Web Final — Microblogging Web Application

## Project Overview

Grove is a microblogging web application built for the Web Information Engineering group project. Users can create an account, publish short posts up to 280 characters with an optional image, follow other users, and read a feed built from the people they follow. On top of the required core, Grove also supports likes, hashtags, search, notifications, a trending panel, and image attachments. The frontend is a React single page app, the backend is an Express REST API backed by SQLite. Full design details, including architecture, data model, and API design, are documented in `design-document.md`.

## How to clone the repository
```bash
git clone https://github.com/rihts-4/web-final.git
```

## How to run the backend
1. Open a terminal tab and go to:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

By default, the backend runs on `http://localhost:3000`.

## How to run the frontend
1. Open a **different terminal tab** and go to:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```

By default, the frontend runs on `http://localhost:5173`.

> Run backend and frontend at the same time in **separate terminal tabs**.

## Repository structure
- `backend/` — Express + SQLite API
- `frontend/` — React + Vite client app

## Key technologies

### Backend
- Node.js
- Express 5
- SQLite (`better-sqlite3`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Image uploads (`multer`)

### Frontend
- React 18
- Vite 6
- React Router
- Tailwind CSS v4
- Radix UI / shadcn-style UI components

## Code organization

### Backend (`backend/`)
- `server.js` — app entrypoint and route mounting
- `db/schema.sql` — database schema
- `db/database.js` — DB initialization
- `middleware/` — auth and upload middleware
- `routes/` — feature routes (`auth`, `users`, `posts`, `feed`, `search`, `notifications`)

### Frontend (`frontend/src/`)
- `main.jsx` — React app bootstrap
- `app/App.jsx` — router and route wiring
- `app/context/UserContext.jsx` — user state context
- `app/services/api.js` — API request layer
- `app/components/` — reusable and page-level UI components

### AI Usage Declaration
AI Agents usage
- Scaffolding
- PR Review
- Making changes based on the review