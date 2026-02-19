import { useEffect, useState } from "react";
import { API_BASE } from "../config";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
    amber: "bg-amber-900/40 text-amber-200 border-amber-800/50",
    green: "bg-emerald-900/40 text-emerald-200 border-emerald-800/50",
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

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/teams`)
      .then((r) => r.json())
      .then((data) => {
        setTeams(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-1 py-2">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Teams</h1>
          <p className="mt-1 text-sm text-slate-400">TEAM + MEMBERS + CAR overview from /api/teams.</p>
        </div>

        <Badge tone="slate">{loading ? "Loading…" : `${teams.length} teams`}</Badge>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      {loading ? (
        <Card title="Loading teams" subtitle="Fetching from database…" right={<Badge tone="slate">GET /api/teams</Badge>}>
          <div className="text-sm text-slate-400">Loading teams…</div>
        </Card>
      ) : teams.length === 0 ? (
        <Card title="No teams found" subtitle="The database returned no team records.">
          <div className="text-sm text-slate-400">No teams found in database.</div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {teams.map((team) => {
            const members = team.members || null;
            const people = [
              members?.team_leader,
              members?.member1,
              members?.member2,
              members?.member3,
              members?.member4,
            ].filter((p) => Boolean(p && String(p).trim()));

            return (
              <Card
                key={team.team_id}
                title={`${team.team_id} • ${team.team_name}`}
                subtitle="Team record"
                right={<Badge tone="blue">Leader: {team.team_leader || "—"}</Badge>}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-400">Team ID:</span> <span className="font-semibold text-slate-100">{team.team_id}</span></div>
                    <div><span className="text-slate-400">Team Name:</span> <span className="font-semibold text-slate-100">{team.team_name}</span></div>
                    <div><span className="text-slate-400">Team Leader:</span> <span className="font-semibold text-slate-100">{team.team_leader || "—"}</span></div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-xs font-medium text-slate-400">Members</div>
                      <Badge tone="slate">{people.length}</Badge>
                    </div>

                    <div className="space-y-2">
                      {people.length > 0 ? people.map((person) => (
                        <div key={`${team.team_id}-${person}`} className="rounded-xl border border-slate-800/60 bg-slate-900/20 px-3 py-2 text-sm text-white">{person}</div>
                      )) : <div className="text-sm text-slate-500">No members listed.</div>}
                    </div>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="text-slate-300">Email: {members?.email_contact || "—"}</div>
                      <div className="text-slate-300">Phone: {members?.mobile_contact || "—"}</div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-xs font-medium text-slate-400">Cars</div>
                      <Badge tone="green">{Array.isArray(team.cars) ? team.cars.length : 0}</Badge>
                    </div>

                    <div className="space-y-2">
                      {Array.isArray(team.cars) && team.cars.length > 0 ? (
                        team.cars.map((car) => (
                          <div key={car.car_id} className="rounded-xl border border-slate-800/60 bg-slate-900/20 px-3 py-2 text-sm">
                            <div className="font-semibold text-white">{car.car_id} • {car.car_name}</div>
                            <div className="text-slate-400">{car.car_type || "—"}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">No cars listed.</div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
