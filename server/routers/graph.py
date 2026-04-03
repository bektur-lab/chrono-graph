from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from models.graph import GraphData, Node
from data.graph_data import GRAPH, NODE_INDEX
from services.wikidata import fetch_recent_laureates
from services.ai_processor import build_graph_from_wikidata

router = APIRouter(prefix="/api")

# In-memory cache for the live graph (replaced on every /live call)
# In production this would be a Neo4j write → read cycle instead
_live_graph_cache: Optional[GraphData] = None


@router.get("/graph", response_model=GraphData)
def get_graph():
    """Returns mock graph data (static fallback)."""
    return GRAPH


@router.get("/graph/wikidata-raw")
async def get_wikidata_raw():
    """Debug endpoint — returns raw Wikidata rows before AI processing."""
    rows = await fetch_recent_laureates()
    return {"count": len(rows), "rows": rows[:20]}


@router.get("/graph/live", response_model=GraphData)
async def get_live_graph(refresh: bool = False):
    """
    Returns a graph built from Wikidata + Claude AI.

    - First call (or refresh=true): fetches Wikidata → Claude → caches result
    - Subsequent calls: returns cached result instantly

    In production: cache would be replaced by a Neo4j read.
    """
    global _live_graph_cache

    if _live_graph_cache is not None and not refresh:
        return _live_graph_cache

    try:
        raw_rows = await fetch_recent_laureates()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Wikidata fetch failed: {e}")

    if not raw_rows:
        raise HTTPException(status_code=404, detail="No data returned from Wikidata")

    try:
        graph = await build_graph_from_wikidata(raw_rows)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI processing failed: {e}")

    _live_graph_cache = graph
    return graph


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