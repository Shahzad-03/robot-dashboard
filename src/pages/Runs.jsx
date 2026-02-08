// src/pages/Runs.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

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
    <section className="page-section">
      <h1 className="page-title">Runs</h1>
      <p className="page-subtitle">
        Runs are loaded from the database. You can also insert a new run here (simulating robot upload).
      </p>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {submitMsg && (
        <div className="card" style={{ borderLeft: "4px solid green" }}>
          {submitMsg}
        </div>
      )}

      {/* ===== New Run form (inside Runs page) ===== */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>+ New Run</h3>

        <form onSubmit={handleSubmit} className="form">
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <label>
              Run ID (optional)
              <input
                placeholder="Leave blank for auto (R02, R03...)"
                value={runId}
                onChange={(e) => setRunId(e.target.value)}
              />
            </label>

            <label>
              Team Code
              <input
                placeholder="e.g. T01"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
              />
            </label>

            <label>
              Maze
              <select value={mazeId} onChange={(e) => setMazeId(e.target.value)}>
                {mazes.map((m) => (
                  <option key={m.maze_id} value={m.maze_id}>
                    {m.maze_id} • {m.goal_type} • {m.no_of_tiles} tiles
                  </option>
                ))}
              </select>
            </label>

            <label>
              Algorithm
              <select value={algorithmId} onChange={(e) => setAlgorithmId(e.target.value)}>
                {algorithms.map((a) => (
                  <option key={a.algorithm_id} value={a.algorithm_id}>
                    {a.algorithm_id} • {a.type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Run time (seconds) *
              <input
                type="number"
                step="0.01"
                required
                value={runTime}
                onChange={(e) => setRunTime(e.target.value)}
              />
            </label>

            <label>
              Path length (steps)
              <input
                type="number"
                value={pathLength}
                onChange={(e) => setPathLength(e.target.value)}
              />
            </label>

            <label>
              Nodes explored
              <input
                type="number"
                value={nodesExplored}
                onChange={(e) => setNodesExplored(e.target.value)}
              />
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 22 }}>
              <input
                type="checkbox"
                checked={goalReached}
                onChange={(e) => setGoalReached(e.target.checked)}
              />
              Goal reached
            </label>
          </div>

          <label style={{ marginTop: 10 }}>
            Notes
            <textarea
              rows={3}
              placeholder="Optional notes about this run"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
            Submit Run (POST to DB)
          </button>
        </form>
      </div>

      {/* ===== Runs table ===== */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>All Runs</h3>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading runs…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Run</th>
                <th>Maze</th>
                <th>Algorithm</th>
                <th>Time</th>
                <th>Path</th>
                <th>Goal</th>
                <th>Nodes</th>
                <th>Team</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.run_id}>
                  <td>{r.run_id}</td>
                  <td>
                    {r.maze_id} • {r.goal_type} • {r.no_of_tiles} tiles
                  </td>
                  <td>{r.algorithm_type}</td>
                  <td>{r.run_time}s</td>
                  <td>{r.path_length}</td>
                  <td>{Number(r.goal_reached) === 1 ? "Yes" : "No"}</td>
                  <td>{r.nodes_explored}</td>
                  <td>{r.team_code || "—"}</td>
                  <td>
                    {r.contact_email ? (
                      <a href={`mailto:${r.contact_email}`}>{r.contact_email}</a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}

              {runs.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ color: "#6b7280" }}>
                    No runs found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
