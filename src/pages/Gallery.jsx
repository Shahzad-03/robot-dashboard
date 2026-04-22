import { useEffect, useMemo, useState } from "react";

const GALLERY_STORAGE_KEY = "mazeGalleryItems";

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

const selectClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

const textareaClass =
  "w-full rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 " +
  "placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40";

export default function Gallery() {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all"); // all | robot | maze | run
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((x) => x.tag === filter);
  }, [items, filter]);

  useEffect(() => {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
      reader.readAsDataURL(file);
    });
  }

  async function onFilesSelected(e) {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const next = [];

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed (PNG/JPG/WebP).");
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        next.push({
          id: crypto.randomUUID(),
          url: dataUrl,
          name: file.name,
          tag: "robot",
          note: "",
          createdAt: new Date().toISOString(),
        });
      }

      setItems((prev) => [...next, ...prev]);
    } catch (uploadError) {
      setError(uploadError.message || "Could not upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function updateItem(id, patch) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <section className="px-1 py-2">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Gallery</h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload photos of the physical robot, maze setup, and test runs. Saved in this browser for the demo.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFilesSelected}
            />
            {uploading ? "Saving..." : "Upload images"}
          </label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="robot">Robot</option>
            <option value="maze">Maze</option>
            <option value="run">Run</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-4 text-sm text-rose-100">
          <div className="font-semibold">Error</div>
          <div className="mt-1 text-rose-200/90">{error}</div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/30 p-8 shadow-sm">
          <div className="text-lg font-semibold text-white">No images yet</div>
          <p className="mt-2 text-sm text-slate-400">
            Upload photos of your robot and maze so the website shows the physical build.
            This is ideal evidence for assessment and demos, and saved on this browser.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800/60 bg-slate-900/20 p-4">
              <div className="font-semibold text-white">Robot</div>
              <p className="mt-1 text-sm text-slate-400">
                Photos of the robot chassis, sensors, Raspberry Pi, wiring.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/60 bg-slate-900/20 p-4">
              <div className="font-semibold text-white">Maze</div>
              <p className="mt-1 text-sm text-slate-400">
                The physical maze layout, tiles, start & goal markers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/60 bg-slate-900/20 p-4">
              <div className="font-semibold text-white">Run</div>
              <p className="mt-1 text-sm text-slate-400">
                Screenshots/video stills during a run for proof of testing.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <Badge tone="slate">
              Total: <span className="ml-1 font-semibold text-white">{items.length}</span>
            </Badge>
            <Badge tone="slate">
              Showing: <span className="ml-1 font-semibold text-white">{filtered.length}</span>
            </Badge>
            <Badge tone="blue">
              Filter: <span className="ml-1 font-semibold text-white">{filter}</span>
            </Badge>
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 shadow-sm"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900/40">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {item.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Added {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg border border-slate-800/60 bg-slate-900/20 px-2 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-900/40"
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-200">
                      Tag
                      <select
                        value={item.tag}
                        onChange={(e) => updateItem(item.id, { tag: e.target.value })}
                        className={selectClass + " mt-1"}
                      >
                        <option value="robot">Robot</option>
                        <option value="maze">Maze</option>
                        <option value="run">Run</option>
                      </select>
                    </label>

                    <label className="text-xs font-medium text-slate-200">
                      Notes (optional)
                      <textarea
                        value={item.note}
                        onChange={(e) => updateItem(item.id, { note: e.target.value })}
                        className={textareaClass + " mt-1"}
                        rows={3}
                        placeholder="e.g., IR sensors installed, camera mount, maze goal marker…"
                      />
                    </label>
                  </div>

                  <div className="mt-3 rounded-lg border border-slate-800/60 bg-slate-900/20 px-3 py-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">Purpose:</span>{" "}
                    Shows physical build evidence for assessment and demos.
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone={item.tag === "robot" ? "blue" : "slate"}>{item.tag}</Badge>
                    {item.note?.trim() ? <Badge tone="green">has notes</Badge> : <Badge tone="slate">no notes</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
