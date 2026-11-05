import { useEffect, useState } from "react";
// Pure vibe code - for testing purposes
// Album autocomplete. Calls onSelect(album) with a /api/search result ({ id, artist, title, year, thumb, cover, ... }).
export default function SearchBox({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (q.trim().length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      // debounce: Discogs allows 25-60 req/min
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error);
        setResults(body);
        setError("");
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const shown = q.trim().length < 2 ? [] : results;

  return (
    <div style={{ position: "relative", width: 420 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search albums or artists"
        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
      />
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {shown.length > 0 && (
        <ul
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
            background: "#fff",
            color: "#000",
            border: "1px solid #ccc",
            maxHeight: 400,
            overflowY: "auto",
            zIndex: 1,
          }}
        >
          {shown.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => {
                  onSelect(a);
                  setQ("");
                }}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  width: "100%",
                  padding: 6,
                  border: 0,
                  background: "none",
                  color: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {a.thumb ? (
                  <img src={a.thumb} width={40} height={40} alt="" />
                ) : (
                  <span style={{ width: 40, height: 40, background: "#ddd" }} />
                )}
                <span>
                  {a.artist} - {a.title} {a.year && `(${a.year})`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
