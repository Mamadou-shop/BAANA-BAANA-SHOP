const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    image: { type: String, required: false },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // null = produit officiel Doux-Doux, sinon référence au vendeur
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    statut: { type: String, enum: ["en_attente", "validé", "refusé"], default: "validé" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);