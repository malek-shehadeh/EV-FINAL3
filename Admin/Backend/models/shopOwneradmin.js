// const mongoose = require("mongoose");

// const shopOwnerSchema = new mongoose.Schema({
//   ownerName: { type: String, required: true },
//   shopPhone: { type: String, required: true },
//   shopLocation: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   licenseCertificate: { type: String, required: true }, // This will store the file path
//   isApproved: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("ShopOwner", shopOwnerSchema);
//////////

///////////////////////////////
const mongoose = require("mongoose");

const maintenanceShopSchema = new mongoose.Schema(
  {
    // Shop Owner fields
    ownerName: {
      type: String,
      required: true,
    },
    shopPhone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    licenseCertificate: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    // Maintenance Center fields
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    website: {
      type: String,
    },
    services: [String],
    specializations: [String],
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    openingHours: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Set up the geospatial index
maintenanceShopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("ShopOwner", maintenanceShopSchema);
