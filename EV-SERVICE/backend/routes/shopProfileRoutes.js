///////////////////////////////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const shopOwnerController = require("../controllers/shopProfileController");
const upload = require("../middlewares/uploadConfig"); // Multer upload
const protect = require("../middlewares/auth"); // Middleware للتحقق من المستخدم

// GET route for profile
router.get("/profile", protect, shopOwnerController.getProfile);

// PUT route for updating profile (including profile picture upload)
router.put(
  "/profile",
  protect,
  upload.single("profilePicture"), // Handling profile picture upload
  shopOwnerController.updateProfile
);

module.exports = router;
