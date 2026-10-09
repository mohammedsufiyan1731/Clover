# 05: Skeleton Prompt for Antigravity (build + connect Atlas + deploy, BEFORE the hackathon)

**Who runs it:** the Integrator (with a helper), days before the hackathon.
**Paste into:** Antigravity (or any coding agent) opened on an **empty folder** that will become the repo (e.g. `cypher-project`).
**Result:** a working repo with a React frontend, a FastAPI backend connected to MongoDB Atlas, CI checks, and configs for **auto-deploy on every push to `main`** (Vercel for frontend, Render for backend). On hackathon day the team only writes project code and pushes.

## Before you paste (5 minutes, human steps)
1. Create an empty GitHub repo `cypher-project` (private, no README). Copy its URL.
2. In MongoDB Atlas: create a free **M0** cluster, a Database User (username + password; **use letters and digits only in the password**), and under Network Access add `0.0.0.0/0`. Click **Connect > Drivers** and copy the connection string (it starts with `mongodb+srv://`). Replace `<password>` in it with the real password.
3. Open the empty folder in Antigravity. Keep the connection string handy; the agent will ask you to put it in `backend/.env` yourself (never paste it into chat).

```text
ROLE
You are a careful senior full-stack engineer setting up a hackathon starter repo ("skeleton") for a team of 3 beginners on WINDOWS (PowerShell). Be precise, verify every step by running it, and fix problems before moving on. Do not add features beyond what is listed. Do not add libraries beyond what is listed unless something fails without it, and tell me if you do.

GOAL
Create a monorepo skeleton that runs locally, is connected to MongoDB Atlas, is checked by CI on each push, and is ready to auto-deploy: backend to Render, frontend to Vercel. The team will later add their own features on top. Everything must be generic (no specific project idea).

STACK (fixed)
- Backend: Python 3.11+, FastAPI, Uvicorn, Pydantic v2, pydantic-settings, PyMongo (sync), dnspython, certifi, python-dotenv.
- Frontend: React (JavaScript, not TypeScript) + Vite, Tailwind CSS v4 (using the @tailwindcss/vite plugin), react-router-dom. No other runtime libraries.
- Database: MongoDB Atlas (free M0).

STEP 0: Check environment
Run and show results: `git --version`, `node -v`, `npm -v`, `python --version`. If anything is missing or too old (Node < 20, Python < 3.11), stop and tell me exactly how to install it. 

STEP 1: Folder structure
Create exactly:
cypher-project/
  AGENTS.md, CLAUDE.md, GEMINI.md   (identical contents, see STEP 7)
  PROGRESS.md
  README.md
  render.yaml
  .gitignore
  .github/workflows/ci.yml
  scripts/smoke-test.ps1
  docs/.gitkeep
  docs/BUGS.md                       (header + table: ID | Severity (P0/P1/P2) | Where (Frontend/Backend) | Description | Owner | Status)
  backend/
    app/__init__.py
    app/main.py
    app/config.py
    app/db.py
    app/routers/__init__.py
    app/routers/health.py
    app/routers/items.py
    app/schemas/__init__.py
    app/schemas/items.py
    app/services/__init__.py
    app/utils/__init__.py
    app/utils/responses.py
    seed.py
    requirements.txt
    .env.example
    .python-version                  (contains: 3.11)
  frontend/
    (a Vite React app, created with npm create vite@latest frontend -- --template react, then cleaned)
    src/api/client.js
    src/api/items.js
    src/api/health.js
    src/mocks/items.js
    src/components/StatusPanel.jsx
    src/components/Layout.jsx
    src/pages/Home.jsx
    src/pages/NotFound.jsx
    src/styles/index.css
    stitch-export/.gitkeep
    vercel.json
    .env.example

STEP 2: Backend
- requirements.txt with pinned-compatible recent versions of: fastapi, uvicorn[standard], pydantic>=2, pydantic-settings, pymongo, dnspython, certifi, python-dotenv.
- app/config.py: a pydantic-settings `Settings` class reading from .env: MONGODB_URI (default empty string), DB_NAME (default "cypher"), CLIENT_ORIGINS (comma-separated string, default "http://localhost:5173"), CLIENT_ORIGIN_REGEX (optional, default empty), APP_VERSION ("0.1.0"). Expose `get_settings()` with caching. The app must NOT crash at import time if MONGODB_URI is empty.
- app/db.py: lazily create ONE MongoClient (serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where()), `get_db()` returns the database, `ping_db()` returns True/False without raising. 
- app/utils/responses.py: helpers `ok(data, meta=None)` returning { "success": true, "data": ..., "meta": ... } and an `error_response(code, message, details=None)` returning { "success": false, "error": { "code", "message", "details" } }. Also a helper `serialize(doc)` that converts a Mongo document's ObjectId `_id` to a string `id` and converts datetimes to ISO 8601 UTC strings.
- app/main.py: create the FastAPI app (title "CYPHER API"); add CORSMiddleware using CLIENT_ORIGINS (split by comma) and CLIENT_ORIGIN_REGEX if set; include routers; custom exception handlers so validation errors (422), HTTP errors, and unexpected errors all return the error envelope (validation -> code VALIDATION_ERROR); a root route `/` returning a small JSON with name, version and a pointer to /docs.
- app/routers/health.py: GET /health returning { "status": "ok", "time": <UTC ISO>, "dbConnected": <bool from ping_db()>, "version": <APP_VERSION> } (this one is NOT wrapped in the envelope, so uptime checkers stay simple).
- app/routers/items.py + app/schemas/items.py: a tiny demo resource under /api/items to prove the full database round trip:
  - GET /api/items -> list newest first (limit query param default 50)
  - POST /api/items body { "title": str (1-100 chars), "note": str|null (max 500) } -> create with createdAt, return created item
  - DELETE /api/items/{id} -> delete; 404 with error envelope if not found or invalid id
  Use plain `def` endpoints. Collection name: "items". All responses use the envelope and `id` strings.
- seed.py: connects, deletes the "items" collection contents only if `--force` is passed (or after confirmation), inserts 5 sample items with realistic space-flavoured titles, prints a summary. Run with `python seed.py`.
- .env.example with every variable and a short comment; the REAL `backend/.env` must be git-ignored.
- Create the virtual environment at backend/.venv, install requirements, and verify imports.

STEP 3: Frontend
- Create the Vite React app in /frontend, then install: tailwindcss, @tailwindcss/vite, react-router-dom. Configure the Tailwind v4 Vite plugin. Remove Vite demo assets and boilerplate.
- src/styles/index.css: import Tailwind, add Google Fonts imports for Space Grotesk, Inter and JetBrains Mono, and an `@theme` block defining these colour tokens and fonts so the team's design has a base:
  --color-ink #0E1116, --color-panel #161B22, --color-paper #F2EBDD, --color-signal #FF5A1F, --color-phosphor #3DFFA2, --color-amber #FFB547, --color-steel #8B98A9, --color-ice #BFE3FF; --font-display "Space Grotesk"; --font-body "Inter"; --font-mono "JetBrains Mono". Set the body background to ink and text to paper. (The team will refine the look later from Stitch designs.)
- src/api/client.js: `API_URL` from import.meta.env.VITE_API_URL (default http://localhost:8000); `USE_MOCKS` from import.meta.env.VITE_USE_MOCKS === "true"; a `request(path, options)` function using fetch with a 60-second timeout via AbortController, JSON handling, one retry on network failure, throwing a readable Error built from the backend's error envelope; and an exported small event/state (e.g. `onWaking(callback)`) that signals when a request has taken longer than 3 seconds, so the UI can show "Waking up the server, this can take up to a minute".
- src/api/health.js: `getHealth()` calling GET /health (never mocked).
- src/api/items.js: `listItems()`, `createItem(data)`, `deleteItem(id)`; each uses mocks from src/mocks/items.js when USE_MOCKS is true, otherwise calls the real API and returns the `data` of the envelope.
- src/mocks/items.js: mock items identical in shape to the API example (id, title, note, createdAt).
- src/components/Layout.jsx: a simple page shell with a top bar (project name placeholder "MISSION CONTROL // STARTER", live UTC clock, status dot) and a content area.
- src/components/StatusPanel.jsx: shows three live checks with coloured dots: Frontend (always OK), Backend (from /health), Database (dbConnected), plus the API URL in use, the backend version and a "Mode: LIVE API / MOCKS" label. Shows the "waking up" message when applicable and a Refresh button.
- src/pages/Home.jsx: StatusPanel + a small demo section to list, add and delete items using src/api/items.js (proves the round trip frontend -> backend -> Atlas).
- src/pages/NotFound.jsx and routing in App/main with react-router-dom (routes "/" and "*").
- frontend/vercel.json with an SPA rewrite so all routes serve index.html.
- frontend/.env.example: VITE_API_URL=http://localhost:8000 and VITE_USE_MOCKS=false.

STEP 4: Root files
- .gitignore: node_modules, dist, .env, .env.*, !.env.example, .venv, __pycache__, *.pyc, .DS_Store, .vscode (optional), *.log.
- render.yaml (Render Blueprint) defining ONE web service named "cypher-backend": runtime python, rootDir backend, plan free, buildCommand `pip install -r requirements.txt`, startCommand `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, healthCheckPath /health, autoDeploy true, branch main, envVars: PYTHON_VERSION=3.11.9, DB_NAME=cypher, MONGODB_URI (sync: false), CLIENT_ORIGINS (sync: false), CLIENT_ORIGIN_REGEX = ^https://.*\.vercel\.app$ .
- .github/workflows/ci.yml: on push and pull_request to main. Job "backend": ubuntu-latest, setup-python 3.11, pip install -r backend/requirements.txt, run in backend: `python -c "from app.main import app; print('backend imports OK')"`. Job "frontend": ubuntu-latest, setup-node 20 with npm cache, run in frontend: `npm ci` then `npm run build`. (Make sure frontend/package-lock.json is committed.)
- scripts/smoke-test.ps1: parameters -Backend (URL) and -Frontend (URL, optional). It calls GET {Backend}/health and prints PASS/FAIL (status ok, dbConnected true); creates an item via POST /api/items, lists items, deletes it, printing PASS/FAIL for each; if -Frontend is given, checks it returns HTTP 200. Ends with an overall summary and a non-zero exit code on failure. Print friendly hints if the first request is slow (Render cold start).
- README.md: what this repo is, the stack, folder layout, how to run the backend and frontend locally on Windows, environment variables, how deployment works, and the daily git routine. Keep it beginner-friendly.

