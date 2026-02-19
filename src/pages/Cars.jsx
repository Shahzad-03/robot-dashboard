import { useEffect, useState } from "react";
import { API_BASE } from "../config";

function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-200">{children}</span>;
}

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then((r) => r.json())
      .then((data) => {
        setCars(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-1 py-2">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cars</h1>
          <p className="mt-1 text-sm text-slate-400">CAR records from /api/cars joined with team info.</p>
        </div>
        <Badge>{loading ? "Loading…" : `${cars.length} cars`}</Badge>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-slate-900/40 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 md:px-6">Car ID</th>
                <th className="px-4 py-3 md:px-6">Car Name</th>
                <th className="px-4 py-3 md:px-6">Car Type</th>
                <th className="px-4 py-3 md:px-6">Team ID</th>
                <th className="px-4 py-3 md:px-6">Team Name</th>
                <th className="px-4 py-3 md:px-6">Team Leader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cars.map((car) => (
                <tr key={car.car_id} className="transition hover:bg-slate-900/30">
                  <td className="px-4 py-3 md:px-6 font-semibold text-white">{car.car_id}</td>
                  <td className="px-4 py-3 md:px-6 text-slate-200">{car.car_name}</td>
                  <td className="px-4 py-3 md:px-6 text-slate-200">{car.car_type || "—"}</td>
                  <td className="px-4 py-3 md:px-6 text-slate-200">{car.team_id}</td>
                  <td className="px-4 py-3 md:px-6 text-slate-200">{car.team_name || "—"}</td>
                  <td className="px-4 py-3 md:px-6 text-slate-200">{car.team_leader || "—"}</td>
                </tr>
              ))}

              {!loading && cars.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-500 md:px-6" colSpan={6}>No cars found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
