// src/pages/Teams.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
    amber: "bg-amber-900/40 text-amber-200 border-amber-800/50",
    green: "bg-emerald-900/40 text-emerald-200 border-emerald-800/50",
    red: "bg-rose-900/40 text-rose-200 border-rose-800/50",
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
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Teams</h1>
          <p className="mt-1 text-sm text-slate-400">
            All teams and members loaded from the database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="slate">{loading ? "Loading…" : `${teams.length} teams`}</Badge>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      {/* Loading */}
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
          {teams.map((t) => (
            <Card
              key={t.team_id}
              title={`${t.team_code} • ${t.team_name}`}
              subtitle="Team record from database"
              right={
                <div className="flex items-center gap-2">
                  <Badge tone="blue">{t.team_code}</Badge>
                  <Badge tone="slate">
                    {(t.members && t.members.length) ? `${t.members.length} members` : "0 members"}
                  </Badge>
                </div>
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                {/* Team details */}
                <div className="md:col-span-1">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-400">Leader:</span>{" "}
                      <span className="font-semibold text-slate-100">{t.team_leader || "—"}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Contact:</span>{" "}
                      {t.contact_email ? (
                        <a
                          className="font-semibold text-blue-400 hover:underline"
                          href={`mailto:${t.contact_email}`}
                        >
                          {t.contact_email}
                        </a>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.team_leader ? <Badge tone="amber">Leader set</Badge> : <Badge tone="slate">No leader</Badge>}
                    {t.contact_email ? <Badge tone="green">Contact set</Badge> : <Badge tone="slate">No contact</Badge>}
                  </div>
                </div>

                {/* Members */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-medium text-slate-400">Members</div>
                    <Badge tone="slate">{(t.members && t.members.length) ? t.members.length : 0}</Badge>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {t.members && t.members.length > 0 ? (
                      t.members.map((m) => (
                        <div
                          key={m.member_id}
                          className="flex flex-col gap-1 rounded-xl border border-slate-800/60 bg-slate-900/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white">
                              {m.full_name}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {m.email || "No email"}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {m.role ? <Badge tone="amber">{m.role}</Badge> : <Badge tone="slate">member</Badge>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-slate-800/60 bg-slate-900/20 px-3 py-3 text-sm text-slate-400">
                        No members listed.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
