import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo" />
        <div className="app-title">Maze Robot Website</div>

        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>

          <NavLink to="/runs" className={({ isActive }) => (isActive ? "active" : "")}>
            Runs
          </NavLink>

          {/* ✅ NEW DATABASE-BACKED PAGES */}
          <NavLink to="/mazes" className={({ isActive }) => (isActive ? "active" : "")}>
            Mazes
          </NavLink>

          <NavLink to="/algorithms" className={({ isActive }) => (isActive ? "active" : "")}>
            Algorithms
          </NavLink>
          
          <NavLink to="/teams" className={({ isActive }) => (isActive ? "active" : "")}>
            Teams
          </NavLink>

          <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>
            Gallery
          </NavLink>

          <NavLink to="/status" className={({ isActive }) => (isActive ? "active" : "")}>
            Robot Status
          </NavLink>

          <NavLink to="/logbook" className={({ isActive }) => (isActive ? "active" : "")}>
            Logbook
          </NavLink>

          {user ? (
            <>
              <span className="app-nav-user">Hello, {user.name}</span>

              <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                Profile
              </NavLink>

              <button className="app-btn-outline" onClick={signOut}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={({ isActive }) => (isActive ? "active" : "")}>
                Sign In
              </NavLink>

              <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        Internal project site • Maze-solving robot dashboard
      </footer>
    </div>
  );
}