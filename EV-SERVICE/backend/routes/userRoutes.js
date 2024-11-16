/////
const express = require("express");
const userController = require("../controllers/usercontoller"); // تأكد من الاسم الصحيح للملف
const protect = require("../middlewares/auth"); // تأكد من اسم الملف
const upload = require("../middlewares/uploadConfig");
const router = express.Router();

// Endpoint to get user profile
router.get("/profile", protect, userController.getProfile);

// Endpoint to update user profile with image upload
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  userController.updateProfile
);
///////////////////
router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    res.json(req.user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});
///////

router.get("/orders", protect, userController.getUserOrders);

////
module.exports = router;
//////////////////////
