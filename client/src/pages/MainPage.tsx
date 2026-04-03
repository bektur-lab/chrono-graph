import GraphView from "../components/GraphView";
import LegendTable from "../components/LegendTable";

export default function MainPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "1.5rem", gap: "1rem", boxSizing: "border-box", background: "#0f172a", color: "#e5e7eb" }}>
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>ChronoGraph</h1>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraphView />
      </div>
      <div style={{ background: "#1f2937", borderRadius: 8, padding: "1rem" }}>
        <LegendTable />
      </div>
    </div>
  );
}
