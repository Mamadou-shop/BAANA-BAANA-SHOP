const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["stripe", "wave", "orange_money"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "XOF" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    paymentUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);