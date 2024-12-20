////////////////in the top 100%////

// Payment Model
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    deliveryInfo: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        quantity: Number,
        price: Number,
        images: [String], // Added field to store product images
        shopOwner: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShopOwner",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
