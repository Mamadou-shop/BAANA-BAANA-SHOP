const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripePayment({ order, user }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "xof",
          product_data: { name: `Commande Doux-Doux #${order._id}` },
          unit_amount: Math.round(order.totalAmount * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.PAYMENT_SUCCESS_URL}?orderId=${order._id}`,
    cancel_url: process.env.PAYMENT_CANCEL_URL
  });
  return { providerPaymentId: session.id, paymentUrl: session.url };
}

async function createWavePayment({ order, user }) {
  return { 
    providerPaymentId: `wave_${Date.now()}`, 
    paymentUrl: `${process.env.PAYMENT_SUCCESS_URL}?orderId=${order._id}` 
  };
}

async function createOrangeMoneyPayment({ order, user, phone }) {
  return { 
    providerPaymentId: `om_${Date.now()}`, 
    paymentUrl: `${process.env.PAYMENT_SUCCESS_URL}?orderId=${order._id}` 
  };
}

module.exports = { createStripePayment, createWavePayment, createOrangeMoneyPayment };