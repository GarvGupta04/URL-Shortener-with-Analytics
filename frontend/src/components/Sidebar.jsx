
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Link as LinkIcon,
    Plus,
    ChartNoAxesCombined,
    Link2
} from "lucide-react";

function Sidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: LayoutDashboard
        },
        {
            name: "My URLs",
            path: "/urls",
            icon: LinkIcon
        },
        {
            name: "Create URL",
            path: "/create",
            icon: Plus
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: ChartNoAxesCombined
        }
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">
                <div className="brand-icon">
                    <Link2 size={22} />
                </div>

                <div>
                    <h2>Shortly</h2>
                    <span>URL Manager</span>
                </div>
            </div>

            <div className="sidebar-section">
                <p className="sidebar-label">MENU</p>

                <nav className="sidebar-nav">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-item active"
                                        : "nav-item"
                                }
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}

                </nav>
            </div>

            <div className="sidebar-footer">
                <p>URL Shortener</p>
                <span>Analytics Dashboard</span>
            </div>

        </aside>
    );
}

export default Sidebar;
