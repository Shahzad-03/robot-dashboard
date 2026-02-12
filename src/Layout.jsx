import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function NavItem({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-medium transition",
          "hover:bg-slate-800/60 hover:text-white",
          isActive
            ? "bg-slate-800 text-white shadow-sm"
            : "text-slate-300",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    // Dark theme base (whole site)
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
                src="/logo.png"
                alt="Maze Robot Logo"
                className="h-9 w-9 rounded-xl border border-slate-700 bg-slate-900 p-1 object-contain shadow-sm"
            />

            <div>
              <div className="text-sm font-semibold leading-tight text-white">
                Maze Robot Dashboard
              </div>
              <div className="text-xs text-slate-400">
                Runs • Teams • Logbook • Gallery
              </div>
            </div>
          </div>

          {/* Right side: auth info */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-medium text-slate-200">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    Team {user.teamId || "—"}
                    {user.carModel ? ` • ${user.carModel}` : ""}
                  </div>
                </div>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    [
                      "rounded-lg border px-3 py-2 text-sm font-medium transition",
                      "border-slate-800 bg-slate-900/40 hover:bg-slate-900",
                      isActive ? "text-white" : "text-slate-200",
                    ].join(" ")
                  }
                >
                  Profile
                </NavLink>

                <button
                  onClick={signOut}
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/15"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/signin"
                  className={({ isActive }) =>
                    [
                      "rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive ? "text-white" : "text-slate-200",
                      "hover:text-white",
                    ].join(" ")
                  }
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Navigation row */}
        <div className="mx-auto max-w-6xl px-4 pb-3 md:px-8">
          <nav className="flex flex-wrap items-center gap-2">
            <NavItem to="/" end label="Dashboard" />
            <NavItem to="/runs" label="Runs" />
            <NavItem to="/mazes" label="Mazes" />
            <NavItem to="/teams" label="Teams" />
            <NavItem to="/logbook" label="Logbook" />
            <NavItem to="/gallery" label="Gallery" />
            <NavItem to="/status" label="Robot Status" />
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        {/* content surface */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 shadow-sm md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6">
        <div className="mx-auto max-w-6xl px-4 text-xs text-slate-500 md:px-8">
          Internal project site • Maze-solving robot dashboard • Deployed frontend + API
        </div>
      </footer>
    </div>
  );
}
