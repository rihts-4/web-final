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

2. Copy environment variables template.

```bash
cp .env.example .env
```

3. Install dependencies.

```bash
npm install
```

4. Start the server.

```bash
npm run dev               # starts on http://localhost:3000
```

### Testing with curl:

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","display_name":"Test","password":"secret123"}'

# Login and save the token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"secret123"}' | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")

# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -F "content=Hello world #intro"

# Get feed
curl http://localhost:3000/api/feed \
  -H "Authorization: Bearer $TOKEN"

# Like a post
curl -X POST http://localhost:3000/api/posts/1/like \
  -H "Authorization: Bearer $TOKEN"

# Search
curl "http://localhost:3000/api/search?q=hello"
```

The backend will run on:

```
http://localhost:3000
```

---

## Environment Variables

Copy the template and adjust as needed:

```bash
cp .env.example .env
```

Available variables:

| Variable         | Default                  | Description                          |
|------------------|--------------------------|--------------------------------------|
| `PORT`           | `3000`                   | Server port                          |
| `JWT_SECRET`     | `dev_secret`             | Secret key for JWT tokens            |
| `FRONTEND_ORIGIN`| `http://localhost:5173`  | Allowed CORS origin                  |
| `DB_PATH`        | `database.db`            | SQLite database file path            |

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

All endpoints return JSON. Most require a Bearer token: `Authorization: Bearer <token>` (token obtained from login, expires in 7 days).

---

### Authentication

#### POST `/api/auth/register`

Create a new user account.

- **Auth:** None
- **Content-Type:** `application/json`

**Request body:**

```json
{
  "username": "janedoe",
  "display_name": "Jane Doe",
  "password": "secret123"
}
```

**Success** `201`:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "janedoe",
    "display_name": "Jane Doe"
  }
}
```

**Errors:**

| Status | Body |
|--------|------|
| `400`  | `{"error": "Username, display name, and password are required"}` |
| `400`  | `{"error": "Password must be at least 6 characters"}` |
| `409`  | `{"error": "Username already exists"}` |

---

#### POST `/api/auth/login`

Authenticate and receive a JWT.

- **Auth:** None
- **Content-Type:** `application/json`

**Request body:**

```json
{
  "username": "janedoe",
  "password": "secret123"
}
```

**Success** `200`:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "janedoe",
    "display_name": "Jane Doe"
  }
}
```

**Errors:**

| Status | Body |
|--------|------|
| `400`  | `{"error": "Username and password are required"}` |
| `401`  | `{"error": "Invalid username or password"}` |

---

### Users

#### GET `/api/users/:username`

Get a user's public profile, their posts, follower/following counts, and whether the current user follows them.

- **Auth:** Optional

**Success** `200`:

```json
{
  "user": {
    "id": 1,
    "username": "janedoe",
    "display_name": "Jane Doe",
    "created_at": "2025-06-01T10:00:00.000Z"
  },
  "followers": 15,
  "following": 7,
  "isFollowing": true,
  "posts": [
    {
      "id": 10,
      "user_id": 1,
      "content": "Hello world",
      "image_path": null,
      "created_at": "2025-07-10T12:00:00.000Z",
      "like_count": 5,
      "liked": 0,
      "is_following": 0
    }
  ]
}
```

**Errors:**

| Status | Body |
|--------|------|
| `404`  | `{"error": "User not found"}` |

---

#### POST `/api/users/:id/follow`

Follow a user. A notification is sent to the target user.

- **Auth:** Required

**Success** `200`:

```json
{ "message": "User followed" }
```

**Errors:**

| Status | Body |
|--------|------|
| `400`  | `{"error": "You cannot follow yourself"}` |
| `404`  | `{"error": "User not found"}` |

---

#### DELETE `/api/users/:id/follow`

Unfollow a user.

- **Auth:** Required

**Success** `200`:

```json
{ "message": "User unfollowed" }
```

**Errors:**

| Status | Body |
|--------|------|
| `500`  | `{"error": "Failed to unfollow user"}` |

---

### Posts

#### POST `/api/posts`

Create a new post. Hashtags (`#tag`) are parsed and indexed automatically.

- **Auth:** Required
- **Content-Type:** `multipart/form-data`

**Request fields:**

| Field     | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `content` | string | yes      | Post text (max **280** characters) |
| `image`   | file   | no       | Image file (jpeg, png, etc.)       |

**Success** `201`:

```json
{
  "message": "Post created successfully",
  "postId": 11
}
```

