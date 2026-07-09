const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Search posts and users
 * Example:
 * GET /api/search?q=hello
 */
router.get("/", (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        error: "Search query is required"
      });
    }

    const keyword = `%${q}%`;

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
        ) AS like_count

      FROM posts

      JOIN users
        ON users.id = posts.user_id

      WHERE posts.content LIKE ?

      ORDER BY posts.created_at DESC
    `).all(keyword);

    const users = db.prepare(`
      SELECT
        id,
        username,
        display_name,
        created_at

      FROM users

      WHERE
        username LIKE ?
        OR display_name LIKE ?

      ORDER BY username
    `).all(keyword, keyword);

    res.json({
      posts,
      users
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Search failed"
    });
  }
});

/**
 * Search by hashtag
 * Example:
 * GET /api/search/hashtag/test
 */
router.get("/hashtag/:tag", auth.optionalAuth, (req, res) => {
  try {

    const tag = req.params.tag.toLowerCase();
    const currentUserId = req.user?.id;

    const posts = db.prepare(`
      SELECT
        posts.id,
        posts.user_id,
        posts.content,
        posts.image_path,
        posts.created_at,

        users.username,
        users.display_name,

        (
          SELECT COUNT(*)
          FROM likes
          WHERE likes.post_id = posts.id
        ) AS like_count,

        ${currentUserId ? `(
          SELECT COUNT(*)
          FROM likes
          WHERE likes.post_id = posts.id AND likes.user_id = ?
        ) AS liked,
        (
          SELECT COUNT(*)
          FROM follows
          WHERE follower_id = ? AND following_id = posts.user_id
        ) AS is_following` : "0 AS liked, 0 AS is_following"}

      FROM posts

      JOIN users
        ON users.id = posts.user_id

      JOIN post_hashtags
        ON post_hashtags.post_id = posts.id

      JOIN hashtags
        ON hashtags.id = post_hashtags.hashtag_id

      WHERE hashtags.tag = ?

      ORDER BY posts.created_at DESC
    `).all(...(currentUserId ? [currentUserId, currentUserId, tag] : [tag]));

    const result = posts.map((p) => ({
      ...p,
      is_following: currentUserId ? Boolean(p.is_following) : false,
    }));

    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Hashtag search failed"
    });
  }
});

module.exports = router;