import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import { NODE_COLORS, EDGE_COLORS } from "../data/mockData";
import type { GraphData, NodeData, EdgeData } from "../data/mockData";

interface SimNode extends NodeData {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SimLink {
  source: SimNode;
  target: SimNode;
  type: EdgeData["type"];
}

interface Props {
  data: GraphData;
}

const LANE_Y: Record<string, number> = {
  scientist: 0.2,
  discovery: 0.5,
  invention: 0.8,
};

export default function GraphView({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll("*").remove();

    const width = svgRef.current!.clientWidth || 900;
    const height = svgRef.current!.clientHeight || 600;

    const container = svg.append("g");

    const allYears = data.nodes.map((n) => n.data.year).filter(Boolean) as number[];
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);
    const pad = 80;
    const xScale = d3.scaleLinear([minYear, maxYear], [pad, width - pad]);

    const nodes: SimNode[] = data.nodes.map((n) => {
      const tx = n.data.year ? xScale(n.data.year) : width / 2;
      const ty = height * (LANE_Y[n.data.variety] ?? 0.5);
      return { ...n.data, x: tx, y: ty, vx: 0, vy: 0 };
    });

    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const links: SimLink[] = data.edges
      .map((e) => {
        const source = nodeById.get(e.data.source);
        const target = nodeById.get(e.data.target);
        if (!source || !target) return null;
        return { source, target, type: e.data.type };
      })
      .filter(Boolean) as SimLink[];

    // Lane labels
    const lanes = [
      { label: "Scientists", fy: LANE_Y.scientist },
      { label: "Discoveries", fy: LANE_Y.discovery },
      { label: "Inventions", fy: LANE_Y.invention },
    ];
    lanes.forEach(({ label, fy }) => {
      container.append("text")
        .attr("x", 8)
        .attr("y", height * fy)
        .attr("dy", "0.35em")
        .attr("font-size", "10px")
        .attr("fill", "#4b5563")
        .attr("font-weight", 600)
        .attr("letter-spacing", "0.05em")
        .text(label.toUpperCase());

      container.append("line")
        .attr("x1", 0).attr("x2", width)
        .attr("y1", height * fy).attr("y2", height * fy)
        .attr("stroke", "#1f2937")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 4");
    });

    // Arrow markers
    const edgeTypes = ["discovered", "invented", "influenced", "led_to"] as const;
    const defs = svg.append("defs");
    edgeTypes.forEach((t) => {
      defs.append("marker")
        .attr("id", `arrow-${t}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 13)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", EDGE_COLORS[t]);
    });

    const link = container.append("g")
      .selectAll<SVGPathElement, SimLink>("path")
      .data(links)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (d) => EDGE_COLORS[d.type])
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    const node = container.append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
        navigate(`/${d.variety}/${d.id}`);
      });

    node.append("circle")
      .attr("r", 8)
      .attr("fill", (d) => NODE_COLORS[d.variety])
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d) => d.label)
      .attr("x", 12)
      .attr("y", -10)
      .attr("font-size", "10px")
      .attr("fill", "#e5e7eb")
      .attr("pointer-events", "none");

    const tooltip = d3.select("body")
      .append("div")
      .style("position", "fixed")
      .style("padding", "6px 10px")
      .style("background", "#1f2937")
      .style("color", "#e5e7eb")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "9999");

    node
      .on("mouseenter", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.label}</strong><br/>${d.discipline ?? ""}${d.year ? ` · ${d.year}` : ""}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.clientX + 14}px`)
          .style("top", `${event.clientY - 28}px`);
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
      });

    const NODE_RADIUS = 8;

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force("link", d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(80).strength(0.1))
      .force("charge", d3.forceManyBody().strength(-60))
      .force("collide", d3.forceCollide<SimNode>(NODE_RADIUS + 20).strength(1).iterations(3))
      // Pull nodes to their year on X axis
      .force("x", d3.forceX<SimNode>((d) => d.year ? xScale(d.year) : width / 2).strength(0.8))
      // Pull nodes to their lane on Y axis
      .force("y", d3.forceY<SimNode>((d) => height * (LANE_Y[d.variety] ?? 0.5)).strength(0.9))
      .on("tick", () => {
        nodes.forEach((d) => {
          d.x = Math.max(pad / 2, Math.min(width - pad / 2, d.x));
          d.y = Math.max(20, Math.min(height - 20, d.y));
        });

        link.attr("d", (d) => {
          const sx = d.source.x, sy = d.source.y;
          const tx = d.target.x, ty = d.target.y;
          // Horizontal bezier — control points align with source/target Y for git-like curves
          const cx1 = sx + (tx - sx) * 0.5;
          const cx2 = tx - (tx - sx) * 0.5;
          return `M${sx},${sy} C${cx1},${sy} ${cx2},${ty} ${tx},${ty}`;
        });

        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });

    // Drag: no simulation restart — just move the node, no scatter
    const drag = d3.drag<SVGGElement, SimNode>()
      .on("start", (_event, d) => { d.fx = d.x; d.fy = d.y; })
      .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on("end", (_e, d) => { d.fx = null; d.fy = null; });

    node.call(drag);

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data, navigate]);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100%", background: "#111827", borderRadius: 8 }}
    />
  );
}
