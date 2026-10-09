# 06: Rescue Prompts (use any time you are stuck)

Copy a prompt, fill the `<...>` parts, paste into your coding agent (or Claude chat). Always include the **full error text**, not a screenshot summary.

---

## R1. Explain this error simply
```text
I'm a beginner. Here is the error I see. Explain in simple words what it means and the most likely cause (max 5 lines), then give the smallest fix and tell me how to check it worked. Do not change files outside <frontend|backend>.
<paste full error, and say which command or page caused it>
```

## R2. The agent changed too much
```text
Stop. Run `git status` and `git diff --stat` and list every file you changed. Undo all changes to files outside <folder>. From now on only modify these files: <list>. Make the smallest change that achieves: <goal>. Do not refactor or rename anything.
```
Then, if still broken: `git restore .` (undo all uncommitted changes in the repo; careful: this deletes your uncommitted work).

## R3. Explain this file / flow to me
```text
Explain <file or feature> in simple words for a beginner: what it does, how data flows through it (browser -> frontend -> API -> database), and which parts I should NOT change. Use a small example with real values.
```

## R4. We are behind: cut scope
```text
We are at hour <N> of 24 and behind. Read docs/PRD.md and docs/PHASE_PLAN.md. Tell me exactly what to cut, in order, to protect the WOW MOMENT. List what stays, what goes, what we show instead (e.g. mock data or seed data), and the new plan for the remaining hours with a push at the end of every phase. Be strict.
```

## R5. Atlas connection problems (backend)
```text
My FastAPI backend cannot connect to MongoDB Atlas. Error: <paste>. Check, in order: 1) MONGODB_URI format (mongodb+srv://user:password@cluster.../?options) and the DB name in DB_NAME, 2) special characters in the password (URL-encode them or reset to letters/digits), 3) Atlas Network Access allows 0.0.0.0/0, 4) the DB user exists and has read/write permission, 5) certifi/dnspython installed, 6) is `.env` being loaded from the backend folder. Write a tiny script `backend/check_db.py` that prints exactly which step fails, run it, and fix the cause. Never print the password.
```

## R6. CORS error in the browser
```text
The browser console shows a CORS error when the frontend calls the backend: <paste>. Check: the frontend URL used (localhost:5173 or the Vercel URL), the backend's CLIENT_ORIGINS and CLIENT_ORIGIN_REGEX, that VITE_API_URL has no trailing slash, and whether the backend is actually returning an error (a 500 can look like CORS). Explain the cause and give the exact value to set in backend/.env or in the Render dashboard.
```

## R7. Git conflict or "rejected" push
```text
I ran git pull --rebase / git push and got this: <paste>. Explain what happened in simple words. Give the exact commands to resolve it step by step, preserving both my work and my teammates' work. If a conflict is in a file I don't own, tell me to ask its owner instead.
```
Quick fixes: `git status` (see state), `git rebase --abort` (go back to before the pull), `git stash` then `git pull --rebase` then `git stash pop`.

## R8. Deployment failed (Render or Vercel)
```text
My <Render|Vercel> deployment failed. Here are the last 40 lines of the build/deploy log: <paste>. Explain the cause in simple words, give the smallest fix, and say whether it's a code problem, a missing environment variable, or a settings problem (Root Directory, build command, Python/Node version). Do not change anything unrelated.
```
Checklist: Render env vars set (MONGODB_URI, CLIENT_ORIGINS), start command is `uvicorn app.main:app --host 0.0.0.0 --port $PORT`; Vercel root directory is `frontend` and `VITE_API_URL` is set; CI is green.

## R9. Demo is failing live (what to say and do)
```text
Our live demo is failing right now. Write a calm 3-line script to say to the judges while we switch to Plan B, and the exact steps to switch: open the backup video, or reset data with the demo reset, or switch the frontend to mock mode. Our wow flow is: <paste from PRD>.
```
Before every demo: open `<backend>/health` to wake the server, run `scripts/smoke-test.ps1`, reset demo data.

## R10. Resume in a new chat
```text
Read AGENTS.md, PROGRESS.md and the documents in /docs. Summarise in 6 lines where the project stands, which phase we are in, what is working, and what the next task is according to my playbook (<FRONTEND_PLAYBOOK|BACKEND_PLAYBOOK|INTEGRATOR_PLAYBOOK>.md). Do not change anything until I say "go".
```

## R11. Review before I push
```text
I'm about to push. Review my uncommitted changes (`git diff`) for: files outside my folder, secrets or keys, console.log/print debugging, hardcoded URLs, broken imports, and anything that disagrees with docs/API_CONTRACT.md. Tell me if it is safe to push and run the quick checks (backend import, frontend build).
```

## R12. Stitch design drift / looks generic
```text
(Paste into Claude) Here is my Stitch prompt: <paste>. The result looks too generic / inconsistent with my Style Seed. Rewrite the prompt to be stronger: restate the palette with hex codes, fonts, sharp 2-4px corners, mono uppercase micro-labels, registration marks, orbit-line backgrounds, stamp badges, and the telemetry bar, and add 3 specific visual details for this page. Keep it under <N> characters if Stitch truncates.
```

## R13. Make seed/demo data look alive
```text
Update backend/seed.py so the demo looks alive: <N> realistic records per collection, dates spread across the last 30 days, a mix of statuses, and 2 hero records for the wow moment described in docs/PRD.md Section 3. Keep field names exactly as in docs/API_CONTRACT.md. Then run it and show the first 3 records of each collection.
```

## R14. Explain the problem statement
```text
Explain this hackathon problem statement like I'm 15: who has the problem, what hurts, what a solution would do, and 5 words I may not know. Then ask me 3 questions to help pick a direction. <paste statement>
```

## R15. Prepare the pitch
```text
Using docs/PRD.md, write a 4-minute pitch script for 3 speakers: Problem (30s), Live demo (90s) with exact clicks, How it works (45s), Impact and next steps (30s). Map each part to the judging criteria (innovation, technical complexity, execution, practicality, presentation). Add 8 judge questions with short answers and a 7-slide outline.
```
