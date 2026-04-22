import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    blue: "bg-sky-900/40 text-sky-200 border-sky-800/50",
    green: "bg-emerald-900/40 text-emerald-200 border-emerald-800/50",
    amber: "bg-amber-900/40 text-amber-200 border-amber-800/50",
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

function createAccountForm(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    teamId: user?.teamId || "",
    carModel: user?.carModel || "",
  };
}

function createTeamForm(teamProfile, user) {
  return {
    teamLeader: teamProfile?.teamLeader || user?.name || "",
    member1: teamProfile?.member1 || "",
    member2: teamProfile?.member2 || "",
    member3: teamProfile?.member3 || "",
    member4: teamProfile?.member4 || "",
    emailContact: teamProfile?.emailContact || user?.email || "",
    mobileContact: teamProfile?.mobileContact || "",
  };
}

export default function Profile() {
  const { user, updateProfile, getTeamProfile, saveTeamProfile } = useAuth();
  const teamProfile = getTeamProfile(user?.teamId);

  const [accountForm, setAccountForm] = useState(() => createAccountForm(user));
  const [teamForm, setTeamForm] = useState(() => createTeamForm(teamProfile, user));
  const [accountMsg, setAccountMsg] = useState("");
  const [teamMsg, setTeamMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAccountForm(createAccountForm(user));
    setTeamForm(createTeamForm(teamProfile, user));
  }, [user, teamProfile]);

  function handleAccountChange(event) {
    const { name, value } = event.target;
    setAccountForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleTeamChange(event) {
    const { name, value } = event.target;
    setTeamForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleAccountSubmit(event) {
    event.preventDefault();
    setError("");
    setAccountMsg("");

    try {
      updateProfile(accountForm);
      setAccountMsg("Account details saved.");
    } catch (saveError) {
      setError(saveError.message || "Could not save account details.");
    }
  }

  function handleTeamSubmit(event) {
    event.preventDefault();
    setError("");
    setTeamMsg("");

    try {
      saveTeamProfile(accountForm.teamId || user?.teamId, teamForm);
      setTeamMsg("Team details saved for this browser.");
    } catch (saveError) {
      setError(saveError.message || "Could not save team details.");
    }
  }

  return (
    <section className="px-1 py-2">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Profile</h1>
          <p className="mt-1 text-sm text-slate-400">
            Update your saved account and simple team details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="blue">Signed in</Badge>
          <Badge tone="slate">{user.email}</Badge>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Account"
          subtitle="These details are stored in local browser storage."
          right={<Badge tone="slate">User</Badge>}
        >
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                name="name"
                value={accountForm.name}
                onChange={handleAccountChange}
                required
              />
            </Field>

            <Field label="Email">
              <input
                className={inputClass}
                type="email"
                name="email"
                value={accountForm.email}
                onChange={handleAccountChange}
                required
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Team ID" hint="e.g. T01">
                <input
                  className={inputClass}
                  name="teamId"
                  value={accountForm.teamId}
                  onChange={handleAccountChange}
                  required
                />
              </Field>

              <Field label="Car Model">
                <input
                  className={inputClass}
                  name="carModel"
                  value={accountForm.carModel}
                  onChange={handleAccountChange}
                  required
                />
              </Field>
            </div>

            {accountMsg && <div className="text-sm text-emerald-300">{accountMsg}</div>}

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Save Account
              </button>
            </div>
          </form>
        </Card>

        <Card
          title="Team Details"
          subtitle="Simple member and contact details for your team."
          right={<Badge tone="green">{accountForm.teamId || "No team ID"}</Badge>}
        >
          <form onSubmit={handleTeamSubmit} className="space-y-4">
            <Field label="Team Leader">
              <input
                className={inputClass}
                name="teamLeader"
                value={teamForm.teamLeader}
                onChange={handleTeamChange}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Member 1">
                <input className={inputClass} name="member1" value={teamForm.member1} onChange={handleTeamChange} />
              </Field>
              <Field label="Member 2">
                <input className={inputClass} name="member2" value={teamForm.member2} onChange={handleTeamChange} />
              </Field>
              <Field label="Member 3">
                <input className={inputClass} name="member3" value={teamForm.member3} onChange={handleTeamChange} />
              </Field>
              <Field label="Member 4">
                <input className={inputClass} name="member4" value={teamForm.member4} onChange={handleTeamChange} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Contact Email">
                <input
                  className={inputClass}
                  type="email"
                  name="emailContact"
                  value={teamForm.emailContact}
                  onChange={handleTeamChange}
                />
              </Field>

              <Field label="Mobile Contact">
                <input
                  className={inputClass}
                  name="mobileContact"
                  value={teamForm.mobileContact}
                  onChange={handleTeamChange}
                />
              </Field>
            </div>

            {teamMsg && <div className="text-sm text-emerald-300">{teamMsg}</div>}

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Save Team Details
              </button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
