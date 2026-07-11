# Grove

**Microblogging Web Application Design Document**

Group 3, Web Information Engineering

## 1. Application Overview

Grove is a microblogging application where users publish short posts, follow other accounts, and read a feed built from the people they follow. Posts are capped at two hundred and eighty characters and can optionally carry one image. The idea behind Grove is pacing. Instead of the infinite scroll most microblogging platforms rely on, the feed presents one post at a time as a card that the user swipes or clicks through, so a post gets read on its own rather than skimmed past in half a second alongside a dozen others.

Table 1 lists the six extended features built on top of the required core, with the reasoning behind each. Together they form one loop, a post gets published, becomes discoverable through search or a hashtag, and draws likes, follows, and a notification back to its author. Reposting and bookmarking were considered but left out, since neither fit that loop, and a smaller set of features built properly felt more valuable than a longer list built thinly.

**Table 1: Extended features implemented and the reasoning behind each.**

| Feature | Reason chosen |
|---|---|
| Likes | Gives a reader a lightweight way to react without writing a reply |
| Hashtags | Pulled automatically from post text, groups related posts by topic |
| Search | Covers posts and usernames from a single query box |
| Notifications | Tells a user when they gain a follower or a like on their post |
| Trending | Surfaces the most used hashtags and the most active posters right now |
| Media attachments | Lets a post carry one image alongside its text |

## 2. Architecture Diagram

Figure 1 lays out the three main components of Grove and how they communicate. The React frontend has no access to the database on its own. Every read or write goes out as a REST call to the Express backend over HTTP, drawn as the dashed arrow in the diagram. The backend is the only component allowed to open the SQLite file, drawn as the solid arrow below it, a direct call through the better sqlite3 driver inside the same process rather than a network round trip. Uploaded images sit in a folder on the backend's disk and are served back through an Express static route, so the frontend just requests them like any other file. The one piece of state the frontend manages on its own is the session, the JWT and the current user kept in local storage so a page reload does not sign anyone out.

**Figure 1: System Architecture Diagram**

## 3. Data Model

Figure 2 shows the seven tables that make up Grove's schema, matching schema.sql table for table. Users stores the account record, its username, display name, and password hash. Posts belong to exactly one user and hold the post text, an optional image path, and a creation timestamp. Follows and likes are plain join tables keyed on a composite primary key rather than a surrogate id, since neither is ever looked up except by the pair of ids it stores. Follows is also self referencing. A row points back to the users table twice, once as the follower and once as the account being followed, so the diagram draws two lines into the same users box. Hashtags exist as their own table rather than free text inside every post, and post_hashtags lets one post carry several tags while a tag stays attached to every post that uses it. Notifications stores one row per event and records who caused it, who should receive it, what type it was, and which post it concerns when that applies. post_id is left nullable for follow notifications, since following someone does not involve a post at all.

Table 2 lists a few constraints enforced directly in the schema rather than only checked in application code, since a reviewer reading schema.sql should be able to see them without also reading the route handlers.

**Table 2: Constraints enforced directly in schema.sql.**

| Table | Constraint | Purpose |
|---|---|---|
| posts | content length <= 280 (CHECK) | enforces the character limit at the database level |
| users | username UNIQUE | prevents duplicate accounts sharing a handle |
| follows | composite PK (follower_id, following_id) | a user can only follow another user once |
| likes | composite PK (user_id, post_id) | a user can only like a given post once |

**Figure 2: Data Model Diagram**

## 4. API Design

The backend organizes routes by resource. auth, users, posts, feed, search, and notifications each live in their own file, keeping every file focused on one part of the domain instead of one large router. Table 3 lists every endpoint the backend exposes, grouped the same way, along with what each one requires. Sixteen endpoints in total, comfortably past the ten the assignment asks for.

