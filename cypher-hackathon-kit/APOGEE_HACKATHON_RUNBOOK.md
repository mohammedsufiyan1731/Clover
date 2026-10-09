# CYPHER 4.0 — Apogee Team Runbook
**Timing convention:** The input's “Start time / demo time / team names” field was left as a placeholder, so no clock-time start or demo time can be grounded. All times below are relative to hackathon start (`H+00:00`). Replace H+ with actual clock times in the first 10 minutes. Treat phase windows as targets, not permission to skip gates. Every phase ends with a push and an Integrator verification.

=== PHASE_PLAN.md ===

# Phase Plan

## 1. Phase map

The source documents define F0 and four frontend groups, and B0–B5 on the backend. The plan below aligns them into the smallest useful increments. The MUST path is F1–F5 (PRD features), not optional F6–F11. Phase windows are relative to hackathon start because the supplied start-time field is blank.

| Combined phase | Target window | Backend work | Frontend work | Integrator work | Demo-able result at end | Gate before next phase |
|---|---|---|---|---|---|---|
| P0 Understand | H+00:00–00:30 | Read PRD and spec; verify current `/health` and Atlas settings without changing code | Read design, inspect existing routes and mock/API layer | Confirm GitHub repo, deployed URLs, team names, demo time, access and secrets; run baseline smoke test | Team can explain the 90-second wow flow and current skeleton state | Baseline recorded; no one starts feature work before scope and ownership are clear |
| P1 Docs / Specs | H+00:30–01:15 | Confirm endpoint names, collections, response envelope, seed account plan | Confirm S1–S8 names, Stitch export locations, mock fixture names and API wrapper | Ensure `API_CONTRACT.md` is committed; record unresolved decisions and phase gates | One agreed API contract; each developer can work independently | Contract reviewed by both devs; changes thereafter use change-log procedure |
| P2 Stitch + Phase 1 build | H+01:15–03:15 | **B0** stabilize skeleton; then begin **B1** auth, users, batches and test-builder endpoints | **F0** shared shell/routes; start Group 1 screens S1, S2 basic, S8 with mocks | Verify CI and deployments; smoke-test skeleton; prepare `docs/BUGS.md`; check Atlas | Branded navigable shell and local Swagger foundation; all pages have a route | F0 builds; B0 health passes; CI green; contract names match |
| P3 Foundation features | H+03:15–06:00 | Finish **B1**: auth, role guards, batches, tests, questions, CSV import/assign, analytics overview/export shell | Finish Group 1: S1 Launch Gate, S2 Mission Control basic, S8 Command Center; keep mock mode until B1 is deployed and verified | Verify login roles, test creation/import/assignment, roster and CSV export on deployed URLs | Login works; student sees readiness and assigned tests; trainer creates and assigns test | B1 endpoint checks pass on deployed backend; assigned-batch rule confirmed; frontend switches only these flows to real API after green gate |
| P4 Test Arena + Debrief | H+06:00–09:00 | **B2** start attempt, shuffled safe questions, submit once, server scoring, topic timing, batch average, readiness v1 | Group 2 S3 Test Arena + S4 Debrief, first with mock `SQL Fundamentals Check` fixture | Verify CI/deploy, timer and API; test hidden answer protection and mobile 375px | Student completes timed test; Debrief shows score, topic accuracy, time and batch average | Real B2 deployed and tested; score changes from saved attempt; no `correctIndex` in student response |
| P5 Resume + Interview wow flow | H+09:00–13:00 | **B3** text PDF extraction, rules analyzer, fallback interview, report persistence, readiness v2; AI adapter only after fallback works | Group 3 S6 Resume Lab + S5 Interview Room; use NovaPay sample job description and matching mock fixtures until B3 verified | Run the exact resume → interview → report → readiness → trainer roster story on deployed URLs | Main wow flow works with AI enabled or explicitly labelled BASIC MODE fallback | F1–F5 MUST demo passes end-to-end; all report fields exist; score and trainer view reflect saved data |
| P6 Seed + harden | H+13:00–15:00 | **B4** deterministic `seed.py`, authorization tests, deployment configuration, smoke tests | Fix only P0/P1 UI bugs; remove silent fake-success fallback after real API integration | Reset seed data, run all MUST flows, test phone and error states, prepare screenshots/video | Repeatable demo with Aarav, Priya, Rohan and seeded batch data | Integrator announces “Phase 6 is GREEN”; no unresolved P0 |
| P7 Optional extras (conditional) | H+15:00–17:30 | **B5** only if B0–B4 pass; expose only genuinely implemented optional routes | Group 4 S7 and S2 additions only after MUST flows pass | Keep MUST regression running; cut extras immediately if they threaten stability | At most one extra that really works; MUST demo remains intact | Extra is isolated, tested and labelled; otherwise skip it |
| P8 FEATURE FREEZE | H+18:00 | No new feature work; only safe bug fixes | No new pages/features; visual and responsive polish only | Declare freeze; create release checklist; verify current live commit | Stable release candidate | Any change after freeze must fix a demonstrated bug and pass full smoke test |
| P9 Polish | H+18:00–19:30 | Fix only deployment/data bugs; warm Render | Improve legibility, loading/error states and small-screen layout | Verify Vercel/Render logs, env vars, live URLs and seed reset | Clean demo surfaces, no broken links or console errors | Live critical path passes twice consecutively |
| P10 Demo prep | H+19:30–21:00 | Stay available for production bug fixes | Keep deployed build unchanged unless Integrator authorizes a fix | Record 90-second backup video by H+20; finish slides, QR code, script, Q&A and demo reset | Live demo and offline Plan B both ready | Video opens on another device; QR code points to live Vercel URL |
| P11 Buffer + presentation | H+21:00–24:00 | On-call only | On-call only | Rehearse 4-minute pitch, verify demo account, avoid risky deploys; use buffer for recovery | Judges see the wow flow and understand innovation, complexity, execution and practicality | Final check immediately before presentation; if live system fails, use video/screenshots |

**Sleep and meals:** Do not schedule a full-team sleep block during the 24 hours. Rotate rest in short blocks after H+13:00: one person rests while two remain available, and never leave a live deploy or demo reset unattended. Suggested meals: H+04:00 (15–20 min staggered), H+10:00 (20 min staggered), H+16:00 (20 min staggered), H+21:30 (snack/water). If the event permits naps, each person gets one 60–90 minute protected rest block between H+13:00 and H+18:00, staggered and only after their phase handoff.

## 2. Mock-first / API-later schedule

| Flow | Frontend may build with mocks | Backend must push and Integrator must verify | Frontend may switch to real API when |
|---|---|---|---|
| S1/S2/S8: login, roles, dashboard, roster, tests builder | From F0 and Group 1 start; use seeded-shaped fixtures | B1 endpoints are deployed; auth, roles, assignment and roster checks pass | Integrator announces Phase 3 GREEN and names the approved endpoints |
| S3/S4: test and debrief | From Group 2 start; use `SQL Fundamentals Check`, 12 MCQs, sample attempt and batch average 68 | B2 start/submit/attempt/debrief/dashboard endpoints pass on Render | Integrator announces Phase 4 GREEN |
| S6/S5: resume and interview | From Group 3 start; use sample resume, NovaPay description, ATS 61, missing `REST API`, `Docker`, `SQL joins` and sample adaptive follow-up | B3 resume/interview endpoints and fallback report pass on Render | Integrator announces Phase 5 GREEN |
| S7 and optional S2 additions | Only after MUST demo is green | B5 routes are implemented, tested and not placeholder success | Integrator explicitly approves the optional integration |

Never silently replace a failed real API response with invented successful data. Show a retryable error. A clearly labelled `BASIC MODE` fallback is permitted for AI failure, and deterministic seeded database records are permitted for the demo.

## 3. Critical path and blockers

1. API contract agreement blocks frontend API wiring and backend route naming.
2. B0 blocks trustworthy backend feature work and deployment verification.
3. B1 blocks real login, role-aware dashboard, trainer builder and batch assignment integration.
4. B2 blocks real Test Arena/Debrief integration and readiness v1.
5. B3 blocks the wow flow: resume gap → adaptive interview → report → readiness update → trainer view.
6. Seed data and stable deployed URLs block repeatable rehearsal.
7. No SHOULD/COULD work starts before F1–F5 pass end-to-end.
8. CI red blocks phase GREEN. Do not push another unrelated feature on top of a failing main branch.

Parallelism rule: frontend continues visual work with mocks while backend builds the matching phase. Integration is a short, explicit handoff after backend push + green CI + deployed endpoint test. Do not ask the backend developer to debug frontend code or vice versa; Integrator triages and routes ownership.

## 4. If we are behind: cut order

Cut exactly in this order, and never cut the wow flow:

1. **First cut: COULD F11 Focus Guard**, then F10 Smart Study Plan and F9 Study Library & Company Tracks. These are optional and not part of the 90-second wow moment.
2. **Second cut: SHOULD F8 Resume Builder and F7 Streaks & Leaderboard.** Keep the single Launch Readiness Score and trainer roster from the MUST path.
3. **Third cut: SHOULD F6 Code Lab** (or reduce it to a clearly labelled editor-only/seeded demo only if it is already stable). Do not build an unsafe server-side code runner.

Never cut F1–F5 or the wow flow. If those are not working, spend all remaining feature time on them.

## 5. Team rules

### Git routine (everyone, before every push)
```bash
git status
git pull --rebase origin main
# edit only your owned files
git add <your-owned-paths>
git commit -m "type(scope): short description"
git pull --rebase origin main
git push origin main
```
Commit format: `feat(frontend): build resume lab`, `fix(backend): reject duplicate email`, `docs(integrator): record phase 3 gate`, `test(backend): cover attempt scoring`. Keep each commit focused. Never force-push. If rebase reports conflicts, stop and ask Integrator; do not guess which version to keep.

### Folder ownership
- FRONTEND DEV: `/frontend` only.
- BACKEND DEV: `/backend` only.
- INTEGRATOR: `/docs`, `/scripts`, root files, CI/deployment configuration and coordination.
- Do not edit another owner's folder, even to “quickly fix” it. Report the bug and owner.
- Secrets stay in hosting environment settings or local ignored `.env`; never commit them.

### Contract-change procedure
1. Developer posts the exact proposed endpoint/field change and reason in group chat.
2. Both frontend and backend owners approve before code changes.
3. Integrator updates `API_CONTRACT.md` Change Log with version, date/hour, old → new shape, reason, approvers and affected flows.
4. Backend pushes implementation; frontend remains on mocks until the new contract is verified.
5. Integrator tests it on deployed URLs and announces the new approved contract version. No private contract changes.

