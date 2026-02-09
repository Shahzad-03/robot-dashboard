// src/pages/Logbook.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../AuthContext.jsx";

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

function Field({ label, hint, children }) {
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

const textareaClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

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
      const url = user?.teamId
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

  const headerTitle = useMemo(() => {
    return user?.teamId ? `Team ${user.teamId} Posts` : "All Posts";
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
        team_code: user.teamId, // e.g. T01
        title: title.trim(),
        body: body.trim(),
        run_id: runId.trim() || null, // optional
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
    <section className="px-1 py-2">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Logbook</h1>
          <p className="mt-1 text-sm text-slate-400">
            Project updates saved in the database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="slate">{headerTitle}</Badge>
          <Badge tone="blue">{posts.length} posts</Badge>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      {msg && (
        <div className="mb-4 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-sm text-emerald-100">
          {msg}
        </div>
      )}

      {/* Create post */}
      <div className="mb-6">
        <Card
          title="New Logbook Post"
          subtitle="Share progress updates and link them to a run."
          right={<Badge tone="blue">POST /api/logbook</Badge>}
        >
          {!user ? (
            <div className="text-sm text-slate-400">
              Sign in to create posts.
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge tone="slate">
                  Posting as <span className="ml-1 font-semibold text-white">{user.name}</span>
                </Badge>
                <Badge tone="blue">
                  Team <span className="ml-1 font-semibold text-white">{user.teamId}</span>
                </Badge>
                {user.carModel ? (
                  <Badge tone="amber">
                    Car <span className="ml-1 font-semibold text-white">{user.carModel}</span>
                  </Badge>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title" hint="Required">
                    <input
                      className={inputClass}
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Improved DFS performance"
                    />
                  </Field>

                  <Field label="Link to Run ID (optional)" hint="e.g. R02">
                    <input
                      className={inputClass}
                      value={runId}
                      onChange={(e) => setRunId(e.target.value)}
                      placeholder="e.g. R02"
                    />
                  </Field>
                </div>

                <Field label="Post" hint="Required">
                  <textarea
                    className={textareaClass}
                    required
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your update here…"
                  />
                </Field>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-slate-500">
                    Tip: Link your post to a run (R01, R02…) to connect notes with performance data.
                  </div>

                  <button
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                    type="submit"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>

      {/* Posts list */}
      <Card
        title={headerTitle}
        subtitle={user?.teamId ? "Only posts from your team." : "All teams’ posts."}
        right={loading ? <Badge tone="slate">Loading…</Badge> : <Badge tone="slate">{posts.length} items</Badge>}
      >
        {loading ? (
          <div className="text-sm text-slate-400">Loading posts…</div>
        ) : posts.length === 0 ? (
          <div className="text-sm text-slate-400">No posts yet.</div>
        ) : (
          <div className="grid gap-3">
            {posts.map((p) => (
              <article
                key={p.post_id}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-white">
                      {p.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge tone="blue">Team {p.team_code}</Badge>
                      <Badge tone="slate">Author: {p.author_name || "—"}</Badge>
                      <Badge tone="amber">Car: {p.car_model || "—"}</Badge>
                      {p.run_id ? <Badge tone="green">Linked Run: {p.run_id}</Badge> : null}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    {p.created_at ? new Date(p.created_at).toLocaleString() : ""}
                  </div>
                </div>

                <div className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
                  {p.body}
                </div>

                {p.contact_email ? (
                  <div className="mt-3 text-xs text-slate-400">
                    Contact:{" "}
                    <a
                      className="underline decoration-slate-600 underline-offset-4 hover:text-white"
                      href={`mailto:${p.contact_email}`}
                    >
                      {p.contact_email}
                    </a>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}
