const express = require("express");

const router = express.Router();

const {
    createShortUrl
} = require("../controllers/urlController");

const {
    redirectUrl
} = require("../controllers/redirectController");

// Create short URL
router.post("/", createShortUrl);

// Redirect using short code
router.get("/:shortCode", redirectUrl);

module.exports = router;