
import { Copy, ExternalLink } from "lucide-react";

function UrlTable({ urls }) {

    // Copy a short URL to clipboard
    const copyUrl = async (shortUrl) => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            alert("Short URL copied!");
        } catch (error) {
            console.error("Copy failed:", error);
            alert("Unable to copy URL");
        }
    };

    // Format the creation date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="table-wrapper">

            <table className="url-table">

                <thead>
                    <tr>
                        <th>Original URL</th>
                        <th>Short URL</th>
                        <th>Clicks</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {urls.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="empty-table">
                                No URLs created yet.
                            </td>
                        </tr>
                    ) : (

                        urls.map((url) => (
                            <tr key={url.id}>

                                <td className="original-url">
                                    {url.original_url}
                                </td>

                                <td>
                                    <a
                                        href={url.short_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="short-url"
                                    >
                                        {url.short_url}
                                    </a>
                                </td>

                                <td>
                                    <span className="click-count">
                                        {url.click_count}
                                    </span>
                                </td>

                                <td>
                                    {formatDate(url.created_at)}
                                </td>

                                <td>
                                    <button
                                        className="copy-button"
                                        onClick={() =>
                                            copyUrl(url.short_url)
                                        }
                                        aria-label="Copy short URL"
                                    >
                                        <Copy size={16} />
                                    </button>

                                    <a
                                        href={url.short_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="external-link"
                                        aria-label="Open short URL"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </td>

                            </tr>
                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default UrlTable;
