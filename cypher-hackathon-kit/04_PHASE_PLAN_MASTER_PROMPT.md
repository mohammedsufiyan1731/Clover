# 04: Phase Plan Master Prompt (PRD + Frontend + Backend docs → Playbooks for each person)

**Who runs it:** Integrator.
**Paste into:** a fresh Claude chat, then paste `PRD.md`, `FRONTEND_DESIGN.md`, `BACKEND_SPEC.md` and `API_CONTRACT.md` at the bottom, plus the start time and team names.
**Output (save each in `/docs`):** `PHASE_PLAN.md`, `FRONTEND_PLAYBOOK.md`, `BACKEND_PLAYBOOK.md`, `INTEGRATOR_PLAYBOOK.md`.

```text
ROLE
You are an experienced hackathon team lead and engineering manager. You plan work for a team of 3 beginners who use AI coding agents (Antigravity, Claude, Copilot) so that three people work in parallel without blocking or breaking each other. You write instructions a beginner can follow with zero guessing, in plain words.

CONTEXT
- CYPHER 4.0, 24-hour space hackathon. Judged on innovation, technical complexity, execution, practicality, presentation.
- Team of 3: FRONTEND DEV (owns /frontend), BACKEND DEV (owns /backend), INTEGRATOR (owns /docs, root files, /scripts; does QA, bug triage, deployment checks, demo, pitch).
- Stack: React + Vite + Tailwind v4 (Vercel), FastAPI + PyMongo (Render), MongoDB Atlas.
- A deployed SKELETON already exists. Pushing to `main` auto-deploys both apps (Vercel for /frontend, Render for /backend). Everyone pushes to `main` but only edits their own folder. A GitHub Action (CI) checks that the backend imports and the frontend builds on each push.
- The skeleton has: GET /health, a demo /api/items endpoint, a frontend src/api layer with a VITE_USE_MOCKS flag, mocks folder, a StatusPanel on the home page, scripts/smoke-test.ps1, and agent rule files.

TASK
Using the four documents at the bottom, output FOUR documents separated by the headings "=== PHASE_PLAN.md ===", "=== FRONTEND_PLAYBOOK.md ===", "=== BACKEND_PLAYBOOK.md ===", "=== INTEGRATOR_PLAYBOOK.md ===".

=== PHASE_PLAN.md ===
1. Phase map: a table of phases in order, aligning FRONTEND phases (F0..Fn from FRONTEND_DESIGN.md Section 7) with BACKEND phases (B0..Bn from BACKEND_SPEC.md Section 10). Each combined PHASE row: Phase number, clock time window (use the start time given), Backend work, Frontend work, Integrator work, the demo-able result at the end of the phase, and the "gate": what must pass before the next phase starts.
2. Frontend works ahead on mock data and connects to the backend only when the matching backend phase has been pushed and verified. Show this timing explicitly (a Mermaid Gantt or a table).
3. Critical path and blockers: what blocks what.
4. Timeline for all 24 hours: P0 Understand, P1 Docs/Specs, P2 Stitch + Phase 1 build, Phase 2..N, Harden, FEATURE FREEZE at hour 18, Polish, Demo prep, Buffer. Include meals/sleep slots.
5. "If we are behind" decision list: exactly what to cut first, second, third (using SHOULD/COULD from the PRD), never the wow flow.
6. Team rules: git routine (`git pull --rebase`, commit, `git pull --rebase`, `git push`), commit message format, folder ownership, contract-change procedure, what to do if the CI shows a red cross, bug list `docs/BUGS.md` format.
7. Communication: 30-minute stand-up (2 minutes each: done, doing, blocked), blocker rule (stuck > 20 minutes = ask), sleep rota.
8. Risk register: top 8 risks specific to this project with owner and mitigation.

=== BACKEND_PLAYBOOK.md, FRONTEND_PLAYBOOK.md, INTEGRATOR_PLAYBOOK.md (same format) ===
Each playbook is the personal guide for one person. Start with "Your role in one paragraph", "What you own / must NOT touch", "Your tools", "Your daily loop".
Then for EVERY phase that person works on, a PHASE CARD with exactly these fields:
- Phase and time window
- Goal (one sentence)
- Why it matters (one line)
- Inputs (which docs/sections to read, which earlier phases must be done)
- Steps (numbered, tiny, plain words)
- THE PROMPT TO PASTE INTO YOUR AGENT: a complete, copy-paste prompt block. It must tell the agent to read AGENTS.md and the relevant docs, restrict work to the person's folder, list exact files/endpoints/pages to create, follow the API contract and canonical names, run/test, and not modify anything else. For the frontend, include the Stitch export files to use and which mock data to use. For the backend, include exact endpoints and which collections.
- EXPECTED OUTCOME: what the person should literally see (e.g. "Swagger page at http://localhost:8000/docs lists GET /api/missions; executing it returns 5 missions with id, name, status")
- HOW TO TEST (click-by-click or command with expected output)
- DONE WHEN: checkbox list
- COMMIT AND PUSH: exact commands and commit message
- AFTER YOU PUSH: what you tell the Integrator in the group chat (a message template)
- IF STUCK: the 3 most likely problems and fixes, plus which rescue prompt in 06_RESCUE_PROMPTS.md to use

INTEGRATOR_PLAYBOOK specifics
- Phase 0 (before/at start): run PRD, confirm docs pushed, verify the skeleton is live (run scripts/smoke-test.ps1), confirm Atlas is connected.
- For each phase: a VERIFICATION CARD: wait for both pushes, check CI is green on GitHub, wait for deploys, run the smoke test, then run the phase's user-flow test on the DEPLOYED URLs (step-by-step clicks with expected results), test on a phone, log bugs in docs/BUGS.md with severity (P0 breaks wow flow / P1 fix before freeze / P2 ignore) and owner, then announce "Phase N is GREEN" or "Phase N is RED: X".
- Contract management: how to approve/record contract changes in the Change Log.
- Integration steps for each flow in the Flow Map: switch which frontend calls use the real API, who does it, how to verify.
- QA scripts for each MUST flow, plus error-state tests (backend asleep, empty data, bad input, offline).
- Deployment checks: where to see Vercel/Render logs, what environment variables must exist, how to roll back a bad deploy.
- Demo and pitch pack: 4-minute script with timings mapped to judging criteria, who talks and clicks, max 7 slides, backup video recorded at hour 20, QR code to the live URL, demo reset procedure, Plan B if Wi-Fi/backend fails, Q&A cheat sheet, README final checklist.

RULES
- Every task is 30-90 minutes. Each phase ends with a push AND an Integrator check.
- Prompts for agents must be complete and copy-pasteable. Never write "see above".
- Use the canonical names and endpoint names from the documents exactly.
- Frontend and Backend phases must be independently testable (mocks vs Swagger).
- Be explicit about expected outcomes; beginners need to know what "right" looks like.
- Keep wording simple; define any term on first use.

INPUT
=== Start time of the hackathon, demo time, team names and roles ===
<paste here>

=== PRD.md ===
<paste here>

=== FRONTEND_DESIGN.md ===
<paste here>

=== BACKEND_SPEC.md ===
<paste here>

=== API_CONTRACT.md ===
<paste here>
```

## After you get the output
1. Integrator splits it into the four files in `/docs`, pushes them.
2. Each person opens their own playbook and starts at their first phase card.
3. The Integrator shares the Phase Plan table in the group chat and pins it.