### Red CI cross
1. Stop feature work and do not push another feature.
2. Open the failed GitHub Action and read the first actual error, not just the final “failed” line.
3. Identify owner by changed path. Owner fixes only their folder, runs the same local check, commits and pushes.
4. Integrator reruns smoke test and verifies green CI before reopening the phase.
5. If the failure is not obvious in 20 minutes, use the matching rescue prompt and ask the team. Never disable CI to make the badge green.

### `docs/BUGS.md` format
```md
| ID | Severity | Flow/page | Steps to reproduce | Expected | Actual | Owner | Status | Found at commit |
|---|---|---|---|---|---|---|---|---|
| BUG-001 | P1 | S6 Resume Lab | Upload sample PDF, click Analyze | ATS score and line rewrite appear | Blank result panel | Frontend Dev | Open | abc1234 |
```
Severity: **P0** breaks the wow flow or blocks app start; **P1** must fix before freeze; **P2** ignore unless time remains. Every bug needs an owner and reproducible steps.

## 6. Communication and sleep rota

- Every 30 minutes: 6-minute stand-up, exactly 2 minutes per person: **Done / Doing / Blocked**. Integrator records blockers and phase state.
- Stuck for more than 20 minutes: ask in group chat with the error, command/clicks, expected vs actual, last commit and what was tried. Do not silently struggle.
- Integrator posts one of: `Phase N is GREEN` or `Phase N is RED: <specific blocker>`.
- Sleep rota after H+13:00: Integrator first gets 60–90 minutes while both developers remain available; then frontend rests while backend + Integrator cover; then backend rests while frontend + Integrator cover. Move blocks if a gate is red. No one naps simultaneously with the only person who can fix an active P0.

## 7. Risk register — top 8

| Risk | Owner | Mitigation / trigger |
|---|---|---|
| Scope exceeds 24 hours | Integrator | MUST F1–F5 only until wow flow is green; use cut order above |
| AI slow, odd or unavailable | Backend Dev | Rules-based resume analysis and seeded interview follow-ups must work with `AI_PROVIDER=none`; 15-second timeout; show `BASIC MODE` |
| AI key/quota failure | Backend Dev | Test key early; keep fallback as default; never put key in frontend |
| Render sleeps / cold start | Integrator | Warm service 10 minutes before demo; check logs and `/health`; backup video and screenshots |
| Live demo has empty/bad data | Integrator | Repeatable `seed.py`; verify Aarav, Priya, Rohan and CSE-A 2027 before rehearsal |
| Team edits overlap | All; Integrator enforces | Strict folder ownership, small commits, rebase before push |
| API contract drift | Integrator | Contract change procedure; no frontend integration before matching gate |
| Mobile/phone layout or CORS failure | Frontend Dev for UI; Backend Dev for CORS; Integrator verifies | Test 375px; set exact Vercel origin in `CORS_ORIGINS`; test deployed, not only localhost |

---

=== FRONTEND_PLAYBOOK.md ===

# Frontend Playbook

## Your role in one paragraph
You own the React + Vite + Tailwind v4 app in `/frontend`. Build the Apogee screens in the order defined by `FRONTEND_DESIGN.md`, use Stitch exports as the visual starting point, and use mock data until the matching backend phase has been pushed, CI is green, and the Integrator has verified the deployed endpoints. Your job is to make the full MUST journey clear, responsive and honest—not to invent backend fields or silently fake successful API calls.

## What you own / must NOT touch
- Own: `/frontend` only, including React components, routes, styling, mock fixtures, `src/api` wrappers and frontend tests.
- Must NOT touch: `/backend`, `/docs`, `/scripts`, root files, deployment config or CI. Do not change endpoint/field names privately.
- Never expose AI keys in Vite variables. Only public base URL and public feature flags belong in `VITE_*`.
- Keep the existing `VITE_USE_MOCKS` switch. Mocks are for unintegrated screens or clearly labelled demo fixtures, not silent API-failure success.

## Your tools
VS Code, Git, Node/npm, browser dev tools, mobile responsive mode, Stitch export HTML/CSS/screenshots, Antigravity/Claude/Copilot. Use browser console and Network tab. Ask Integrator for deployed URLs and approved API contract version.

## Your daily loop
1. Read `AGENTS.md`, `FRONTEND_DESIGN.md`, `PRD.md`, and `API_CONTRACT.md`.
2. Pull with rebase; check `git status`.
3. Work on one 30–90 minute card only.
4. Run `npm run build` (and existing lint/test scripts if present).
5. Check desktop and 375px phone width; inspect console.
6. Commit only `/frontend`, rebase, push.
7. Tell Integrator what changed, what is tested, the commit hash, and which gate is needed.
8. Do not wire real API calls until the Integrator announces the matching phase GREEN.

## PHASE CARD F0 — Foundation (H+01:15–02:15)

**Goal:** Build the shared shell and route scaffolding for S1–S8 using mock data.

**Why it matters:** All later pages need consistent navigation, styling, and error/loading patterns.

**Inputs:** `AGENTS.md`; `FRONTEND_DESIGN.md` Sections 1–5 and 7 (F0); `API_CONTRACT.md` Sections 1 and 7; existing frontend skeleton and agent rules.

