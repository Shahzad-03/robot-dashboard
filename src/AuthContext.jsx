import { createContext, useContext, useEffect, useState } from "react";

// Simple team directory – fill this with your real team data
const TEAM_DIRECTORY = {
  T01: {
    id: "T01",
    name: "Team 1",
    members: ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"],
    contactEmail: "team1@example.com",
  },
  // Add more teams if you want:
  // T02: { id: "T02", name: "Team 2", members: [...], contactEmail: "..." }
};

// OPTIONAL: simple list of demo users for sign-in
// (Later this could come from your database)
const DEMO_USERS = [
  {
    email: "team1@demo.com",
    password: "pass123",
    name: "Team 1 User",
    teamId: "T01",
    carModel: "Prototype Car",
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Try to load user from localStorage on first render
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mazeUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Whenever user changes, save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("mazeUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("mazeUser");
    }
  }, [user]);

  // Fake sign-in that checks against DEMO_USERS
  function signIn(email, password) {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      // throw an error we can catch in the SignIn page
      throw new Error("Invalid email or password");
    }
    // We don't store password in user state
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
  }

  // Sign-up: accept values from the form and treat them as a new user
  function signUp(name, email, password, teamId, carModel) {
    const safeTeamId = teamId || "T01";
    const newUser = { name, email, teamId: safeTeamId, carModel: carModel || "Unknown" };
    setUser(newUser);

    // (Optional) in the future, send this to a backend / DB
  }

  function signOut() {
    setUser(null);
  }

  // Helper to get full team info for current user
  function getCurrentTeam() {
    if (!user || !user.teamId) return null;
    return TEAM_DIRECTORY[user.teamId] || null;
  }

  const value = { user, signIn, signUp, signOut, getCurrentTeam, TEAM_DIRECTORY };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
