import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  FileText,
  LayoutGrid,
  Folder,
  User,
  HelpCircle,
  Headphones,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Loan Application",
    icon: FileText,
    to: "/",
    matchPaths: ["/", "/resume", "/success"],
  },
  {
    label: "Dashboard",
    icon: LayoutGrid,
    to: "/dashboard",
    matchPaths: ["/dashboard"],
  },
  {
    label: "My Applications",
    icon: Folder,
    to: null,
  },
  {
    label: "Documents",
    icon: Folder,
    to: null,
  },
  {
    label: "Profile",
    icon: User,
    to: null,
  },
  {
    label: "Support",
    icon: HelpCircle,
    to: null,
  },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();

  return (
    <aside className="sidebar-surface">
      {/* ================================================
          BRAND
          ================================================ */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Building2 size={23} strokeWidth={2.2} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[20px] font-bold leading-none text-slate-900">
            LoanFlow
          </p>

          <p className="mt-2 truncate text-sm text-slate-500">
            Smart Loan Platform
          </p>
        </div>
      </div>

      {/* ================================================
          NAVIGATION
          ================================================ */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.matchPaths?.includes(location.pathname) ?? false;

          if (!item.to) {
            return (
              <div
                key={item.label}
                className="sidebar-nav-item sidebar-nav-disabled"
                aria-disabled="true"
              >
                <span className="sidebar-nav-icon">
                  <Icon size={19} />
                </span>

                <span>{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={`sidebar-nav-item ${
                isActive ? "sidebar-nav-active" : ""
              }`}
            >
              <span className="sidebar-nav-icon">
                <Icon size={19} />
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ================================================
          SUPPORT CARD
          ================================================ */}
      <div className="sidebar-support-card">
        <div className="sidebar-support-icon">
          <Headphones size={21} />
        </div>

        <p className="mt-4 text-[17px] font-semibold text-slate-900">
          Need Help?
        </p>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          Our support team is here to help you.
        </p>

        <a
          href="mailto:hellojavaos@gmail.com"
          className="sidebar-support-button"
        >
          <Headphones size={17} />
          Contact Support
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;