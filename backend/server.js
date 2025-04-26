const express = require("express");
const cors = require("cors");
const { getSummery } = require("./routes/summery");
const { changeCurrency } = require("./routes/currency");
const { getTags, addTag, updateTag, deleteTag } = require("./routes/tags");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/api/summary", getSummery);
app.post("/api/currency", changeCurrency);
app.get("/api/tags", getTags);
app.post("/api/tags", addTag);
app.put("/api/tags/:id", updateTag);
app.delete("/api/tags/:id", deleteTag);
app.get("/api/transactions", getTransactions);
app.post("/api/transactions", addTransaction);
app.put("/api/transactions/:id", updateTransaction);
app.delete("/api/transactions/:id", deleteTransaction);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
