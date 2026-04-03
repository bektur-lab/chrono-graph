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

export default function GraphView({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll("*").remove();

    const width = svgRef.current!.clientWidth || 900;
    const height = svgRef.current!.clientHeight || 600;

    const container = svg.append("g");

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => container.attr("transform", event.transform))
    );

    const nodes: SimNode[] = data.nodes.map((n) => ({
      ...n.data,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
    }));

    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const links: SimLink[] = data.edges
      .map((e) => {
        const source = nodeById.get(e.data.source);
        const target = nodeById.get(e.data.target);
        if (!source || !target) return null;
        return { source, target, type: e.data.type };
      })
      .filter(Boolean) as SimLink[];

    // Arrow markers
    const edgeTypes = ["discovered", "invented", "influenced", "led_to"] as const;
    const defs = svg.append("defs");
    edgeTypes.forEach((t) => {
      defs.append("marker")
        .attr("id", `arrow-${t}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
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
      .attr("stroke-opacity", 0.7)
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
      .attr("r", 14)
      .attr("fill", (d) => NODE_COLORS[d.variety])
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d) => d.label)
      .attr("x", 18)
      .attr("y", 4)
      .attr("font-size", "11px")
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

    const NODE_RADIUS = 14;

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force("link", d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("collide", d3.forceCollide<SimNode>(NODE_RADIUS + 30).strength(1).iterations(3))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .on("tick", () => {
        nodes.forEach((d) => {
          d.x = Math.max(20, Math.min(width - 20, d.x));
          d.y = Math.max(20, Math.min(height - 20, d.y));
        });

        link.attr("d", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const bend = dist * 0.15;
          const mx = (d.source.x + d.target.x) / 2 - (dy / dist) * bend;
          const my = (d.source.y + d.target.y) / 2 + (dx / dist) * bend;
          return `M${d.source.x},${d.source.y} Q${mx},${my} ${d.target.x},${d.target.y}`;
        });

        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });

    const drag = d3.drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.05).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
        simulation.alphaTarget(0.05).restart();
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

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