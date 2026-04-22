// src/pages/Status.jsx
import { useState } from "react";

function Card({ title, children, right }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-4 py-3">
        <div className="text-sm font-semibold text-white">{title}</div>
        {right ? <div className="text-xs text-slate-400">{right}</div> : null}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function StatusRow({ label, value, tone = "slate" }) {
  const toneMap = {
    slate: "text-slate-200",
    green: "text-emerald-300",
    red: "text-rose-300",
    amber: "text-amber-300",
    blue: "text-sky-300",
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${toneMap[tone] || toneMap.slate}`}>
        {value}
      </span>
    </div>
  );
}

export default function Status() {
  const [connected, setConnected] = useState(false);
  const [battery, setBattery] = useState(82);
  const [leftMotor, setLeftMotor] = useState("OK");
  const [rightMotor, setRightMotor] = useState("OK");

  return (
    <section className="px-1 py-2">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Robot Status
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Demo robot telemetry for now. This can later be replaced with real Raspberry Pi data.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800/60 bg-slate-950/30 p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-white">Demo Controls</div>
        <p className="mb-4 text-sm text-slate-400">
          These controls are only for showing how the status area could work before live robot data is connected.
        </p>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-200">Connection</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
              value={connected ? "connected" : "disconnected"}
              onChange={(e) => setConnected(e.target.value === "connected")}
            >
              <option value="disconnected">Disconnected</option>
              <option value="connected">Connected</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-200">Battery %</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
              type="number"
              min="0"
              max="100"
              value={battery}
              onChange={(e) => setBattery(Number(e.target.value || 0))}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-200">Left Motor</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
              value={leftMotor}
              onChange={(e) => setLeftMotor(e.target.value)}
            >
              <option value="OK">OK</option>
              <option value="Warning">Warning</option>
              <option value="Offline">Offline</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-200">Right Motor</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
              value={rightMotor}
              onChange={(e) => setRightMotor(e.target.value)}
            >
              <option value="OK">OK</option>
              <option value="Warning">Warning</option>
              <option value="Offline">Offline</option>
            </select>
          </label>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Connection" right="MQTT">
          <div className="space-y-2">
            <StatusRow
              label="Status"
              value={connected ? "Connected" : "Disconnected"}
              tone={connected ? "green" : "red"}
            />
            <StatusRow label="Last ping" value="—" />
          </div>
        </Card>

        <Card title="Power">
          <div className="space-y-2">
            <StatusRow
              label="Battery"
              value={`${battery}%`}
              tone={battery > 50 ? "green" : battery > 20 ? "amber" : "red"}
            />

            {/* Battery bar */}
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div
                  className={`h-2 rounded-full ${
                    battery > 50
                      ? "bg-emerald-500"
                      : battery > 20
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${battery}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Simulated value
              </div>
            </div>
          </div>
        </Card>

        <Card title="Motors">
          <div className="space-y-2">
            <StatusRow
              label="Left motor"
              value={leftMotor}
              tone={leftMotor === "OK" ? "green" : leftMotor === "Warning" ? "amber" : "red"}
            />
            <StatusRow
              label="Right motor"
              value={rightMotor}
              tone={rightMotor === "OK" ? "green" : rightMotor === "Warning" ? "amber" : "red"}
            />
          </div>
        </Card>
      </div>

      {/* Maze / Path visual */}
      <div className="mt-6">
        <Card
          title="Maze & Path Visualisation"
          right="Placeholder"
        >
          <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-sm text-slate-400">
            2D maze / robot path visualisation will appear here
          </div>

          <p className="mt-3 text-xs text-slate-500">
            This section is reserved for a future live view using data streamed
            from the Raspberry Pi (e.g. WebSockets or MQTT).
          </p>
        </Card>
      </div>
    </section>
  );
}
