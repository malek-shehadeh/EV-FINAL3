////
const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/ContactController");

// Route for submitting a contact message
router.post("/", createContact); // Updated to use "/" path

module.exports = router;
