import { useState } from "react";
import GraphView from "../components/GraphView";
import LegendTable from "../components/LegendTable";
import { useGraphData } from "../hooks/useGraphData";

export default function MainPage() {
  const [refresh, setRefresh] = useState(false);
  const state = useGraphData(refresh);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "1.5rem",
        gap: "1rem",
        boxSizing: "border-box",
        background: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          ChronoGraph
        </h1>
        {state.status === "ok" && (
          <>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: 999,
                background: state.source === "live" ? "#10b98122" : "#f59e0b22",
                color: state.source === "live" ? "#10b981" : "#f59e0b",
                border: `1px solid ${
                  state.source === "live" ? "#10b981" : "#f59e0b"
                }`,
              }}
            >
              {state.source === "live" ? "Wikidata" : "mock data"}
            </span>
            <button
              onClick={() => setRefresh((r) => !r)}
              style={{
                marginLeft: "auto",
                padding: "4px 12px",
                fontSize: "0.8rem",
                background: "#1f2937",
                color: "#9ca3af",
                border: "1px solid #374151",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {state.status === "loading" && (
          <div style={overlayStyle}>
            <span style={{ marginBottom: "0.5rem" }}>{state.message}</span>
            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              Wikidata → Claude AI → graph (first load ~15s)
            </span>
          </div>
        )}
        {state.status === "error" && (
          <div style={{ ...overlayStyle, color: "#ef4444" }}>
            {state.message}
          </div>
        )}
        {state.status === "ok" && <GraphView data={state.data} />}
      </div>

      <div style={{ background: "#1f2937", borderRadius: 8, padding: "1rem" }}>
        <LegendTable />
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#111827",
  borderRadius: 8,
  color: "#9ca3af",
  fontSize: "0.95rem",
};
