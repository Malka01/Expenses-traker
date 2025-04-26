const { db } = require("../lib/db");

// POST : /api/currency
const changeCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    if (!currency) {
      return res.status(400).json({ message: "Currency is required" });
    }
    // get first currentData
    const currentData = await db.currentData.findFirst();
    if (!currentData) {
      return res.status(404).json({ message: "No current data found" });
    }

    // update currentData with new currency
    const newCurrency = await db.currentData.update({
      where: { id: currentData.id },
      data: {
        currency,
      },
    });
    res.status(200).json(newCurrency);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  changeCurrency,
};
