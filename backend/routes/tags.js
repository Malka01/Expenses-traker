const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all tags
router.get("/", (req, res) => {
  db.query("SELECT * FROM tags", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new tag
router.post("/", (req, res) => {
  const { name, color } = req.body;
  const sql = "INSERT INTO tags (name, color) VALUES (?, ?)";
  db.query(sql, [name, color], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, color });
  });
});

// Update a tag
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  const sql = "UPDATE tags SET name = ?, color = ? WHERE id = ?";
  db.query(sql, [name, color, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name, color });
  });
});

// Delete a tag
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tags WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tag deleted", id });
  });
});

module.exports = router;
