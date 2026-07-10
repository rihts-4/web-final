const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Get a user's public profile
 */
router.get("/:username", auth.optionalAuth, (req, res) => {
  try {

    const currentUserId = req.user?.id;

    const user = db.prepare(`
      SELECT
        id,
        username,
        display_name,
        created_at
      FROM users
      WHERE username = ?
    `).get(req.params.username);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const posts = db.prepare(`
      SELECT
        posts.id,
        posts.user_id,
        posts.content,
        posts.image_path,
        posts.created_at,

        (
          SELECT COUNT(*)
          FROM likes
          WHERE likes.post_id = posts.id
        ) AS like_count,

        ${currentUserId ? `(
          SELECT COUNT(*)
          FROM likes
          WHERE likes.post_id = posts.id AND likes.user_id = ?
        ) AS liked` : "0 AS liked"},

        ${currentUserId ? `(
          SELECT COUNT(*)
          FROM follows
          WHERE follower_id = ? AND following_id = posts.user_id
        ) AS is_following` : "0 AS is_following"}

      FROM posts

      WHERE posts.user_id = ?

      ORDER BY posts.created_at DESC
    `).all(...(currentUserId ? [currentUserId, currentUserId, user.id] : [user.id]));

    const isFollowing = currentUserId
      ? db.prepare(`
          SELECT 1 FROM follows
          WHERE follower_id = ? AND following_id = ?
        `).get(currentUserId, user.id) ? true : false
      : false;

    const followers = db.prepare(`
      SELECT COUNT(*) AS count
      FROM follows
      WHERE following_id = ?
    `).get(user.id).count;

    const following = db.prepare(`
      SELECT COUNT(*) AS count
      FROM follows
      WHERE follower_id = ?
    `).get(user.id).count;

    res.json({
      user,
      followers,
      following,
      isFollowing,
      posts
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to retrieve profile"
    });
  }
});

/**
 * Follow another user
 */
router.post("/:id/follow", auth, (req, res) => {
  try {

    const followingId = Number(req.params.id);

    if (!Number.isInteger(followingId) || followingId < 1) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (followingId === req.user.id) {
      return res.status(400).json({
        error: "You cannot follow yourself"
      });
    }

    const exists = db.prepare(`
      SELECT id
      FROM users
      WHERE id = ?
    `).get(followingId);

    if (!exists) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    db.prepare(`
      INSERT OR IGNORE INTO follows
      (follower_id, following_id)
      VALUES (?, ?)
    `).run(req.user.id, followingId);

    db.prepare(`
      INSERT INTO notifications
      (recipient_id, actor_id, type)
      VALUES (?, ?, ?)
    `).run(followingId, req.user.id, "follow");

    res.json({
      message: "User followed"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to follow user"
    });
  }
});

/**
 * Unfollow a user
 */
router.delete("/:id/follow", auth, (req, res) => {
  try {

    const followingId = Number(req.params.id);

    if (!Number.isInteger(followingId) || followingId < 1) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    db.prepare(`
      DELETE FROM follows
      WHERE follower_id = ?
      AND following_id = ?
    `).run(req.user.id, followingId);

    res.json({
      message: "User unfollowed"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to unfollow user"
    });
  }
});

module.exports = router;