import { useState, useEffect } from "react";
import type { GraphData } from "../data/mockData";
import { mockData } from "../data/mockData";

const API_URL = "http://localhost:8000/api/graph";

export type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: GraphData };

export function useGraphData(): FetchState {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GraphData>;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ok", data });
      })
      .catch(() => {
        if (!cancelled) {
          console.warn("Backend unavailable, falling back to mock data");
          setState({ status: "ok", data: mockData });
        }
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}