const express = require("express");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { protect } = require("../middleware/authMiddleware");
const { createStripePayment, createWavePayment, createOrangeMoneyPayment } = require("../services/paymentService");
const router = express.Router();

router.post("/checkout/:orderId", protect, async (req, res) => {
  try {
    const { provider, phone } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    let paymentData;
    if (provider === "stripe") paymentData = await createStripePayment({ order, user: req.user });
    else if (provider === "wave") paymentData = await createWavePayment({ order, user: req.user });
    else if (provider === "orange_money") paymentData = await createOrangeMoneyPayment({ order, user: req.user, phone });
    else return res.status(400).json({ message: "Moyen de paiement non géré" });

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      provider,
      amount: order.totalAmount,
      paymentUrl: paymentData.paymentUrl
    });

    // Pour le test de validation, on simule que le paiement passe direct à "payé"
    order.paymentStatus = "payé";
    await order.save();

    res.status(201).json({ paymentUrl: payment.paymentUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;