STEP 5: Run locally and verify (do all of these and show me the outputs)
1. Ask me to create `backend/.env` from `.env.example` and paste my MONGODB_URI into it myself (do not ask me to share the string in chat). Wait until I say it is done.
2. Backend: activate venv (`.\.venv\Scripts\Activate.ps1`), run `uvicorn app.main:app --reload --port 8000`. Verify http://localhost:8000/health returns status ok and dbConnected true, and that http://localhost:8000/docs lists the endpoints. Run `python seed.py --force` and confirm items appear via GET /api/items.
3. Frontend: `npm run dev` in /frontend (http://localhost:5173). Verify the StatusPanel shows all three checks green and that adding and deleting an item works and survives a page refresh.
4. Run `npm run build` in /frontend and confirm it succeeds.
5. If anything fails, diagnose and fix it, and explain what was wrong in one simple sentence.

STEP 6: Git
- `git init`, set the default branch to main, make a first commit "chore: initial skeleton". Add the remote I give you (ask me for the GitHub repo URL) and push to main. Confirm that .env is NOT in the commit (`git ls-files | findstr .env` should show only .env.example files).
- After pushing, tell me to open the GitHub "Actions" tab and confirm the CI run is green.

STEP 7: Agent rules files
Create AGENTS.md, CLAUDE.md and GEMINI.md with IDENTICAL content so any agent picks them up:
- Project: CYPHER 4.0 hackathon app. Stack summary.
- Source of truth: the files in /docs. docs/API_CONTRACT.md wins over everything for endpoint paths and field names; docs/PRD.md for names and features.
- Folder ownership: Frontend work only in /frontend; backend work only in /backend; never change /docs/API_CONTRACT.md unless I explicitly say so.
- Add libraries only after asking.
- Make small changes, run the app after each change, and update PROGRESS.md after each task.
- Never commit secrets; never hardcode URLs (use VITE_API_URL and env vars).
- All API responses use the envelope { success, data } or { success:false, error:{code,message,details} }; JSON is camelCase; ids are strings named `id`.
- Frontend calls the API only through src/api; mock data in src/mocks must equal the API contract examples.
- Explain errors in simple words and fix with the smallest change.
- Before finishing any task, say how I can verify it myself.
Also create PROGRESS.md with a table: Date/Time | Who | What changed | Status.

STEP 8: Deployment checklist for the human
Do NOT try to automate Render, Vercel or Atlas dashboards. Instead, print a numbered checklist, with the expected result of each step, for the Integrator to follow:
 A. Render: New > Blueprint > connect the GitHub repo > Render reads render.yaml > fill MONGODB_URI (the Atlas string) and CLIENT_ORIGINS (set temporarily to http://localhost:5173) > Apply. Expected: service "cypher-backend" shows "Live"; opening https://<service>.onrender.com/health shows status ok and dbConnected true; /docs works.
 B. Vercel: Add New Project > import the repo > set Root Directory to `frontend` > Framework Preset Vite > Environment Variables: VITE_API_URL = the Render URL (no trailing slash), VITE_USE_MOCKS = false > Deploy. Expected: the site opens and the StatusPanel shows Backend and Database green. (First load may show the "waking up" message.)
 C. Back in Render: set CLIENT_ORIGINS to the exact Vercel production URL (and keep http://localhost:5173, comma-separated) > save and wait for redeploy. Expected: no CORS errors in the browser console on the Vercel site.
 D. Auto-deploy check: change one visible text in the frontend (e.g. the top bar title) and one in the backend root route message, commit, push to main. Expected: Vercel and Render both redeploy within a few minutes and the changes are visible on the live URLs.
 E. Run `.\scripts\smoke-test.ps1 -Backend https://<render-url> -Frontend https://<vercel-url>`. Expected: all PASS.
 F. Share the repo with teammates (GitHub > Settings > Collaborators) and tell them to clone and follow README.md.
 G. Note: Render's free service sleeps after inactivity; the first request can take about a minute. Open /health before the demo.
 H. Note for the day: Vercel creates a preview URL for every branch but production deploys come from main. Keep the production URLs in the group chat.

STEP 9: Final report
Finish with: (1) a tree of what was created, (2) the exact commands to run backend and frontend, (3) a table of what I verified and the result, (4) anything I should still do manually, (5) any deviations from this prompt and why.

RULES
- Never print or log secrets. Never commit .env.
- Use PowerShell-compatible commands (no &&, use ; if chaining).
- Keep code simple, readable, and commented only where the reason isn't obvious.
- If a step fails twice, stop and explain instead of trying random fixes.
- Do not build any project-specific features.
```

## After the skeleton is live (Integrator)
1. Do checklist A-F from the agent's final output.
2. Put the three URLs in the group chat: GitHub repo, Vercel site, Render backend (`/docs` page).
3. Everyone clones, runs locally, makes a tiny change, pushes, and sees it deployed. This is the dress rehearsal for the hackathon.
4. Save the agent's final report somewhere safe; it's your "how this was set up" reference.
