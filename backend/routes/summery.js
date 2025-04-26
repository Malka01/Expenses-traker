const { db } = require("../lib/db");

// GET : /api/summery
const getSummery = async (req, res) => {
  try {
    const summery = await db.currentData.findFirst();
    if (!summery) {
      // add summery
      const newSummery = await db.currentData.create({ data: {} });
      return res.status(200).json(newSummery);
    }
    return res.status(200).json(summery);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSummery,
};