**Table 3: Every REST endpoint exposed by Grove's backend, grouped by resource.**

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | No | Create an account with a username, display name and password |
| POST | /api/auth/login | No | Verify credentials and issue a JWT |
| GET | /api/users/:username | Optional | Public profile, its posts, follower and following counts |
| POST | /api/users/:id/follow | Yes | Follow another user |
| DELETE | /api/users/:id/follow | Yes | Unfollow a user |
| POST | /api/posts | Yes | Create a post, optional image upload |
| DELETE | /api/posts/:id | Yes | Delete a post, author only |
| POST | /api/posts/:id/like | Yes | Like a post |
| DELETE | /api/posts/:id/like | Yes | Remove a like |
| GET | /api/feed | Yes | Personal feed of followed accounts |
| GET | /api/feed/public | Optional | Public feed, works with or without login |
| GET | /api/feed/trending | No | Top hashtags and the most active posters |
| GET | /api/search | No | Search posts and usernames by keyword |
| GET | /api/search/hashtag/:tag | Optional | All posts using a given hashtag |
| GET | /api/notifications | Yes | List notifications for the logged in user |
| PATCH | /api/notifications/:id/read | Yes | Mark one notification as read |

Two pieces of middleware sit in front of these routes. auth requires a valid token and responds with 401 if one is missing, which protects an endpoint like post creation from anonymous use. optionalAuth runs the same check but never blocks the request. It attaches the logged in user to req.user when a valid token is present and lets the request continue anonymously otherwise. That second middleware is what allows one route, such as a public profile or the public feed, to behave correctly for both a logged in visitor and a stranger with no account.

Figure 3 traces a login followed by a later request that reuses the token issued at login. Passwords are compared with bcrypt rather than as plain text, and the token itself is a JWT signed with a server side secret, valid for seven days. The dashed line partway through the diagram marks a jump in time rather than a message. Everything above it happens once at login, and everything below it can happen on any later request that carries that same token in its Authorization header.

**Figure 3: Login and Authenticated Request Sequence Diagram**

Figure 4 shows a case where that distinction matters more directly, the public feed route, which uses optionalAuth instead of auth. The boxed section labeled alt shows the two paths optionalAuth can take depending on whether the header holds a valid token. When the request carries a valid token the query adds two subqueries, one checking whether the current user already liked each post and one checking whether they follow its author. When no valid token is present those two columns are simply left at zero. The personal feed route always requires a token and works differently, matching posts where the author is either the requesting user or someone that user follows, computed fresh with a join on every request rather than served from a stored timeline.

**Figure 4: Public Feed with optionalAuth Sequence Diagram**

## 5. Influence from Real Platforms

The midterm comparative study found that follower graphs across X, Threads, and Mastodon are built as asymmetric, one way relationships that need no approval from the account being followed. Grove's follows table was designed the same way. It has no status column and no pending state. A row is either present or it is not, and inserting it is the entire act of following someone. An approval based model, closer to a private account elsewhere, was never seriously considered, since it would add an accepted or pending flag to a table that otherwise needs none, and none of the six extended features depended on that kind of gated relationship.

## 6. Trade-offs and Scope Decisions

The midterm found that X pushes new posts into every follower's cached timeline at write time, so a feed read later is a fast cache lookup rather than a database query. Grove does the opposite, computing the personal feed live with a SQL join across posts, users, and follows on every request instead of maintaining a cached timeline. At this project's scale, a handful of accounts sharing one SQLite file, that cost is not measurable, and the write path for a new post stays simple. This would not hold up at X's scale, which is why the midterm found X falls back to a hybrid push and pull model for celebrity accounts. Grove never needed that complexity.

The second trade-off concerns sessions. X issues short lived access tokens through OAuth 2.0 with PKCE, requiring a refresh step and a point at which to revoke access. Grove issues one JWT at login valid for seven days, checked only for a correct signature and expiry on each request. Logging out just clears the frontend's copy from local storage, the token itself stays valid until it expires either way. Table 4 summarizes both trade-offs.

**Table 4: Two trade-offs made against the production approaches studied in the midterm report.**

| Concern | Production approach | Grove's approach |
|---|---|---|
| Feed generation | Fan out on write into a cached timeline (X) | Live SQL join computed on every request |
| Session handling | Short lived token with refresh and revocation, OAuth 2.0 with PKCE (X) | Single 7 day JWT, no refresh, no server side revocation |

Real revocation would mean adding a token table checked on every request, the kind of bookkeeping already avoided by using a live feed query. Given the project's length, and that six features already exceed the assignment's minimum of two, that complexity was not worth the time.
