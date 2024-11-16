/////////////////////////////////////////////////////////////

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ShopOwner = require("../models/shopOwner");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // استخراج الرمز المميز من الهيدر
      token = req.headers.authorization.split(" ")[1];
      console.log("Received token:", token);

      // فك تشفير الرمز المميز
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // البحث عن المستخدم في كلا النموذجين
      let user = await User.findById(decoded.id).select("-password");
      let shopOwner = await ShopOwner.findById(decoded.id).select("-password");

      if (user) {
        req.user = user;
        req.userType = "user";
      } else if (shopOwner) {
        req.user = shopOwner;
        req.userType = "shopOwner";
      } else {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Error in protect middleware:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;
