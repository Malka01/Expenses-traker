/*import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();*/
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "spendwise",
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL DB");
  }
});

// Route: Add a new transaction (updated to match frontend)
app.post("/api/addtransactions", (req, res) => {
  const { type, description, amount, tag } = req.body;

  if (!type || !description || !amount || !tag) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO addtransactions (type, description, amount, tag) VALUES (?, ?, ?, ?)";
  db.query(query, [type, description, amount, tag], (err, result) => {
    if (err) {
      console.error("Failed to insert transaction:", err);
      return res.status(500).json({ message: "Internal server error." });
    }

    res.status(201).json({ message: "Transaction added successfully!" });
  });
});

// Route: Income and expense summary
app.get("/api/summary", (req, res) => {
  const incomeQuery = "SELECT SUM(amount) AS income FROM addtransactions WHERE type='income'";
  const expenseQuery = "SELECT SUM(amount) AS expenses FROM addtransactions WHERE type='expense'";

  db.query(incomeQuery, (err, incomeResult) => {
    if (err) return res.status(500).json(err);
    db.query(expenseQuery, (err, expenseResult) => {
      if (err) return res.status(500).json(err);
      res.json({
        income: incomeResult[0].income || 0,
        expenses: expenseResult[0].expenses || 0,
      });
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
