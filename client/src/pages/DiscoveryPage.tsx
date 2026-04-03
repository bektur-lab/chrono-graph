import { useParams, Link } from "react-router-dom";
import { mockData, NODE_COLORS } from "../data/mockData";

export default function DiscoveryPage() {
  const { id } = useParams<{ id: string }>();
  const node = mockData.nodes.find((n) => n.data.id === id)?.data;

  if (!node || node.variety !== "discovery") {
    return <div style={pageStyle}>Discovery not found.</div>;
  }

  const ledTo = mockData.edges
    .filter((e) => e.data.source === id && e.data.type === "led_to")
    .map((e) => mockData.nodes.find((n) => n.data.id === e.data.target)?.data)
    .filter(Boolean);

  const influenced = mockData.edges
    .filter((e) => e.data.source === id && e.data.type === "influenced")
    .map((e) => mockData.nodes.find((n) => n.data.id === e.data.target)?.data)
    .filter(Boolean);

  const discoveredBy = mockData.edges
    .filter((e) => e.data.target === id && e.data.type === "discovered")
    .map((e) => mockData.nodes.find((n) => n.data.id === e.data.source)?.data)
    .filter(Boolean);

  return (
    <div style={pageStyle}>
      <Link to="/" style={backStyle}>← Back to graph</Link>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <span style={{ ...dot, background: NODE_COLORS.discovery }} />
        <h1 style={{ margin: 0 }}>{node.label}</h1>
        <span style={badge}>Discovery</span>
      </div>

      <table style={infoTable}>
        <tbody>
          {node.year && <tr><td style={tdLabel}>Year</td><td>{node.year}</td></tr>}
          {node.discipline && <tr><td style={tdLabel}>Discipline</td><td>{node.discipline}</td></tr>}
          {node.description && <tr><td style={tdLabel}>Description</td><td>{node.description}</td></tr>}
        </tbody>
      </table>

      {discoveredBy.length > 0 && (
        <>
          <h2 style={sectionTitle}>Discovered by</h2>
          <ul style={listStyle}>
            {discoveredBy.map((d) => d && (
              <li key={d.id}>
                <Link to={`/${d.variety}/${d.id}`} style={linkStyle}>
                  <span style={{ ...dot, background: NODE_COLORS[d.variety], width: 10, height: 10 }} />
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {ledTo.length > 0 && (
        <>
          <h2 style={sectionTitle}>Led to</h2>
          <ul style={listStyle}>
            {ledTo.map((d) => d && (
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

      {influenced.length > 0 && (
        <>
          <h2 style={sectionTitle}>Influenced</h2>
          <ul style={listStyle}>
            {influenced.map((d) => d && (
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
const badge: React.CSSProperties = { background: NODE_COLORS.discovery + "33", color: NODE_COLORS.discovery, padding: "2px 10px", borderRadius: 999, fontSize: "0.8rem", border: `1px solid ${NODE_COLORS.discovery}` };
const infoTable: React.CSSProperties = { borderCollapse: "collapse", marginBottom: "1.5rem", fontSize: "0.95rem" };
const tdLabel: React.CSSProperties = { paddingRight: "1.5rem", paddingBottom: "0.5rem", color: "#9ca3af", verticalAlign: "top" };
const sectionTitle: React.CSSProperties = { fontSize: "1rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" };
const listStyle: React.CSSProperties = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" };
const linkStyle: React.CSSProperties = { color: "#e5e7eb", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" };