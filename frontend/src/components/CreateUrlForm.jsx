
import toast from "react-hot-toast";
import { useState } from "react";

import {
    Link2,
    Copy,
    Check,
    ArrowRight
} from "lucide-react";

import api from "../services/api";

function CreateUrlForm() {

    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);


    // Create a shortened URL
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setShortUrl("");
        setCopied(false);

        // Validate empty input
        if (!originalUrl.trim()) {
            setError("Please enter a URL.");
            toast.error("Please enter a URL.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/api/urls", {
                originalUrl: originalUrl.trim()
            });

            // Store the generated short URL
            setShortUrl(response.data.data.short_url);

            // Show success notification
            toast.success("Short URL created successfully!");

            // Clear input
            setOriginalUrl("");

        } catch (error) {
            console.error("Create URL Error:", error);

            const errorMessage =
                error.response?.data?.message ||
                "Unable to create short URL.";

            setError(errorMessage);
            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };


    // Copy generated short URL
    const copyUrl = async () => {

        try {
            await navigator.clipboard.writeText(shortUrl);

            setCopied(true);

            toast.success("Short URL copied!");

        } catch (error) {
            console.error("Copy Error:", error);

            setError("Unable to copy short URL.");
            toast.error("Unable to copy URL");
        }
    };


    return (
        <div className="create-form-container">

            <div className="create-form-icon">
                <Link2 size={28} />
            </div>

            <h2>Shorten your long URL</h2>

            <p className="create-form-description">
                Paste your original link below and generate a shorter,
                shareable URL instantly.
            </p>


            <form onSubmit={handleSubmit}>

                <label htmlFor="originalUrl">
                    Enter your original URL
                </label>

                <input
                    id="originalUrl"
                    type="url"
                    placeholder="https://example.com/your-long-url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                />

                <button
                    type="submit"
                    className="primary-button create-submit"
                    disabled={loading}
                >
                    {loading ? (
                        "Generating..."
                    ) : (
                        <>
                            Shorten URL
                            <ArrowRight size={17} />
                        </>
                    )}
                </button>

            </form>


            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}


            {shortUrl && (

                <div className="generated-result">

                    <div className="success-heading">
                        <Check size={19} />
                        URL created successfully!
                    </div>

                    <p>Your shortened URL</p>

                    <div className="generated-url-box">

                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {shortUrl}
                        </a>

                        <button
                            onClick={copyUrl}
                            type="button"
                            className="copy-generated-button"
                        >
                            {copied ? (
                                <Check size={18} />
                            ) : (
                                <Copy size={18} />
                            )}

                            {copied ? "Copied" : "Copy"}
                        </button>

                    </div>

                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="open-generated-link"
                    >
                        Open shortened URL
                    </a>

                </div>

            )}

        </div>
    );
}

export default CreateUrlForm;
