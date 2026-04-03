from fastapi import APIRouter, HTTPException, Query
from models.graph import GraphData, Node
from data.graph_data import GRAPH, NODE_INDEX

router = APIRouter(prefix="/api")


@router.get("/graph", response_model=GraphData)
def get_graph():
    return GRAPH


@router.get("/nodes/{node_id}", response_model=Node)
def get_node(node_id: str):
    node = NODE_INDEX.get(node_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found")
    return node


@router.get("/search", response_model=list[Node])
def search_nodes(q: str = Query(..., min_length=1)):
    q_lower = q.lower()
    return [
        n for n in GRAPH.nodes
        if q_lower in n.data.label.lower()
        or q_lower in (n.data.discipline or "").lower()
        or q_lower in (n.data.description or "").lower()
    ]