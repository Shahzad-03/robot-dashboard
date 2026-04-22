import { createContext, useContext, useEffect, useState } from "react";

const CURRENT_USER_KEY = "mazeUser";
const STORED_USERS_KEY = "mazeUsers";
const TEAM_PROFILES_KEY = "mazeTeamProfiles";

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

function readJson(key, fallbackValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(CURRENT_USER_KEY, null));
  const [storedUsers, setStoredUsers] = useState(() => readJson(STORED_USERS_KEY, []));
  const [teamProfiles, setTeamProfiles] = useState(() => readJson(TEAM_PROFILES_KEY, {}));

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORED_USERS_KEY, JSON.stringify(storedUsers));
  }, [storedUsers]);

  useEffect(() => {
    localStorage.setItem(TEAM_PROFILES_KEY, JSON.stringify(teamProfiles));
  }, [teamProfiles]);

  function signIn(email, password) {
    const wantedEmail = normaliseEmail(email);
    const allUsers = [...DEMO_USERS, ...storedUsers];

    const found = allUsers.find(
      (account) =>
        normaliseEmail(account.email) === wantedEmail && account.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password");
    }

    const { password: _unusedPassword, ...safeUser } = found;
    setUser(safeUser);
  }

  function signUp(name, email, password, teamId, carModel) {
    const safeEmail = normaliseEmail(email);
    const safeTeamId = String(teamId || "T01").trim().toUpperCase();
    const safeName = String(name || "").trim();

    if (!safeName || !safeEmail || !password) {
      throw new Error("Please complete all required fields.");
    }

    const emailExists =
      DEMO_USERS.some((account) => normaliseEmail(account.email) === safeEmail) ||
      storedUsers.some((account) => normaliseEmail(account.email) === safeEmail);

    if (emailExists) {
      throw new Error("An account with this email already exists.");
    }

    const newAccount = {
      name: safeName,
      email: safeEmail,
      password,
      teamId: safeTeamId,
      carModel: String(carModel || "Unknown").trim() || "Unknown",
    };

    setStoredUsers((currentUsers) => [...currentUsers, newAccount]);

    const { password: _unusedPassword, ...safeUser } = newAccount;
    setUser(safeUser);
  }

  function signOut() {
    setUser(null);
  }

  function updateProfile(profilePatch) {
    if (!user) {
      throw new Error("You must be signed in to update your profile.");
    }

    const nextUser = {
      ...user,
      ...profilePatch,
      email: normaliseEmail(profilePatch.email ?? user.email),
      teamId: String(profilePatch.teamId ?? user.teamId ?? "").trim().toUpperCase(),
      carModel: String(profilePatch.carModel ?? user.carModel ?? "").trim(),
      name: String(profilePatch.name ?? user.name ?? "").trim(),
    };

    setUser(nextUser);
    setStoredUsers((currentUsers) =>
      currentUsers.map((account) =>
        normaliseEmail(account.email) === normaliseEmail(user.email)
          ? { ...account, ...nextUser, password: account.password }
          : account
      )
    );
  }

  function getTeamProfile(teamId) {
    const safeTeamId = String(teamId || "").trim().toUpperCase();
    return safeTeamId ? teamProfiles[safeTeamId] || null : null;
  }

  function saveTeamProfile(teamId, profilePatch) {
    const safeTeamId = String(teamId || "").trim().toUpperCase();
    if (!safeTeamId) {
      throw new Error("A team ID is required before saving team details.");
    }

    const cleanedProfile = {
      teamLeader: String(profilePatch.teamLeader || "").trim(),
      member1: String(profilePatch.member1 || "").trim(),
      member2: String(profilePatch.member2 || "").trim(),
      member3: String(profilePatch.member3 || "").trim(),
      member4: String(profilePatch.member4 || "").trim(),
      emailContact: normaliseEmail(profilePatch.emailContact || ""),
      mobileContact: String(profilePatch.mobileContact || "").trim(),
    };

    setTeamProfiles((currentProfiles) => ({
      ...currentProfiles,
      [safeTeamId]: cleanedProfile,
    }));
  }

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    storedUsers,
    updateProfile,
    getTeamProfile,
    saveTeamProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
