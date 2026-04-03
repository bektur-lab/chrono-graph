import { NODE_COLORS, EDGE_COLORS } from "../data/mockData";
import type { NodeVariety, EdgeType } from "../data/mockData";

const nodeEntries: { variety: NodeVariety; label: string }[] = [
  { variety: "scientist", label: "Scientist" },
  { variety: "discovery", label: "Discovery" },
  { variety: "invention", label: "Invention" },
];

const edgeEntries: { type: EdgeType; label: string; description: string }[] = [
  { type: "discovered", label: "discovered", description: "Scientist made a discovery" },
  { type: "invented", label: "invented", description: "Scientist created an invention" },
  { type: "influenced", label: "influenced", description: "One finding influenced another" },
  { type: "led_to", label: "led to", description: "One finding led to another" },
];

export default function LegendTable() {
  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>
          Node Types
        </h3>
        <table style={{ borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <tbody>
            {nodeEntries.map(({ variety, label }) => (
              <tr key={variety}>
                <td style={{ padding: "4px 10px 4px 0" }}>
                  <span style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: NODE_COLORS[variety],
                    verticalAlign: "middle",
                    marginRight: 6,
                  }} />
                  {label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>
          Edge Types
        </h3>
        <table style={{ borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <tbody>
            {edgeEntries.map(({ type, label, description }) => (
              <tr key={type}>
                <td style={{ padding: "4px 10px 4px 0", whiteSpace: "nowrap" }}>
                  <span style={{
                    display: "inline-block",
                    width: 24,
                    height: 3,
                    background: EDGE_COLORS[type],
                    verticalAlign: "middle",
                    marginRight: 6,
                    borderRadius: 2,
                  }} />
                  <strong>{label}</strong>
                </td>
                <td style={{ padding: "4px 0", color: "#9ca3af" }}>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}