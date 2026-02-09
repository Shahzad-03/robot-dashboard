// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../AuthContext.jsx";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    green: "bg-emerald-900/40 text-emerald-200 border-emerald-800/50",
    red: "bg-rose-900/40 text-rose-200 border-rose-800/50",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
    amber: "bg-amber-900/40 text-amber-200 border-amber-800/50",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneMap[tone] || toneMap.slate,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/60 px-4 py-3 md:px-6">
          <div>
            {title && <div className="text-sm font-semibold text-white">{title}</div>}
            {subtitle && <div className="mt-0.5 text-xs text-slate-400">{subtitle}</div>}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      )}
      <div className="px-4 py-4 md:px-6">{children}</div>
    </div>
  );
}

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

    // Your login stores teamId like "T01"
    const code = (user.teamId || user.team_code || user.teamCode || "").trim();
    if (!code) return null;

    return (
      teams.find((t) => String(t.team_code).toUpperCase() === code.toUpperCase()) || null
    );
  }, [user, teams]);

  // Calculate stats from DB runs
  const stats = useMemo(() => {
    const total = runs.length;
    const successes = runs.filter(
      (r) => Number(r.goal_reached) === 1 || r.goal_reached === true
    ).length;

    const avgTime =
      total === 0
        ? null
        : runs.reduce((sum, r) => sum + Number(r.run_time || 0), 0) / total;

    const successRate = total === 0 ? null : (successes / total) * 100;

    // Best algorithm by lowest average time
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
    <section className="px-1 py-2">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Overview of team details and robot run performance (loaded from database).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="slate">Runs: {stats.total}</Badge>
          <Badge tone="green">Success: {stats.successes}</Badge>
          <Badge tone="amber">
            Avg time: {stats.avgTime == null ? "—" : `${stats.avgTime.toFixed(2)}s`}
          </Badge>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      {/* Team + Members */}
      <div className="mb-6">
        <Card
          title="Team Information"
          subtitle="Shows your team details and members when signed in."
          right={
            user ? (
              <Badge tone="blue">
                Signed in as {user?.name || "User"}
              </Badge>
            ) : (
              <Badge tone="slate">Not signed in</Badge>
            )
          }
        >
          {!user && (
            <div className="text-sm text-slate-400">
              Sign in to see your team members on the dashboard.
            </div>
          )}

          {user && loading && (
            <div className="text-sm text-slate-400">Loading team…</div>
          )}

          {user && !loading && !userTeam && (
            <div className="text-sm text-slate-400">
              Could not find your team in the database. Check your Team ID on your profile matches a{" "}
              <span className="font-semibold text-slate-200">team_code</span> in the DB (e.g. T01).
            </div>
          )}

          {user && userTeam && (
            <div className="grid gap-4 md:grid-cols-3">
              {/* Team details */}
              <div className="md:col-span-1">
                <div className="text-xs font-medium text-slate-400">Team</div>
                <div className="mt-1 text-base font-semibold text-white">
                  {userTeam.team_code} • {userTeam.team_name}
                </div>

                <div className="mt-4 text-xs font-medium text-slate-400">Contact</div>
                <div className="mt-1 text-sm text-slate-200">
                  {userTeam.contact_email ? (
                    <a
                      className="underline decoration-slate-600 underline-offset-4 hover:text-white"
                      href={`mailto:${userTeam.contact_email}`}
                    >
                      {userTeam.contact_email}
                    </a>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </div>
              </div>

              {/* Members list */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-medium text-slate-400">Members</div>
                  <Badge tone="slate">
                    {(userTeam.members && userTeam.members.length) || 0} members
                  </Badge>
                </div>

                <div className="mt-3 space-y-2">
                  {userTeam.members && userTeam.members.length > 0 ? (
                    userTeam.members.map((m) => (
                      <div
                        key={m.member_id}
                        className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/30 px-3 py-2"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-100">
                            {m.full_name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {m.email ? m.email : "No email"}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {m.role ? <Badge tone="amber">{m.role}</Badge> : <Badge tone="slate">member</Badge>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No members found for this team.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Total Runs"
          subtitle="Recorded in database"
          right={<Badge tone="slate">DB</Badge>}
        >
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="mt-1 text-xs text-slate-500">All teams combined</div>
        </Card>

        <Card
          title="Average Time"
          subtitle="Across all runs"
          right={<Badge tone="amber">seconds</Badge>}
        >
          <div className="text-3xl font-bold text-white">
            {stats.avgTime == null ? "—" : stats.avgTime.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-slate-500">Lower is better</div>
        </Card>

        <Card
          title="Success Rate"
          subtitle="Goal reached vs total"
          right={
            stats.successRate == null ? (
              <Badge tone="slate">—</Badge>
            ) : (
              <Badge tone={stats.successRate >= 50 ? "green" : "red"}>
                {stats.successRate.toFixed(0)}%
              </Badge>
            )
          }
        >
          <div className="text-3xl font-bold text-white">
            {stats.successRate == null ? "—" : `${stats.successRate.toFixed(0)}%`}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Goal reached in {stats.successes}/{stats.total} runs
          </div>
        </Card>
      </div>

      {/* Best algorithm */}
      <div className="mt-6">
        <Card
          title="Best Algorithm"
          subtitle="Based on lowest average time"
          right={<Badge tone="amber">analysis</Badge>}
        >
          <div className="text-lg font-semibold text-white">
            {stats.bestAlgorithm ? stats.bestAlgorithm : "—"}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            This is a simple comparison using the stored run times.
          </div>
        </Card>
      </div>
    </section>
  );
}
