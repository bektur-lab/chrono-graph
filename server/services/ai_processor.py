"""
Passes raw Wikidata results to Claude and asks it to build a GraphData structure
with classified nodes (scientist / discovery / invention) and typed edges.

AI processing is currently stubbed — returns a graph built directly from
Wikidata rows without calling the Anthropic API.
Real AI processing will be added later.
"""

import re
from models.graph import GraphData, Node, Edge, NodeData, EdgeData

# import os
# import json
# import anthropic
# client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# SYSTEM_PROMPT = """..."""  # will be restored when AI processing is re-enabled

# Map Wikidata award URIs → discipline string
_AWARD_DISCIPLINE: dict[str, str] = {
    "Q38104": "physics",
    "Q44585": "chemistry",
    "Q80061": "medicine",
}


def _award_id(uri: str) -> str:
    return uri.rsplit("/", 1)[-1]


def _slug(label: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", label.lower()).strip("_")


async def build_graph_from_wikidata(raw_rows: list[dict]) -> GraphData:
    """
    Builds GraphData directly from Wikidata rows (no AI call).
    - Each unique person becomes a scientist node
    - Each unique notable work becomes a discovery node
    - Edges: person → work (discovered), co-laureates in same field (influenced)
    """
    scientist_nodes: dict[str, Node] = {}
    discovery_nodes: dict[str, Node] = {}
    edges: list[Edge] = []
    seen_edges: set[tuple[str, str, str]] = set()

    for row in raw_rows:
        person_uri = row.get("person", "")
        person_label = row.get("personLabel", "").strip()
        award_uri = row.get("award", "")
        year_str = row.get("year", "")
        field_label = row.get("fieldLabel", "")
        work_uri = row.get("work", "")
        work_label = row.get("workLabel", "").strip()
        birth_str = row.get("birthYear", "")

        if not person_label or not person_uri:
            continue

        discipline = _AWARD_DISCIPLINE.get(_award_id(award_uri), "science")
        year = int(year_str) if year_str.isdigit() else None
        birth = int(birth_str) if birth_str.isdigit() else None

        person_id = _slug(person_label)

        # Scientist node (upsert — keep first occurrence)
        if person_id not in scientist_nodes:
            scientist_nodes[person_id] = Node(data=NodeData(
                id=person_id,
                label=person_label,
                variety="scientist",
                discipline=field_label or discipline,
                year=birth,
                description=f"Nobel Prize in {discipline.title()} ({year})",
            ))

        # Notable work → discovery node
        if work_uri and work_label:
            work_id = _slug(work_label)
            if work_id not in discovery_nodes:
                discovery_nodes[work_id] = Node(data=NodeData(
                    id=work_id,
                    label=work_label,
                    variety="discovery",
                    discipline=discipline,
                ))

            edge_key = (person_id, work_id, "discovered")
            if edge_key not in seen_edges:
                seen_edges.add(edge_key)
                edges.append(Edge(data=EdgeData(
                    source=person_id,
                    target=work_id,
                    type="discovered",
                )))

    # "influenced" edges between scientists who share the same award
    from collections import defaultdict
    award_to_scientists: dict[str, list[str]] = defaultdict(list)
    for row in raw_rows:
        person_label = row.get("personLabel", "").strip()
        award_uri = row.get("award", "")
        year_str = row.get("year", "")
        if person_label and award_uri and year_str:
            key = f"{_award_id(award_uri)}_{year_str}"
            pid = _slug(person_label)
            if pid not in award_to_scientists[key]:
                award_to_scientists[key].append(pid)

    for group in award_to_scientists.values():
        if len(group) > 1:
            for i in range(len(group) - 1):
                edge_key = (group[i], group[i + 1], "influenced")
                if edge_key not in seen_edges:
                    seen_edges.add(edge_key)
                    edges.append(Edge(data=EdgeData(
                        source=group[i],
                        target=group[i + 1],
                        type="influenced",
                    )))

    nodes = list(scientist_nodes.values()) + list(discovery_nodes.values())
    return GraphData(nodes=nodes, edges=edges)