**Steps**
1. Inspect `/frontend/src` and identify the current entry point, router, API layer, mocks and `StatusPanel`.
2. Locate Stitch exports/screens for Style Seed and S1–S8. Use exports if present; if HTML/CSS exports exist, copy/adapt their structure into React components—do not paste an entire exported app over the Vite skeleton. If no exports are committed, use the screenshots and exact design tokens from Section 2; do not invent a new visual system.
3. Apply Tailwind v4 tokens: Ink `#0E1116`, Panel `#161B22`, Paper `#F2EBDD`, Signal `#FF5A1F`, Phosphor `#3DFFA2`, Amber `#FFB547`, Steel `#8B98A9`, Ice `#BFE3FF`; use Space Grotesk, Inter and JetBrains Mono.
4. Build/reuse `TelemetryBar`, `Navbar`, `Button`, `BriefingCard`, `PanelCard`, `StatusStamp`, `PageHeader`, `FormField`, `OrbitLoader`, `EmptyState`, `ErrorState`, `Toast` and `Modal`.
5. Ensure routes exist for S1 Launch Gate, S2 Mission Control, S3 Test Arena, S4 Debrief, S5 Interview Room, S6 Resume Lab, S7 Code Lab and S8 Command Center. Placeholder content is acceptable at this phase.
6. Add role-aware route guard: student → S2; trainer/admin → S8. Do not rely on hiding links alone for security.
7. Keep `VITE_USE_MOCKS` and the existing `src/api` layer; add no real calls yet. Keep shared API envelope handling aligned with `{ success, data }` / `{ success, error }`.
8. Run build and check every route and mobile menu.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, frontend/AGENTS.md if present, FRONTEND_DESIGN.md Sections 1–5 and 7 F0, PRD.md Sections 0–5, and API_CONTRACT.md Sections 1 and 7 before editing. Work ONLY inside /frontend. Do not modify backend, docs, scripts, root files, CI or deployment configuration. Preserve the existing Vite skeleton, src/api layer, VITE_USE_MOCKS flag, mocks folder and StatusPanel until replacements are verified. Use the existing Stitch Style Seed and screen exports for S1 Launch Gate, S2 Mission Control, S3 Test Arena, S4 Debrief, S5 Interview Room, S6 Resume Lab, S7 Code Lab and S8 Command Center if they exist; adapt exported HTML/CSS into React rather than replacing the app. If exports are absent, follow FRONTEND_DESIGN.md tokens exactly. Create/reuse the shared shell components TelemetryBar, Navbar, Button, BriefingCard, PanelCard, StatusStamp, PageHeader, FormField, OrbitLoader, EmptyState, ErrorState, Toast and Modal. Add routes for all canonical S1–S8 page names. Add role-aware navigation/guards (student → S2; trainer/admin → S8). Use mock data only, no real API integration in this phase. Do not invent endpoint names or change camelCase API fields. Make the app responsive at 375px, show loading/empty/error states, and keep keyboard focus visible. Run npm run build and any existing frontend tests; fix errors caused by your changes. Do not add unrelated dependencies. Report exact files changed, commands run and results. Do not edit anything outside /frontend.
```

**EXPECTED OUTCOME:** `npm run dev` opens the common Apogee shell; all eight canonical routes render; the same telemetry bar/navigation style appears throughout; role redirects work with mock users; no browser console errors.

**HOW TO TEST**
1. In a terminal: `cd frontend`, `npm install` only if dependencies are not installed, then `npm run dev`.
2. Open the printed local URL.
3. Visit each route S1–S8 using the app navigation or route URLs; no blank page should appear.
4. Set browser responsive width to 375px; verify no horizontal page scroll.
5. Run `npm run build`; expected: Vite exits with code 0 and prints built assets.

**DONE WHEN**
- [ ] Tailwind v4 tokens/fonts are global.
- [ ] S1–S8 routes render in one shell.
- [ ] Role redirects are correct.
- [ ] Existing API/mocks switch remains intact.
- [ ] Build passes; no console errors.
- [ ] Only `/frontend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add frontend
git commit -m "feat(frontend): build shared Apogee shell"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Frontend F0 pushed: <commit>. Build: PASS/FAIL. S1–S8 routes: PASS/FAIL. 375px check: PASS/FAIL. Still mock-only. Integrator, please verify CI/deploy and confirm F0 GREEN.
```

**IF STUCK**
1. Tailwind classes do not apply: confirm the existing Tailwind v4 Vite setup and CSS `@import "tailwindcss";`; do not replace configuration blindly.
2. Routes show blank screens: inspect browser console and route imports; temporarily render a simple page for the failing route.
3. Stitch export conflicts with React structure: reuse layout/styles/assets, not the exported full HTML document.
Rescue prompt: use the relevant “frontend build/build error” prompt in `06_RESCUE_PROMPTS.md` if that file exists in the repository; if it does not, ask the agent to explain the first error and propose the smallest fix without editing other folders.

## PHASE CARD F1 — Group 1: S1, S2 basic, S8 (H+02:15–05:30)

**Goal:** Finish Launch Gate, Mission Control basics and Command Center using mocks first, then connect only after B1 is GREEN.

**Why it matters:** Login, role-aware dashboards and trainer batch tools establish the practical product foundation.

**Inputs:** `FRONTEND_DESIGN.md` Sections 3–5, 7 Group 1; `PRD.md` F1/F2 acceptance criteria; `API_CONTRACT.md` Sections 2–4, 6–8; F0 done.

**Steps**
1. Build S1 login/register forms and visible invalid-credentials errors.
2. Build S2 readiness score (seeded 54), assigned tests and recommended next action.
3. Build S8 tabs for Tests, Batches and Students; create test form, CSV import summary (`22 added / 2 rejected`) and assign action.
4. Use mock fixtures for Aarav Sharma, Ms. Priya Nair, Dr. Rohan Kulkarni, batch `CSE-A 2027`, 12 students and three weak topics.
5. Implement API calls only in `src/api`; leave mock mode on while backend B1 is being built.
6. After Integrator says B1 GREEN, wire only the approved B1 endpoints: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`, `/api/v1/users/me`, `/api/v1/batches`, `/api/v1/tests`, `/api/v1/tests/{testId}/questions`, `/api/v1/tests/{testId}/questions/import`, `/api/v1/tests/{testId}/assign`, `/api/v1/analytics/overview`, `/api/v1/analytics/batches/{batchId}/readiness.csv`.
7. Handle `accessToken`, `Authorization: Bearer <token>`, JSON envelope and errors exactly. Do not fabricate successful data when a request fails.
8. Test student/trainer/admin routing and logout.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, frontend/AGENTS.md if present, PRD.md F1 and F2 acceptance criteria, FRONTEND_DESIGN.md Sections 3–5 and 7 Group 1, and API_CONTRACT.md Sections 1–8. Work ONLY inside /frontend. Preserve the shared F0 shell, src/api layer, VITE_USE_MOCKS and mocks. Use Stitch exports for S1 Launch Gate, S2 Mission Control and S8 Command Center if present; use the exact canonical names. Build S1 login/register, S2 readiness score seeded at 54 with assigned tests and recommended next action, and S8 Tests/Batches/Students tabs with test creation, CSV import accepted/rejected summary and batch assignment. Use mock fixtures for Aarav Sharma (student), Ms. Priya Nair (trainer), Dr. Rohan Kulkarni (admin), CSE-A 2027 with 12 students, three weak topics and CSV summary 22 added / 2 rejected. Initially keep mock mode on. Do not wire real calls unless the Integrator has explicitly confirmed B1 GREEN; then use only POST /api/v1/auth/register, POST /api/v1/auth/login, GET /api/v1/auth/me, PATCH /api/v1/users/me, GET /api/v1/batches, POST/GET /api/v1/tests, GET /api/v1/tests/{testId}, POST/GET /api/v1/tests/{testId}/questions, POST /api/v1/tests/{testId}/questions/import, POST /api/v1/tests/{testId}/assign, GET /api/v1/analytics/overview and GET /api/v1/analytics/batches/{batchId}/readiness.csv as specified in API_CONTRACT.md. Use accessToken and the shared success/error envelope. Never expose admin registration or silently replace API errors with mocks. Run npm run build and available tests. Change only /frontend.
```

**EXPECTED OUTCOME:** With mocks, the three pages are usable and show the expected seeded values. After B1 integration, valid accounts log in, role routes are correct, the trainer can create/import/assign a test, and a student outside the assigned batch does not see it.

**HOW TO TEST**
1. `cd frontend && npm run build` → exit code 0.
2. Start `npm run dev`; log in using the agreed seeded/demo account or mock role switch.
3. Check student lands on S2; trainer/admin land on S8.
4. In S8 create a draft test, import the sample CSV and verify accepted/rejected counts; assign to `CSE-A 2027`.
5. After B1 GREEN only: verify the same actions in Network tab against the deployed Render URL; refresh and confirm saved values remain.
6. Log out; protected screen should redirect to S1.

**DONE WHEN**
- [ ] S1/S2/S8 meet F1/F2 UI acceptance criteria.
- [ ] Mock path remains independently testable.
- [ ] Real integration occurs only after B1 GREEN.
- [ ] Error/loading/empty states are understandable.
- [ ] Build passes and only `/frontend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add frontend
git commit -m "feat(frontend): build login dashboards and test builder"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Frontend Group 1 pushed: <commit>. Mock flow: PASS/FAIL. Build: PASS/FAIL. Real API connected: NO / YES (B1 GREEN confirmed by Integrator). Please run the B1 deployed user-flow check.
```

**IF STUCK**
1. Login response fields differ: stop; compare `API_CONTRACT.md` and ask Integrator to approve a contract change.
2. CSV upload returns an error: verify multipart upload lets the browser set its boundary; do not manually set multipart Content-Type.
3. Trainer data is empty: confirm seed fixture/account and managed batch; do not invent a fake success.
Rescue prompt: “frontend API integration / auth” in `06_RESCUE_PROMPTS.md`, if present; otherwise ask the agent to isolate the smallest fix in `/frontend` only.

## PHASE CARD F2 — Group 2: S3 Test Arena + S4 Debrief (H+06:00–08:30)

**Goal:** Deliver a timed test and a useful Debrief, first with mock fixtures and then with verified B2 endpoints.

**Why it matters:** This proves technical state, server-side scoring and a readiness update from saved activity.

**Inputs:** `FRONTEND_DESIGN.md` Section 7 Group 2 and component library; `PRD.md` F3; `API_CONTRACT.md` endpoint inventory and flow map; F1 done.

**Steps**
1. Build S3 with `SQL Fundamentals Check`, 12 varied MCQs, question palette, selected answer, per-question timer and countdown.
2. Shuffle display order; never expect the backend to send `correctIndex` to students.
3. On timer zero, submit automatically once; prevent double submission.
4. Build S4 with score, topic accuracy, per-question time, weak areas and batch average `68` in mock mode.
5. Keep mock mode until Integrator confirms B2 GREEN.
6. Then connect `POST /api/v1/tests/{testId}/start`, `POST /api/v1/attempts/{attemptId}/submit`, `GET /api/v1/attempts/{attemptId}`, `GET /api/v1/attempts/{attemptId}/debrief`, and `GET /api/v1/dashboard/student`.
7. Submit answers and timing data according to contract; server is authoritative for score.
8. Test at 375px, including timer and submit control.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, frontend/AGENTS.md if present, PRD.md F3 acceptance criteria, FRONTEND_DESIGN.md Section 4 component library and Section 7 Group 2, and API_CONTRACT.md Sections 2–8. Work ONLY inside /frontend. Build S3 Test Arena and S4 Debrief using the Stitch S3 and S4 exports/screens if available. Mock fixture must be named SQL Fundamentals Check and contain 12 MCQs with varied topics/difficulties, one sample completed TestAttempt, per-question timing and batch average 68. Include countdown, QuestionPalette, answer selection, shuffled question order, auto-submit at zero and a clear submitted state. Do not expose or rely on correctIndex before submit. Keep VITE_USE_MOCKS enabled until Integrator confirms B2 GREEN. After approval, use exactly POST /api/v1/tests/{testId}/start, POST /api/v1/attempts/{attemptId}/submit, GET /api/v1/attempts/{attemptId}, GET /api/v1/attempts/{attemptId}/debrief and GET /api/v1/dashboard/student from API_CONTRACT.md. The backend computes score and readiness; do not calculate a fake authoritative score in the browser. Prevent double-submit, show retryable API errors, and preserve the agreed JSON envelope. Run npm run build and existing tests; test at 375px. Do not modify anything outside /frontend.
```

**EXPECTED OUTCOME:** Student can answer questions, see the countdown, and reach S4. Real mode stores attempt and returns score/topic/timing/batch data; S2 reflects server readiness after refresh.

**HOW TO TEST**
1. Build: `cd frontend && npm run build`.
2. In mock mode, start the sample test, answer a few questions, wait for timer or submit, and confirm S4 appears.
3. Verify timer zero submits once and button cannot submit a second time.
4. At 375px, confirm no horizontal scrolling and submit remains reachable.
5. After B2 GREEN, repeat against deployed Render and inspect response: no student question contains `correctIndex`.

**DONE WHEN**
- [ ] Timer, answer selection and auto-submit work.
- [ ] Debrief shows score, topic accuracy, question timing, weak areas and batch average.
- [ ] Readiness refetches from backend.
- [ ] Student payload never exposes correct answers.
- [ ] Build passes; only `/frontend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add frontend
git commit -m "feat(frontend): build test arena and debrief"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Frontend Group 2 pushed: <commit>. Mock timer/submit/Debrief: PASS/FAIL. 375px: PASS/FAIL. Real API switched: NO / YES after B2 GREEN. Please verify deployed test flow.
```

**IF STUCK**
1. Timer fires multiple submissions: keep one submitted-state guard and disable submit immediately.
2. Debrief data missing: inspect the actual network response and contract; do not invent fields.
3. Horizontal overflow: inspect fixed widths in question rows/palette; stack on mobile.
Rescue prompt: “frontend state/timer bug” in `06_RESCUE_PROMPTS.md` if present; otherwise request a minimal `/frontend`-only fix.

## PHASE CARD F3 — Group 3: S6 Resume Lab + S5 Interview Room (H+09:00–12:30)

**Goal:** Build the resume-to-adaptive-interview-to-report journey with rules-based fallback always available.

**Why it matters:** This is the primary 90-second wow moment and the strongest innovation story.

**Inputs:** `PRD.md` F4/F5 and WOW MOMENT; `FRONTEND_DESIGN.md` Stitch prompts for S5/S6 and Group 3; `API_CONTRACT.md` resume/interview schemas and flow map; F2 done.

