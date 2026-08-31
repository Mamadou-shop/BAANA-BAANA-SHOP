const express = require("express");
const Order = require("../models/Order");
const { protect, livreurOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Se déclarer disponible / indisponible
router.put("/disponibilite", protect, livreurOnly, async (req, res) => {
  try {
    req.user.disponible = req.body.disponible;
    await req.user.save();
    res.json({ disponible: req.user.disponible });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité" });
  }
});

// Voir les commandes disponibles à prendre en charge (expédiées, sans livreur assigné)
router.get("/commandes-disponibles", protect, livreurOnly, async (req, res) => {
  try {
    if (!req.user.disponible) {
      return res.status(403).json({ message: "Passe-toi disponible pour voir les commandes" });
    }
    const commandes = await Order.find({ orderStatus: "expédiée", livreur: null }).populate("user", "name phone address");
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
  }
});

// Accepter une commande (s'assigner comme livreur)
router.put("/commandes/:id/accepter", protect, livreurOnly, async (req, res) => {
  try {
    const commande = await Order.findOne({ _id: req.params.id, livreur: null });
    if (!commande) return res.status(404).json({ message: "Commande introuvable ou déjà prise en charge" });

    commande.livreur = req.user._id;
    commande.orderStatus = "en_livraison";
    await commande.save();
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'acceptation de la commande" });
  }
});

// Voir ses propres commandes en cours de livraison
router.get("/mes-commandes", protect, livreurOnly, async (req, res) => {
  try {
    const commandes = await Order.find({ livreur: req.user._id }).populate("user", "name phone address");
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de tes commandes" });
  }
});

// Marquer une commande comme livrée
router.put("/commandes/:id/livrer", protect, livreurOnly, async (req, res) => {
  try {
    const commande = await Order.findOne({ _id: req.params.id, livreur: req.user._id });
    if (!commande) return res.status(404).json({ message: "Commande introuvable ou non assignée à toi" });

    commande.orderStatus = "livrée";
    await commande.save();
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
});

module.exports = router;