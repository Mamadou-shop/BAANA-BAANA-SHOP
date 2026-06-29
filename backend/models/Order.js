const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: { type: String, enum: ["en_attente", "payé", "échoué"], default: "en_attente" },
    orderStatus: { type: String, enum: ["préparation", "expédiée", "livrée"], default: "préparation" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);