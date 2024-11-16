//////////////////

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const protect = require("../middlewares/auth");

// Basic cart operations
router.post("/add", protect, cartController.addToCart);
router.put("/update", protect, cartController.updateCartItem);
router.delete("/remove/:itemId", protect, cartController.removeFromCart);
router.get("/", protect, cartController.getCart);

// Clear cart route
router.delete("/clear", protect, cartController.clearCart);

module.exports = router;
