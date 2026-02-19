import { createContext, useContext, useEffect, useState } from "react";

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
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mazeUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("mazeUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("mazeUser");
    }
  }, [user]);

  function signIn(email, password) {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid email or password");
    }
    const { password: _unusedPassword, ...safeUser } = found;
    setUser(safeUser);
  }

  function signUp(name, email, password, teamId, carModel) {
    const safeTeamId = teamId || "T01";
    const newUser = { name, email, teamId: safeTeamId, carModel: carModel || "Unknown" };
    setUser(newUser);
  }

  function signOut() {
    setUser(null);
  }

  const value = { user, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
