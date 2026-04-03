export type NodeVariety = "scientist" | "discovery" | "invention";
export type EdgeType = "discovered" | "invented" | "influenced" | "led_to";

export interface NodeData {
  id: string;
  label: string;
  variety: NodeVariety;
  discipline?: string;
  year?: number;
  description?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface EdgeData {
  source: string;
  target: string;
  type: EdgeType;
}

export interface GraphData {
  nodes: { data: NodeData }[];
  edges: { data: EdgeData }[];
}

export const mockData: GraphData = {
  nodes: [
    { data: { id: "newton", label: "Isaac Newton", variety: "scientist", discipline: "physics", year: 1643, description: "Physicist who formulated laws of motion and gravitation" }},
    { data: { id: "einstein", label: "Albert Einstein", variety: "scientist", discipline: "physics", year: 1879, description: "Developed the theory of relativity" }},
    { data: { id: "curie", label: "Marie Curie", variety: "scientist", discipline: "chemistry", year: 1867, description: "Pioneered research on radioactivity" }},
    { data: { id: "darwin", label: "Charles Darwin", variety: "scientist", discipline: "biology", year: 1809, description: "Proposed the theory of natural selection" }},
    { data: { id: "turing", label: "Alan Turing", variety: "scientist", discipline: "mathematics", year: 1912, description: "Father of theoretical computer science" }},
    { data: { id: "laws_of_motion", label: "Laws of Motion", variety: "discovery", discipline: "physics", year: 1687, description: "Three laws describing the motion of bodies" }},
    { data: { id: "gravitation", label: "Law of Gravitation", variety: "discovery", discipline: "physics", year: 1687, description: "All bodies attract each other proportional to their masses" }},
    { data: { id: "relativity", label: "Theory of Relativity", variety: "discovery", discipline: "physics", year: 1905, description: "E=mc², space and time are unified" }},
    { data: { id: "radioactivity", label: "Radioactivity", variety: "discovery", discipline: "chemistry", year: 1898, description: "Spontaneous emission of radiation from atoms" }},
    { data: { id: "natural_selection", label: "Natural Selection", variety: "discovery", discipline: "biology", year: 1859, description: "Species evolve through survival of the fittest" }},
    { data: { id: "turing_machine", label: "Turing Machine", variety: "discovery", discipline: "mathematics", year: 1936, description: "Abstract model of computation" }},
    { data: { id: "nuclear_fission", label: "Nuclear Fission", variety: "discovery", discipline: "physics", year: 1938, description: "Splitting of atomic nucleus releasing enormous energy" }},
    { data: { id: "atomic_bomb", label: "Atomic Bomb", variety: "invention", discipline: "engineering", year: 1945, description: "Weapon based on nuclear chain reaction" }},
    { data: { id: "nuclear_reactor", label: "Nuclear Reactor", variety: "invention", discipline: "engineering", year: 1942, description: "Controlled nuclear reaction for energy generation" }},
    { data: { id: "computer", label: "Electronic Computer", variety: "invention", discipline: "engineering", year: 1945, description: "First computers implemented the Turing machine principle" }},
    { data: { id: "xray_machine", label: "X-Ray Machine", variety: "invention", discipline: "medicine", year: 1895, description: "Medical imaging based on radiation" }},
  ],
  edges: [
    { data: { source: "newton", target: "laws_of_motion", type: "discovered" }},
    { data: { source: "newton", target: "gravitation", type: "discovered" }},
    { data: { source: "gravitation", target: "relativity", type: "influenced" }},
    { data: { source: "einstein", target: "relativity", type: "discovered" }},
    { data: { source: "relativity", target: "nuclear_fission", type: "influenced" }},
    { data: { source: "nuclear_fission", target: "atomic_bomb", type: "led_to" }},
    { data: { source: "nuclear_fission", target: "nuclear_reactor", type: "led_to" }},
    { data: { source: "curie", target: "radioactivity", type: "discovered" }},
    { data: { source: "radioactivity", target: "xray_machine", type: "led_to" }},
    { data: { source: "radioactivity", target: "nuclear_fission", type: "influenced" }},
    { data: { source: "darwin", target: "natural_selection", type: "discovered" }},
    { data: { source: "turing", target: "turing_machine", type: "discovered" }},
    { data: { source: "turing_machine", target: "computer", type: "led_to" }},
  ],
};

export const NODE_COLORS: Record<NodeVariety, string> = {
  scientist: "#f59e0b",
  discovery: "#3b82f6",
  invention: "#10b981",
};

export const EDGE_COLORS: Record<EdgeType, string> = {
  discovered: "#3b82f6",
  invented: "#10b981",
  influenced: "#f59e0b",
  led_to: "#ef4444",
};
