// src/pages/Runs.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";

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

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="flex items-end justify-between gap-3">
        <span className="text-xs font-medium text-slate-200">{label}</span>
        {hint ? <span className="text-[11px] text-slate-500">{hint}</span> : null}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

const selectClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

const textareaClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

export default function Runs() {
  const [runs, setRuns] = useState([]);
  const [mazes, setMazes] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitMsg, setSubmitMsg] = useState("");
  const [error, setError] = useState("");

  // Form state (matches your API contract)
  const [runId, setRunId] = useState("");
  const [mazeId, setMazeId] = useState("");
  const [algorithmId, setAlgorithmId] = useState("");
  const [runTime, setRunTime] = useState("");
  const [pathLength, setPathLength] = useState("");
  const [goalReached, setGoalReached] = useState(true);
  const [nodesExplored, setNodesExplored] = useState("");
  const [teamCode, setTeamCode] = useState("T01");
  const [notes, setNotes] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [runsRes, mazesRes, algRes] = await Promise.all([
        fetch(`${API_BASE}/api/runs`),
        fetch(`${API_BASE}/api/mazes`),
        fetch(`${API_BASE}/api/algorithms`),
      ]);

      const runsData = await runsRes.json();
      const mazesData = await mazesRes.json();
      const algData = await algRes.json();

      setRuns(Array.isArray(runsData) ? runsData : []);
      setMazes(Array.isArray(mazesData) ? mazesData : []);
      setAlgorithms(Array.isArray(algData) ? algData : []);

      // sensible defaults for dropdowns
      if (!mazeId && Array.isArray(mazesData) && mazesData.length > 0) {
        setMazeId(mazesData[0].maze_id);
      }
      if (!algorithmId && Array.isArray(algData) && algData.length > 0) {
        setAlgorithmId(algData[0].algorithm_id);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runStats = useMemo(() => {
    const total = runs.length;
    const success = runs.filter((r) => Number(r.goal_reached) === 1 || r.goal_reached === true).length;
    const fail = total - success;
    return { total, success, fail };
  }, [runs]);

  function makeNextRunId() {
    // If your run_ids are like R01, R02, R03
    const existingNums = runs
      .map((r) => String(r.run_id || ""))
      .map((id) => {
        const m = id.match(/^R(\d+)$/i);
        return m ? parseInt(m[1], 10) : null;
      })
      .filter((n) => n != null);

    const next = (existingNums.length ? Math.max(...existingNums) : 0) + 1;
    return `R${String(next).padStart(2, "0")}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitMsg("");
    setError("");

    const finalRunId = runId.trim() || makeNextRunId();

    // Basic validation
    if (!mazeId || !algorithmId || runTime === "") {
      setError("Please select maze, algorithm, and enter run time.");
      return;
    }

    const payload = {
      run_id: finalRunId,
      maze_id: mazeId,
      algorithm_id: algorithmId,
      run_time: Number(runTime),
      path_length: pathLength === "" ? 0 : Number(pathLength),
      goal_reached: goalReached ? 1 : 0,
      nodes_explored: nodesExplored === "" ? 0 : Number(nodesExplored),
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      team_code: teamCode.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      const resp = await fetch(`${API_BASE}/api/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.error || "Failed to submit run");
        return;
      }

      setSubmitMsg(`✅ Run ${finalRunId} added to database.`);
      setRunId("");
      setRunTime("");
      setPathLength("");
      setNodesExplored("");
      setNotes("");

      // refresh table
      await loadAll();
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <section className="px-1 py-2">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Runs</h1>
          <p className="mt-1 text-sm text-slate-400">
            Runs are loaded from the database. You can insert a new run here (simulating robot upload).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="slate">Total: {runStats.total}</Badge>
          <Badge tone="green">Goal reached: {runStats.success}</Badge>
          <Badge tone="red">Failed: {runStats.fail}</Badge>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      {submitMsg && (
        <div className="mb-4 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-sm text-emerald-100">
          {submitMsg}
        </div>
      )}

      {/* New Run Form */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-4 py-3 md:px-6">
          <div>
            <div className="text-sm font-semibold text-white">+ New Run</div>
            <div className="text-xs text-slate-400">
              Submit a run record via POST to the database.
            </div>
          </div>

          <Badge tone="blue">POST /api/runs</Badge>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Run ID (optional)" hint="Auto-generates R02, R03…">
              <input
                className={inputClass}
                placeholder="Leave blank for auto (R02, R03...)"
                value={runId}
                onChange={(e) => setRunId(e.target.value)}
              />
            </Field>

            <Field label="Team Code" hint="e.g. T01">
              <input
                className={inputClass}
                placeholder="e.g. T01"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
              />
            </Field>

            <Field label="Maze">
              <select className={selectClass} value={mazeId} onChange={(e) => setMazeId(e.target.value)}>
                {mazes.map((m) => (
                  <option key={m.maze_id} value={m.maze_id}>
                    {m.maze_id} • {m.goal_type} • {m.no_of_tiles} tiles
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Algorithm">
              <select
                className={selectClass}
                value={algorithmId}
                onChange={(e) => setAlgorithmId(e.target.value)}
              >
                {algorithms.map((a) => (
                  <option key={a.algorithm_id} value={a.algorithm_id}>
                    {a.algorithm_id} • {a.type}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Run time (seconds) *" hint="Required">
              <input
                className={inputClass}
                type="number"
                step="0.01"
                required
                value={runTime}
                onChange={(e) => setRunTime(e.target.value)}
              />
            </Field>

            <Field label="Path length (steps)">
              <input
                className={inputClass}
                type="number"
                value={pathLength}
                onChange={(e) => setPathLength(e.target.value)}
              />
            </Field>

            <Field label="Nodes explored">
              <input
                className={inputClass}
                type="number"
                value={nodesExplored}
                onChange={(e) => setNodesExplored(e.target.value)}
              />
            </Field>

            <div className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-950/30 px-3 py-3">
              <input
                id="goalReached"
                type="checkbox"
                checked={goalReached}
                onChange={(e) => setGoalReached(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-slate-200"
              />
              <label htmlFor="goalReached" className="text-sm font-medium text-slate-200">
                Goal reached
              </label>
              <div className="ml-auto">
                {goalReached ? <Badge tone="green">Yes</Badge> : <Badge tone="red">No</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Field label="Notes" hint="Optional">
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Optional notes about this run"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Tip: leave Run ID blank to auto-generate.
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Submit Run (POST to DB)
            </button>
          </div>
        </form>
      </div>

      {/* Runs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-4 py-3 md:px-6">
          <div>
            <div className="text-sm font-semibold text-white">All Runs</div>
            <div className="text-xs text-slate-400">
              Latest runs first. Loaded from the database.
            </div>
          </div>
          <Badge tone="slate">{loading ? "Loading…" : `${runs.length} rows`}</Badge>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-slate-400 md:px-6">Loading runs…</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="bg-slate-900/40 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 md:px-6">Run</th>
                  <th className="px-4 py-3 md:px-6">Maze</th>
                  <th className="px-4 py-3 md:px-6">Algorithm</th>
                  <th className="px-4 py-3 md:px-6">Time</th>
                  <th className="px-4 py-3 md:px-6">Path</th>
                  <th className="px-4 py-3 md:px-6">Goal</th>
                  <th className="px-4 py-3 md:px-6">Nodes</th>
                  <th className="px-4 py-3 md:px-6">Team</th>
                  <th className="px-4 py-3 md:px-6">Contact</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {runs.map((r) => {
                  const goalYes = Number(r.goal_reached) === 1 || r.goal_reached === true;
                  return (
                    <tr
                      key={r.run_id}
                      className="hover:bg-slate-900/30 transition"
                    >
                      <td className="px-4 py-3 md:px-6">
                        <div className="font-semibold text-white">{r.run_id}</div>
                        <div className="text-xs text-slate-500">
                          {r.date ? new Date(r.date).toLocaleDateString() : ""}
                        </div>
                      </td>

                      <td className="px-4 py-3 md:px-6 text-slate-200">
                        <div className="font-medium">
                          {r.maze_id}{" "}
                          <span className="text-slate-500">•</span>{" "}
                          {r.goal_type}
                        </div>
                        <div className="text-xs text-slate-500">{r.no_of_tiles} tiles</div>
                      </td>

                      <td className="px-4 py-3 md:px-6 text-slate-200">
                        <Badge tone="amber">{r.algorithm_type}</Badge>
                      </td>

                      <td className="px-4 py-3 md:px-6 text-slate-200">
                        <span className="font-medium">{r.run_time}</span>
                        <span className="text-slate-500">s</span>
                      </td>

                      <td className="px-4 py-3 md:px-6 text-slate-200">{r.path_length}</td>

                      <td className="px-4 py-3 md:px-6">
                        {goalYes ? <Badge tone="green">Yes</Badge> : <Badge tone="red">No</Badge>}
                      </td>

                      <td className="px-4 py-3 md:px-6 text-slate-200">{r.nodes_explored}</td>

                      <td className="px-4 py-3 md:px-6 text-slate-200">
                        <div className="font-medium">{r.team_code || "—"}</div>
                        <div className="text-xs text-slate-500">{r.team_name || ""}</div>
                      </td>

                      <td className="px-4 py-3 md:px-6">
                        {r.contact_email ? (
                          <a
                            className="text-slate-200 underline decoration-slate-600 underline-offset-4 hover:text-white"
                            href={`mailto:${r.contact_email}`}
                          >
                            {r.contact_email}
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {runs.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-slate-500 md:px-6" colSpan={9}>
                      No runs found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}