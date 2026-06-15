import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All expense routes are protected
router.use(protect);

// GET /api/expenses  — list with optional filters
router.get("/", async (req, res) => {
  try {
    const { category, dateFrom, dateTo, search, page = 1, limit = 200 } = req.query;

    const query = { user: req.user._id };

    if (category) query.category = category;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(query),
    ]);

    res.json({ expenses, total, page: Number(page) });
  } catch (err) {
    console.error("Get expenses error:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// POST /api/expenses  — create
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "Title, amount, category and date are required" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      category,
      date,
      notes: notes || "",
    });

    res.status(201).json({ message: "Expense created", expense });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Create expense error:", err);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

// PUT /api/expenses/:id  — update
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const { title, amount, category, date, notes } = req.body;
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = Number(amount);
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();
    res.json({ message: "Expense updated", expense });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Update expense error:", err);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// DELETE /api/expenses/:id  — delete
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete expense error:", err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

// GET /api/expenses/stats  — summary statistics
router.get("/stats", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const query = { user: req.user._id };
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }

    const stats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const overall = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avg: { $avg: "$amount" },
        },
      },
    ]);

    res.json({
      byCategory: stats,
      overall: overall[0] || { total: 0, count: 0, avg: 0 },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
