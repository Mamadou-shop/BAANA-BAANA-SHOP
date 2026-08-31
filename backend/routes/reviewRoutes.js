const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Voir les avis d'un produit (public)
router.get("/:productId", async (req, res) => {
  try {
    const avis = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(avis);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des avis" });
  }
});

// Poster un avis (uniquement si le client a acheté et reçu ce produit)
router.post("/:productId", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const aAchete = await Order.findOne({
      user: req.user._id,
      orderStatus: "livrée",
      "items.product": productId
    });
    if (!aAchete) {
      return res.status(403).json({ message: "Tu dois avoir reçu ce produit pour laisser un avis" });
    }

    const dejaNote = await Review.findOne({ product: productId, user: req.user._id });
    if (dejaNote) {
      return res.status(400).json({ message: "Tu as déjà laissé un avis pour ce produit" });
    }

    const avis = await Review.create({ product: productId, user: req.user._id, rating, comment });

    // Recalcule la note moyenne du produit
    const tousLesAvis = await Review.find({ product: productId });
    const moyenne = tousLesAvis.reduce((total, a) => total + a.rating, 0) / tousLesAvis.length;
    await Product.findByIdAndUpdate(productId, { rating: moyenne });

    res.status(201).json(avis);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'avis", error: error.message });
  }
});

module.exports = router;