**Steps**
1. Build S6 with PDF dropzone, optional job description, ATS score, section feedback, matched/missing keywords and original-line/suggested-line diff.
2. Use mock sample PDF and “Backend Intern at NovaPay”; fixture score 61; missing keywords `REST API`, `Docker`, `SQL joins`; matched keywords `Python`, `Git`.
3. Add “Interview me on these gaps” which passes the missing keywords into a Technical round.
4. Build S5 chat, HR/Technical/Behavioral selector, message list, answer input, end-interview action and report.
5. Mock at least 4 questions and one follow-up reacting to “I used Docker once.”; report must include four exact skill names, two strengths, two weaknesses and answer comments.
6. Keep mocks until B3 GREEN, then use multipart field `file`, optional `jobDescription`, and the exact `/api/v1/resumes...` and `/api/v1/interviews...` endpoints from contract.
7. Show `BASIC MODE` when fallback fields indicate AI unavailable. Do not claim AI-generated content when `analysisMode` is `rules` or fallback is indicated.
8. After resume analysis/interview completion, refetch S2 and ensure trainer roster can refresh the saved readiness.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, frontend/AGENTS.md if present, PRD.md F4/F5 and the full WOW MOMENT, FRONTEND_DESIGN.md Stitch prompts for S5 Interview Room and S6 Resume Lab plus Section 7 Group 3, and API_CONTRACT.md Sections 2, 3, 4, 6, 7 and 8. Work ONLY inside /frontend. Use the existing Stitch exports/screens for S5 and S6 if present. Build S6 PDF upload, optional job description, ATS score, Education/Skills/Projects/Experience feedback, matched/missing keyword tags and ResumeLineDiff. Mock fixture: Backend Intern at NovaPay, ATS score 61, missing REST API/Docker/SQL joins, matched Python/Git and one original resume line with a stronger rewrite. The “Interview me on these gaps” action opens S5 in the Technical round with those focus keywords. Build S5 round selector (hr, technical, behavioral), chat messages, answer submit, end interview and report. Include at least 4 questions, one answer-reactive Docker follow-up, skill scores named exactly Communication, Technical Depth, Problem Solving, Structure of Answers, two strengths, two weaknesses and answer-level comments. Keep mock mode until Integrator confirms B3 GREEN. Then integrate POST /api/v1/resumes/analyze (multipart field file and optional jobDescription), GET /api/v1/resumes, GET /api/v1/resumes/{resumeReportId}, POST /api/v1/interviews, POST /api/v1/interviews/{sessionId}/answer, POST /api/v1/interviews/{sessionId}/end, GET /api/v1/interviews/{sessionId} and GET /api/v1/interviews exactly as API_CONTRACT.md specifies. Show BASIC MODE for rules/AI fallback. Refetch the real readiness value after resume/interview completion. Never silently turn API errors into mock success. Run build/tests and test phone width. Change only /frontend.
```

**EXPECTED OUTCOME:** S6 shows a score, four section feedback items, matched/missing keywords and a real-line rewrite. “Interview me on these gaps” opens Technical S5. A response to “I used Docker once” leads to a Docker-specific follow-up. End interview displays a complete report; readiness changes on S2 and appears in trainer roster after refresh.

**HOW TO TEST**
1. Run `npm run build`.
2. In mock mode, open S6, select the sample PDF, paste the sample job description and click Analyze.
3. Confirm ATS 61, three missing keywords, matched keywords and one line rewrite.
4. Click “Interview me on these gaps”; confirm Technical round and gap keywords.
5. Answer “I used Docker once”; confirm next question asks what the container ran/how it started.
6. End interview; confirm four named skill scores, two strengths, two weaknesses and answer comments.
7. After B3 GREEN, repeat with real backend and AI disabled; expect valid rules/fallback results and `BASIC MODE`, not an error page.

**DONE WHEN**
- [ ] Resume result meets F5 acceptance criteria.
- [ ] Interview adapts to an actual answer and report meets F4 criteria.
- [ ] Fallback is visible and functional.
- [ ] Readiness is refetched from saved API data.
- [ ] Phone layout and build pass; only `/frontend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add frontend
git commit -m "feat(frontend): build resume lab and interview room"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Frontend Group 3 pushed: <commit>. Resume mock flow: PASS/FAIL. Adaptive interview/report: PASS/FAIL. Fallback label: PASS/FAIL. Real B3 integration: NO / YES after GREEN. Please verify the full wow flow on deployed URLs.
```

**IF STUCK**
1. PDF upload fails: use FormData and do not manually set multipart Content-Type.
2. Follow-up does not mention the answer: verify the submitted message is sent and rendered; do not hardcode an unlabeled “AI” claim.
3. Report field names differ: stop and ask Integrator to reconcile API contract before editing.
Rescue prompt: “frontend file upload/chat/report integration” in `06_RESCUE_PROMPTS.md` if present; otherwise request a small `/frontend`-only diagnosis.

## PHASE CARD F4 — Group 4 optional extras (H+15:00–17:30; only if MUST is green)

**Goal:** Add at most one stable optional feature without risking F1–F5.

**Why it matters:** Extra breadth can help judging only when the core demo already works.

**Inputs:** `PRD.md` F6–F11; `FRONTEND_DESIGN.md` Section 7 Group 4; `API_CONTRACT.md` optional endpoint inventory; F1–F5 end-to-end GREEN.

**Steps**
1. Ask Integrator which extra has a genuinely working backend and sufficient time.
2. Prefer F6 Code Lab only if a hosted runner is configured and tested; otherwise choose a small F7/F8 item only if already close.
3. Build S7 with mock problems only until B5 is verified; label any seeded fallback honestly.
4. Optional F9/F10/F11 sections must not create a new dependency for the wow flow.
5. Run the full MUST regression after any extra.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, frontend/AGENTS.md if present, PRD.md Sections 4 and 11, FRONTEND_DESIGN.md Section 7 Group 4 and API_CONTRACT.md optional endpoint inventory. Work ONLY inside /frontend. Do not start unless Integrator confirms F1–F5 pass end-to-end and explicitly chooses the optional feature. Use the Stitch S7 Code Lab export/screen if Code Lab is approved; otherwise implement only the exact optional page/panel the Integrator names. Do not expose optional controls when their backend routes are not implemented. If building F6, do not execute code in the browser/server as if securely judged; use only the approved hosted runner contract. Label seeded results as demo/fallback. Run npm run build and then re-test S1/S2/S3/S4/S5/S6/S8. If the extra causes a MUST regression, revert your optional changes. Change only /frontend.
```

**EXPECTED OUTCOME:** One optional feature works without breaking login, timed test, resume, interview, readiness or trainer view. If no safe feature fits, no new feature is the correct outcome.

**HOW TO TEST**
1. Confirm Integrator's written approval and exact optional feature.
2. Build and test that feature in mock mode.
3. Integrate only after B5 is verified.
4. Run `npm run build`; repeat the MUST wow flow from a fresh seed.
5. At 375px confirm no overflow.

**DONE WHEN**
- [ ] MUST flow remains green.
- [ ] Optional endpoint is real or UI is hidden/disabled.
- [ ] Fallback is labelled.
- [ ] Build and regression pass.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add frontend
git commit -m "feat(frontend): add approved optional feature"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Optional frontend work pushed: <commit>. Feature: <name>. MUST regression: PASS/FAIL. Integrator, please verify B5 and decide whether to keep it.
```

**IF STUCK**
1. Optional endpoint returns 404: hide the feature; route may not be implemented.
2. Hosted runner unavailable: cut F6; do not build an unsafe local executor.
3. Core flow regresses: revert the optional feature and tell Integrator.
Rescue prompt: “minimal optional feature / safe revert” from `06_RESCUE_PROMPTS.md` if present; otherwise request the smallest scoped fix.

---

=== BACKEND_PLAYBOOK.md ===

# Backend Playbook

## Your role in one paragraph
You own the FastAPI + synchronous PyMongo backend in `/backend`. Extend the deployed skeleton rather than redesigning it. Keep `GET /health`, CORS configuration, the existing `{ "success": true, "data": ... }` envelope, canonical `/api/v1` routes, ObjectId string IDs and MongoDB collection names. Implement fallback paths before optional AI integration. Push each phase and tell the Integrator exactly what was tested.

## What you own / must NOT touch
- Own: `/backend` only: FastAPI routers, Pydantic models, services, tests, seed script and backend environment example.
- Must NOT touch: `/frontend`, `/docs`, `/scripts`, root files, CI or hosting configuration. Ask Integrator to change docs/config.
- Do not return raw MongoDB documents, `_id`, `passwordHash`, student-facing `correctIndex`, or secrets.
- Do not store plaintext passwords. Never hard-code production JWT secret or expose AI key.
- Collections are exactly `users`, `batches`, `tests`, `questions`, `test_attempts`, plus the canonical resume/interview collections defined in `BACKEND_SPEC.md`. Use those names from the spec; do not invent aliases.

## Your tools
Python 3.11, venv, pip, FastAPI, Uvicorn, PyMongo, MongoDB Atlas, Swagger at `/docs`, pytest, httpx, Git, Render logs, AI coding agent.

## Your daily loop
1. Read `AGENTS.md`, `BACKEND_SPEC.md`, `API_CONTRACT.md`, PRD relevant feature acceptance criteria.
2. Pull with rebase and check status.
3. Implement one phase card; preserve existing skeleton conventions.
4. Run import/compile/tests locally; test through Swagger or curl.
5. Never include secrets in output/logs.
6. Commit only `/backend`, rebase, push.
7. Tell Integrator endpoints, tests, seed/env needs and known gaps.

## PHASE CARD B0 — Stabilize skeleton (H+01:15–02:00)

**Goal:** Keep the deployed skeleton reliable while adding shared configuration, errors and ID serialization helpers.

**Why it matters:** Every feature depends on a stable boot, health endpoint and consistent response shape.

**Inputs:** `AGENTS.md`; `BACKEND_SPEC.md` Sections 1–4, 13–15; `API_CONTRACT.md` Sections 1, 3, 8 and 10; existing skeleton.

**Steps**
1. Inspect `backend/app/main.py`, `config.py`, `db.py`, `routers/health.py`, current `items.py`, requirements and tests.
2. Preserve `GET /health`, current response envelope, CORS configuration and deployment startup command.
3. Validate required settings `MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET_KEY`; do not print their values.
4. Add shared `AppError` and exception handling that returns `{success:false,error:{code,message,details}}`; retain `{success:true,data:...}` on success.
5. Add ObjectId-to-string serialization helpers and UTC timestamp convention.
6. Add/confirm minimal indexes and health/envelope tests. Do not require an AI key for `/health`.
7. Run backend import/tests and verify Render `/health`.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, backend/AGENTS.md if present, BACKEND_SPEC.md Sections 1–4, 13–15, and API_CONTRACT.md Sections 1, 3, 8 and 10. Work ONLY inside /backend. Extend the existing skeleton; do not redesign it. Preserve app/main.py, app/config.py, app/db.py, app/routers/health.py, GET /health, CORS environment configuration, the current success envelope {success:true,data:...}, and Render's existing startup configuration. Inspect the existing demo items router and leave it clearly demo-only or stop registering it as a product route. Validate MONGODB_URI, MONGODB_DB_NAME and JWT_SECRET_KEY without logging secret values. Add a shared AppError handler returning {success:false,error:{code,message,details}}, ObjectId string serialization helpers and UTC timestamp handling. Add/confirm minimal indexes and tests for health and envelope. Do not require AI for health. Run python -m compileall app, pytest if configured, and verify GET /health locally; report exact commands/results. Do not modify anything outside /backend.
```

