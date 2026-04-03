# ChronoGraph

A science history graph app that visualizes connections between scientists, discoveries, and inventions across time.

## Features
- Interactive force-directed graph built with D3.js
- Node types: **Scientist**, **Discovery**, **Invention**
- Edge types: discovered, invented, influenced, led_to
- AI-assisted graph enrichment via Anthropic Claude

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript |
| Graph Visualization | D3.js |
| Routing | React Router |
| Backend | Python, FastAPI, Uvicorn |
| HTTP Client | HTTPX |
| AI | Anthropic SDK |
| Database (planned) | Neo4j |

## Project Structure
```
chrono-graph/
├── client/          # React + Vite + TypeScript frontend
│   ├── src/
│   ├── index.html
│   └── package.json
├── server/          # FastAPI backend
│   ├── venv/        # Python virtual environment
│   ├── main.py
│   └── requirements.txt
├── CLAUDE.md        # Context for Claude Code
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- Python 3.9+

### Frontend
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd server
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

## API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/graph` | Fetch full graph data (nodes + edges) |
