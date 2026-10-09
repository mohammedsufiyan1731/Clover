# 02: Frontend Master Prompt (PRD → Detailed Design Doc + Stitch Prompts)

**Who runs it:** Frontend Dev.
**Paste into:** a fresh Claude chat, then paste the full `docs/PRD.md` at the bottom.
**Output:** save as `docs/FRONTEND_DESIGN.md`. It contains the design system, every page's spec, a ready-to-paste **Stitch prompt for every page**, build phases, and the plan to convert Stitch's output into React.

**Design direction: "Analog Mission Control".** Most space projects look like dark purple galaxies with neon gradients. This one looks like a 1970s-meets-2070s flight-operations room: warm mission paper, stamped labels, analog gauges, phosphor displays, orbit diagrams. It's clearly space but visibly different, and memorable on a judging table. A fallback theme is included.

```text
ROLE
You are a senior product designer and design-systems engineer who writes prompts for Google Stitch (an AI UI generator) and who understands React + Tailwind CSS v4 so your specs convert cleanly into code. You explain things in plain words for beginners.

TASK
Using the PRD at the bottom, produce ONE document called FRONTEND_DESIGN.md that:
(a) defines a unique, consistent visual identity,
(b) fully specifies every page in the PRD's Pages Inventory,
(c) gives one detailed, self-contained, ready-to-paste Stitch prompt per page (plus a Style Seed prompt),
(d) groups pages into frontend BUILD PHASES that line up with the PRD's build groups,
(e) explains how Stitch output becomes working React code and connects to the backend.

DESIGN DIRECTION (fixed unless the user asks to change it): "ANALOG MISSION CONTROL"
Concept: a retro-futuristic space-agency flight-ops room. Printed mission paper, stamped labels, analog gauges, phosphor displays, orbit diagrams, registration marks. NOT neon purple galaxy, NOT generic glassmorphism, NOT stock astronaut/planet illustrations.

Palette (use exactly these tokens):
- --ink #0E1116 (primary dark background)
- --panel #161B22 (raised dark surface)
- --paper #F2EBDD (warm mission-paper off-white for "document/briefing" cards)
- --signal #FF5A1F (signal orange, THE primary action colour; one primary CTA per screen)
- --phosphor #3DFFA2 (phosphor green, live data, success, status dots)
- --amber #FFB547 (warnings, secondary highlight)
- --steel #8B98A9 (muted text, borders)
- --ice #BFE3FF (rare cool accent for info/links)
Dark UI by default, with --paper cards for contrast. Orange sparingly. Green only for live/OK states.

Typography: Headings "Space Grotesk" (or "Chakra Petch"); data/labels/IDs/timestamps "JetBrains Mono" in UPPERCASE with wide letter-spacing; body "Inter". Use mono micro-labels as UI texture, e.g. "MISSION ID // 0042", "STATUS: NOMINAL", "T-MINUS 00:12:44". They must mean something real in the app.

Signature elements (use on every page):
1. 1px crosshair/registration marks in card corners
2. Thin concentric orbit lines as backgrounds and dividers
3. Slightly rotated "stamp" badges for statuses
4. A top telemetry bar: UTC clock, status dot, project name
5. Very faint grain/scanline texture on dark surfaces
6. Radial gauges, segmented bars, tick-mark scales instead of generic rounded charts
7. Sharp corners (2-4px radius), hard offset shadows, 1px borders; no big rounded pills except stamp badges
Motion (for coding stage): count-up numbers, blinking status dot, typewriter heading reveal, slow orbit rotation. Tasteful.
Copy voice: calm, precise mission-briefing tone, mapped to the project's real terms without confusing the user.

OUTPUT STRUCTURE (use these headings exactly)

# 1. Brand Snapshot
Project name, tagline, wordmark + orbit glyph description, one-paragraph rationale for the look, and "How this will look to judges" in 3 lines.

# 2. Design Tokens
- Colour table (name, hex, usage, do/don't).
- Type scale (size/weight/line-height for display, h1-h4, body, small, mono label).
- Spacing (4px base), radii, borders, shadows, z-index layers, breakpoints (375 / 768 / 1280).
- A ready-to-paste Tailwind CSS v4 `@theme { ... }` block with these tokens as CSS variables (e.g. --color-ink, --color-signal, --font-display, --font-mono) and a :root block for plain CSS variables.
- Google Fonts <link> tags to use.

# 3. Layout and Navigation
Page shell (telemetry bar, nav, content area, footer), nav pattern desktop vs mobile, how nav maps to page IDs, responsive rules. Mobile-first.

# 4. Component Library
Every reusable component with: purpose, variants, states (default/hover/focus/disabled/loading/error), props in plain words, and which pages use it. Include at least: Button, BriefingCard (paper card), PanelCard (dark), StatusStamp, GaugeRadial, SegmentedBar, DataTable, FormField, Modal, Toast, OrbitLoader, EmptyState, ErrorState, TelemetryBar, Navbar, PageHeader, plus project-specific ones from the PRD.

# 5. Page Specifications
For EACH page (same IDs/names as PRD):
- Purpose and the user's goal
- Layout: sections top to bottom, desktop columns vs mobile stacking
- Components used
- Exact realistic content/copy (no lorem ipsum), sample data using PRD entity names
- Data shown (field names in camelCase matching the PRD's entities) and the actions that need the backend ("API: see API_CONTRACT")
- States: loading, empty, error, success
- Navigation in and out
- The memorable visual moment on this page

# 6. STITCH PROMPTS
Stitch does not remember earlier prompts, so EVERY prompt must restate the style. Provide:
- STITCH PROMPT 0 (STYLE SEED): generates a single style-guide / component-sheet screen first (palette swatches, type samples, buttons, cards, stamps, gauges, form fields, telemetry bar). Used as the visual anchor.
- STITCH PROMPT per page, each in its own fenced code block, labelled with page ID and name, each containing:
  1. "Design a [responsive web / mobile-first] screen for [Project Name], [one-line description]."
  2. The condensed style block: colours with hex values, fonts, sharp 2-4px corners, mono uppercase micro-labels, registration marks, orbit-line backgrounds, stamp badges, telemetry top bar.
  3. Section-by-section layout with exact content/copy and data examples.
  4. Visible component states.
  5. Final line: "Keep consistent with the previous screens: same top telemetry bar, same navigation, same colour tokens, same fonts."
- A mobile variant prompt for the 2 most important pages.
- Recommended generation order: Style Seed -> the wow page -> other pages by build group.
- Tips: if Stitch drifts in style, attach the Style Seed screenshot as reference; if a prompt is too long for Stitch, shorten the page content but never drop the style block; regenerate rather than hand-edit; time-box Stitch to ~3 hours.

# 7. Frontend Build Phases
Group pages into 2-4 phases, matching PRD build groups. For each phase: pages included, components needed (new ones only), mock data needed, which backend phase it will connect to, "done when" checklist, and what the user should see in the browser. Phase F0 = foundation (tokens, fonts, shell, routing, shared components) always comes first.

# 8. From Stitch to Working Code (handoff plan)
Step by step for a beginner:
1. Export from each Stitch screen (HTML/CSS code and/or screenshot; follow Stitch's current export options). Save into `/frontend/stitch-export/` with names like `S1_landing.html`.
2. Which files the coding agent should read.
3. A copy-paste instruction block for the agent: "Rebuild each exported screen as a React page using Tailwind v4 and the tokens in src/styles. Extract repeated UI into the components in FRONTEND_DESIGN.md Section 4. Use src/mocks data identical to the API_CONTRACT example responses. Keep the API calls in src/api only. Do not add libraries beyond react-router-dom and framer-motion (and recharts only if the PRD needs charts). Work only in /frontend."
4. How to switch a page from mocks to the real API (the VITE_USE_MOCKS flag and src/api layer from the skeleton).
5. Routes table: path -> page ID -> component name.
6. "Waking up the server" UX: the free backend may take up to a minute on first request; show a friendly loading message.

# 9. Quality Checklist
Responsive at 375/768/1280, contrast, keyboard focus, 44px touch targets, all states handled, no console errors, tokens used (no random colours), motion only on wow elements, works on a phone, deployed on Vercel.

# 10. Fallback Theme
"SOLAR FLARE BRUTALIST": black background, solar yellow #FFD400 and white, 3px borders, oversized grotesque type, hard shadows, cut-out collage planets, with a palette table and a 5-line rule set, and how to adjust the Stitch prompts.

RULES
- Use the PRD's exact page, entity and feature names.
- No lorem ipsum. Use believable data for this project's domain.
- Page count must equal the PRD's pages (max 8). Don't invent pages.
- Every Stitch prompt must be self-contained (never say "as above").
- No code except the @theme/CSS variable blocks, font tags, and the handoff instruction block.
- Explain choices in plain words; the reader is a beginner.

INPUT
=== PRD.md (paste full contents) ===
<paste here>

=== Optional: changes to the theme (e.g. "use fallback theme", "make accent colour blue") ===
<paste here>
```

## What the Frontend Dev does with the output
1. Save as `docs/FRONTEND_DESIGN.md` (push it).
2. Open Stitch. Paste **Stitch Prompt 0** first, check the look, adjust until happy.
3. Generate each page prompt in the recommended order. Export each to `frontend/stitch-export/`.
4. Hand `FRONTEND_DESIGN.md` to the Integrator for the Phase Plan (prompt 04).
