import mongoose from "mongoose";

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Health",
  "Entertainment",
  "Shopping",
  "Education",
  "Other",
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
    },
    date: {
      type: String, // stored as "YYYY-MM-DD" string to match frontend format
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// Compound index for efficient user + date queries
expenseSchema.index({ user: 1, date: -1 });

export default mongoose.model("Expense", expenseSchema);
