// src/pages/SignUp.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
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

const inputClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamId, setTeamId] = useState("T01");
  const [carModel, setCarModel] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    signUp(name, email, password, teamId, carModel);
    navigate("/profile");
  }

  return (
    <section className="px-1 py-2">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign Up</h1>
          <p className="mt-1 text-sm text-slate-400">
            Create an account and link it to your team and car model.
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
          <div className="border-b border-slate-800/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Create Account</div>
              <div className="flex items-center gap-2">
                <Badge tone="blue">Team</Badge>
                <Badge tone="amber">Car</Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-200">Name</span>
              <input
                className={inputClass + " mt-1"}
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-200">Email</span>
              <input
                className={inputClass + " mt-1"}
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-slate-200">Team ID</span>
                <input
                  className={inputClass + " mt-1"}
                  type="text"
                  required
                  placeholder="e.g. T01"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-200">Car model</span>
                <input
                  className={inputClass + " mt-1"}
                  type="text"
                  required
                  placeholder="e.g. MazeCar v1"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                />
              </label>
            </div>

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

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Sign Up
            </button>
          </form>

          <div className="border-t border-slate-800/60 px-4 py-3 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-blue-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
