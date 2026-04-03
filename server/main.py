from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.graph import router as graph_router

app = FastAPI(title="ChronoGraph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph_router)


@app.get("/")
def root():
    return {"message": "ChronoGraph API is running"}