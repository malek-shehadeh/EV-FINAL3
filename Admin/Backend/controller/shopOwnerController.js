// const ShopOwner = require("../models/shopOwneradmin");

// exports.getAllShopOwners = async (req, res) => {
//   try {
//     const shopOwners = await ShopOwner.find({}, "-password");
//     res.json(shopOwners);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching shop owners", error: error.message });
//   }
// };

// exports.updateShopOwnerStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isApproved } = req.body;

//     const updatedShopOwner = await ShopOwner.findByIdAndUpdate(
//       id,
//       { isApproved },
//       { new: true, select: "-password" }
//     );

//     if (!updatedShopOwner) {
//       return res.status(404).json({ message: "Shop owner not found" });
//     }

//     res.json(updatedShopOwner);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: "Error updating shop owner status",
//         error: error.message,
//       });
//   }
// };
/////////////////////////

const ShopOwner = require("../models/shopOwneradmin");
const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "malek.shehadeh96@gmail.com",
    pass: "axuq oqty wwsh lvwc",
  },
});

// Email template function
const createEmailContent = (ownerName, isApproved) => {
  const status = isApproved ? "Activated" : "Deactivated";
  const message = isApproved
    ? "Your account has been activated. You can now access all shop features."
    : "Your account has been deactivated. Please contact support if you have any questions.";

  return {
    subject: `Shop Account ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${ownerName},</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #666;">
          This is to inform you that your shop account has been <strong>${status}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #666;">
          ${message}
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #999;">
            Best regards,<br>
            Your Shop Management Team
          </p>
        </div>
      </div>
    `,
  };
};

// Send email function
const sendStatusEmail = async (ownerEmail, ownerName, isApproved) => {
  const { subject, html } = createEmailContent(ownerName, isApproved);

  try {
    await transporter.sendMail({
      from: '"Shop Management" <malek.shehadeh96@gmail.com>',
      to: ownerEmail,
      subject,
      html,
    });
    console.log(`Status email sent to ${ownerEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // We'll log the error but not throw it, as we don't want to break the status update
    // if email sending fails
  }
};

exports.updateShopOwnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const updatedShopOwner = await ShopOwner.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true, select: "-password" }
    );

    if (!updatedShopOwner) {
      return res.status(404).json({ message: "Shop owner not found" });
    }

    // Send email notification
    await sendStatusEmail(
      updatedShopOwner.email,
      updatedShopOwner.ownerName,
      isApproved
    );

    res.json(updatedShopOwner);
  } catch (error) {
    res.status(500).json({
      message: "Error updating shop owner status",
      error: error.message,
    });
  }
};
////
exports.getAllShopOwners = async (req, res) => {
  try {
    const shopOwners = await ShopOwner.find()
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 });

    res.status(200).json(shopOwners);
  } catch (error) {
    console.error("Error in getAllShopOwners:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shop owners",
      error: error.message,
    });
  }
};

// exports.getAllShopOwners = async (req, res) => {
//   try {
//     const shopOwners = await ShopOwner.find({}, "-password");
//     res.json(shopOwners);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching shop owners", error: error.message });
//   }
// };
