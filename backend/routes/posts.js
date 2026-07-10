const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

/*
 * Extract hashtags from a post and save them
 */
function saveHashtags(postId, content) {
  const hashtags = [
    ...new Set(
      (content.match(/#[a-zA-Z0-9_]+/g) || []).map((tag) =>
        tag.substring(1).toLowerCase()
      )
    ),
  ];

  for (const tag of hashtags) {
    db.prepare(
      "INSERT OR IGNORE INTO hashtags (tag) VALUES (?)"
    ).run(tag);

    const hashtag = db
      .prepare("SELECT id FROM hashtags WHERE tag = ?")
      .get(tag);

    db.prepare(
      "INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)"
    ).run(postId, hashtag.id);
  }
}

/*
 * Create post
 */
router.post("/", auth, upload.single("image"), (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        error: "Post cannot be empty",
      });
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length > 280) {
      return res.status(400).json({
        error: "Post exceeds 280 characters",
      });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const result = db
      .prepare(
        `
      INSERT INTO posts
      (user_id, content, image_path)
      VALUES (?, ?, ?)
    `
      )
      .run(req.user.id, trimmedContent, imagePath);

    saveHashtags(result.lastInsertRowid, trimmedContent);

    res.status(201).json({
      message: "Post created successfully",
      postId: result.lastInsertRowid,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create post",
    });
  }
});

/*
 * Delete post
 */
router.delete("/:id", auth, (req, res) => {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId < 1) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = db
      .prepare(
        `
      SELECT *
      FROM posts
      WHERE id = ?
    `
      )
      .get(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({
        error: "You can only delete your own posts",
      });
    }

    db.prepare(
      "DELETE FROM posts WHERE id = ?"
    ).run(postId);

    res.json({
      message: "Post deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete post",
    });
  }
});

/*
 * Like post
 */
router.post("/:id/like", auth, (req, res) => {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId < 1) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = db
      .prepare(
        `
      SELECT *
      FROM posts
      WHERE id = ?
    `
      )
      .get(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    db.prepare(
      `
      INSERT OR IGNORE INTO likes
      (user_id, post_id)
      VALUES (?, ?)
    `
    ).run(req.user.id, postId);

    if (post.user_id !== req.user.id) {
      db.prepare(
        `
        INSERT INTO notifications
        (recipient_id, actor_id, type, post_id)
        VALUES (?, ?, ?, ?)
      `
      ).run(post.user_id, req.user.id, "like", postId);
    }

    res.json({
      message: "Post liked",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to like post",
    });
  }
});

/*
 * Unlike post
 */
router.delete("/:id/like", auth, (req, res) => {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId < 1) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    db.prepare(
      `
      DELETE FROM likes
      WHERE user_id = ?
      AND post_id = ?
    `
    ).run(req.user.id, postId);

    res.json({
      message: "Post unliked",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to unlike post",
    });
  }
});

module.exports = router;