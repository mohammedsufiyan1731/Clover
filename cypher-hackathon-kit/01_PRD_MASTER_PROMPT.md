# 01: PRD Master Prompt (Problem Statement → PRD)

**Who runs it:** the Integrator, with the whole team reading along.
**Paste into:** a fresh Claude chat. Then paste the problem statement (and the chosen idea from 01A if you used it) at the bottom.
**Output:** save as `docs/PRD.md`. This is the single source of truth. Prompts 02, 03 and 04 all take it as input.

The PRD is written in **plain words** so every teammate understands exactly what is being built, why, and how the parts connect.

```text
ROLE
You are a senior product manager and hackathon mentor. You write clear, beginner-friendly Product Requirements Documents (PRDs). Anything technical must be explained in everyday words with an example.

CONTEXT
Hackathon: CYPHER 4.0, a 24-hour space-themed hackathon by the Rotaract Club of Atria Institute of Technology. Judged on: innovation, technical complexity, execution, practicality, presentation. Industry-professional judges. Each team gets a demo slot.
Team: 3 beginners using AI coding agents ("vibe coding"). Roles: Frontend Dev, Backend Dev, Integrator (QA, bugs, deployment, demo).
Fixed stack: React + Vite + Tailwind (frontend), Python FastAPI + PyMongo (backend), MongoDB Atlas (database), Vercel + Render hosting. Web app only (mobile-friendly). Real build time: about 14-16 hours.

TASK
Read the problem statement at the bottom and produce ONE document: PRD.md, with EXACTLY the sections below.

BEFORE WRITING
- If the statement is a broad theme or has several options and no idea is chosen, first run a mini idea selection: list 3 ideas, score each 1-5 on innovation, practicality, buildable-in-16h, demo impact, space fit; pick one; explain in 3 lines. Then continue.
- If something critical is missing, ask at most 5 short numbered questions and wait. If I answer "skip", continue with clearly labelled assumptions. If nothing critical is missing, do not ask; list your assumptions inside the PRD.

SECTIONS (use these headings exactly)

# 0. Read This First (plain-language summary)
- "What we are building" in 5 sentences a 15-year-old understands.
- "Who it helps and why it matters" in 3 sentences.
- "What the judges will see in 90 seconds" in 3 sentences.
- "What we are NOT building" (3 bullets).

# 1. Project Identity
Name (short, space-flavoured), tagline (max 10 words), one-sentence pitch, logo/wordmark idea.

# 2. Problem and Users
- The problem with a real scenario and one approximate statistic (label it "approximate").
- 2-3 user personas: name, who they are, their pain, what they want, how they'll use the app.
- Why existing solutions fall short (3 bullets).

# 3. The Solution and the Wow Moment
- How the solution works in 6-8 lines.
- WOW MOMENT: the single 60-90 second demo, as numbered steps from the user's viewpoint, ending in a clear "aha".
- Why it is innovative (3 bullets) and why it is practical (3 bullets).
- Which judging criterion each feature serves (small table).

# 4. Features (MoSCoW) with acceptance criteria
Table with columns: ID (F1...), Feature, Plain description, Priority (MUST / SHOULD / COULD), Difficulty (Easy/Medium/Hard), Acceptance criteria ("done when ..." as 2-3 checkable bullets).
- MUST: max 5 (the MVP: must be 100% working in the demo).
- SHOULD: max 3 (differentiators).
- COULD: max 3 (stretch).
- WON'T: 4+ bullets of things deliberately out of scope.
Order the MUST features in the order they should be BUILT.

# 5. User Journeys
- For each MUST feature: step by step "user does -> app responds -> data saved/read".
- One Mermaid flowchart of the main end-to-end journey.

# 6. Pages (screens) Inventory
Max 8 pages. Table: Page ID (S1...), Page name, Purpose, Features served (F-IDs), What the user sees, What the user can do, Data needed, Goes to (navigation), Build priority (1 = first).
Mark which page is the "wow page". Group the pages into 2-4 BUILD GROUPS in the order they should be built (e.g. Group 1: S1,S2; Group 2: S3,S4...) so frontend work can happen in small phases that line up with backend phases.

# 7. Data (in plain words)
List the "things" the app stores (entities). For each: what it is, key facts stored about it (plain field names in camelCase), and how it relates to other things. Include which MUST feature creates it and which pages show it. This is NOT the final database design, just the idea.

# 8. Smart / AI Feature (if useful)
Where AI/smart logic adds real value, what goes in, what comes out, and a fallback if it fails (so the demo never breaks). If AI isn't helpful, propose a different technical-depth feature (scoring algorithm, live updates, maps, charts). Do not require training any ML model. Prefer calling a hosted AI API from the backend, to be decided later.

# 9. How It All Fits Together (architecture explained simply)
- A Mermaid diagram: User's Browser -> React Frontend (Vercel) -> FastAPI Backend (Render) -> MongoDB Atlas, plus any external API.
- A short "story" of what happens when a user clicks the main button, step by step, naming each part (browser, frontend, API request, backend, database, response, screen update).
- A table "Who builds what": Frontend Dev, Backend Dev, Integrator, each with their responsibilities and the folder they own.
- Folder structure explained: /frontend, /backend, /docs, /scripts, with one line each on what lives there and why.

# 10. Space Theme Integration
How the theme shows in the name, copy tone ("mission briefing" voice), UI metaphors, data presentation and the pitch story. It should feel authentic, not decorative.

# 11. Risks and Plan B
Top 6 risks (time, data, external API limits, deployment, demo, team) with a concrete mitigation each. Include the "Plan B demo" (backup video + seed data).

# 12. Success Story for the Pitch
- Three impact claims (clearly labelled "projected").
- 4-minute pitch outline: Problem (30s) -> Live demo (90s) -> How it works (45s) -> Impact and next steps (30s), mapped to the five judging criteria.
- 6 likely judge questions with short strong answers.

# 13. Glossary and Canonical Names
Table of every entity, feature, and page with its OFFICIAL name. All later documents must use exactly these names. Add a mini glossary of any technical terms used in this PRD with one-line plain explanations.

# 14. Assumptions and Open Questions
Everything assumed. Mark each as "confirm with team".

# 15. Reading Guide for the Team
Which sections the Frontend Dev, Backend Dev and Integrator must read first, and what each person should be able to explain after reading.

# 16. PRD Checklist
Tick-style checklist confirming: MUST features <= 5, pages <= 8, each MUST feature has acceptance criteria, every page is linked to features, every entity is linked to features, names in Section 13 are consistent.

RULES
- Be specific and concrete, no filler, no vague "innovative platform" language.
- Everything must be buildable by beginners with AI agents in about 16 hours.
- Do not write code. Do not choose a different stack.
- Keep MUST scope small. Mention honestly what is hard.
- Use realistic example data when giving examples.

INPUT
=== PROBLEM STATEMENT (paste here) ===
<paste here>

=== CHOSEN IDEA from the Idea Picker (optional) ===
<paste here>

=== TEAM (names, skills) and anything already decided (optional) ===
<paste here>
```

## After you get the PRD
1. Everyone reads **Section 0, 3, 4, 9**. Ask Claude "explain Section X again more simply" until all three can explain the project in 2 sentences.
2. Integrator fixes anything wrong by replying to Claude (e.g. "Make F3 a COULD and drop S7"), then saves the final version as `docs/PRD.md` and pushes it.
3. Move to prompts **02** (Frontend) and **03** (Backend+DB), run in parallel by the two devs.
