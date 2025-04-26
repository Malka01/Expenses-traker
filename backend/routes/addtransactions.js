const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/addtransactions
router.post('/', (req, res) => {
  const { type, description, amount, tag } = req.body;

  if (!type || !description || !amount || !tag) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO addtransactions (type, description, amount, tag) VALUES (?, ?, ?, ?)';
  db.query(sql, [type, description, amount, tag], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    res.status(201).json({ message: 'Transaction added successfully', transactionId: result.insertId });
  });
});

module.exports = router;
