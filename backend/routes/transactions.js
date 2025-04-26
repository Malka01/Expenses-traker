const { db } = require("../lib/db");

// GET : /api/transactions
const getTransactions = async (req, res) => {
  try {
    // query parameters
    const { filter, amount, type, page, search } = req.query;
    const pageInt = parseInt(page) || 1;
    const amountInt = parseInt(amount) || 0;
    const pageSize = 5;
    const skip = (pageInt - 1) * pageSize;
    const take = pageSize;

    // define where clause based on filter
    let whereClause = {};
    if (filter) {
      if (filter === "less") {
        whereClause = {
          amount: {
            lte: amountInt,
          },
        };
      } else if (filter === "greater") {
        whereClause = {
          amount: {
            gte: amountInt,
          },
        };
      }
    }
    if (type === "income" || type === "expenses") {
      whereClause.type = type;
    }
    if (search) {
      whereClause.description = {
        contains: search,
      };
    }

    // filter : grater or less
    const transactions = await db.transactions.findMany({
      where: whereClause,
      include: {
        tags: true,
      },
      skip: skip,
      take: take,
    });

    // get total pages
    const totalTransactions = await db.transactions.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalTransactions / pageSize);
    const currentPage = pageInt > totalPages ? totalPages : pageInt;
    res.status(200).json({
      transactions,
      totalPages,
      currentPage,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST : /api/transactions
const addTransaction = async (req, res) => {
  try {
    const { amount, type, description, tags } = req.body;
    if (!amount) {
      return res
        .status(400)
        .json({ message: "Transaction amount is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "Transaction type is required" });
    }
    if (!description) {
      return res
        .status(400)
        .json({ message: "Transaction description is required" });
    }
    if (!tags || tags.length === 0) {
      return res.status(400).json({ message: "Transaction tags is required" });
    }

    const transaction = await db.transactions.create({
      data: {
        amount,
        type,
        description,
        tags: {
          connect: tags.map((tag) => ({ id: tag })),
        },
      },
    });

    // get first current data
    const currentData = await db.currentData.findFirst();

    // increase the balance
    if (type === "income") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            increment: amount,
          },
          income: {
            increment: amount,
          },
        },
      });
    } else if (type === "expenses") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            decrement: amount,
          },
          expenses: {
            increment: amount,
          },
        },
      });
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT : /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const idInt = parseInt(id);

    if (isNaN(idInt)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const { amount, type, description, tags } = req.body;
    if (!amount) {
      return res
        .status(400)
        .json({ message: "Transaction amount is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "Transaction type is required" });
    }
    if (!description) {
      return res
        .status(400)
        .json({ message: "Transaction description is required" });
    }
    if (!tags || tags.length === 0) {
      return res.status(400).json({ message: "Transaction tags is required" });
    }

    // get the current transaction
    const currentTransaction = await db.transactions.findUnique({
      where: {
        id: idInt,
      },
    });

    const transaction = await db.transactions.update({
      where: {
        id: idInt,
      },
      data: {
        amount,
        type,
        description,
        tags: {
          set: tags.map((tag) => ({ id: tag })),
        },
      },
    });

    // get first current data
    const currentData = await db.currentData.findFirst();

    // update the balance
    if (type === "income" && currentTransaction.type === "expenses") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            increment: amount + currentTransaction.amount,
          },
          income: {
            increment: amount,
          },
          expenses: {
            decrement: currentTransaction.amount,
          },
        },
      });
    } else if (type === "expenses" && currentTransaction.type === "income") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            decrement: amount + currentTransaction.amount,
          },
          expenses: {
            increment: amount,
          },
          income: {
            decrement: currentTransaction.amount,
          },
        },
      });
    } else if (type === "income" && currentTransaction.type === "income") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            increment: amount - currentTransaction.amount,
          },
          income: {
            increment: amount - currentTransaction.amount,
          },
        },
      });
    } else if (type === "expenses" && currentTransaction.type === "expenses") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            decrement: amount - currentTransaction.amount,
          },
          expenses: {
            increment: amount - currentTransaction.amount,
          },
        },
      });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE : /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const idInt = parseInt(id);
    if (isNaN(idInt)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    // get the first current data
    const currentData = await db.currentData.findFirst();

    // get the current transaction
    const currentTransaction = await db.transactions.findUnique({
      where: {
        id: idInt,
      },
    });

    // check if the transaction exists
    if (!currentTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await db.transactions.delete({
      where: {
        id: idInt,
      },
    });

    if (currentTransaction.type === "income") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            decrement: currentTransaction.amount,
          },
          income: {
            decrement: currentTransaction.amount,
          },
        },
      });
    } else if (currentTransaction.type === "expenses") {
      await db.currentData.update({
        where: {
          id: currentData.id,
        },
        data: {
          currentBalance: {
            increment: currentTransaction.amount,
          },
          expenses: {
            decrement: currentTransaction.amount,
          },
        },
      });
    }

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
