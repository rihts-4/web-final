const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Get all notifications for the logged-in user
 */
router.get("/", auth, (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT
        notifications.id,
        notifications.type,
        notifications.post_id,
        notifications.is_read,
        notifications.created_at,

        users.id AS actor_id,
        users.username,
        users.display_name,

        posts.content AS post_content

      FROM notifications

      JOIN users
        ON users.id = notifications.actor_id

      LEFT JOIN posts
        ON posts.id = notifications.post_id

      WHERE notifications.recipient_id = ?

      ORDER BY notifications.created_at DESC
    `).all(req.user.id);

    res.json(notifications);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to retrieve notifications"
    });
  }
});

/**
 * Mark a notification as read
 */
router.patch("/:id/read", auth, (req, res) => {
  try {

    const notifId = Number(req.params.id);
    if (!Number.isInteger(notifId) || notifId < 1) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const result = db.prepare(`
      UPDATE notifications
      SET is_read = 1
      WHERE id = ?
      AND recipient_id = ?
    `).run(notifId, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Notification not found"
      });
    }

    res.json({
      message: "Notification marked as read"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update notification"
    });
  }
});

module.exports = router;