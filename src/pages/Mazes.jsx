// src/pages/Mazes.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

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
    <section className="page-section">
      <h1 className="page-title">Mazes</h1>
      <p className="page-subtitle">Maze definitions loaded from the database.</p>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Maze List</h3>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading mazes…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Maze ID</th>
                <th>Goal Type</th>
                <th>No. of Tiles</th>
              </tr>
            </thead>
            <tbody>
              {mazes.map((m) => (
                <tr key={m.maze_id}>
                  <td>{m.maze_id}</td>
                  <td>{m.goal_type}</td>
                  <td>{m.no_of_tiles}</td>
                </tr>
              ))}

              {mazes.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ color: "#6b7280" }}>
                    No mazes found in database.
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
