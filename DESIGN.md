# RepoCity: Requirements

## Functional requirements
- Submit a public GitHub repo URL and get the city view
- View the result on a shareable page (permalink)
- Re-submitting the same repo returns the page instantly (cached)
- No user login required
- Download the city view as an image
- See live status while an analysis runs (queued → cloning → analyzing → ready / failed)
- Clear errors: repo not found, private repo, repo too large, analysis timed out
- Hover or click a building to see file path, language, lines of code
- Permalink is pinned to a commit (`owner/repo@sha`), so a shared link never changes
- Submitting a repo that has new commits triggers a fresh analysis; old permalinks keep working
- Embeddable README badge/image: `/badge/{owner}/{repo}.svg`

## Non-functional requirements
- The API must respond fast even if the analysis is slow (async: accept the job, return immediately)
- 100 people submitting the same repo trigger one analysis, not a hundred (request coalescing)
- One huge or malicious repo must not take down the system (size limits, timeouts, sandboxing)
- Services can scale independently (API, workers, frontend)
- Performance targets:
  - Cache hit: p95 < 200 ms
  - Submit endpoint (accept or cache hit): p95 < 300 ms
  - Analysis of a typical repo (< 50 MB): p95 < 60 s
- Read-heavy workload: results are immutable, so they are CDN-cacheable
- Fair usage: per-IP rate limiting on submissions
- Respect upstream limits: never depend on the GitHub REST API for cloning (use git over HTTPS)
- Security: never execute repo code, no shell interpolation of user input, workers run in resource-limited containers
- Observability: metrics (queue depth, analysis duration, cache hit ratio), structured logs, and a trace across API → queue → worker
- Reproducible deploy: the whole system starts with `docker compose up`
- Storage stays bounded: eviction or TTL for old analyses