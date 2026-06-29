const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Votre panier est vide" });

    let totalAmount = 0;
    const items = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return { product: item.product._id, quantity: item.quantity, price: item.product.price };
    });

    const order = await Order.create({ user: req.user._id, items, totalAmount, shippingAddress });
    cart.items = []; // Vider le panier après commande
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;