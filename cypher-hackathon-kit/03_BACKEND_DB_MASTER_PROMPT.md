# 03: Backend + Database Master Prompt (PRD → Backend Spec, API Contract, DB design, Phases)

**Who runs it:** Backend Dev (Integrator reviews).
**Paste into:** a fresh Claude chat, then paste the full `docs/PRD.md` at the bottom.
**Output:** two files. Save as `docs/BACKEND_SPEC.md` (includes the database design and backend build phases) and `docs/API_CONTRACT.md` (the contract both sides obey).

Backend and database are in ONE prompt because they are designed together: every endpoint maps to specific collections and queries.

```text
ROLE
You are a senior backend architect and MongoDB modeller mentoring beginners in a 24-hour hackathon. You design simple, robust backends that AI coding agents can generate reliably. You explain everything in plain words.

FIXED STACK
Python 3.11, FastAPI, Uvicorn, Pydantic v2, pydantic-settings, PyMongo (synchronous driver; use plain `def` endpoints), MongoDB Atlas free M0, certifi, python-dotenv. Add libraries only when needed and justify them (for example PyJWT + bcrypt for login, httpx for calling an external/AI API). The backend already exists as a deployed SKELETON with: app/main.py, app/config.py, app/db.py, app/routers/health.py, app/routers/items.py (demo), a response envelope { "success": true, "data": ... }, CORS configured by env vars, GET /health, seed.py, and auto-deploy to Render on push to main. Build ON TOP of this skeleton; do not redesign it.

TASK
From the PRD at the bottom, produce TWO documents in one answer, clearly separated by the headings "=== BACKEND_SPEC.md ===" and "=== API_CONTRACT.md ===".

=== BACKEND_SPEC.md must contain ===

# 1. Plain-Language Overview
What the backend does, in simple words; how a request travels (frontend -> endpoint -> service -> MongoDB -> response). A table mapping each PRD feature (F-IDs) to the backend modules and endpoints.

# 2. Folder Structure
Tree under /backend (app/{main.py, config.py, db.py, routers/, schemas/, services/, utils/}, seed.py, requirements.txt, .env.example), marking which files already exist in the skeleton and which are new, with one line per file saying what it does.

# 3. Environment Variables
Table: name, example, who provides it, secret?, where set (local .env / Render dashboard). Existing: MONGODB_URI, DB_NAME, CLIENT_ORIGINS, CLIENT_ORIGIN_REGEX. Add only what the project needs (e.g. AI_API_KEY, JWT_SECRET).

# 4. Authentication Decision
Does the wow flow need login? Choose the simplest option (none / demo users / JWT) and justify. If login isn't essential, make it a SHOULD, not a MUST.

# 5. Database Design (MongoDB Atlas)
- Collections list and why each exists (aim for 2-5).
- For each relationship: EMBED vs REFERENCE with one-line reason.
- Per collection: purpose, a realistic example document, field table (name, type, required, default, validation, notes) with camelCase names identical to API_CONTRACT schemas, indexes (and which query each serves).
- Pydantic models for requests/responses (code block), and a small helper to convert Mongo `_id` (ObjectId) to string `id` in responses.
- Query map: for every endpoint, the PyMongo operation (find/insert/update/aggregate), filter, sort, projection, pagination. Full aggregation pipelines for any stats endpoints.
- Seed data plan: counts (15-40 docs), realistic values, dates spread over the last 30 days, mixed statuses, 2+ "hero" records for the wow moment, and the complete `seed.py` code (clears only the project collections, supports `--force`, prints a summary).
- Data safety: backup export script before the demo and a "demo reset" idea.

# 6. Module Specs
For each module (e.g. missions, reports, ai): responsibilities, service functions (name, inputs, outputs, errors), business rules, edge cases, validation. Protect against NoSQL injection by never passing raw user dicts into queries; validate with Pydantic; reject keys starting with `$`.

# 7. Smart / AI Service (if the PRD has one)
Prompt template(s), input sanitisation, output JSON shape, 15-second timeout, one retry, and a deterministic FALLBACK response so the demo never fails. Keep the provider configurable by env var; the decision on provider will be made later.

# 8. Error Handling
One JSON error shape: { "success": false, "error": { "code": "STRING_CODE", "message": "...", "details": [] } }. Custom FastAPI exception handlers for validation errors (422 -> VALIDATION_ERROR), not found, and unexpected errors. HTTP status usage table.

# 9. Security Basics for a Hackathon
CORS allowlist via env, no secrets in Git, input validation, rate limiting only if cheap, password hashing if auth, never trust the client, never log secrets.

# 10. BACKEND BUILD PHASES (very important)
Break the backend into small, independently pushable phases, in the same order as the PRD's MUST features and build groups. Phase B0 is the existing skeleton. For EACH phase:
- Goal in one sentence
- Exact endpoints delivered
- Files created/changed
- Database work (collections, indexes, seed additions)
- "Test it" steps using the Swagger page at /docs on localhost, with example inputs and EXPECTED outputs
- "Frontend can now connect to" (which pages/phase of the frontend unlocks)
- "Done when" checklist
- Commit message to use
- What the Integrator should check on the deployed URL
Typical shape: B1 data model + seed + read endpoints for the first feature, B2 create/update/delete for it, B3 next feature..., B-AI smart feature, B-final hardening (validation, errors, demo reset). Each phase should take about 45-90 minutes.

# 11. Deployment Notes
Render auto-deploys on push to main; how to read logs; free-tier cold start (~1 min) and how to warm it before demos; what to do if deploy fails.

# 12. Testing
For every endpoint a ready-to-run PowerShell example (Invoke-RestMethod) and a Swagger click-path. A smoke checklist.

# 13. Backend Definition of Done
Checklist.

=== API_CONTRACT.md must contain ===
- Conventions: local base URL http://localhost:8000, production base URL <render-url>; all endpoints under /api except /health.
- Response envelope for success and error (as above); dates are ISO 8601 UTC strings; IDs are strings named `id`.
- Summary table of ALL endpoints: method, path, purpose, pages that call it (S-IDs), feature (F-ID), backend phase (B1...), auth required.
- For EVERY endpoint: parameters/query/body with types and validation rules, example request, realistic example success response, error cases with codes, pagination/sorting if a list.
- Shared object schemas (field names FINAL; DB, backend and frontend mocks must use them exactly).
- "Mock data rule": frontend mocks are copies of these example responses.
- "Flow Map": for each MUST feature, the ordered API calls the frontend makes. This guarantees flows don't break.
- "Phase Availability" table: which endpoints go live in which backend phase, so the frontend knows what can be connected when.
- Change Log (empty). Rule: only the Integrator edits this file, after both devs agree.
- Handshake checklist for the Integrator before integration begins (6 checks).

RULES
- Minimal endpoints: only what pages need (typically 8-15). No speculative endpoints.
- RESTful plural nouns, camelCase JSON, consistent envelope.
- Use the PRD's canonical names exactly.
- Include a dev-only POST /api/demo/reset that re-seeds the demo data.
- Code only where stated (Pydantic models, seed.py, aggregation pipelines, small examples). Keep code short and runnable.
- If the PRD is ambiguous, state the assumption at the top and proceed.
- Explain decisions in one line each; the reader is a beginner.

INPUT
=== PRD.md (paste full contents) ===
<paste here>

=== Optional: existing skeleton notes or decisions (e.g. "we need login", "use Gemini for AI") ===
<paste here>
```

## What the Backend Dev does with the output
1. Split the answer into `docs/BACKEND_SPEC.md` and `docs/API_CONTRACT.md`; give both to the Integrator to push and review.
2. Read Section 1 and Section 10 (the phases). Phase B1 is your first task once the Phase Plan (prompt 04) is ready.
3. Atlas is already connected from the skeleton. Use `/docs` on your local server (http://localhost:8000/docs) to test.
