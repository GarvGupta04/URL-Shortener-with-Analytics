
const express = require("express");

const router = express.Router();

const {
    getAllUrls,
    deleteUrl
} = require("../controllers/managementController");

// GET all URLs
router.get("/", getAllUrls);

// DELETE a URL using its ID
router.delete("/:id", deleteUrl);

module.exports = router;
