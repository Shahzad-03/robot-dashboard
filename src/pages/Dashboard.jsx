// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  const [runs, setRuns] = useState([]);
  const [teams, setTeams] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    setLoading(true);
    setError("");

    try {
      const [runsRes, teamsRes] = await Promise.all([
        fetch(`${API_BASE}/api/runs`),
        fetch(`${API_BASE}/api/teams`),
      ]);

      const runsData = await runsRes.json();
      const teamsData = await teamsRes.json();

      setRuns(Array.isArray(runsData) ? runsData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (e) {
      setError(String(e));
      setRuns([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Find the user's team from DB
  const userTeam = useMemo(() => {
    if (!user) return null;

    // Your login stores teamId like "T01" (from earlier work)
    const code = (user.teamId || user.team_code || user.teamCode || "").trim();

    if (!code) return null;

    return teams.find((t) => String(t.team_code).toUpperCase() === code.toUpperCase()) || null;
  }, [user, teams]);

  // Calculate stats from DB runs
  const stats = useMemo(() => {
    const total = runs.length;
    const successes = runs.filter((r) => Number(r.goal_reached) === 1).length;

    const avgTime =
      total === 0 ? null : runs.reduce((sum, r) => sum + Number(r.run_time || 0), 0) / total;

    const successRate = total === 0 ? null : (successes / total) * 100;

    // best algorithm by lowest average time
    const byAlgo = new Map();
    for (const r of runs) {
      const algo = r.algorithm_type || r.algorithm_id || "Unknown";
      const list = byAlgo.get(algo) || [];
      list.push(Number(r.run_time || 0));
      byAlgo.set(algo, list);
    }

    let bestAlgorithm = null;
    let bestAvg = Infinity;
    for (const [algo, times] of byAlgo.entries()) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      if (avg < bestAvg) {
        bestAvg = avg;
        bestAlgorithm = algo;
      }
    }

    return { total, successes, avgTime, successRate, bestAlgorithm };
  }, [runs]);

  return (
    <section className="page-section">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Overview of team details and robot run performance (loaded from database).
      </p>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ===== TEAM CARD from DATABASE ===== */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Team Information</h3>

        {!user && (
          <p style={{ color: "#6b7280" }}>
            Sign in to see your team members on the dashboard.
          </p>
        )}

        {user && loading && <p style={{ color: "#6b7280" }}>Loading team…</p>}

        {user && !loading && !userTeam && (
          <p style={{ color: "#6b7280" }}>
            Could not find your team in the database. Check your Team ID on your profile matches a
            team_code in the DB (e.g. T01).
          </p>
        )}

        {user && userTeam && (
          <>
            <p>
              <strong>Team:</strong> {userTeam.team_code} • {userTeam.team_name}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {userTeam.contact_email ? (
                <a href={`mailto:${userTeam.contact_email}`}>{userTeam.contact_email}</a>
              ) : (
                "—"
              )}
            </p>

            <p>
              <strong>Members:</strong>
              <br />
              {userTeam.members && userTeam.members.length > 0 ? (
                userTeam.members.map((m) => (
                  <span key={m.member_id}>
                    {m.full_name}
                    {m.role ? ` (${m.role})` : ""}
                    <br />
                  </span>
                ))
              ) : (
                <span style={{ color: "#6b7280" }}>No members found for this team.</span>
              )}
            </p>
          </>
        )}
      </div>

      {/* ===== METRIC CARDS (from DB runs) ===== */}
      <div className="card-grid-3">
        <div className="card">
          <h3>Total Runs</h3>
          <p style={{ fontSize: 28, margin: 0 }}>{stats.total}</p>
          <p style={{ fontSize: 12, color: "#6b7280" }}>Recorded in database</p>
        </div>

        <div className="card">
          <h3>Average Time</h3>
          <p style={{ fontSize: 28, margin: 0 }}>
            {stats.avgTime == null ? "—" : `${stats.avgTime.toFixed(2)} s`}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280" }}>Across all runs</p>
        </div>

        <div className="card">
          <h3>Success Rate</h3>
          <p style={{ fontSize: 28, margin: 0 }}>
            {stats.successRate == null ? "—" : `${stats.successRate.toFixed(0)}%`}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            Goal reached in {stats.successes}/{stats.total} runs
          </p>
        </div>
      </div>

      <div className="page-section">
        <div className="card">
          <h3>Best Algorithm</h3>
          <p style={{ margin: 0 }}>
            {stats.bestAlgorithm ? <strong>{stats.bestAlgorithm}</strong> : "—"}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            (Based on lowest average time)
          </p>
        </div>
      </div>
    </section>
  );
}
