const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Product = require("../models/product");
const { protect, vendeurOnly } = require("../middleware/authMiddleware");
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Inscription en tant que vendeur
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, nomBoutique, description } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "vendeur",
      boutique: { nom: nomBoutique, description: description || "" }
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, boutique: user.boutique }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Voir son propre profil vendeur
router.get("/me", protect, vendeurOnly, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    boutique: req.user.boutique
  });
});

// Lister ses propres produits
router.get("/products", protect, vendeurOnly, async (req, res) => {
  try {
    const produits = await Product.find({ vendor: req.user._id });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits" });
  }
});

// Ajouter un nouveau produit
router.post("/products", protect, vendeurOnly, async (req, res) => {
  try {
    const { name, description, category, price, image, stock } = req.body;
    const produit = await Product.create({
      name,
      description,
      category,
      price,
      image,
      stock,
      vendor: req.user._id,
      statut: "en_attente"
    });
    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du produit", error: error.message });
  }
});

// Modifier un de ses produits
router.put("/products/:id", protect, vendeurOnly, async (req, res) => {
  try {
    const produit = await Product.findOne({ _id: req.params.id, vendor: req.user._id });
    if (!produit) return res.status(404).json({ message: "Produit introuvable ou non autorisé" });

    Object.assign(produit, req.body);
    produit.statut = "en_attente"; // toute modification repasse en attente de validation
    await produit.save();
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
});

// Supprimer un de ses produits
router.delete("/products/:id", protect, vendeurOnly, async (req, res) => {
  try {
    const produit = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user._id });
    if (!produit) return res.status(404).json({ message: "Produit introuvable ou non autorisé" });
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
});

module.exports = router;