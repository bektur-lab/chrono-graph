# ChronoGraph — Claude Code Context

## Project Overview
ChronoGraph is a science history graph application that visualizes connections between scientists, discoveries, and inventions across time.

## Graph Schema

### Node Types
| Type | Description |
|------|-------------|
| `scientist` | A historical or contemporary scientist |
| `discovery` | A scientific discovery (e.g., gravity, DNA structure) |
| `invention` | A physical invention or technology (e.g., telescope, transistor) |

### Edge Types
| Type | Direction | Description |
|------|-----------|-------------|
| `discovered` | scientist → discovery | Scientist made a discovery |
| `invented` | scientist → invention | Scientist created an invention |
| `influenced` | scientist → scientist | One scientist influenced another |
| `led_to` | discovery/invention → discovery/invention | One finding led to another |

## Architecture

### Frontend (`client/`)
- React 19 + Vite + TypeScript
- D3.js for force-directed graph visualization
- React Router for navigation
- Communicates with backend via REST API

### Backend (`server/`)
- Python FastAPI
- Virtual environment at `server/venv/`
- Run with: `uvicorn main:app --reload`
- CORS configured for `localhost:5173`
- Anthropic SDK available for AI-assisted graph enrichment

### Database (planned)
- Neo4j — native graph database
- Nodes and edges map directly to the schema above

## Dev Setup
```bash
# Frontend
cd client && npm run dev        # → http://localhost:5173

# Backend
cd server
source venv/bin/activate
uvicorn main:app --reload       # → http://localhost:8000
```

## API Endpoints
- `GET /` — health check
- `GET /graph` — returns full graph (nodes + edges)
