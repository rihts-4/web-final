const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Get personalized feed
 * Shows posts from users the logged-in user follows,
 * plus their own posts.
 */
router.get("/", auth, (req, res) => {
  try {

    const posts = db.prepare(`
      SELECT
        posts.id,
        posts.content,
        posts.image_path,
        posts.created_at,

        users.id AS user_id,
        users.username,
        users.display_name,

        (
          SELECT COUNT(*)
          FROM likes
          WHERE likes.post_id = posts.id
        ) AS like_count,

        CASE
          WHEN EXISTS (
            SELECT 1 FROM follows
            WHERE follower_id = ? AND following_id = users.id
          ) THEN 1
          ELSE 0
        END AS is_following

      FROM posts

      JOIN users
        ON users.id = posts.user_id

      WHERE
        posts.user_id = ?

        OR posts.user_id IN (
          SELECT following_id
          FROM follows
          WHERE follower_id = ?
        )

      ORDER BY posts.created_at DESC
    `).all(req.user.id, req.user.id, req.user.id);

    res.json(posts);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to retrieve feed"
    });
  }
});

/**
 * Public feed
 * Anyone can view this.
 */
router.get("/public", auth.optionalAuth, (req, res) => {
  try {

    const currentUser = req.user;
    const posts = db.prepare(`
      SELECT
        posts.id,
        posts.content,
        posts.image_path,
        posts.created_at,

        users.id AS user_id,
        users.username,
        users.display_name,

        (
          SELECT COUNT(*)
          FROM likes
          WHERE likes.post_id = posts.id
        ) AS like_count,

        CASE
          WHEN ? IS NOT NULL AND EXISTS (
            SELECT 1 FROM follows
            WHERE follower_id = ? AND following_id = users.id
          ) THEN 1
          ELSE 0
        END AS is_following

      FROM posts

      JOIN users
        ON users.id = posts.user_id

      ORDER BY posts.created_at DESC
    `).all(currentUser?.id, currentUser?.id);

    res.json(posts);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to retrieve public feed"
    });
  }
});

module.exports = router;