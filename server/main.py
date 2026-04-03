from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ChronoGraph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "ChronoGraph API is running"}


@app.get("/graph")
def get_graph():
    # Placeholder graph data
    return {
        "nodes": [
            {"id": "1", "label": "Isaac Newton", "type": "scientist"},
            {"id": "2", "label": "Gravity", "type": "discovery"},
            {"id": "3", "label": "Albert Einstein", "type": "scientist"},
            {"id": "4", "label": "General Relativity", "type": "discovery"},
        ],
        "edges": [
            {"source": "1", "target": "2", "type": "discovered"},
            {"source": "1", "target": "3", "type": "influenced"},
            {"source": "3", "target": "4", "type": "discovered"},
            {"source": "2", "target": "4", "type": "led_to"},
        ],
    }