**EXPECTED OUTCOME:** `GET /health` returns `200` and `{"success":true,"data":{"status":"ok"}}`; FastAPI imports; invalid configuration fails clearly without printing secrets; errors use the agreed envelope.

**HOW TO TEST**
1. `cd backend`; activate the existing virtual environment if available.
2. Run `python -m compileall app`.
3. Run `pytest` if tests are configured; expected all current tests pass.
4. Start `uvicorn app.main:app --reload --port 8000`; open `http://localhost:8000/health`.
5. Open `http://localhost:8000/docs`; health endpoint is listed.
6. Confirm deployed Render `/health` still returns success.

**DONE WHEN**
- [ ] Health works locally and on Render.
- [ ] Envelope and CORS are preserved.
- [ ] Config validates without secret leakage.
- [ ] ID serialization helper and basic tests exist.
- [ ] Only `/backend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add backend
git commit -m "fix(backend): stabilize API skeleton and shared errors"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Backend B0 pushed: <commit>. compileall: PASS/FAIL. pytest: PASS/FAIL/not configured. Local /health: PASS/FAIL. Render /health: PASS/FAIL. Please verify CI and deploy before B1.
```

**IF STUCK**
1. Missing package: add only required package to `backend/requirements.txt`, install locally, rerun tests.
2. Atlas timeout: check URI, Atlas network access and database name through environment settings; never paste the URI in chat.
3. App fails on startup: read the first traceback line from your own code; keep `/health` independent of AI.
Rescue prompt: “backend import/config/health failure” from `06_RESCUE_PROMPTS.md` if present; otherwise ask for the smallest `/backend`-only repair.

## PHASE CARD B1 — Foundation / Group 1 (H+02:00–05:30)

**Goal:** Implement authentication, roles, batches, test builder, CSV import/assignment and Command Center basics.

**Why it matters:** The product must use real saved users and enforce batch access before activity data is trusted.

**Inputs:** `BACKEND_SPEC.md` Sections 2–6, 10, 14–15; `API_CONTRACT.md` endpoint inventory and endpoint details for B1; PRD F1/F2; B0 done.

**Steps**
1. Implement password hashing, normalized email and JWT bearer authentication; admin can only be seeded.
2. Add `users` and `batches` routes and role guards; always load current user from DB.
3. Implement test CRUD basics using `tests` and `questions`; question CSV import returns accepted/rejected counts and row errors.
4. Implement assignment/publication and enforce student batch scope.
5. Add dashboard/analytics overview and readiness roster/CSV export shell as specified.
6. Keep exact success/error envelopes and camelCase field names.
7. Add tests for duplicate email, invalid login, role denial, trainer managed-batch scope, and no public admin registration.
8. Seed only the minimum data needed to test; coordinate demo credentials with Integrator.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, backend/AGENTS.md if present, BACKEND_SPEC.md Sections 2–6, 10, 13–15, PRD.md F1/F2 acceptance criteria, and API_CONTRACT.md Sections 1–6, 8–10. Work ONLY inside /backend. Preserve B0 shared error/envelope helpers and the existing skeleton. Implement B1 endpoints exactly: POST /api/v1/auth/register, POST /api/v1/auth/login, GET /api/v1/auth/me, PATCH /api/v1/users/me; GET/POST /api/v1/batches, PATCH /api/v1/batches/{batchId}, GET /api/v1/batches/{batchId}/students; POST/GET /api/v1/tests, GET /api/v1/tests/{testId}, POST /api/v1/tests/{testId}/questions, POST /api/v1/tests/{testId}/questions/import, POST /api/v1/tests/{testId}/assign, GET /api/v1/tests/{testId}/questions; GET /api/v1/analytics/overview and GET /api/v1/analytics/batches/{batchId}/readiness.csv. Use collections users, batches, tests and questions exactly. Implement hashed passwords, lowercase trimmed email, JWT bearer accessToken, database-authoritative role checks and permissions from API_CONTRACT.md. Public registration may create student or trainer, never admin. Trainer sees/assigns only managed batches; students see only published tests assigned to their batch. Student-delivery question objects must omit correctIndex. CSV import must report acceptedCount, rejectedCount and rowErrors without discarding valid rows. Use exact camelCase fields, public id strings, and {success:true,data} / {success:false,error} envelopes. Add tests for duplicate email, bad login, roles, batch scope and hidden correctIndex. Run python -m compileall app and pytest. Do not modify outside /backend.
```

**EXPECTED OUTCOME:** Swagger at `http://localhost:8000/docs` lists B1 routes. Register/login returns `data.accessToken` and safe `data.user`; trainer creates/imports/assigns a test; only students in the assigned batch see it. Atlas stores records in canonical collections.

**HOW TO TEST**
1. `cd backend && python -m compileall app && pytest`.
2. Run `uvicorn app.main:app --reload --port 8000`; open `/docs`.
3. Register a student and trainer; confirm response has `accessToken`, no password/hash.
4. Attempt public admin registration; expect validation/forbidden response, not admin account.
5. Log in as trainer, create test, import sample CSV, assign to managed batch.
6. Log in as student in batch and fetch tests; student outside batch must not see the test.
7. After push, verify the same on deployed Swagger only after Integrator says CI/deploy is ready.

**DONE WHEN**
- [ ] Auth and role guards work.
- [ ] Batch access enforced server-side.
- [ ] Test/question/import/assign routes match contract.
- [ ] Correct answers hidden from students.
- [ ] Tests and imports report valid/rejected rows.
- [ ] Build/tests pass; only `/backend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add backend
git commit -m "feat(backend): implement auth batches and test builder"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Backend B1 pushed: <commit>. Auth/role tests: PASS/FAIL. Test CSV import and assignment: PASS/FAIL. Collections used: users,batches,tests,questions. Please verify CI, Render deploy and B1 flows.
```

**IF STUCK**
1. JWT works but wrong role persists: reload user from MongoDB on every protected request; database role is authoritative.
2. CSV rows all reject: compare CSV header and `correctOption` values to API_CONTRACT; report partial success shape.
3. Trainer sees/assigns another batch: add server-side `trainerId` scope checks; do not rely on frontend.
Rescue prompt: “backend auth/permissions/CSV import” in `06_RESCUE_PROMPTS.md` if present; otherwise request a minimal `/backend`-only diagnosis.

## PHASE CARD B2 — Tests / Group 2 (H+05:30–08:30)

**Goal:** Store timed attempts, score server-side, calculate topic/batch analysis and update readiness v1.

**Why it matters:** The Debrief must be based on saved answers, not browser-calculated or invented scores.

**Inputs:** `BACKEND_SPEC.md` attempt, readiness and aggregation sections plus Sections 14–15; `API_CONTRACT.md` B2 endpoint details; PRD F3; B1 done.

**Steps**
1. Implement `test_attempts` records and start route with shuffled questions excluding `correctIndex`.
2. Implement submit route; validate attempt owner, question IDs and one-submit rule; score only on server.
3. Store answers and per-question timing.
4. Build attempt/debrief endpoints with topic accuracy, weak topics and batch average.
5. Recalculate `User.readinessScore` and breakdown using the specified readiness formula; renormalize weights for missing components as documented.
6. Add tests for answer key leakage, invalid question IDs, repeated submit, score and readiness.
7. Verify frontend can use response without guessing fields.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, backend/AGENTS.md if present, BACKEND_SPEC.md attempt/readiness/query-map sections and Sections 13–15, PRD.md F3 acceptance criteria, and API_CONTRACT.md B2 endpoint details and schemas. Work ONLY inside /backend. Implement exactly POST /api/v1/tests/{testId}/start, POST /api/v1/attempts/{attemptId}/submit, GET /api/v1/attempts/{attemptId}, GET /api/v1/attempts/{attemptId}/debrief and GET /api/v1/dashboard/student. Use the canonical tests, questions, test_attempts and users collections. Start must create an owned attempt and return shuffled Student QuestionPublic records without correctIndex. Submit must validate owner, assigned test, question IDs, answers and timing; score on the server, persist once and reject repeat submissions with INVALID_STATE. Debrief must derive score, topic accuracy, per-question time, weak topics and batch average from saved records. Recalculate User.readinessScore and readinessBreakdown with the formula in BACKEND_SPEC.md; do not invent a new formula. Enforce student ownership and authorized staff scope. Keep the JSON envelope and camelCase IDs. Add tests for no correctIndex, unknown question IDs, double submit, score calculation, debrief aggregation and readiness update. Run compileall and pytest. Change only /backend.
```

**EXPECTED OUTCOME:** Swagger shows B2 endpoints. Starting `SQL Fundamentals Check` returns shuffled questions with `id`, `text`, `options`, `topic`, `difficulty` and no `correctIndex`. Submit returns saved score and readiness; debrief shows topic and batch comparison.

**HOW TO TEST**
1. `cd backend && python -m compileall app && pytest`.
2. Open `http://localhost:8000/docs`, log in and copy bearer token into Swagger Authorize.
3. Call `/api/v1/tests/{testId}/start` for an assigned test.
4. Inspect question response; expected no `correctIndex`.
5. Submit answers once; expect score and attempt ID. Submit again; expect `409 INVALID_STATE`.
6. Call `/api/v1/attempts/{attemptId}/debrief`; verify score, topic accuracy, time and batch average.
7. Confirm `/api/v1/dashboard/student` returns updated readiness from DB.

**DONE WHEN**
- [ ] Start/submit/attempt/debrief/dashboard endpoints match contract.
- [ ] Score is server-calculated and persisted.
- [ ] Repeat submit and unauthorized access are rejected.
- [ ] Debrief aggregation and readiness tests pass.
- [ ] Only `/backend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add backend
git commit -m "feat(backend): implement timed tests and readiness scoring"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Backend B2 pushed: <commit>. Start/submit/debrief tests: PASS/FAIL. correctIndex hidden: PASS/FAIL. Readiness updates: PASS/FAIL. Please verify deployed B2 endpoints and announce the gate.
```

**IF STUCK**
1. Attempt cannot be submitted: inspect owner, status and question IDs; do not weaken authorization.
2. Batch average is empty: check seeded completed attempts and batch association; return a documented empty state if there is no data.
3. Readiness does not change: inspect saved User update and formula inputs, then add a regression test.
Rescue prompt: “backend attempt scoring/aggregation” in `06_RESCUE_PROMPTS.md` if present; otherwise request a small `/backend`-only fix.

## PHASE CARD B3 — AI / Group 3 (H+08:30–12:30)