**Errors:**

| Status | Body |
|--------|------|
| `400`  | `{"error": "Post cannot be empty"}` |
| `400`  | `{"error": "Post exceeds 280 characters"}` |

---

#### DELETE `/api/posts/:id`

Delete your own post.

- **Auth:** Required

**Success** `200`:

```json
{ "message": "Post deleted" }
```

**Errors:**

| Status | Body |
|--------|------|
| `403`  | `{"error": "You can only delete your own posts"}` |
| `404`  | `{"error": "Post not found"}` |

---

#### POST `/api/posts/:id/like`

Like a post. Sends a notification to the post author (unless you are the author).

- **Auth:** Required

**Success** `200`:

```json
{ "message": "Post liked" }
```

**Errors:**

| Status | Body |
|--------|------|
| `404`  | `{"error": "Post not found"}` |

---

#### DELETE `/api/posts/:id/like`

Remove your like from a post.

- **Auth:** Required

**Success** `200`:

```json
{ "message": "Post unliked" }
```

---

### Feed

#### GET `/api/feed`

Personalized feed — posts from followed users and your own posts.

- **Auth:** Required

**Success** `200`:

```json
[
  {
    "id": 10,
    "content": "Hello world #intro",
    "image_path": null,
    "created_at": "2025-07-10T12:00:00.000Z",
    "user_id": 1,
    "username": "janedoe",
    "display_name": "Jane Doe",
    "like_count": 5,
    "liked": 0,
    "is_following": 1
  }
]
```

| Field          | Type    | Description                             |
|----------------|---------|-----------------------------------------|
| `like_count`   | number  | Total likes on the post                 |
| `liked`        | 0 or 1  | Whether the current user liked this post|
| `is_following` | 0 or 1  | Whether current user follows the author |

---

#### GET `/api/feed/public`

Public feed — all posts, newest first. Non-logged-in users see `liked` and `is_following` as `0`.

- **Auth:** Optional

**Success** `200`: Same shape as `GET /api/feed`.

---

#### GET `/api/feed/trending`

Top 3 hashtags and top 3 most prolific users.

- **Auth:** None

**Success** `200`:

```json
{
  "hashtags": [
    { "tag": "intro", "count": 12 }
  ],
  "users": [
    { "id": 1, "username": "janedoe", "display_name": "Jane Doe", "post_count": 25 }
  ]
}
```

---

### Search

#### GET `/api/search?q=keyword`

Search posts and users by keyword.

- **Auth:** None

**Success** `200`:

```json
{
  "posts": [
    {
      "id": 10,
      "content": "Hello world",
      "image_path": null,
      "created_at": "2025-07-10T12:00:00.000Z",
      "user_id": 1,
      "username": "janedoe",
      "display_name": "Jane Doe",
      "like_count": 5
    }
  ],
  "users": [
    {
      "id": 1,
      "username": "janedoe",
      "display_name": "Jane Doe",
      "created_at": "2025-06-01T10:00:00.000Z"
    }
  ]
}
```

**Errors:**

| Status | Body |
|--------|------|
| `400`  | `{"error": "Search query is required"}` |

---

#### GET `/api/search/hashtag/:tag`

Search posts by hashtag (e.g. `#intro`).

- **Auth:** Optional

**Success** `200`:

```json
[
  {
    "id": 10,
    "user_id": 1,
    "content": "Hello world #intro",
    "image_path": null,
    "created_at": "2025-07-10T12:00:00.000Z",
    "username": "janedoe",
    "display_name": "Jane Doe",
    "like_count": 5,
    "liked": 0,
    "is_following": false
  }
]
```

---

### Notifications

#### GET `/api/notifications`

Get all notifications for the authenticated user.

- **Auth:** Required

**Success** `200`:

```json
[
  {
    "id": 1,
    "type": "like",
    "post_id": 10,
    "is_read": 0,
    "created_at": "2025-07-10T12:30:00.000Z",
    "actor_id": 2,
    "username": "bob",
    "display_name": "Bob",
    "post_content": "Hello world"
  }
]
```

**Types:** `like`, `follow`

---

#### PATCH `/api/notifications/:id/read`

Mark a single notification as read.

- **Auth:** Required

**Success** `200`:

```json
{ "message": "Notification marked as read" }
```

**Errors:**

| Status | Body |
|--------|------|
| `404`  | `{"error": "Notification not found"}` |

---

## Authors

Backend Development

- Ty
- Refadul Islam
- Ghosh Deb Kumar