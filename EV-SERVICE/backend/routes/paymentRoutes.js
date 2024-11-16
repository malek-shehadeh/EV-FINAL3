////////////////////////////////

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const protect = require("../middlewares/auth");

// Create payment intent
router.post(
  "/create-payment-intent",
  protect,
  paymentController.createPaymentIntent
);

// Confirm payment
router.post("/confirm-payment", protect, paymentController.confirmPayment);

// Get payment details (for invoice)
router.get(
  "/payments/:paymentId",
  protect,
  paymentController.getPaymentDetails
);

// In your payment routes
router.get("/payments/:paymentId", protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("user", "username email")
      .populate({
        path: "cartItems.productId",
        select: "name price images",
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        deliveryInfo: payment.deliveryInfo,
        cartItems: payment.cartItems,
        createdAt: payment.createdAt,
        // Add other necessary fields
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment details",
    });
  }
});

module.exports = router;
