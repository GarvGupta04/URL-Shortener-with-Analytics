
import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import {
    Link2,
    MousePointerClick,
    CalendarDays,
    RefreshCw
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

import api from "../services/api";


function Analytics() {

    const [searchParams] = useSearchParams();

    const [urls, setUrls] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    const [analytics, setAnalytics] = useState(null);

    const [loadingUrls, setLoadingUrls] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    const [error, setError] = useState("");


    // Fetch all URLs for the dropdown
    useEffect(() => {

        const fetchUrls = async () => {

            try {
                setLoadingUrls(true);

                const response = await api.get("/api/urls");

                const urlList = response.data.data;

                setUrls(urlList);

                // Select URL from query parameter, if provided
                const requestedId = searchParams.get("urlId");

                const requestedUrl = urlList.find(
                    (url) => String(url.id) === requestedId
                );

                if (requestedUrl) {
                    setSelectedId(String(requestedUrl.id));
                } else if (urlList.length > 0) {
                    setSelectedId(String(urlList[0].id));
                }

            } catch (error) {
                console.error("Fetch URLs Error:", error);
                setError("Unable to fetch URLs.");

            } finally {
                setLoadingUrls(false);
            }
        };

        fetchUrls();

    }, [searchParams]);


    // Fetch analytics whenever selected URL changes
    useEffect(() => {

        if (!selectedId) {
            setAnalytics(null);
            return;
        }

        const fetchAnalytics = async () => {

            try {
                setLoadingAnalytics(true);
                setError("");

                const response = await api.get(
                    `/api/analytics/urls/${selectedId}`
                );

                setAnalytics(response.data.data);

            } catch (error) {
                console.error("URL Analytics Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to fetch URL analytics."
                );

                setAnalytics(null);

            } finally {
                setLoadingAnalytics(false);
            }
        };

        fetchAnalytics();

    }, [selectedId]);


    // Format date for chart
    const formatDate = (date) => {

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );
    };


    if (loadingUrls) {
        return (
            <div className="page-message">
                <RefreshCw size={22} className="loading-icon" />
                <p>Loading URLs...</p>
            </div>
        );
    }


    return (
        <div className="management-page">

            <div className="page-heading">

                <div>
                    <h1>URL Analytics</h1>

                    <p>
                        Monitor the performance of your shortened links.
                    </p>
                </div>

            </div>


            {urls.length === 0 ? (

                <section className="panel page-message">
                    <Link2 size={30} />
                    <h3>No URLs available</h3>
                    <p>Create a shortened URL to view its analytics.</p>
                </section>

            ) : (

                <>

                    {/* URL selector */}
                    <section className="panel analytics-selector">

                        <label htmlFor="urlSelect">
                            Select a URL to view its analytics
                        </label>

                        <select
                            id="urlSelect"
                            value={selectedId}
                            onChange={(e) =>
                                setSelectedId(e.target.value)
                            }
                        >

                            {urls.map((url) => (

                                <option
                                    key={url.id}
                                    value={String(url.id)}
                                >
                                    {url.short_url}
                                </option>

                            ))}

                        </select>

                    </section>


                    {loadingAnalytics ? (

                        <div className="page-message">
                            <RefreshCw
                                size={22}
                                className="loading-icon"
                            />
                            <p>Loading analytics...</p>
                        </div>

                    ) : error ? (

                        <div className="page-message error-text">
                            {error}
                        </div>

                    ) : analytics && (

                        <>

                            {/* Selected URL details */}
                            <section className="panel selected-url-panel">

                                <div className="panel-heading">
                                    <div>
                                        <h2>Selected URL</h2>
                                        <p>Link details and performance</p>
                                    </div>
                                </div>

                                <div className="selected-url-details">

                                    <div>
                                        <span>ORIGINAL URL</span>

                                        <p>
                                            {analytics.url.original_url}
                                        </p>
                                    </div>

                                    <div>
                                        <span>SHORT URL</span>

                                        <a
                                            href={analytics.url.short_url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {analytics.url.short_url}
                                        </a>
                                    </div>

                                </div>

                            </section>


                            {/* Analytics statistics */}
                            <div className="stats-grid analytics-stats">

                                <div className="stat-card">

                                    <div className="stat-card-top">

                                        <div>
                                            <p className="stat-title">
                                                Total Clicks
                                            </p>

                                            <h2 className="stat-value">
                                                {analytics.url.click_count}
                                            </h2>
                                        </div>

                                        <div className="stat-icon">
                                            <MousePointerClick size={22} />
                                        </div>

                                    </div>

                                    <p className="stat-description">
                                        Total visits to this URL
                                    </p>

                                </div>


                                <div className="stat-card">

                                    <div className="stat-card-top">

                                        <div>
                                            <p className="stat-title">
                                                Active Click Days
                                            </p>

                                            <h2 className="stat-value">
                                                {analytics.dailyClicks.length}
                                            </h2>
                                        </div>

                                        <div className="stat-icon">
                                            <CalendarDays size={22} />
                                        </div>

                                    </div>

                                    <p className="stat-description">
                                        Days with at least one click
                                    </p>

                                </div>

                            </div>


                            {/* Individual click chart */}
                            <section className="panel individual-chart-panel">

                                <div className="panel-heading">

                                    <div>
                                        <h2>Daily Click Activity</h2>

                                        <p>
                                            Click history for the selected URL
                                        </p>
                                    </div>

                                </div>


                                {analytics.dailyClicks.length === 0 ? (

                                    <div className="chart-empty">
                                        No clicks recorded for this URL yet.
                                    </div>

                                ) : (

                                    <div className="chart-container">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <AreaChart
                                                data={analytics.dailyClicks}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#e5e7eb"
                                                />

                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={formatDate}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fill: "#6b7280",
                                                        fontSize: 12
                                                    }}
                                                />

                                                <YAxis
                                                    allowDecimals={false}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fill: "#6b7280",
                                                        fontSize: 12
                                                    }}
                                                />

                                                <Tooltip
                                                    labelFormatter={formatDate}
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="clicks"
                                                    stroke="#16a34a"
                                                    strokeWidth={2.5}
                                                    fill="#dcfce7"
                                                />

                                            </AreaChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </section>

                        </>

                    )}

                </>

            )}

        </div>
    );
}

export default Analytics;
