// src/pages/Logbook.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../AuthContext.jsx";

export default function Logbook() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [runId, setRunId] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      // If logged in, load team logbook only; otherwise load all posts
      const url =
        user?.teamId
          ? `${API_BASE}/api/logbook?team_code=${encodeURIComponent(user.teamId)}`
          : `${API_BASE}/api/logbook`;

      const r = await fetch(url);
      const data = await r.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(String(e));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.teamId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!user) {
      setError("You must sign in to create a logbook post.");
      return;
    }
    if (!user.teamId) {
      setError("Your account has no Team ID. Please set a Team ID in your profile/signup.");
      return;
    }

    try {
      const payload = {
        team_code: user.teamId,          // e.g. T01
        title: title.trim(),
        body: body.trim(),
        run_id: runId.trim() || null,    // optional: link post to a run like R03
        author_name: user.name || null,
        car_model: user.carModel || null,
      };

      const resp = await fetch(`${API_BASE}/api/logbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "Failed to create post");
        return;
      }

      setMsg("✅ Logbook post created.");
      setTitle("");
      setBody("");
      setRunId("");

      await loadPosts();
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <section className="page-section">
      <h1 className="page-title">Logbook</h1>
      <p className="page-subtitle">
        Project updates saved in the database.
      </p>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {msg && (
        <div className="card" style={{ borderLeft: "4px solid green" }}>
          {msg}
        </div>
      )}

      {/* Create post */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>New Logbook Post</h3>

        {!user ? (
          <p style={{ color: "#6b7280" }}>
            Sign in to create posts.
          </p>
        ) : (
          <>
            <p style={{ color: "#6b7280", marginTop: 0 }}>
              Posting as <strong>{user.name}</strong> • Team <strong>{user.teamId}</strong>
              {user.carModel ? <> • Car <strong>{user.carModel}</strong></> : null}
            </p>

            <form onSubmit={handleSubmit} className="form">
              <label>
                Title
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Improved DFS performance"
                />
              </label>

              <label>
                Link to Run ID (optional)
                <input
                  value={runId}
                  onChange={(e) => setRunId(e.target.value)}
                  placeholder="e.g. R02"
                />
              </label>

              <label>
                Post
                <textarea
                  required
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your update here…"
                />
              </label>

              <button className="btn-primary" type="submit">
                Publish Post
              </button>
            </form>
          </>
        )}
      </div>

      {/* Posts list */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {user?.teamId ? `Team ${user.teamId} Posts` : "All Posts"}
        </h3>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading posts…</p>
        ) : posts.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No posts yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {posts.map((p) => (
              <div key={p.post_id} className="card" style={{ margin: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <strong>{p.title}</strong>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>
                    {p.created_at ? new Date(p.created_at).toLocaleString() : ""}
                  </span>
                </div>

                <p style={{ marginTop: 8, marginBottom: 8, whiteSpace: "pre-wrap" }}>
                  {p.body}
                </p>

                <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>
                  Team: {p.team_code} • Author: {p.author_name || "—"} • Car: {p.car_model || "—"}
                  {p.run_id ? ` • Linked Run: ${p.run_id}` : ""}
                </p>

                {p.contact_email ? (
                  <p style={{ margin: 0, fontSize: 12 }}>
                    Contact: <a href={`mailto:${p.contact_email}`}>{p.contact_email}</a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}