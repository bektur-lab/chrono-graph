import GraphView from "../components/GraphView";
import LegendTable from "../components/LegendTable";
import { useGraphData } from "../hooks/useGraphData";

export default function MainPage() {
  const state = useGraphData();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "1.5rem", gap: "1rem", boxSizing: "border-box", background: "#0f172a", color: "#e5e7eb" }}>
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>ChronoGraph</h1>

      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {state.status === "loading" && (
          <div style={overlayStyle}>Loading graph…</div>
        )}
        {state.status === "error" && (
          <div style={{ ...overlayStyle, color: "#ef4444" }}>{state.message}</div>
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
  alignItems: "center",
  justifyContent: "center",
  background: "#111827",
  borderRadius: 8,
  color: "#9ca3af",
  fontSize: "0.95rem",
};