**Goal:** Implement PDF resume analysis and persistent interview sessions with complete rules-based fallbacks.

**Why it matters:** This powers the signature resume-gap-to-adaptive-interview wow flow even when the AI provider is unavailable.

**Inputs:** `BACKEND_SPEC.md` resume/interview/AI sections and Sections 13–15; `API_CONTRACT.md` schemas and B3 endpoint details; PRD F4/F5; B2 done.

**Steps**
1. Implement PDF text extraction with size limit and clear `RESUME_TEXT_NOT_FOUND` response.
2. Implement rules-based score first: section feedback, matched/missing keywords and at least one real-line suggestion.
3. Add optional AI adapter only after rules path passes with `AI_PROVIDER=none`; set timeout and fallback.
4. Implement interview start, answer, end, session history and report persistence using canonical collections from spec.
5. Ensure one follow-up is grounded in the student's actual answer; seeded question fallback must still finish.
6. Report exact skill names: `Communication`, `Technical Depth`, `Problem Solving`, `Structure of Answers`.
7. Update readiness after resume analysis and interview completion; return fallback markers `analysisMode` or `usedFallback` as contract defines.
8. Add tests for AI disabled, malformed PDF, complete report and readiness updates.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, backend/AGENTS.md if present, BACKEND_SPEC.md resume, interview, AI provider, error handling and Sections 14–15, PRD.md F4/F5 acceptance criteria and WOW MOMENT, and API_CONTRACT.md resume/interview schemas and B3 details. Work ONLY inside /backend. Implement exactly POST /api/v1/resumes/analyze (multipart field file; optional jobDescription), GET /api/v1/resumes, GET /api/v1/resumes/{resumeReportId}; POST /api/v1/interviews, POST /api/v1/interviews/{sessionId}/answer, POST /api/v1/interviews/{sessionId}/end, GET /api/v1/interviews/{sessionId}, and GET /api/v1/interviews. Use the canonical resume/interview collections and field names defined in BACKEND_SPEC.md; do not invent collection aliases. PDF text extraction and rules-based analysis must work with AI_PROVIDER=none. Return atsScore, sectionFeedback for Education/Skills/Projects/Experience, missingKeywords, matchedKeywords, a lineSuggestions entry quoting an actual extracted resume line, analysisMode and the agreed data.report/readiness fields from API_CONTRACT.md. Respect MAX_RESUME_BYTES and handle unextractable PDFs safely. Interview sessions must persist messages, round and report; answer endpoint returns an adaptive follow-up that references the user's actual answer or a seeded fallback clearly indicated. End report must include scores for Communication, Technical Depth, Problem Solving, Structure of Answers, at least two strengths, two weaknesses and answerComments. Recalculate readiness after resume and interview completion. Keep AI_API_KEY server-side, timeout configured, and fallbacks valid. Add tests with AI disabled, bad PDF, report shape, follow-up, authorization and readiness. Run compileall and pytest. Change only /backend.
```

**EXPECTED OUTCOME:** Swagger lists all resume/interview endpoints. With AI disabled, valid text PDF returns a report with four sections, keywords, a real-line rewrite and `analysisMode: rules`; interview completes and returns all required report fields and updated readiness.

**HOW TO TEST**
1. `cd backend && python -m compileall app && pytest`.
2. Open `/docs`; set `AI_PROVIDER=none` locally or use an environment with AI disabled.
3. Upload a text-based sample PDF using multipart `file` and a `jobDescription`; expect valid report, not a server error.
4. Upload a PDF with no extractable text; expect `400 RESUME_TEXT_NOT_FOUND`.
5. Start a Technical interview; answer “I used Docker once”; verify follow-up is about the container/what it ran.
6. End interview; confirm four skill scores, two strengths, two weaknesses and answer comments.
7. Read the student dashboard; readiness should reflect saved resume/interview activity.

**DONE WHEN**
- [ ] Rules-based resume analysis works without AI.
- [ ] Interview fallback completes and report is complete.
- [ ] Readiness updates persist.
- [ ] File size, authorization and errors are handled.
- [ ] Tests pass; only `/backend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add backend
git commit -m "feat(backend): add resume analysis and adaptive interviews"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Backend B3 pushed: <commit>. Resume rules fallback: PASS/FAIL. Interview fallback/report: PASS/FAIL. Readiness persistence: PASS/FAIL. AI secrets remain server-side: YES/NO. Please verify the wow flow on deployed URLs.
```

**IF STUCK**
1. PDF text is empty: check file type and parser; return `RESUME_TEXT_NOT_FOUND`, not an invented analysis.
2. AI call times out: fall back to rules/seeded question bank within configured timeout.
3. Report fields missing: compare exact schema in API_CONTRACT and add tests for every required field.
Rescue prompt: “backend PDF/AI fallback/interview report” in `06_RESCUE_PROMPTS.md` if present; otherwise request a minimal `/backend`-only fix.

## PHASE CARD B4 — Hardening, seed and demo (H+12:30–15:00)

**Goal:** Make the MUST flow repeatable on deployed data with a one-command seed/reset and tested permissions.

**Why it matters:** Judges need a reliable end-to-end story, not a one-off local success.

**Inputs:** `BACKEND_SPEC.md` seed section 10 and Sections 14–15; `API_CONTRACT.md` Sections 6–10; all B1–B3 phases pushed.

**Steps**
1. Implement/verify `seed.py` is repeatable and safe for demo data; never reset production-like user data without explicit confirmation.
2. Seed Aarav Sharma (student), Ms. Priya Nair (trainer), Dr. Rohan Kulkarni (admin), batch CSE-A 2027, assigned tests, sample resume/interview fixtures and realistic roster records as specified.
3. Verify role/batch permissions and all minimum tests.
4. Verify Render variables and `/health`; never log URI or keys.
5. Coordinate seed reset with Integrator and run smoke tests after seed.
6. Fix only P0/P1 bugs; no optional routes unless MUST is green.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, backend/AGENTS.md if present, BACKEND_SPEC.md Section 10 seed contract and Sections 14–15, API_CONTRACT.md Sections 6–10, and PRD.md demo/Plan B sections. Work ONLY inside /backend. Verify and complete seed.py according to BACKEND_SPEC.md; it must be repeatable and create the agreed demo users Aarav Sharma (student), Ms. Priya Nair (trainer), Dr. Rohan Kulkarni (admin), batch CSE-A 2027, sample tests/questions and realistic batch roster/demo records needed for the wow flow. Use the exact credentials and data defined in the spec or approved by Integrator; do not invent public credentials. Make reset behavior explicit and do not delete unrelated data. Run minimum backend tests for auth, roles, batch scope, no correctIndex leakage, test scoring, CSV import, resume fallback, interview fallback and readiness formula. Verify /health does not depend on AI and ensure required Render env vars are documented in backend/.env.example without real secrets. Do not implement placeholder success endpoints. Run compileall and pytest. Change only /backend.
```

**EXPECTED OUTCOME:** Running the documented seed command produces the same demo records each time; auth, test, resume and interview routes still pass tests; Render health remains healthy.

**HOW TO TEST**
1. Read `seed.py` help/usage before running; confirm it targets the configured demo database.
2. Run the seed command documented in `BACKEND_SPEC.md`; expected successful summary with seeded users/batch/tests and no secret output.
3. Run `pytest`; expected all implemented tests pass.
4. Check Render logs for startup and errors; verify `/health`.
5. Have Integrator run `scripts/smoke-test.ps1` and deployed user flow.

**DONE WHEN**
- [ ] Seed is repeatable and scoped.
- [ ] Demo users/data exist and credentials are confirmed.
- [ ] MUST backend tests pass.
- [ ] No secrets in source/logs.
- [ ] Only `/backend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add backend
git commit -m "test(backend): harden seed data and demo paths"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Backend B4 pushed: <commit>. Seed/reset: PASS/FAIL. MUST tests: PASS/FAIL. /health: PASS/FAIL. Please run deployed smoke test and full wow-flow verification.
```

**IF STUCK**
1. Seed creates duplicates: use deterministic IDs/upserts or documented cleanup limited to demo records.
2. Test passes locally but fails on Render: inspect Render logs and compare environment variable names without exposing values.
3. Demo user cannot access assigned test: check `batchId`, `assignedBatchIds`, `isPublished` and trainer scope.
Rescue prompt: “backend seed/deployment/test failure” from `06_RESCUE_PROMPTS.md` if present; otherwise ask for a small `/backend`-only repair.

## PHASE CARD B5 — Optional routes (H+15:00–17:30; conditional)

**Goal:** Implement optional API routes only when the complete MUST journey is already green.

**Why it matters:** Placeholder routes damage trust and can destabilize the judged path.

**Inputs:** `BACKEND_SPEC.md` optional feature sections; `API_CONTRACT.md` B5 optional inventory; PRD F6–F11; B0–B4 green.

**Steps**
1. Confirm with Integrator which single optional feature is approved.
2. Prefer F6 only if `CODE_RUNNER_URL` and secret are configured and hosted execution is tested; never run user code on this server.
3. Otherwise choose a small already-supported F7/F9 item only if there is time.
4. Implement route behavior and tests before exposing it; no fabricated success objects.
5. Re-run MUST regression after optional changes.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, backend/AGENTS.md if present, BACKEND_SPEC.md optional feature sections and Sections 14–15, API_CONTRACT.md B5 optional endpoint inventory, and PRD.md F6–F11 acceptance criteria. Work ONLY inside /backend. Do not start unless Integrator confirms B0–B4 and the complete F1–F5 demo are GREEN and selects one optional feature. Implement only the selected optional route from the contract: for F6, GET /api/v1/code/problems, POST /api/v1/code/run and POST /api/v1/code/problems/{problemId}/submit only when a hosted runner is configured; for F7, GET /api/v1/leaderboard; for F9, GET /api/v1/library/modules and POST /api/v1/library/modules/{moduleId}/complete. Use only canonical collections and schemas. Never execute untrusted code on the FastAPI host. Do not register unimplemented routes or return fabricated success objects. Add tests and run compileall/pytest, then re-run all MUST regression tests. Change only /backend.
```

**EXPECTED OUTCOME:** Only the approved optional route appears in Swagger and it works for authorized students; otherwise no optional routes are exposed.

**HOW TO TEST**
1. Confirm Integrator approval and environment readiness.
2. Check `/docs` only lists the selected implemented route.
3. Run tests for route behavior and authorization.
4. Run full MUST regression; expected no change in login, test, resume, interview or readiness behavior.

**DONE WHEN**
- [ ] MUST flow remains green.
- [ ] Optional route has real behavior and tests.
- [ ] No untrusted code runs on FastAPI host.
- [ ] Only `/backend` changed.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add backend
git commit -m "feat(backend): add approved optional endpoint"
git pull --rebase origin main
git push origin main
```

