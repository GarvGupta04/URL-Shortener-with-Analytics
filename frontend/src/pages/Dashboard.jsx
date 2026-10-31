import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import {
    ArrowUpRight,
    MousePointerClick,
    Link2,
    TrendingUp,
    ExternalLink,
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

import StatCard from "../components/StatCard";
import UrlTable from "../components/UrlTable";


function Dashboard() {

    const [overview, setOverview] = useState(null);
    const [dailyClicks, setDailyClicks] = useState([]);
    const [recentUrls, setRecentUrls] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch dashboard data from backend
    const fetchDashboardData = async () => {

        try {
            setLoading(true);
            setError("");

            const [
                overviewResponse,
                clicksResponse,
                urlsResponse
            ] = await Promise.all([
                api.get("/api/analytics/overview"),
                api.get("/api/analytics/daily-clicks"),
                api.get("/api/urls")
            ]);

            setOverview(overviewResponse.data.data);

            setDailyClicks(clicksResponse.data.data);

            // Show the five most recent URLs
            setRecentUrls(
                urlsResponse.data.data.slice(0, 5)
            );

        } catch (error) {
            console.error("Dashboard Error:", error);

            setError(
                "Unable to load dashboard data. Please check your backend connection."
            );

        } finally {
            setLoading(false);
        }
    };


    // Fetch data when dashboard loads
    useEffect(() => {
        fetchDashboardData();
    }, []);


    // Format dates for the chart
    const formatChartDate = (date) => {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );
    };


    if (loading) {
        return (
            <div className="loading-state">
                <RefreshCw className="loading-icon" size={28} />
                <p>Loading dashboard...</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="error-state">
                <p>{error}</p>

                <button
                    className="primary-button"
                    onClick={fetchDashboardData}
                >
                    Try Again
                </button>
            </div>
        );
    }


    const popularUrl = overview?.mostPopularUrl;


    return (
        <div className="dashboard">

            {/* Page heading */}
            <div className="page-heading">

                <div>
                    <h1>Dashboard Overview</h1>

                    <p>
                        Here's what's happening with your shortened URLs.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchDashboardData}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* Statistics cards */}
            <div className="stats-grid">

                <StatCard
                    title="Total URLs"
                    value={overview.totalUrls}
                    icon={Link2}
                    description="Total shortened links created"
                />

                <StatCard
                    title="Total Clicks"
                    value={overview.totalClicks}
                    icon={MousePointerClick}
                    description="Total visits across all links"
                />

                <StatCard
                    title="Average Clicks"
                    value={overview.averageClicks}
                    icon={TrendingUp}
                    description="Average clicks per URL"
                />

            </div>


            {/* Chart and popular URL */}
            <div className="dashboard-middle">

                {/* Click activity chart */}
                <section className="panel chart-panel">

                    <div className="panel-heading">

                        <div>
                            <h2>Click Activity</h2>

                            <p>
                                Daily clicks over the last 7 days
                            </p>
                        </div>

                        <div className="chart-legend">
                            <span className="legend-dot"></span>
                            Clicks
                        </div>

                    </div>

                    {dailyClicks.length === 0 ? (

                        <div className="chart-empty">
                            No click activity recorded yet.
                        </div>

                    ) : (

                        <div className="chart-container">

                            <ResponsiveContainer width="100%" height="100%">

                                <AreaChart data={dailyClicks}>

                                    <defs>
                                        <linearGradient
                                            id="clickGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#16a34a"
                                                stopOpacity={0.25}
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#16a34a"
                                                stopOpacity={0.02}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e5e7eb"
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatChartDate}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                    />

                                    <Tooltip
                                        labelFormatter={formatChartDate}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="clicks"
                                        stroke="#16a34a"
                                        strokeWidth={2.5}
                                        fill="url(#clickGradient)"
                                        activeDot={{ r: 5 }}
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </section>


                {/* Most popular URL */}
                <section className="panel popular-panel">

                    <div className="panel-heading">
                        <div>
                            <h2>Most Popular URL</h2>

                            <p>
                                Your best performing link
                            </p>
                        </div>

                        <div className="popular-icon">
                            <TrendingUp size={20} />
                        </div>
                    </div>


                    {popularUrl ? (

                        <div className="popular-content">

                            <div className="popular-clicks">
                                <h3>{popularUrl.click_count}</h3>
                                <span>Total clicks</span>
                            </div>

                            <div className="popular-url-details">

                                <p className="popular-label">
                                    ORIGINAL URL
                                </p>

                                <p className="popular-original">
                                    {popularUrl.original_url}
                                </p>

                                <p className="popular-label">
                                    SHORT URL
                                </p>

                                <a
                                    href={popularUrl.short_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="popular-short"
                                >
                                    {popularUrl.short_url}
                                    <ExternalLink size={14} />
                                </a>

                            </div>

                        </div>

                    ) : (

                        <div className="chart-empty">
                            Create your first URL to see your popular link.
                        </div>

                    )}

                </section>

            </div>


            {/* Recent URLs */}
            <section className="panel recent-panel">

                <div className="panel-heading">

                    <div>
                        <h2>Recent URLs</h2>

                        <p>
                            Your latest shortened links
                        </p>
                    </div>

                    <Link to="/urls" className="view-all-link">
                        View All
                        <ArrowUpRight size={17} />
                    </Link>

                </div>

                <UrlTable urls={recentUrls} />

            </section>

        </div>
    );
}

export default Dashboard;
