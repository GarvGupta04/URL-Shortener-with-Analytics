
import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";

function Navbar() {
    const location = useLocation();

    const pageTitles = {
        "/": "Dashboard",
        "/urls": "My URLs",
        "/create": "Create URL",
        "/analytics": "Analytics"
    };

    const pageTitle = pageTitles[location.pathname] || "Dashboard";

    return (
        <header className="navbar">

            <div>
                <p className="navbar-heading">{pageTitle}</p>
                <p className="navbar-subheading">
                    Manage and track your shortened links
                </p>
            </div>

            <div className="navbar-actions">
                <button className="icon-button" aria-label="Search">
                    <Search size={19} />
                </button>

                <button className="icon-button" aria-label="Notifications">
                    <Bell size={19} />
                </button>

                <div className="user-avatar">
                    GG
                </div>
            </div>

        </header>
    );
}

export default Navbar;
