# Microblogging Web Application - Backend

The backend is built using:

- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT Authentication
- Multer (image uploads)
- bcrypt (password hashing)

---

## Installation

1. Navigate to the backend folder.

```bash
cd backend
```

2. Install dependencies.

```bash
npm install
```

3. Start the server.

```bash
npm run dev
```

The backend will run on:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file with:

```env
PORT=3000
JWT_SECRET=my_secret_key
FRONTEND_ORIGIN=http://localhost:5173
```

---

## Project Structure

```
backend/
│
├── db/
├── middleware/
├── routes/
├── uploads/
├── server.js
├── package.json
└── .env.example
```

---

## Main Features

- User Registration
- User Login (JWT Authentication)
- User Profiles
- Follow / Unfollow Users
- Create Posts
- Delete Posts
- Like / Unlike Posts
- Hashtag Support
- Search Users and Posts
- Notifications
- Image Uploads

---

## API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Users

- GET `/api/users/:username`
- POST `/api/users/:id/follow`
- DELETE `/api/users/:id/follow`

### Posts

- POST `/api/posts`
- DELETE `/api/posts/:id`
- POST `/api/posts/:id/like`
- DELETE `/api/posts/:id/like`

### Feed

- GET `/api/feed`
- GET `/api/feed/public`

### Search

- GET `/api/search?q=keyword`
- GET `/api/search/hashtag/:tag`

### Notifications

- GET `/api/notifications`
- PATCH `/api/notifications/:id/read`

---

## Authors

Backend Development

- Ty
- Refadul Islam
