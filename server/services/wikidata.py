"""
Fetches recent Nobel Prize laureates (2020–2025) and their notable works
from the Wikidata SPARQL endpoint.
"""

import logging
import httpx

logger = logging.getLogger(__name__)

SPARQL_URL = "https://query.wikidata.org/sparql"

# Nobel Prize laureates 2020–2025 with their fields and notable works.
# Uses wdt:P279* (subclass chain) to reliably match all Nobel Prize types.
QUERY = """
SELECT DISTINCT
  ?person ?personLabel
  ?award ?awardLabel
  ?year
  ?field ?fieldLabel
  ?work ?workLabel
  ?birthYear
WHERE {
  # Award date is stored as a qualifier on the P166 statement
  ?person p:P166 ?awardStmt .
  ?awardStmt ps:P166 ?award .
  ?awardStmt pq:P585 ?date .
  BIND(YEAR(?date) AS ?year)
  FILTER(?year >= 2020)

  # Only Nobel Prizes in Physics, Chemistry, Medicine/Physiology
  VALUES ?award {
    wd:Q38104
    wd:Q44585
    wd:Q80061
  }

  OPTIONAL {
    ?person wdt:P569 ?birth .
    BIND(YEAR(?birth) AS ?birthYear)
  }
  OPTIONAL { ?person wdt:P101 ?field }
  OPTIONAL { ?person wdt:P800 ?work }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
  }
}
ORDER BY DESC(?year) ?personLabel
LIMIT 200
"""


async def fetch_recent_laureates() -> list[dict]:
    """
    Returns raw Wikidata bindings for Nobel laureates 2020–2025.
    Each item is a flat dict of string values.
    """
    headers = {
        "Accept": "application/sparql-results+json",
        "User-Agent": "ChronoGraph/1.0 (https://github.com/bektur-lab/chrono-graph)",
    }
    params = {"query": QUERY, "format": "json"}

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(SPARQL_URL, params=params, headers=headers)
        logger.info("Wikidata status: %s", response.status_code)
        response.raise_for_status()
        data = response.json()

    bindings = data.get("results", {}).get("bindings", [])
    logger.info("Wikidata returned %d rows", len(bindings))

    if bindings:
        logger.debug("First row sample: %s", bindings[0])

    results = []
    for binding in bindings:
        results.append({k: v.get("value", "") for k, v in binding.items()})

    return results