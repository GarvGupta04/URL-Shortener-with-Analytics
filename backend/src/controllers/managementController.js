
const db = require("../config/db");

// Get all shortened URLs
const getAllUrls = async (req, res) => {
    try {
        const search = req.query.search || "";

        // Fetch URLs matching the search text
        const [urls] = await db.query(
            `SELECT *
             FROM urls
             WHERE original_url LIKE ?
                OR short_code LIKE ?
                OR short_url LIKE ?
             ORDER BY created_at DESC`,
            [`%${search}%`, `%${search}%`, `%${search}%`]
        );

        res.status(200).json({
            status: "success",
            total: urls.length,
            data: urls
        });

    } catch (error) {
        console.error("Get URLs Error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch URLs"
        });
    }
};


// Delete a shortened URL
const deleteUrl = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Check whether the ID is valid
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid URL ID"
            });
        }

        // Delete the URL from the database
        const [result] = await db.query(
            "DELETE FROM urls WHERE id = ?",
            [id]
        );

        // Check whether the URL existed
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "URL not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "URL deleted successfully"
        });

    } catch (error) {
        console.error("Delete URL Error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to delete URL"
        });
    }
};


module.exports = {
    getAllUrls,
    deleteUrl
};
