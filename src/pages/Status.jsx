// src/pages/Status.jsx
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
  // Static placeholders for now (future: live robot/MQTT/WebSocket data)
  const connected = false;
  const battery = 82;

  return (
    <section className="px-1 py-2">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Robot Status
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Live robot telemetry (currently simulated / placeholder data).
        </p>
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
            <StatusRow label="Left motor" value="OK" tone="green" />
            <StatusRow label="Right motor" value="OK" tone="green" />
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
