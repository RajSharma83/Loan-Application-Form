import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";

function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* =====================================================
          ONE MAIN OUTER CONTAINER
          ===================================================== */}
      <div className="app-outer-container">
        {/* ===================================================
            FIXED SIDEBAR
            =================================================== */}
        <aside className="app-sidebar hidden lg:block">
          <Sidebar />
        </aside>

        {/* ===================================================
            MOBILE SIDEBAR
            =================================================== */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div
              className="glass-panel absolute inset-0 rounded-none border-0"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />

            <div className="relative h-full w-72 max-w-[85vw] p-4">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="skeu-control absolute -right-1 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                <X size={18} />
              </button>

              <Sidebar
                onNavigate={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        {/* ===================================================
            FIXED APPLICATION AREA
            =================================================== */}
        <main className="app-main">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className="skeu-btn mb-4 flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 lg:hidden"
          >
            <Menu size={18} />
            Menu
          </button>

          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;