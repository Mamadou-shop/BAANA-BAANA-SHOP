const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin", "vendeur", "livreur"], default: "client" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },

    // Infos spécifiques aux vendeurs
    boutique: {
      nom: { type: String, default: "" },
      description: { type: String, default: "" },
      statut: { type: String, enum: ["en_attente", "validé", "refusé"], default: "en_attente" }
    },

    // Infos spécifiques aux livreurs
    disponible: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);