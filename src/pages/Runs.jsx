import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    green: "bg-emerald-900/40 text-emerald-200 border-emerald-800/50",
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
  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitMsg, setSubmitMsg] = useState("");
  const [error, setError] = useState("");

  const [runId, setRunId] = useState("");
  const [carId, setCarId] = useState("");
  const [runTime, setRunTime] = useState("");
  const [dateRecorded, setDateRecorded] = useState(new Date().toISOString().slice(0, 10));
  const [runLength, setRunLength] = useState("");
  const [algoType, setAlgoType] = useState("");
  const [notes, setNotes] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");

    try {
      const [runsRes, carsRes] = await Promise.all([
        fetch(`${API_BASE}/api/runs`),
        fetch(`${API_BASE}/api/cars`),
      ]);

      const runsData = await runsRes.json();
      const carsData = await carsRes.json();

      const normalizedRuns = Array.isArray(runsData) ? runsData : [];
      const normalizedCars = Array.isArray(carsData) ? carsData : [];

      setRuns(normalizedRuns);
      setCars(normalizedCars);

      if (!carId && normalizedCars.length > 0) {
        setCarId(normalizedCars[0].car_id);
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
    const totalTime = runs.reduce((sum, r) => sum + Number(r.run_time || 0), 0);
    const avgTime = total > 0 ? totalTime / total : null;
    return { total, avgTime };
  }, [runs]);

  function makeNextRunId() {
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

    if (!carId || runTime === "") {
      setError("Please select a car and enter run time.");
      return;
    }

    const finalRunId = runId.trim() || makeNextRunId();

    const payload = {
      run_id: finalRunId,
      car_id: carId,
      run_time: Number(runTime),
      date_recorded: dateRecorded ? dateRecorded : undefined,
      run_length: runLength === "" ? undefined : Number(runLength),
      algo_type: algoType.trim() || undefined,
      notes: notes.trim() || undefined,
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
      setRunLength("");
      setAlgoType("");
      setNotes("");

      await loadAll();
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <section className="px-1 py-2">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Runs</h1>
          <p className="mt-1 text-sm text-slate-400">
            Submit and review runs using ERD fields only.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="slate">Total: {runStats.total}</Badge>
          <Badge tone="amber">
            Avg time: {runStats.avgTime == null ? "—" : `${runStats.avgTime.toFixed(2)}s`}
          </Badge>
        </div>
      </div>

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

      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-4 py-3 md:px-6">
          <div>
            <div className="text-sm font-semibold text-white">+ New Run</div>
            <div className="text-xs text-slate-400">Submit a run record via POST /api/runs.</div>
          </div>
          <Badge tone="blue">ERD payload</Badge>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Run ID (optional)" hint="Auto-generates R02, R03…">
              <input
                className={inputClass}
                placeholder="Leave blank for auto"
                value={runId}
                onChange={(e) => setRunId(e.target.value)}
              />
            </Field>

            <Field label="Car *" hint="Required">
              <select className={selectClass} required value={carId} onChange={(e) => setCarId(e.target.value)}>
                <option value="" disabled>Select a car</option>
                {cars.map((c) => (
                  <option key={c.car_id} value={c.car_id}>
                    {c.car_id} • {c.car_name} • {c.team_name}
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

            <Field label="Date recorded">
              <input
                className={inputClass}
                type="date"
                value={dateRecorded}
                onChange={(e) => setDateRecorded(e.target.value)}
              />
            </Field>

            <Field label="Run length">
              <input
                className={inputClass}
                type="number"
                value={runLength}
                onChange={(e) => setRunLength(e.target.value)}
              />
            </Field>

            <Field label="Algorithm type">
              <input
                className={inputClass}
                placeholder="e.g. DFS"
                value={algoType}
                onChange={(e) => setAlgoType(e.target.value)}
              />
            </Field>
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

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Submit Run
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-4 py-3 md:px-6">
          <div>
            <div className="text-sm font-semibold text-white">All Runs</div>
            <div className="text-xs text-slate-400">Joined run + car + team + members data.</div>
          </div>
          <Badge tone="slate">{loading ? "Loading…" : `${runs.length} rows`}</Badge>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-slate-400 md:px-6">Loading runs…</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-slate-900/40 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 md:px-6">Run</th>
                  <th className="px-4 py-3 md:px-6">Car</th>
                  <th className="px-4 py-3 md:px-6">Team</th>
                  <th className="px-4 py-3 md:px-6">Run Time</th>
                  <th className="px-4 py-3 md:px-6">Run Length</th>
                  <th className="px-4 py-3 md:px-6">Algo Type</th>
                  <th className="px-4 py-3 md:px-6">Contact</th>
                  <th className="px-4 py-3 md:px-6">Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {runs.map((r) => (
                  <tr key={r.run_id} className="transition hover:bg-slate-900/30">
                    <td className="px-4 py-3 md:px-6">
                      <div className="font-semibold text-white">{r.run_id}</div>
                      <div className="text-xs text-slate-500">
                        {r.date_recorded ? new Date(r.date_recorded).toLocaleDateString() : "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3 md:px-6 text-slate-200">
                      <div className="font-medium">{r.car_name || r.car_id}</div>
                      <div className="text-xs text-slate-500">{r.car_id} • {r.car_type || "—"}</div>
                    </td>

                    <td className="px-4 py-3 md:px-6 text-slate-200">
                      <div className="font-medium">{r.team_name || r.team_id || "—"}</div>
                      <div className="text-xs text-slate-500">{r.team_id || "—"}</div>
                    </td>

                    <td className="px-4 py-3 md:px-6 text-slate-200">{r.run_time}</td>
                    <td className="px-4 py-3 md:px-6 text-slate-200">{r.run_length ?? "—"}</td>
                    <td className="px-4 py-3 md:px-6 text-slate-200">{r.algo_type || "—"}</td>

                    <td className="px-4 py-3 md:px-6">
                      {r.email_contact ? (
                        <a
                          className="text-slate-200 underline decoration-slate-600 underline-offset-4 hover:text-white"
                          href={`mailto:${r.email_contact}`}
                        >
                          {r.email_contact}
                        </a>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="max-w-[240px] px-4 py-3 text-slate-300 md:px-6">{r.notes || "—"}</td>
                  </tr>
                ))}

                {runs.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-slate-500 md:px-6" colSpan={8}>
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
