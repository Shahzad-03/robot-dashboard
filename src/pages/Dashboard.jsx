import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../AuthContext.jsx";

function buildStats(runs) {
  const totalRuns = runs.length;
  let totalTime = 0;

  // Simple object instead of Map to keep this beginner friendly.
  const algoTotals = {};

  for (const run of runs) {
    const runTime = Number(run.run_time || 0);
    totalTime += runTime;

    const algoName = (run.algo_type || "Unknown").trim() || "Unknown";
    if (!algoTotals[algoName]) {
      algoTotals[algoName] = { count: 0, time: 0 };
    }

    algoTotals[algoName].count += 1;
    algoTotals[algoName].time += runTime;
  }

  const avgRunTime = totalRuns > 0 ? totalTime / totalRuns : null;

  let bestAlgoType = null;
  let bestAlgoAvg = Infinity;
  for (const algoName of Object.keys(algoTotals)) {
    const algoData = algoTotals[algoName];
    const algoAvg = algoData.time / algoData.count;
    if (algoAvg < bestAlgoAvg) {
      bestAlgoAvg = algoAvg;
      bestAlgoType = algoName;
    }
  }

  return { totalRuns, avgRunTime, bestAlgoType };
}

function findUserTeam(user, teams) {
  if (!user || !user.teamId) {
    return null;
  }

  const wantedTeamId = String(user.teamId).trim().toUpperCase();

  for (const team of teams) {
    const currentTeamId = String(team.team_id || "").toUpperCase();
    if (currentTeamId === wantedTeamId) {
      return team;
    }
  }

  return null;
}

function getMemberNames(team) {
  if (!team || !team.members) {
    return [];
  }

  const m = team.members;
  const allNames = [m.team_leader, m.member1, m.member2, m.member3, m.member4];
  return allNames.filter((name) => name && String(name).trim());
}

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    green: "bg-emerald-900/40 text-emerald-200 border-emerald-800/50",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
    amber: "bg-amber-900/40 text-amber-200 border-amber-800/50",
  };
  return (
    <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneMap[tone] || toneMap.slate].join(" ")}>
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
  const { user, getTeamProfile } = useAuth();

  const [runs, setRuns] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
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
      }
    }

    loadData();
  }, []);

  // Keeping values as normal variables so it is easier to read during classes.
  const stats = buildStats(runs);
  const userTeam = findUserTeam(user, teams);
  const savedTeamProfile = getTeamProfile(user?.teamId);
  const memberNames = userTeam ? getMemberNames(userTeam) : [];
  const fallbackMemberNames = [
    savedTeamProfile?.teamLeader,
    savedTeamProfile?.member1,
    savedTeamProfile?.member2,
    savedTeamProfile?.member3,
    savedTeamProfile?.member4,
  ].filter((name) => name && String(name).trim());
  const shownMemberNames = memberNames.length > 0 ? memberNames : fallbackMemberNames;
  const shownLeader = userTeam?.team_leader || savedTeamProfile?.teamLeader || "—";
  const shownEmail = userTeam?.members?.email_contact || savedTeamProfile?.emailContact || "";
  const shownPhone = userTeam?.members?.mobile_contact || savedTeamProfile?.mobileContact || "";

  return (
    <section className="px-1 py-2">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">ERD-aligned dashboard overview from runs and teams.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="slate">Runs: {stats.totalRuns}</Badge>
          <Badge tone="blue">Teams: {teams.length}</Badge>
          <Badge tone="amber">Avg: {stats.avgRunTime == null ? "—" : `${stats.avgRunTime.toFixed(2)}s`}</Badge>
          <Badge tone="green">Best Algo: {stats.bestAlgoType || "—"}</Badge>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      <div className="mb-6">
        <Card
          title="Team Information"
          subtitle="Uses /api/teams and your current user teamId."
          right={user ? <Badge tone="blue">{user.name}</Badge> : <Badge tone="slate">Not signed in</Badge>}
        >
          {!user && <div className="text-sm text-slate-400">Sign in to view team details.</div>}

          {user && !userTeam && !savedTeamProfile && (
            <div className="text-sm text-slate-400">
              No team found for <span className="font-semibold text-slate-200">{user.teamId || "(empty)"}</span>. Ensure your profile teamId matches TEAM.team_id.
            </div>
          )}

          {user && (userTeam || savedTeamProfile) && (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs font-medium text-slate-400">Team</div>
                <div className="mt-1 text-base font-semibold text-white">
                  {userTeam ? `${userTeam.team_id} • ${userTeam.team_name}` : `${user?.teamId || "—"} • Saved Team`}
                </div>
                <div className="mt-1 text-sm text-slate-400">Leader: {shownLeader}</div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-400">Contact</div>
                <div className="mt-1 text-sm text-slate-200">
                  {shownEmail ? (
                    <a className="underline decoration-slate-600 underline-offset-4 hover:text-white" href={`mailto:${shownEmail}`}>
                      {shownEmail}
                    </a>
                  ) : "—"}
                </div>
                <div className="mt-1 text-sm text-slate-300">{shownPhone || "—"}</div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-slate-400">Members</div>
                <div className="space-y-1">
                  {shownMemberNames.length > 0 ? shownMemberNames.map((name) => (
                    <div key={name} className="rounded-lg border border-slate-800/60 bg-slate-900/20 px-3 py-1.5 text-sm text-slate-100">{name}</div>
                  )) : <div className="text-sm text-slate-500">No members listed.</div>}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total Runs" subtitle="From RUN table" right={<Badge tone="slate">DB</Badge>}>
          <div className="text-3xl font-bold text-white">{stats.totalRuns}</div>
        </Card>

        <Card title="Average Run Time" subtitle="From run_time" right={<Badge tone="amber">seconds</Badge>}>
          <div className="text-3xl font-bold text-white">{stats.avgRunTime == null ? "—" : stats.avgRunTime.toFixed(2)}</div>
        </Card>

        <Card title="Best Algo Type" subtitle="Lowest average run_time" right={<Badge tone="green">Computed</Badge>}>
          <div className="text-3xl font-bold text-white">{stats.bestAlgoType || "—"}</div>
        </Card>
      </div>
    </section>
  );
}
