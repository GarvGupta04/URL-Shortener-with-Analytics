import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import {
    Search,
    Copy,
    ExternalLink,
    Trash2,
    BarChart3,
    RefreshCw
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function MyUrls() {

    const [urls, setUrls] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // Fetch URLs from backend
    const fetchUrls = async (searchText = "") => {

        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/urls", {
                params: {
                    search: searchText
                }
            });

            setUrls(response.data.data);

        } catch (error) {
            console.error("Fetch URLs Error:", error);
            setError("Unable to load URLs.");

        } finally {
            setLoading(false);
        }
    };


    // Load URLs when page opens
    useEffect(() => {
        fetchUrls();
    }, []);


    // Search URLs
    const handleSearch = (value) => {
        setSearch(value);
        fetchUrls(value);
    };


    // Copy short URL
    const copyUrl = async (url) => {
        try {
            await navigator.clipboard.writeText(url);

            toast.success("URL copied successfully!");
        } catch (error) {
            toast.error("Unable to copy URL");
        }
    };


    // Delete a URL
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this URL?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/api/urls/${id}`);

            toast.success("URL deleted successfully!");

            fetchUrls(search);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete URL"
            );
        }
    };


    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };


    return (
        <div className="management-page">

            <div className="page-heading">

                <div>
                    <h1>My URLs</h1>

                    <p>
                        View, search and manage all your shortened links.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={() => fetchUrls(search)}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* Search bar */}
            <div className="url-search">

                <Search size={19} />

                <input
                    type="text"
                    placeholder="Search original URL or short URL..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />

            </div>


            {/* URL table */}
            <section className="panel urls-panel">

                <div className="panel-heading">

                    <div>
                        <h2>All Shortened URLs</h2>

                        <p>
                            {urls.length} URLs found
                        </p>
                    </div>

                </div>


                {loading ? (

                    <div className="page-message">
                        <RefreshCw size={22} className="loading-icon" />
                        <p>Loading URLs...</p>
                    </div>

                ) : error ? (

                    <div className="page-message error-text">
                        {error}
                    </div>

                ) : urls.length === 0 ? (

                    <div className="page-message">
                        <p>No URLs found.</p>
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="url-table">

                            <thead>
                                <tr>
                                    <th>Original URL</th>
                                    <th>Short URL</th>
                                    <th>Clicks</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {urls.map((url) => (

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

                                        <td className="action-cell">

                                            <button
                                                className="table-action"
                                                title="Copy URL"
                                                onClick={() =>
                                                    copyUrl(url.short_url)
                                                }
                                            >
                                                <Copy size={16} />
                                            </button>

                                            <a
                                                href={url.short_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="table-action"
                                                title="Open URL"
                                            >
                                                <ExternalLink size={16} />
                                            </a>

                                            <button
                                                className="table-action analytics-action"
                                                title="View analytics"
                                                onClick={() =>
                                                    navigate(
                                                        `/analytics?urlId=${url.id}`
                                                    )
                                                }
                                            >
                                                <BarChart3 size={16} />
                                            </button>

                                            <button
                                                className="table-action delete-action"
                                                title="Delete URL"
                                                onClick={() =>
                                                    handleDelete(url.id)
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
}

export default MyUrls;
