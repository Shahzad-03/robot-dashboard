// src/pages/SignIn.jsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
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

const inputClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("team1@demo.com");
  const [password, setPassword] = useState("pass123");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    try {
      signIn(email, password);
      setError("");
      const redirectPath = location.state?.from || "/profile";
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  }

  return (
    <section className="px-1 py-2">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign In
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Use the demo account or your future database account.
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
          <div className="border-b border-slate-800/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Account Login</div>
              <Badge tone="blue">Demo enabled</Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-200">Email</span>
              <input
                className={inputClass + " mt-1"}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-200">Password</span>
              <input
                className={inputClass + " mt-1"}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && (
              <div className="rounded-lg border border-rose-800/50 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Sign In
            </button>
          </form>

          <div className="border-t border-slate-800/60 px-4 py-3 text-center text-xs text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-400 hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
