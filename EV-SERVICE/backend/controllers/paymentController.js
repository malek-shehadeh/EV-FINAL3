
//////////////////////////////////////////////////////////////

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Cart = require("../models/cart");
const Product = require("../models/Product");

// Helper function to generate order number
const generateOrderNumber = () => {
  const prefix = "EV";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${timestamp}${random}`;
};

const paymentController = {
  createPaymentIntent: async (req, res) => {
    try {
      const { amount, deliveryInfo, cartItems } = req.body;

      // Check if amount is valid
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Process cart items to include shop owner information and images
      const processedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findById(item.productId).populate(
            "shopOwner",
            "ownerName _id shopLocation shopPhone"
          );

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          return {
            ...item,
            images: product.images,
            shopOwner: {
              id: product.shopOwner._id,
              name: product.shopOwner.ownerName,
              location: product.shopOwner.shopLocation,
              phone: product.shopOwner.shopPhone,
            },
          };
        })
      );

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId: req.user._id.toString(),
        },
      });

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Create payment record
      const payment = new Payment({
        user: req.user._id,
        stripePaymentIntentId: paymentIntent.id,
        orderNumber,
        amount: amount,
        deliveryFee: 10.0,
        deliveryInfo,
        cartItems: processedCartItems,
        status: "pending",
      });

      await payment.save();

      res.json({
        clientSecret: paymentIntent.client_secret,
        payment: {
          id: payment._id,
          orderNumber: payment.orderNumber,
          amount: payment.amount,
          deliveryFee: payment.deliveryFee,
          status: payment.status,
          cartItems: processedCartItems,
        },
      });
    } catch (error) {
      console.error("Payment Intent Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  confirmPayment: async (req, res) => {
    try {
      const { paymentIntentId } = req.body;

      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntentId,
        status: "pending",
      });

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found or already processed",
        });
      }

      // Update payment status
      payment.status = "completed";
      await payment.save();

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );

      res.json({
        success: true,
        payment: {
          id: payment._id,
          orderNumber: payment.orderNumber,
          status: payment.status,
          amount: payment.amount,
        },
      });
    } catch (error) {
      console.error("Confirmation Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getPaymentDetails: async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.paymentId)
        .populate({
          path: "cartItems.productId",
          select: "name price images",
        })
        .populate({
          path: "user",
          select: "username email",
        })
        .populate({
          path: "cartItems.shopOwner.id",
          select: "ownerName shopLocation shopPhone",
        });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Check if the payment belongs to the requesting user
      if (payment.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Not authorized to view this payment",
        });
      }

      const formattedPayment = {
        id: payment._id,
        orderNumber: payment.orderNumber,
        amount: payment.amount,
        deliveryFee: payment.deliveryFee,
        subtotal: payment.amount - payment.deliveryFee,
        status: payment.status,
        deliveryInfo: payment.deliveryInfo,
        cartItems: payment.cartItems.map((item) => ({
          name: item.productId.name,
          quantity: item.quantity,
          price: item.price,
          images: item.productId.images,
          shopOwner: {
            name: item.shopOwner.name,
            location: item.shopOwner.location,
            phone: item.shopOwner.phone,
          },
          subtotal: item.price * item.quantity,
        })),
        createdAt: payment.createdAt,
        customerInfo: {
          name: payment.user.username,
          email: payment.user.email,
        },
        paymentMethod: "Credit Card",
        stripePaymentIntentId: payment.stripePaymentIntentId,
      };

      res.json({
        success: true,
        payment: formattedPayment,
      });
    } catch (error) {
      console.error("Get Payment Details Error:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paymentController;
