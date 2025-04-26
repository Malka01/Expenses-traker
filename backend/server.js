const express = require("express");
const cors = require("cors");
const { getSummery } = require("./routes/summery");
const { changeCurrency } = require("./routes/currency");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/api/summary", getSummery);
app.post("/api/currency", changeCurrency);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
