///////////////

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const protect = require("../middlewares/auth");

// POST /api/products
router.post("/", protect, productController.addProduct);

// GET /api/products
router.get("/", protect, productController.getAllProducts);

// DELETE /api/products/:id
router.delete("/:id", protect, productController.deleteProduct);

// PUT /api/products/:id
router.put("/:id", protect, productController.updateProduct);

module.exports = router;
