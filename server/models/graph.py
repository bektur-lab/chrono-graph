from typing import Literal, Optional
from pydantic import BaseModel

NodeVariety = Literal["scientist", "discovery", "invention"]
EdgeType = Literal["discovered", "invented", "influenced", "led_to"]


class NodeData(BaseModel):
    id: str
    label: str
    variety: NodeVariety
    discipline: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None


class EdgeData(BaseModel):
    source: str
    target: str
    type: EdgeType


class Node(BaseModel):
    data: NodeData


class Edge(BaseModel):
    data: EdgeData


class GraphData(BaseModel):
    nodes: list[Node]
    edges: list[Edge]