**AFTER YOU PUSH**
```text
Backend B5 pushed: <commit>. Optional feature: <name>. Route tests: PASS/FAIL. MUST regression: PASS/FAIL. Please decide whether the optional route is approved for the demo.
```

**IF STUCK**
1. Runner unavailable: cut F6; do not fake judging.
2. Optional schema unclear: stop and request a contract decision.
3. MUST regression fails: revert B5 changes.
Rescue prompt: “backend optional feature safe cut” in `06_RESCUE_PROMPTS.md` if present; otherwise ask for a minimal scoped fix.

---

=== INTEGRATOR_PLAYBOOK.md ===

# Integrator Playbook

## Your role in one paragraph
You own coordination, root files, `/docs`, `/scripts`, CI/deployment checks, QA, bug triage, demo reset and pitch. You do not write feature code in `/frontend` or `/backend`; you verify each pushed phase on the deployed URLs and decide when the next phase may integrate. You are the single source of phase status: no phase is GREEN until both relevant pushes, green CI, successful deployment and user-flow tests are complete.

## What you own / must NOT touch
- Own: `/docs`, `/scripts`, root files, CI/deployment configuration, `docs/BUGS.md`, API contract change log, smoke test and presentation pack.
- Must NOT touch feature implementation in `/frontend` or `/backend`. Report and assign bugs to that owner.
- Never mark GREEN based only on local success or an HTTP 200 that contains the wrong data.
- Never claim push-based “real-time” updates; contract supports refresh/poll unless push is implemented.

## Your tools
GitHub Actions, Vercel project/deployments/logs, Render dashboard/logs, MongoDB Atlas console, browser DevTools, PowerShell, phone, QR-code generator, screen recorder and slide tool.

## Your daily loop
1. Check both developers' status every 30 minutes.
2. Keep the phase board current; log every bug with severity and owner.
3. Verify CI, deployment, health, endpoint contract and user flow after each phase.
4. Announce GREEN/RED with exact reason.
5. Protect the wow flow; stop optional work if a MUST bug appears.
6. Keep a known-good commit and backup video available.

## PHASE CARD I0 — Phase 0 / Before and at start (H+00:00–00:30)

**Goal:** Establish the source of truth and prove the existing skeleton, Atlas and deployment are reachable.

**Why it matters:** If the baseline is broken, feature failures later will be misdiagnosed.

**Inputs:** `PRD.md`, `FRONTEND_DESIGN.md`, `BACKEND_SPEC.md`, `API_CONTRACT.md`, repository `AGENTS.md`, `scripts/smoke-test.ps1`.

**Steps**
1. Confirm actual hackathon start time, demo time, team names/roles and deployed Vercel/Render URLs; fill the blank schedule fields in `PHASE_PLAN.md`.
2. Confirm all four docs are committed and pushed; if not, commit docs under `/docs` and ensure both devs can read them.
3. Open GitHub Actions and note current main commit/CI status.
4. Open Vercel deployment and Render service; open logs if either is not healthy.
5. Run `scripts/smoke-test.ps1` from repository root in PowerShell. Record exact output.
6. Call Render `/health` and confirm success envelope.
7. Confirm Atlas connectivity using backend health/startup logs or the approved backend check; never paste `MONGODB_URI` into chat.
8. Confirm `MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET_KEY`, `CORS_ORIGINS` exist in Render. Confirm frontend public API base URL and `VITE_USE_MOCKS` are set correctly in Vercel. Do not display secret values.
9. Create/update `docs/BUGS.md`, record baseline issues and owners.
10. Announce baseline PASS or RED before implementation moves forward.

**THE PROMPT TO PASTE INTO YOUR AGENT**
```text
Read AGENTS.md, PRD.md Sections 0, 3, 4 and 11–13, FRONTEND_DESIGN.md Sections 1, 3 and 7, BACKEND_SPEC.md Sections 1, 2, 10 and 14–15, API_CONTRACT.md Sections 1, 3, 6–10, and inspect scripts/smoke-test.ps1. You are the Integrator and may edit only /docs, /scripts, root files and CI/deployment configuration. Do not modify feature implementation in /frontend or /backend. Confirm the actual hackathon start/demo times, team names and roles; record relative H+ schedule if actual times are not supplied. Confirm all four source docs are pushed and visible to both developers. Check GitHub Actions on main, Vercel deployment, Render deployment/logs, run scripts/smoke-test.ps1 in PowerShell, call deployed GET /health and confirm {success:true,data:{status:"ok"}} or document the actual shape. Confirm Atlas connectivity from approved health/startup diagnostics without printing credentials. Verify required Render env var names MONGODB_URI, MONGODB_DB_NAME, JWT_SECRET_KEY, CORS_ORIGINS and frontend API base URL/VITE_USE_MOCKS settings; never reveal secret values. Create docs/BUGS.md with severity, reproduction, expected/actual, owner and status. Record baseline and announce PASS or RED. Do not claim success without observed output.
```

**EXPECTED OUTCOME:** A written baseline with repo commit, CI status, live URLs, smoke-test output, health result, Atlas connectivity result, required environment variable names, and open bugs.

**HOW TO TEST**
1. In PowerShell at repo root: `.\scripts\smoke-test.ps1`.
2. Expected: the script exits successfully and reports the current health/demo API checks as defined in the script. If it fails, record exact line and output; do not assume the script tests endpoints it does not contain.
3. Open Render `/health`; expect HTTP 200 and the success envelope.
4. Open Vercel URL; confirm page loads.
5. Check Render logs/Atlas connection; do not paste secret values into tickets.

**DONE WHEN**
- [ ] Actual clock times and names recorded or explicitly still pending.
- [ ] Four docs are pushed and accessible.
- [ ] CI baseline checked.
- [ ] Vercel and Render are reachable.
- [ ] Smoke test and Atlas check recorded.
- [ ] `docs/BUGS.md` exists with owners.

**COMMIT AND PUSH**
```bash
git status
git pull --rebase origin main
git add docs scripts *.md
git commit -m "docs(integrator): record baseline and phase gates"
git pull --rebase origin main
git push origin main
```
Only stage files you actually changed; do not use the wildcard if it would capture unrelated files.

**AFTER YOU PUSH**
```text
Integrator baseline: commit <hash>; CI <GREEN/RED>; Vercel <OK/FAIL>; Render /health <OK/FAIL>; smoke test <PASS/FAIL>; Atlas <CONNECTED/UNKNOWN/FAIL>. Open P0/P1: <IDs>. Phase 0 is <GREEN/RED: reason>.
```

**IF STUCK**
1. Smoke script cannot reach backend: verify URL and Render status/logs; cold start may take time.
2. Atlas not connected: verify environment variable names, Atlas IP/network access and database user; never expose URI.
3. CI red: inspect first failing step and assign by changed folder.
Rescue prompt: “deployment/smoke-test triage” from `06_RESCUE_PROMPTS.md` if present; otherwise ask the agent to diagnose from exact logs without changing feature folders.

## VERIFICATION CARD — Run after every phase push

Do this for each combined phase (P2 through P7 and every post-freeze bug-fix push). No phase is GREEN until all applicable checks pass.

1. **Wait for both relevant pushes.** Confirm frontend and backend commits are on `main` when the phase needs both. Write down commit hashes.
2. **Check GitHub Actions.** Open Actions → latest run on `main`; verify backend import/CI and frontend build are green. If red, follow the red-CI rule and do not proceed.
3. **Wait for deploys.** In Vercel → Project → Deployments, wait for the commit to finish. In Render → service → Events/Deploys, wait for deploy to finish.
4. **Check logs.** Vercel deployment/build logs for frontend build errors; Render service Logs for startup/import/traceback/Atlas errors. Do not paste secrets.
5. **Run smoke test.** From repo root in PowerShell: `.\scripts\smoke-test.ps1`; record output.
6. **Run the phase user-flow test on DEPLOYED URLs** using the relevant test below, not only localhost.
7. **Test on a phone.** Open the Vercel URL on a real phone at least once per major group; verify login/navigation and current flow. If no phone is available, use DevTools 375px and mark real-phone check as pending, not passed.
8. **Log every defect** in `docs/BUGS.md` with severity P0/P1/P2 and one owner. P0 breaks wow flow/app start; P1 fix before freeze; P2 can be ignored.
9. **Announce exactly:** `Phase N is GREEN` or `Phase N is RED: <specific blocker>`. Include commit hashes and failed test.

## Phase verification checklists

### Phase 2 / F0 + B0
- Vercel URL loads the shared shell; S1–S8 route placeholders render.
- Render `GET /health` returns success.
- GitHub CI green; `scripts/smoke-test.ps1` passes.
- Mobile shell has no horizontal scroll at 375px.
- If either dev push is missing, phase stays RED.

### Phase 3 / F1 + B1
1. Open Launch Gate, register/login as student; student lands on S2 Mission Control.
2. Verify S2 shows readiness and assigned tests from saved data after integration.
3. Log out; log in as trainer; open S8 Command Center.
4. Create a test with title/topic/duration.
5. Import the agreed sample CSV; verify accepted and rejected row counts and row errors.
6. Assign/publish to `CSE-A 2027`.
7. Log in as student in that batch; test appears. A student outside the batch must not see it.
8. Verify roster and CSV export; admin cannot be self-registered.
9. Refresh; saved data remains. Test phone width.
**Expected:** correct role routing, real saved test/assignment, no cross-batch leakage, green CI/deploy.

### Phase 4 / F2 + B2
1. Log in as assigned student and open S3 Test Arena.
2. Start the `SQL Fundamentals Check`; verify questions shuffle.
3. Inspect the student response in Network; `correctIndex` must be absent.
4. Answer several questions; confirm timer counts down and question timing is recorded.
5. Let timer reach zero on a test fixture or submit manually; only one submission occurs.
6. S4 Debrief shows score, topic accuracy, per-question time, weak topics and batch average.
7. Return to S2; readiness reflects backend response after refresh.
8. Test 375px and slow/offline behavior.
**Expected:** score comes from server-saved attempt; no duplicate submit or answer leakage.

