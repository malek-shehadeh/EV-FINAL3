/////
const Contact = require("../models/contact");

// Add contact message to the database
exports.createContact = async (req, res) => {
  try {
    const { email, name, national_id, subject, message, captchaValue } =
      req.body;

    // Verify reCAPTCHA value if needed
    if (!captchaValue) {
      return res.status(400).json({ message: "Captcha is required" });
    }

    // Create and save new contact message
    const newContact = new Contact({
      email,
      name,
      national_id,
      subject,
      message,
      captchaValue,
    });

    await newContact.save();

    res.status(201).json({ message: "Contact message saved successfully" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ message: "Server error" });
  }
};
