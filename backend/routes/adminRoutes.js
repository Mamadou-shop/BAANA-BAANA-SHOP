const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/user");
const Product = require("../models/product");
const router = express.Router();

router.get("/dashboard", protect, adminOnly, async (req, res) => {
  res.json({ message: "Bienvenue sur le tableau de bord d'administration Doux-Doux" });
});

// --- Modération des vendeurs ---

// Liste des boutiques en attente de validation
router.get("/vendeurs/en-attente", protect, adminOnly, async (req, res) => {
  try {
    const vendeurs = await User.find({ role: "vendeur", "boutique.statut": "en_attente" }).select("-password");
    res.json(vendeurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des vendeurs" });
  }
});

// Valider une boutique
router.put("/vendeurs/:id/valider", protect, adminOnly, async (req, res) => {
  try {
    const vendeur = await User.findOneAndUpdate(
      { _id: req.params.id, role: "vendeur" },
      { "boutique.statut": "validé" },
      { new: true }
    ).select("-password");
    if (!vendeur) return res.status(404).json({ message: "Vendeur introuvable" });
    res.json(vendeur);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la validation" });
  }
});

// Refuser une boutique
router.put("/vendeurs/:id/refuser", protect, adminOnly, async (req, res) => {
  try {
    const vendeur = await User.findOneAndUpdate(
      { _id: req.params.id, role: "vendeur" },
      { "boutique.statut": "refusé" },
      { new: true }
    ).select("-password");
    if (!vendeur) return res.status(404).json({ message: "Vendeur introuvable" });
    res.json(vendeur);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du refus" });
  }
});

// --- Modération des produits vendeurs ---

// Liste des produits en attente de validation
router.get("/produits/en-attente", protect, adminOnly, async (req, res) => {
  try {
    const produits = await Product.find({ statut: "en_attente" }).populate("vendor", "name boutique.nom");
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits" });
  }
});

// Valider un produit
router.put("/produits/:id/valider", protect, adminOnly, async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(req.params.id, { statut: "validé" }, { new: true });
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la validation" });
  }
});

// Refuser un produit
router.put("/produits/:id/refuser", protect, adminOnly, async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(req.params.id, { statut: "refusé" }, { new: true });
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du refus" });
  }
});




// Statistiques globales des ventes
router.get("/stats/ventes", protect, adminOnly, async (req, res) => {
  try {
    const [totaux] = await Order.aggregate([
      { $match: { paymentStatus: "payé" } },
      { $group: { _id: null, totalCommandes: { $sum: 1 }, chiffreAffaires: { $sum: "$totalAmount" } } }
    ]);

    const topProduits = await Order.aggregate([
      { $match: { paymentStatus: "payé" } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", quantiteVendue: { $sum: "$items.quantity" }, chiffreAffaires: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } },
      { $sort: { quantiteVendue: -1 } },
      { $limit: 10 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "produit" } },
      { $unwind: "$produit" }
    ]);

    const parVendeur = await Order.aggregate([
      { $match: { paymentStatus: "payé" } },
      { $unwind: "$items" },
      { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "produitInfo" } },
      { $unwind: "$produitInfo" },
      { $group: { _id: "$produitInfo.vendor", chiffreAffaires: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }, quantiteVendue: { $sum: "$items.quantity" } } },
      { $sort: { chiffreAffaires: -1 } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "vendeurInfo" } }
    ]);

    res.json({
      totalCommandes: totaux?.totalCommandes || 0,
      chiffreAffaires: totaux?.chiffreAffaires || 0,
      topProduits,
      parVendeur
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul des statistiques", error: error.message });
  }
});


module.exports = router;