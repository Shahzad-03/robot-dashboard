// src/pages/Mazes.jsx
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

export default function Mazes() {
  const [mazes, setMazes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/mazes`)
      .then((r) => r.json())
      .then((data) => {
        setMazes(Array.isArray(data) ? data : []);
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Mazes</h1>
          <p className="mt-1 text-sm text-slate-400">
            Maze definitions loaded from the database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="slate">
            {loading ? "Loading…" : `${mazes.length} mazes`}
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

      {/* Mazes table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
        <div className="border-b border-slate-800/60 px-4 py-3 md:px-6">
          <div className="text-sm font-semibold text-white">Maze List</div>
          <div className="mt-0.5 text-xs text-slate-400">
            Each maze defines the goal type and size used in robot runs.
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-slate-400 md:px-6">
            Loading mazes…
          </div>
        ) : mazes.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-400 md:px-6">
            No mazes found in database.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full text-left text-sm">
              <thead className="bg-slate-900/40 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 md:px-6">Maze ID</th>
                  <th className="px-4 py-3 md:px-6">Goal Type</th>
                  <th className="px-4 py-3 md:px-6">No. of Tiles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mazes.map((m) => (
                  <tr
                    key={m.maze_id}
                    className="hover:bg-slate-900/30 transition"
                  >
                    <td className="px-4 py-3 font-semibold text-white md:px-6">
                      {m.maze_id}
                    </td>
                    <td className="px-4 py-3 text-slate-200 md:px-6">
                      <Badge tone="blue">{m.goal_type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-200 md:px-6">
                      <Badge tone="amber">{m.no_of_tiles}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