### Phase 5 / F3 + B3 — primary wow flow
1. Log in as Aarav; confirm readiness starts at seeded 54 (or document the seeded contract value).
2. Open S6 Resume Lab and upload the approved text-based sample PDF; paste the NovaPay Backend Intern job description.
3. Click Analyze. Expect ATS-style score, Education/Skills/Projects/Experience feedback, missing `REST API`, `Docker`, `SQL joins`, matched terms and a rewrite quoting a real line.
4. Click “Interview me on these gaps”; S5 opens in Technical mode with gap keywords.
5. Answer “I used Docker once.” Expect a follow-up about what the container ran/how it started, or a clearly labelled seeded fallback that responds to the answer.
6. Answer at least four questions; click End interview.
7. Expect four skill scores (`Communication`, `Technical Depth`, `Problem Solving`, `Structure of Answers`), at least two strengths, two weaknesses and answer comments.
8. Return to S2; readiness updates from saved API data.
9. Log in as Priya; S8 roster shows Aarav's updated readiness after refresh/poll. Do not claim websocket/live push unless built.
10. Repeat with AI disabled; valid fallback and `BASIC MODE` must appear.
**Expected:** the full 90-second story works twice consecutively on deployed URLs.

### Phase 6 / B4 hardening
- Run seed/reset using the documented command and confirm only demo data is affected.
- Run `scripts/smoke-test.ps1`.
- Test wrong password, logout, forbidden role, empty tests, invalid CSV, oversized/unextractable PDF, AI disabled, backend asleep/cold start and offline frontend.
- Confirm error UI offers retry and does not show fake success.
- Verify mobile phone and current deployment commit.

### Phase 7 / optional B5
- Only test the approved optional feature.
- Confirm the endpoint is implemented and authorized; no fake success route.
- Immediately rerun Phase 5 wow flow and at least one timed test.
- If any MUST regression occurs, announce RED and ask owner to revert optional work.

## Contract management and integration switches

### Change log procedure
Use `API_CONTRACT.md` Section 9 Change Log. A contract change is approved only after frontend and backend owners agree in chat. Integrator records version, time, endpoint/field, old and new shape, reason, approvers and affected flows. Backend pushes first; CI and deployed endpoint are checked; frontend stays mock-only until Integrator approves. No one changes the contract privately.

### Which calls switch to real API, and who does it
- **S1/S2/S8 Group 1:** Frontend Dev switches calls in `/frontend/src/api` only after B1 push, CI green, Render deploy and B1 verification. Integrator confirms exact endpoints: auth, users/me, batches, tests/questions/import/assign, analytics overview/export.
- **S3/S4 Group 2:** Frontend Dev switches after B2 verified: test start, attempt submit/get/debrief, student dashboard.
- **S6/S5 Group 3:** Frontend Dev switches after B3 verified: resumes analyze/list/get and interviews start/answer/end/get/list.
- **S7/extras:** Frontend Dev switches only after Integrator verifies the selected B5 route.
- Never globally turn off mocks before all unintegrated screens have a working source. Prefer per-flow integration if the existing API layer supports it. If only one global flag exists, keep it on until the real endpoints required by the visible screen are ready and explicitly test every other route.

## QA scripts / error-state tests

| Scenario | Steps | Expected result |
|---|---|---|
| MUST wow flow | Run Phase 5 steps above | Resume → adaptive interview → report → readiness → trainer roster works |
| Login bad password | Submit wrong password | Generic “Invalid email or password”; no account enumeration |
| Backend asleep | Wait for Render cold start; open app and retry | Loading/retry message; after warm-up request succeeds; no fake success |
| Empty data | Use an account with no assigned tests | Clear EmptyState and next action; no crash |
| Bad input | Invalid email, malformed CSV, malformed ID | Contract error envelope; readable field/error message |
| Offline | Turn off network and click an API action | ErrorState and retry; no invented success data |
| Oversized file | Upload beyond configured size | Clear file-too-large message (413 `FILE_TOO_LARGE`) |
| Unextractable PDF | Upload scanned/no-text PDF | `RESUME_TEXT_NOT_FOUND`, explain text-based PDF requirement |
| AI unavailable | `AI_PROVIDER=none` or invalid provider in test environment | Resume rules mode and seeded interview fallback; label `BASIC MODE` |
| Role violation | Student tries trainer endpoint; trainer tries unmanaged batch | 403 `FORBIDDEN` or contract-appropriate hidden 404 |
| Hidden answer | Inspect start/questions response | `correctIndex` absent |
| Double submit | Submit same attempt twice | Second submission rejected as `INVALID_STATE` |
| No CORS | Test deployed frontend against Render | Browser shows no CORS error; exact frontend origin in Render config |

## Deployment checks

### Vercel
- Project → Deployments: ensure latest `main` commit has Ready status.
- Deployment/build logs: inspect first failed build command.
- Environment Variables: verify public API base URL and `VITE_USE_MOCKS`; no secrets in `VITE_*`.
- Redeploy after environment variable changes if required by Vercel.
- If latest deploy is bad, use Vercel deployment history to promote/restore the last known-good deployment; coordinate so backend/frontend versions remain contract-compatible.

### Render
- Service → Events/Deploys: confirm latest commit deploy completed.
- Logs: inspect import errors, startup failures, Atlas connection errors and tracebacks; redact secrets.
- Required env var names: `MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET_KEY`, `CORS_ORIGINS`; optional `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `AI_TIMEOUT_SECONDS`; optional code runner variables only if F6 is approved.
- Confirm CORS includes exact deployed Vercel origin.
- Warm Render by opening `/health` around 10 minutes before demo.
- If bad deploy: redeploy last known-good commit using Render's deploy history/rollback option if available; otherwise revert the bad commit through a new normal commit and push. Never force-push.

### Rollback rules
1. Stop optional work and announce RED.
2. Identify the exact bad commit and owner.
3. Prefer a revert commit (not force push); run GitHub CI.
4. Wait for both Vercel and Render to deploy the compatible known-good state.
5. Run smoke test and the last GREEN user flow again.
6. Record rollback and reason in `docs/BUGS.md`/Change Log.

## Demo and pitch pack

### Four-minute script (max 7 slides)
Use no more than 7 slides. Keep the live demo to 90 seconds. Pitch timing follows PRD:
- **Slide 1 / 0:00–0:30 — Problem (Integrator or speaker 1):** Tell Meera's story: 12 applications, no offers, no clear diagnosis; trainers track 180 students in spreadsheets. Say the employability statistic is approximate, not a guaranteed current fact. Criteria: practicality, presentation.
- **Live demo / 0:30–2:00 — Student story (Frontend Dev clicks; Backend Dev narrates technical behavior; Integrator switches account):** Start as Aarav, readiness 54 → S6 Resume Lab → upload PDF and paste NovaPay description → show score 61-style result, missing skills and line rewrite → “Interview me on these gaps” → answer “I used Docker once” → show reactive follow-up → end interview/report → show readiness update → switch to Priya and show updated roster. Use real saved data; if fallback, label BASIC MODE. Criteria: innovation, execution, presentation.
- **Slide 2 / architecture during or after demo:** React/Vite on Vercel → FastAPI on Render → MongoDB Atlas; JWT bearer auth; rules-based fallback plus optional hosted AI; scoring and access checks server-side. Criteria: technical complexity.
- **Slide 3 / 2:00–2:45 — Why it is credible:** show how resume gaps feed interview focus and one readiness score includes the available activities; note `areasUsed`/coverage when data is missing. Do not claim exact score formula beyond what is implemented. Criteria: technical complexity.
- **Slide 4 / 2:45–3:15 — Practical impact and next steps:** trainer bulk import/assign and batch view; describe impact estimates as projected, not measured. Criteria: practicality, innovation.
- **3:15–4:00 — Q&A/buffer:** answer clearly; don't start risky live feature changes.

Suggested speaker duties: Frontend Dev drives student UI clicks; Backend Dev explains persisted data, fallback and server-side scoring; Integrator drives account switch/Command Center and keeps backup ready. One person speaks at a time.

### Backup video, QR and reset
- Record a **90-second backup video by H+20** showing the full wow flow. Copy it to every teammate's phone and laptop; test playback offline.
- Generate a QR code to the live Vercel URL; test it from a phone on mobile data.
- Before demo: run documented seed/reset; log in once as Aarav and Priya; verify test account credentials; warm Render `/health`; close unrelated tabs; set browser zoom so key panels fit.
- Demo reset: Integrator confirms reset target, runs the documented seed command, verifies Aarav readiness and trainer roster, then opens S1. Never run a destructive reset against an unconfirmed database.
- Plan B if Wi-Fi/backend fails: play backup video, then show screenshots of Resume Lab, Interview Report, updated Mission Control and Command Center. Explain the architecture and fallback honestly.

### Q&A cheat sheet
- **How is resume advice specific?** It uses extracted resume text, compares keywords with the job description and quotes a real line for rewrite; rules-based checks still work without AI.
- **How does the interviewer adapt?** It uses the conversation/answer to form a follow-up; seeded fallback remains available if AI is unavailable.
- **How is code run safely?** Only claim hosted sandbox execution if F6 actually uses the configured hosted runner; otherwise say Code Lab is out of MVP scope.
- **How is readiness calculated?** Explain the implemented visible weighted formula and show which areas were available; don't imply missing activities were measured.
- **Can trainers see everyone?** Trainers are restricted to managed batches; admin access is seeded/authorized.
- **What about privacy?** Passwords are hashed, tokens/keys are not shown, AI key remains server-side, and reports are permission-scoped.

### README final checklist
- [ ] Problem, Apogee promise and MUST feature list documented.
- [ ] Architecture and local run steps documented.
- [ ] Required env var NAMES documented; no real values.
- [ ] Seed/reset command and demo credentials shared privately with team, not published as secrets.
- [ ] Deployed Vercel and Render URLs included.
- [ ] API contract and phase plan linked.
- [ ] Tests, smoke-test command and known limitations listed.
- [ ] AI fallback behavior and `BASIC MODE` explained.
- [ ] Optional features accurately labelled as implemented or not implemented.
- [ ] No API keys, JWT secrets, database URI, tokens or real resumes committed.
- [ ] Final known-good commit and backup video location noted.

## Final release checklist
- [ ] Latest GitHub CI green.
- [ ] Vercel and Render deploys healthy and compatible.
- [ ] `scripts/smoke-test.ps1` passes.
- [ ] Main wow flow passes twice on deployed URLs.
- [ ] Phone test done.
- [ ] P0 bugs = 0; all P1 bugs fixed or explicitly accepted with explanation.
- [ ] Backup video and screenshots tested offline.
- [ ] QR code tested.
- [ ] Phase status and contract version recorded.
