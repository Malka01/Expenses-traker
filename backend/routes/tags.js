const { db } = require("../lib/db");

// GET : /api/tags
const getTags = async (req, res) => {
  try {
    const tags = await db.tags.findMany();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST : /api/tags
const addTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }
    if (!color) {
      return res.status(400).json({ message: "Tag color is required" });
    }
    const tag = await db.tags.create({
      data: {
        name,
        color,
      },
    });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT : /api/tags/:id
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const idInt = parseInt(id);

    if (isNaN(idInt)) {
      return res.status(400).json({ message: "Invalid tag ID" });
    }

    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }
    if (!color) {
      return res.status(400).json({ message: "Tag color is required" });
    }
    const tag = await db.tags.update({
      where: {
        id: idInt,
      },
      data: {
        name,
        color,
      },
    });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE : /api/tags/:id
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const idInt = parseInt(id);
    if (isNaN(idInt)) {
      return res.status(400).json({ message: "Invalid tag ID" });
    }
    await db.tags.delete({
      where: { id: idInt },
    });
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTags,
  addTag,
  updateTag,
  deleteTag,
};
