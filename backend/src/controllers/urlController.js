const db = require("../config/db");
const crypto = require("crypto");

// Generate a random 8-character short code
function generateShortCode() {
    return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

// Create a shortened URL
const createShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        // Check whether URL is provided
        if (!originalUrl || typeof originalUrl !== "string") {
            return res.status(400).json({
                status: "error",
                message: "Please provide a URL"
            });
        }

        const trimmedUrl = originalUrl.trim();

        // Validate URL
        let parsedUrl;

        try {
            parsedUrl = new URL(trimmedUrl);
        } catch {
            return res.status(400).json({
                status: "error",
                message: "Invalid URL format"
            });
        }

        // Allow only HTTP and HTTPS URLs
        if (
            !["http:", "https:"].includes(parsedUrl.protocol) ||
            !parsedUrl.hostname
        ) {
            return res.status(400).json({
                status: "error",
                message: "Only HTTP and HTTPS URLs are allowed"
            });
        }

        // Generate unique short code
        const baseUrl = (
            process.env.SHORT_URL_BASE || "http://localhost:5001"
        ).replace(/\/+$/, "");

        for (let attempt = 0; attempt < 5; attempt++) {

            const shortCode = generateShortCode();
            const shortUrl = `${baseUrl}/${shortCode}`;

            try {
                // Save URL in MySQL
                const [result] = await db.execute(
                    `INSERT INTO urls
                    (original_url, short_code, short_url)
                    VALUES (?, ?, ?)`,
                    [trimmedUrl, shortCode, shortUrl]
                );

                // Get the inserted record
                const [rows] = await db.execute(
                    `SELECT id, original_url, short_code,
                    short_url, click_count, created_at
                    FROM urls WHERE id = ?`,
                    [result.insertId]
                );

                return res.status(201).json({
                    status: "success",
                    message: "Short URL created successfully",
                    data: rows[0]
                });

            } catch (error) {

                // Retry if generated short code already exists
                if (error.code === "ER_DUP_ENTRY") {
                    continue;
                }

                throw error;
            }
        }

        return res.status(500).json({
            status: "error",
            message: "Unable to generate a unique short code. Please try again."
        });

    } catch (error) {
        console.error("URL creation error:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

module.exports = {
    createShortUrl
};