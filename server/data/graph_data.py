from models.graph import Node, Edge, NodeData, EdgeData, GraphData

NODES: list[Node] = [
    Node(data=NodeData(id="newton", label="Isaac Newton", variety="scientist", discipline="physics", year=1643, description="Physicist who formulated laws of motion and gravitation")),
    Node(data=NodeData(id="einstein", label="Albert Einstein", variety="scientist", discipline="physics", year=1879, description="Developed the theory of relativity")),
    Node(data=NodeData(id="curie", label="Marie Curie", variety="scientist", discipline="chemistry", year=1867, description="Pioneered research on radioactivity")),
    Node(data=NodeData(id="darwin", label="Charles Darwin", variety="scientist", discipline="biology", year=1809, description="Proposed the theory of natural selection")),
    Node(data=NodeData(id="turing", label="Alan Turing", variety="scientist", discipline="mathematics", year=1912, description="Father of theoretical computer science")),
    Node(data=NodeData(id="laws_of_motion", label="Laws of Motion", variety="discovery", discipline="physics", year=1687, description="Three laws describing the motion of bodies")),
    Node(data=NodeData(id="gravitation", label="Law of Gravitation", variety="discovery", discipline="physics", year=1687, description="All bodies attract each other proportional to their masses")),
    Node(data=NodeData(id="relativity", label="Theory of Relativity", variety="discovery", discipline="physics", year=1905, description="E=mc², space and time are unified")),
    Node(data=NodeData(id="radioactivity", label="Radioactivity", variety="discovery", discipline="chemistry", year=1898, description="Spontaneous emission of radiation from atoms")),
    Node(data=NodeData(id="natural_selection", label="Natural Selection", variety="discovery", discipline="biology", year=1859, description="Species evolve through survival of the fittest")),
    Node(data=NodeData(id="turing_machine", label="Turing Machine", variety="discovery", discipline="mathematics", year=1936, description="Abstract model of computation")),
    Node(data=NodeData(id="nuclear_fission", label="Nuclear Fission", variety="discovery", discipline="physics", year=1938, description="Splitting of atomic nucleus releasing enormous energy")),
    Node(data=NodeData(id="atomic_bomb", label="Atomic Bomb", variety="invention", discipline="engineering", year=1945, description="Weapon based on nuclear chain reaction")),
    Node(data=NodeData(id="nuclear_reactor", label="Nuclear Reactor", variety="invention", discipline="engineering", year=1942, description="Controlled nuclear reaction for energy generation")),
    Node(data=NodeData(id="computer", label="Electronic Computer", variety="invention", discipline="engineering", year=1945, description="First computers implemented the Turing machine principle")),
    Node(data=NodeData(id="xray_machine", label="X-Ray Machine", variety="invention", discipline="medicine", year=1895, description="Medical imaging based on radiation")),
]

EDGES: list[Edge] = [
    Edge(data=EdgeData(source="newton", target="laws_of_motion", type="discovered")),
    Edge(data=EdgeData(source="newton", target="gravitation", type="discovered")),
    Edge(data=EdgeData(source="gravitation", target="relativity", type="influenced")),
    Edge(data=EdgeData(source="einstein", target="relativity", type="discovered")),
    Edge(data=EdgeData(source="relativity", target="nuclear_fission", type="influenced")),
    Edge(data=EdgeData(source="nuclear_fission", target="atomic_bomb", type="led_to")),
    Edge(data=EdgeData(source="nuclear_fission", target="nuclear_reactor", type="led_to")),
    Edge(data=EdgeData(source="curie", target="radioactivity", type="discovered")),
    Edge(data=EdgeData(source="radioactivity", target="xray_machine", type="led_to")),
    Edge(data=EdgeData(source="radioactivity", target="nuclear_fission", type="influenced")),
    Edge(data=EdgeData(source="darwin", target="natural_selection", type="discovered")),
    Edge(data=EdgeData(source="turing", target="turing_machine", type="discovered")),
    Edge(data=EdgeData(source="turing_machine", target="computer", type="led_to")),
]

GRAPH = GraphData(nodes=NODES, edges=EDGES)

NODE_INDEX: dict[str, Node] = {n.data.id: n for n in NODES}