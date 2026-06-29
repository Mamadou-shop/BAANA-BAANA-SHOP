const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/dashboard", protect, adminOnly, async (req, res) => {
  res.json({ message: "Bienvenue sur le tableau de bord d'administration Doux-Doux" });
});

module.exports = router;