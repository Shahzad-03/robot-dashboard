// src/pages/Teams.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

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
    <section className="page-section">
      <h1 className="page-title">Teams</h1>
      <p className="page-subtitle">
        All teams and members loaded from the database.
      </p>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p style={{ color: "#6b7280" }}>Loading teams…</p>
        </div>
      ) : (
        <>
          {teams.length === 0 ? (
            <div className="card">
              <p style={{ color: "#6b7280" }}>No teams found in database.</p>
            </div>
          ) : (
            teams.map((t) => (
              <div className="card" key={t.team_id} style={{ marginBottom: 14 }}>
                <h3 style={{ marginTop: 0 }}>
                  {t.team_code} • {t.team_name}
                </h3>

                <p style={{ margin: "6px 0" }}>
                  <strong>Leader:</strong> {t.team_leader || "—"}
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong>Contact:</strong>{" "}
                  {t.contact_email ? (
                    <a href={`mailto:${t.contact_email}`}>{t.contact_email}</a>
                  ) : (
                    "—"
                  )}
                </p>

                <div style={{ marginTop: 10 }}>
                  <strong>Members:</strong>
                  {t.members && t.members.length > 0 ? (
                    <ul style={{ marginTop: 6 }}>
                      {t.members.map((m) => (
                        <li key={m.member_id}>
                          {m.full_name}
                          {m.role ? ` — ${m.role}` : ""}
                          {m.email ? ` — ${m.email}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#6b7280", marginTop: 6 }}>
                      No members listed.
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </section>
  );
}
