
////////////////////////////////////////////////////

// productController.js
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Add product
/////////////////

exports.addProduct = [
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (req.userType !== "shopOwner") {
        return res.status(403).json({ 
          message: "Only shop owners can add products" 
        });
      }

      const { name, description, price, category } = req.body;
      const images = req.files.map((file) => file.path);

      const product = new Product({
        name,
        description,
        price: parseFloat(price),
        category,
        images,
        isApproved: true,
        shopOwner: req.user._id,
        shopOwnerName: req.user.ownerName  // استخدام ownerName من req.user
      });

      const savedProduct = await product.save();
      
      res.status(201).json({ 
        message: "Product added successfully", 
        product: savedProduct 
      });
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ 
        message: "Error adding product", 
        error: error.message 
      });
    }
  },
];
/////////////
// Get products for the logged-in shop owner
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopOwner: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopOwner: req.user._id,
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found or you're not authorized to delete it",
      });
    }
    // Delete associated images
    for (const imagePath of product.images) {
      await fs
        .unlink(imagePath)
        .catch((err) => console.error("Error deleting file:", err));
    }
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Update product
exports.updateProduct = [
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      let updateData = { name, description, price, category };

      const product = await Product.findOne({
        _id: req.params.id,
        shopOwner: req.user._id,
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found or you're not authorized to update it",
        });
      }

      // Handle existing images
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : req.body.existingImages
        ? [req.body.existingImages]
        : [];

      // Delete removed images
      for (const imagePath of product.images) {
        if (!existingImages.includes(path.basename(imagePath))) {
          await fs
            .unlink(imagePath)
            .catch((err) => console.error("Error deleting file:", err));
        }
      }

      updateData.images = existingImages.map(
        (filename) => `uploads/${filename}`
      );

      // Add new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => file.path);
        updateData.images = [...updateData.images, ...newImages];
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, shopOwner: req.user._id },
        updateData,
        { new: true }
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  },
];
