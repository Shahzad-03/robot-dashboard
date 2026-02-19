import { useAuth } from "../AuthContext.jsx";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
  };
  return (
    <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneMap[tone] || toneMap.slate].join(" ")}>
      {children}
    </span>
  );
}

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

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="px-1 py-2">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Profile</h1>
          <p className="mt-1 text-sm text-slate-400">Local demo auth details.</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="blue">Signed in</Badge>
          <Badge tone="slate">{user.email}</Badge>
        </div>
      </div>

      <div className="mb-6 max-w-xl">
        <Card title="Account" subtitle="Stored in localStorage demo auth." right={<Badge tone="slate">User</Badge>}>
          <div className="space-y-2 text-sm text-slate-200">
            <div><span className="font-medium text-slate-400">Name:</span> <span className="text-white">{user.name}</span></div>
            <div><span className="font-medium text-slate-400">Email:</span> <span className="text-white">{user.email}</span></div>
            <div><span className="font-medium text-slate-400">Team ID:</span> <span className="text-white">{user.teamId || "—"}</span></div>
            <div><span className="font-medium text-slate-400">Car model:</span> <span className="text-white">{user.carModel || "—"}</span></div>
          </div>
        </Card>
      </div>
    </section>
  );
}
