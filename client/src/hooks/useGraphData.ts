import { useState, useEffect } from "react";
import type { GraphData } from "../data/mockData";
import { mockData } from "../data/mockData";

const API_BASE = "http://localhost:8000/api";

export type FetchState =
  | { status: "loading"; message?: string }
  | { status: "error"; message: string }
  | { status: "ok"; data: GraphData; source: "live" | "mock" };

export function useGraphData(refresh = false): FetchState {
  const [state, setState] = useState<FetchState>({
    status: "loading",
    message: "Fetching data from Wikidata…",
  });

  useEffect(() => {
    let cancelled = false;

    const url = `${API_BASE}/graph/live${refresh ? "?refresh=true" : ""}`;

    setState({ status: "loading", message: "Fetching data from Wikidata…" });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GraphData>;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ok", data, source: "live" });
      })
      .catch(() => {
        if (!cancelled) {
          console.warn("Backend unavailable, falling back to mock data");
          setState({ status: "ok", data: mockData, source: "mock" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return state;
}