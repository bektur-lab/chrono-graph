import { useParams, Link } from "react-router-dom";
import { mockData, NODE_COLORS } from "../data/mockData";

export default function ScientistPage() {
  const { id } = useParams<{ id: string }>();
  const node = mockData.nodes.find((n) => n.data.id === id)?.data;

  if (!node || node.variety !== "scientist") {
    return <div style={pageStyle}>Scientist not found.</div>;
  }

  const discoveries = mockData.edges
    .filter((e) => e.data.source === id && (e.data.type === "discovered" || e.data.type === "invented"))
    .map((e) => mockData.nodes.find((n) => n.data.id === e.data.target)?.data)
    .filter(Boolean);

  return (
    <div style={pageStyle}>
      <Link to="/" style={backStyle}>← Back to graph</Link>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <span style={{ ...dot, background: NODE_COLORS.scientist }} />
        <h1 style={{ margin: 0 }}>{node.label}</h1>
        <span style={badge}>Scientist</span>
      </div>

      <table style={infoTable}>
        <tbody>
          {node.year && <tr><td style={tdLabel}>Born</td><td>{node.year}</td></tr>}
          {node.discipline && <tr><td style={tdLabel}>Discipline</td><td>{node.discipline}</td></tr>}
          {node.description && <tr><td style={tdLabel}>About</td><td>{node.description}</td></tr>}
        </tbody>
      </table>

      {discoveries.length > 0 && (
        <>
          <h2 style={sectionTitle}>Discoveries & Inventions</h2>
          <ul style={listStyle}>
            {discoveries.map((d) => d && (
              <li key={d.id}>
                <Link to={`/${d.variety}/${d.id}`} style={linkStyle}>
                  <span style={{ ...dot, background: NODE_COLORS[d.variety], width: 10, height: 10 }} />
                  {d.label} {d.year ? `(${d.year})` : ""}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = { padding: "2rem", background: "#0f172a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" };
const backStyle: React.CSSProperties = { display: "inline-block", marginBottom: "1.5rem", color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" };
const dot: React.CSSProperties = { display: "inline-block", width: 14, height: 14, borderRadius: "50%", flexShrink: 0 };
const badge: React.CSSProperties = { background: NODE_COLORS.scientist + "33", color: NODE_COLORS.scientist, padding: "2px 10px", borderRadius: 999, fontSize: "0.8rem", border: `1px solid ${NODE_COLORS.scientist}` };
const infoTable: React.CSSProperties = { borderCollapse: "collapse", marginBottom: "1.5rem", fontSize: "0.95rem" };
const tdLabel: React.CSSProperties = { paddingRight: "1.5rem", paddingBottom: "0.5rem", color: "#9ca3af", verticalAlign: "top" };
const sectionTitle: React.CSSProperties = { fontSize: "1rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" };
const listStyle: React.CSSProperties = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" };
const linkStyle: React.CSSProperties = { color: "#e5e7eb", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" };