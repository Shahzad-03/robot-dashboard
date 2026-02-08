// src/pages/Algorithms.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function Algorithms() {
  const [algorithms, setAlgorithms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/algorithms`)
      .then((r) => r.json())
      .then((data) => {
        setAlgorithms(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section">
      <h1 className="page-title">Algorithms</h1>
      <p className="page-subtitle">Algorithm list loaded from the database.</p>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Algorithm List</h3>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading algorithms…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Algorithm ID</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map((a) => (
                <tr key={a.algorithm_id}>
                  <td>{a.algorithm_id}</td>
                  <td>{a.type}</td>
                </tr>
              ))}

              {algorithms.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ color: "#6b7280" }}>
                    No algorithms found in database.
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
