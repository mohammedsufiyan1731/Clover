# Apogee API Contract

**Contract status:** MVP proposal aligned to the Apogee PRD  
**Base path:** `/api/v1`  
**Backend:** FastAPI + synchronous PyMongo + MongoDB Atlas  
**Frontend:** React + Vite; send bearer JWT on protected calls  
**Source of truth:** This document and the PRD. If an implementation differs, update this contract and notify both frontend and backend owners.

---

## 1. Shared conventions

### 1.1 Base URL

Local development: `http://localhost:8000`  
Production: use the Render backend URL configured by the team. The frontend must read it from its environment configuration and must not hard-code a developer's URL.

Existing root health endpoint remains `GET /health`. Product endpoints use `/api/v1`.

### 1.2 Authorization

Protected endpoints require:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

For multipart requests, let the browser/client set the multipart `Content-Type` boundary; do not manually set it. Token payload role is not authoritative; backend loads the current User record and checks the stored role.

Roles are `student`, `trainer`, `admin`. Public registration may create `student` or `trainer`, never `admin`. Admin is seeded.

### 1.3 Success envelope

Every JSON endpoint returns:

```json
{
  "success": true,
  "data": {}
}
```

Lists use:

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

### 1.4 Error envelope

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found.",
    "details": []
  }
}
```

`details` is an array of `{ "field": "email", "message": "Invalid email address" }`. The frontend should display `error.message`; field-level forms may map `details` to the relevant inputs.

### 1.5 Common errors

| HTTP | Code | Meaning |
|---:|---|---|
| 400 | `INVALID_ID` | Malformed resource ID or invalid file/content |
| 400 | `RESUME_TEXT_NOT_FOUND` | PDF has no extractable text |
| 401 | `INVALID_CREDENTIALS` | Email/password pair is incorrect |
| 401 | `UNAUTHENTICATED` | Missing, invalid or expired token |
| 403 | `FORBIDDEN` | Role or ownership/batch scope denied |
| 404 | `NOT_FOUND` | Resource not found or intentionally hidden |
| 409 | `DUPLICATE_EMAIL` | Email is already registered |
| 409 | `INVALID_STATE` | Attempt already submitted or interview already completed |
| 413 | `FILE_TOO_LARGE` | Upload exceeds server limit |
| 422 | `VALIDATION_ERROR` | Input schema validation failed |
| 500 | `INTERNAL_ERROR` | Unexpected server failure |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | External service unavailable and no fallback can complete the request |

AI failure normally does **not** produce an error response: use the documented fallback fields.

### 1.6 IDs and timestamps

- All public resource IDs are strings containing MongoDB ObjectId hex values.
- All timestamps are ISO 8601 UTC strings, e.g. `2026-10-09T13:23:32Z`.
- JSON field names use camelCase.
- Do not return `_id`, `passwordHash`, hidden coding tests, or student-facing question `correctIndex`.

---

## 2. Canonical shared schemas

### 2.1 UserPublic

```json
{
  "id": "665f00000000000000000001",
  "name": "Aarav Sharma",
  "email": "aarav@example.test",
  "role": "student",
  "batchId": "665f00000000000000000002",
  "readinessScore": 54,
  "streakCount": 2,
  "points": 20
}
```

`role`: `student | trainer | admin`. `batchId` may be `null`. Never include password or password hash.

### 2.2 TestPublic

```json
{
  "id": "665f00000000000000000010",
  "title": "Aptitude Fundamentals",
  "topic": "Aptitude",
  "durationMinutes": 20,
  "questionCount": 20,
  "assignedBatchIds": ["665f00000000000000000002"],
  "isPublished": true
}
```

### 2.3 Student QuestionPublic

```json
{
  "id": "665f00000000000000000020",
  "text": "Which data structure uses FIFO?",
  "options": ["Stack", "Queue", "Tree", "Graph"],
  "topic": "Data Structures",
  "difficulty": "easy"
}
```

**Student delivery must not include `correctIndex`.** Trainer authoring/review endpoints may include `correctIndex` for tests the trainer manages.

### 2.4 TopicAccuracy

```json
{
  "topic": "Data Structures",
  "correct": 4,
  "total": 5,
  "accuracy": 80.0
}
```

### 2.5 ResumeAnalysisPublic

```json
{
  "id": "665f00000000000000000030",
  "atsScore": 61,
  "sectionFeedback": [
    {"section": "Education", "score": 8, "feedback": "Education details are clear."},
    {"section": "Skills", "score": 6, "feedback": "Add evidence for the listed skills."},
    {"section": "Projects", "score": 7, "feedback": "Add measurable project outcomes."},
    {"section": "Experience", "score": 5, "feedback": "Describe your contribution more specifically."}
  ],
  "missingKeywords": ["REST API", "Docker", "SQL joins"],
  "matchedKeywords": ["Python", "Git"],
  "lineSuggestions": [
    {
      "originalLine": "Built an API",
      "suggestedLine": "Built a REST API with ...",
      "reason": "Names the API type and the implementation detail."
    }
  ],
  "analysisMode": "rules",
  "basicModeNote": "Basic analysis was used because AI feedback was unavailable."
}
```

The example values above illustrate shape only; live results must be calculated from the uploaded resume and job description. `analysisMode` is `ai | rules`.

### 2.6 InterviewReport

```json
{
  "skillScores": [
    {"skill": "Communication", "score": 6, "maxScore": 10},
    {"skill": "Technical Depth", "score": 4, "maxScore": 10},
    {"skill": "Problem Solving", "score": 5, "maxScore": 10},
    {"skill": "Structure of Answers", "score": 6, "maxScore": 10}
  ],
  "strengths": ["Explains the basic concept"],
  "weaknesses": ["Needs a specific implementation example"],
  "answerComments": [
    {"messageIndex": 1, "comment": "Add a concrete example and outcome."}
  ],
  "overallScore": 5.25,
  "summary": "The answer would be stronger with a specific example."
}
```

`messageIndex` is zero-based index into the persisted `messages` array. Skill scores are integers 0–10; overall score is 0–10.

---

## 3. Endpoint inventory and phase map

| Phase | Endpoint | Method | Access | Purpose |
|---|---|---|---|---|
| B0 | `/health` | GET | Public | Existing deployment health check |
| B1 | `/api/v1/auth/register` | POST | Public | Register student/trainer |
| B1 | `/api/v1/auth/login` | POST | Public | Authenticate and return JWT |
| B1 | `/api/v1/auth/me` | GET | Any authenticated | Current safe user |
| B1 | `/api/v1/users/me` | PATCH | Any authenticated | Update own profile |
| B1 | `/api/v1/batches` | GET | Trainer/Admin | List batches in permitted scope |
| B1 | `/api/v1/batches` | POST | Admin | Create batch |
| B1 | `/api/v1/batches/{batchId}` | PATCH | Admin | Update batch/trainer |
| B1 | `/api/v1/batches/{batchId}/students` | GET | Trainer/Admin | List students in permitted batch |
| B1 | `/api/v1/tests` | POST | Trainer/Admin | Create draft test |
| B1 | `/api/v1/tests` | GET | Student/Trainer/Admin | Student's assigned tests or staff-managed tests |
| B1 | `/api/v1/tests/{testId}` | GET | Authorized user | Test metadata |
| B1 | `/api/v1/tests/{testId}/questions` | POST | Trainer/Admin | Add one question |
| B1 | `/api/v1/tests/{testId}/questions/import` | POST | Trainer/Admin | Import CSV questions |
| B1 | `/api/v1/tests/{testId}/assign` | POST | Trainer/Admin | Assign to batch(es), publish |
| B1 | `/api/v1/tests/{testId}/questions` | GET | Student/Trainer/Admin | Student-safe questions or trainer authoring view |
| B1 | `/api/v1/analytics/overview` | GET | Trainer/Admin | Dashboard overview and roster summary |
| B1 | `/api/v1/analytics/batches/{batchId}/readiness.csv` | GET | Trainer/Admin | Export authorized roster CSV |
| B2 | `/api/v1/tests/{testId}/start` | POST | Assigned student | Start one attempt and receive shuffled questions |
| B2 | `/api/v1/attempts/{attemptId}/submit` | POST | Attempt owner | Submit answers and score server-side |
| B2 | `/api/v1/attempts/{attemptId}` | GET | Attempt owner/authorized staff | Debrief result |
| B2 | `/api/v1/attempts/{attemptId}/debrief` | GET | Attempt owner/authorized staff | Topic, time and batch comparison |
| B2 | `/api/v1/dashboard/student` | GET | Student | Mission Control dashboard |
| B3 | `/api/v1/resumes/analyze` | POST | Student | Upload PDF and analyze |
| B3 | `/api/v1/resumes` | GET | Student | Own report history |
| B3 | `/api/v1/resumes/{resumeReportId}` | GET | Owner/authorized staff | One resume report |
| B3 | `/api/v1/interviews` | POST | Student | Start interview |
| B3 | `/api/v1/interviews/{sessionId}/answer` | POST | Session owner | Submit answer and get next question |
| B3 | `/api/v1/interviews/{sessionId}/end` | POST | Session owner | Complete interview and generate report |
| B3 | `/api/v1/interviews/{sessionId}` | GET | Owner/authorized staff | Session/report |
| B3 | `/api/v1/interviews` | GET | Student | Own interview history |
| B4 | `seed.py` | CLI | Operator | Seed/reset demo data |
| B5 optional | `/api/v1/code/problems` | GET | Student | Coding problem list without hidden tests |
| B5 optional | `/api/v1/code/run` | POST | Student | Run code using hosted runner |
| B5 optional | `/api/v1/code/problems/{problemId}/submit` | POST | Student | Judge against hidden tests |
| B5 optional | `/api/v1/leaderboard` | GET | Student | Top 10 in own batch |
| B5 optional | `/api/v1/library/modules` | GET | Student | Study modules |
| B5 optional | `/api/v1/library/modules/{moduleId}/complete` | POST | Student | Mark module complete |

Do not expose optional B5 routes until their behavior is implemented. A route returning a fabricated success object is not an implementation.

---

## 4. Endpoint details

### 4.1 `GET /health` — B0

Public. Preserve the existing route and its current behavior where practical.

**Response `200`:**
```json
{"success": true, "data": {"status": "ok"}}
```

Do not require an AI provider for health. If database connectivity is included, return a safe status indicator and do not leak the URI.

### 4.2 `POST /api/v1/auth/register` — B1

Public. `201 Created`.

**Request:**
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.test",
  "password": "demo-password-123",
  "role": "student"
}
```

Allowed roles: `student`, `trainer`. If role is omitted, default to `student`. `admin` returns `422 VALIDATION_ERROR` or `403 FORBIDDEN`; choose one consistently (recommended: schema rejects it).

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "bearer",
    "expiresIn": 43200,
    "user": {
      "id": "665f00000000000000000001",
      "name": "Aarav Sharma",
      "email": "aarav@example.test",
      "role": "student",
      "batchId": null,
      "readinessScore": 0,
      "streakCount": 0,
      "points": 0
    }
  }
}
```

Errors: `409 DUPLICATE_EMAIL`, `422 VALIDATION_ERROR`.

### 4.3 `POST /api/v1/auth/login` — B1

Public. `200 OK`.

**Request:**
```json
{"email": "aarav@example.test", "password": "demo-password-123"}
```

**Response:** same `data` shape as register.

Errors: `401 INVALID_CREDENTIALS` with generic “Invalid email or password.” Do not reveal whether the email exists.

### 4.4 `GET /api/v1/auth/me` — B1

Any authenticated user. `200 OK`.

**Response:** `{ "success": true, "data": { ...UserPublic } }`.

### 4.5 `PATCH /api/v1/users/me` — B1

Any authenticated user; can only change their own profile.

**Request:**
```json
{"name": "Aarav S."}
```

At least one supported field is required. Ignore no unknown fields; reject them.

**Response:** updated `UserPublic`.

### 4.6 `GET /api/v1/batches` — B1

Trainer sees batches where `trainerId` equals their user ID; admin sees all batches. Students should use their own `batchId` from `/auth/me` and do not need the full batch list.

Optional query: `page=1&pageSize=20`.

**Response data:**
```json
{
  "items": [
    {"id": "665f00000000000000000002", "name": "CSE-A 2027", "year": 2027, "trainerId": "665f00000000000000000003"}
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### 4.7 `POST /api/v1/batches` — B1

Admin only.

**Request:**
```json
{"name": "CSE-A 2027", "year": 2027, "trainerId": "665f00000000000000000003"}
```

Validate `trainerId` exists and has role `trainer`.

**Response `201`:** created `BatchPublic`.

### 4.8 `PATCH /api/v1/batches/{batchId}` — B1

Admin only. Request may contain `name`, `year`, and/or `trainerId`. Validate new trainer role. Return updated `BatchPublic`.

### 4.9 `GET /api/v1/batches/{batchId}/students` — B1

Trainer managing that batch or admin. Returns paginated `UserPublic` rows; do not return passwords or private resume/interview content in this roster response.

### 4.10 `POST /api/v1/tests` — B1

Trainer/Admin only.

**Request:**
```json
{"title": "Aptitude Fundamentals", "topic": "Aptitude", "durationMinutes": 20}
```

Creates a draft test with `assignedBatchIds=[]`, `isPublished=false`, and `questionCount=0`.

**Response `201`:** `TestPublic`.

### 4.11 `GET /api/v1/tests` — B1

Role-dependent behavior:
- Student: only published tests assigned to the student's `batchId`.
- Trainer: tests created by the trainer, plus tests they are explicitly authorized to manage.
- Admin: all tests.

Optional filters: `page`, `pageSize`, and for staff `createdBy` only if allowed. Do not let students supply a batch ID to read another batch's tests.

### 4.12 `GET /api/v1/tests/{testId}` — B1

Student sees only assigned/published test metadata. Trainer sees tests they manage; admin sees any test. Does not include questions or answer keys.

### 4.13 `POST /api/v1/tests/{testId}/questions` — B1

Trainer/Admin with test-management permission.

**Request:**
```json
{
  "text": "Which data structure uses FIFO?",
  "options": ["Stack", "Queue", "Tree", "Graph"],
  "correctIndex": 1,
  "topic": "Data Structures",
  "difficulty": "easy"
}
```

**Response `201`:** trainer question shape including `correctIndex`. `options` must contain exactly four non-empty strings.

### 4.14 `POST /api/v1/tests/{testId}/questions/import` — B1

Trainer/Admin with test-management permission. `multipart/form-data` field name: `file`. CSV column order:

`topic,question,optionA,optionB,optionC,optionD,correctOption,difficulty`

`correctOption` accepts `A`, `B`, `C`, `D` or `0`, `1`, `2`, `3`. Difficulty: `easy`, `medium`, `hard`. Limit file to configured CSV size.

**Success response `200`:**
```json
{
  "success": true,
  "data": {
    "testId": "665f00000000000000000010",
    "totalRows": 24,
    "acceptedCount": 22,
    "rejectedCount": 2,
    "rowErrors": [
      {"row": 4, "field": "correctOption", "message": "Expected A/B/C/D or 0-3."},
      {"row": 9, "field": "optionC", "message": "Option cannot be empty."}
    ],
    "questionCount": 22
  }
}
```

Row numbers should refer to physical CSV row numbers including the header (first data row is row 2). Valid rows are saved even if other rows are rejected.

### 4.15 `POST /api/v1/tests/{testId}/assign` — B1

Trainer managing the test and selected batches, or admin.

**Request:**
```json
{"batchIds": ["665f00000000000000000002"]}
```

Validate every batch exists and the trainer manages each selected batch. Require at least one question. Assign and publish the test. Response is updated `TestPublic`.

### 4.16 `GET /api/v1/tests/{testId}/questions` — B1/B2

Student must be assigned and test published. Trainer/Admin must manage the test.

- Student response returns only `id`, `text`, `options`, `topic`, `difficulty`.
- Staff authoring response may include `correctIndex`.
- Before test start, this route is for authoring/review or a student-safe preview; the timed attempt should use `/start`.

### 4.17 `GET /api/v1/analytics/overview` — B1

Trainer/Admin only. Trainer data is scoped to managed batches; admin data is college-wide.

**Response data shape:**
```json
{
  "totalStudents": 12,
  "averageReadiness": 57,
  "studentsBelowThreshold": 5,
  "batches": [
    {
      "id": "665f00000000000000000002",
      "name": "CSE-A 2027",
      "studentCount": 12,
      "averageReadiness": 57,
      "weakTopics": [
        {"topic": "Docker/Containers", "incorrectAnswers": 8}
      ]
    }
  ],
  "students": [
    {
      "id": "665f00000000000000000001",
      "name": "Aarav Sharma",
      "email": "aarav@example.test",
      "batchId": "665f00000000000000000002",
      "readinessScore": 61,
      "weakTopics": ["Docker/Containers", "SQL joins"]
    }
  ]
}
```

`studentsBelowThreshold` uses a configurable/default threshold of 60 for MVP; if configurable, expose the selected threshold in the response. This threshold is a recommended implementation default because the PRD does not specify one.

### 4.18 `GET /api/v1/analytics/batches/{batchId}/readiness.csv` — B1

Trainer managing the batch or admin. Respond with `text/csv` download, with columns:

`studentId,name,email,batchName,readinessScore,weakTopics`

Only include students in the authorized batch. CSV must quote/escape fields correctly. The common JSON envelope does not apply to file-download bodies; document the response as CSV.

### 4.19 `POST /api/v1/tests/{testId}/start` — B2

Assigned student only. Creates the student's single attempt and returns shuffled questions without answers.

**Request:** empty JSON body `{}`.

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "attemptId": "665f00000000000000000040",
    "test": {
      "id": "665f00000000000000000010",
      "title": "Aptitude Fundamentals",
      "durationMinutes": 20,
      "totalQuestions": 20
    },
    "startedAt": "2026-10-09T13:23:32Z",
    "expiresAt": "2026-10-09T13:43:32Z",
    "questions": [
      {
        "id": "665f00000000000000000020",
        "text": "Which data structure uses FIFO?",
        "options": ["Stack", "Queue", "Tree", "Graph"],
        "topic": "Data Structures",
        "difficulty": "easy"
      }
    ]
  }
}
```

MVP: one attempt per student/test. If an attempt already exists, return `409 INVALID_STATE` with a clear message. The server stores `startedAt`; client countdown is display only.

### 4.20 `POST /api/v1/attempts/{attemptId}/submit` — B2

Attempt owner only. One submission.

**Request:**
```json
{
  "answers": [
    {"questionId": "665f00000000000000000020", "selectedIndex": 1, "timeSpentSeconds": 12}
  ],
  "tabSwitchCount": 0
}
```

Only accept question IDs delivered for that attempt/test. Missing questions count as unanswered/incorrect. The server calculates correctness, score, accuracy and topic accuracy. Enforce duration server-side; optionally allow a small network grace period only if the team agrees.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "attemptId": "665f00000000000000000040",
    "testId": "665f00000000000000000010",
    "score": 16,
    "totalQuestions": 20,
    "accuracy": 80.0,
    "topicAccuracy": [
      {"topic": "Data Structures", "correct": 4, "total": 5, "accuracy": 80.0}
    ],
    "timePerQuestion": [
      {"questionId": "665f00000000000000000020", "timeSpentSeconds": 12}
    ],
    "tabSwitchCount": 0,
    "submittedAt": "2026-10-09T13:40:12Z",
    "readinessScore": 58,
    "readinessAreasUsed": 1
  }
}
```

The sample is illustrative; scores must come from submitted answers and saved question keys. Re-submission returns `409 INVALID_STATE`.

### 4.21 `GET /api/v1/attempts/{attemptId}` — B2

Owner student or authorized trainer/admin. Returns saved attempt summary and answer review appropriate to role. Student may see correct answers only after their attempt is submitted. Staff access is scoped to the batch/test they manage.

### 4.22 `GET /api/v1/attempts/{attemptId}/debrief` — B2

Owner student or authorized trainer/admin.

**Response data includes:**
```json
{
  "attempt": {
    "id": "665f00000000000000000040",
    "score": 16,
    "totalQuestions": 20,
    "accuracy": 80.0,
    "topicAccuracy": []
  },
  "timePerQuestion": [],
  "weakTopics": ["SQL joins"],
  "batchComparison": {
    "batchAverageAccuracy": 67.5,
    "batchAverageScore": 13.5,
    "participantsCount": 10
  }
}
```

If no other submitted attempts exist, return `participantsCount: 1` (the current student) and a batch average based on available participants, or return `null` average with count 0 if the current attempt is intentionally excluded. Pick one policy and keep it consistent; recommended: include all submitted attempts, including the current one, and state the participant count.

### 4.23 `GET /api/v1/dashboard/student` — B2

Student only.

**Response data:**
```json
{
  "user": {
    "id": "665f00000000000000000001",
    "name": "Aarav Sharma",
    "readinessScore": 58,
    "streakCount": 2,
    "points": 20
  },
  "readiness": {
    "score": 58,
    "areasUsed": 1,
    "basedOn": ["test"]
  },
  "assignedTests": [],
  "recentActivity": [],
  "recommendedNextAction": {
    "label": "Analyze your resume",
    "reason": "Your resume has not been analyzed yet.",
    "target": "S6"
  }
}
```

Recommended action must be based on real saved activity. The example is illustrative.

### 4.24 `POST /api/v1/resumes/analyze` — B3

Student only. `multipart/form-data`:
- `file`: text-based PDF, required.
- `jobDescription`: optional text field.

Max file size default 5 MiB. Reject non-PDF or empty/unextractable content. Do not save the original PDF by default. The backend extracts text, runs rule-based checks, optionally calls AI, persists a `ResumeReport`, recalculates readiness and returns `ResumeAnalysisPublic` plus readiness values.

**Response `200`:** shared `ResumeAnalysisPublic` schema plus:
```json
{
  "readinessScore": 61,
  "readinessAreasUsed": 2
}
```

Implementation may nest these in the returned data object; frontend and backend must agree on the final exact shape before integration. Recommended final shape:

```json
{
  "success": true,
  "data": {
    "report": { "...ResumeAnalysisPublic fields..." },
    "readinessScore": 61,
    "readinessAreasUsed": 2
  }
}
```

Use this nested shape as the contract.

### 4.25 `GET /api/v1/resumes` — B3

Student only. Returns own history, newest first. Do not include full `resumeText` in list results.

**Response data:** `{ "items": [ResumeAnalysisPublic...], "page": 1, "pageSize": 20, "total": 1 }`.

### 4.26 `GET /api/v1/resumes/{resumeReportId}` — B3

Owner student or authorized staff. Returns the report's public analysis fields. Include extracted resume text only if the screen genuinely needs it and the requester is authorized; default response omits it.

### 4.27 `POST /api/v1/interviews` — B3

Student only.

**Request:**
```json
{
  "round": "technical",
  "focusKeywords": ["Docker", "REST API"],
  "resumeReportId": "665f00000000000000000030"
}
```

`round`: `hr | technical | behavioral`. `focusKeywords` and `resumeReportId` are optional. If `resumeReportId` is provided, it must belong to the student. The backend creates the session and returns the first assistant question.

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "665f00000000000000000050",
    "round": "technical",
    "status": "active",
    "focusKeywords": ["Docker", "REST API"],
    "messages": [
      {
        "role": "assistant",
        "content": "What have you used Docker for?",
        "kind": "question",
        "createdAt": "2026-10-09T13:23:32Z"
      }
    ],
    "report": null,
    "usedFallback": false
  }
}
```

`usedFallback` is true if the first question came from the seeded bank.

### 4.28 `POST /api/v1/interviews/{sessionId}/answer` — B3

Session owner only; session must be active.

**Request:**
```json
{"answer": "I used Docker once."}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "665f00000000000000000050",
    "answer": {
      "role": "user",
      "content": "I used Docker once.",
      "kind": "answer",
      "createdAt": "2026-10-09T13:24:10Z"
    },
    "nextQuestion": {
      "role": "assistant",
      "content": "What was the container running, and how did you start it?",
      "kind": "question",
      "createdAt": "2026-10-09T13:24:11Z"
    },
    "questionCount": 2,
    "usedFallback": true
  }
}
```

The sample follow-up illustrates the desired behavior. Actual follow-up must be generated from the conversation or fallback rules, not hard-coded for all users. The response's `usedFallback` means a fallback has been used during this session; persist the cumulative flag.

### 4.29 `POST /api/v1/interviews/{sessionId}/end` — B3

Session owner only. May end early. If already completed, return `409 INVALID_STATE` or return the saved report idempotently; recommended: return `409` to make the state transition explicit.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "sessionId": "665f00000000000000000050",
    "status": "completed",
    "report": { "...InterviewReport fields..." },
    "readinessScore": 61,
    "readinessAreasUsed": 3,
    "usedFallback": true
  }
}
```

Fallback report must contain four skill scores, strengths, weaknesses and a comment for each answer. With too few answers for meaningful feedback, use transparent neutral fallback comments rather than inventing claims about answers that do not exist.

### 4.30 `GET /api/v1/interviews/{sessionId}` — B3

Owner student or authorized staff. Returns the session with persisted messages and report if completed. Do not expose other students' session transcripts to unauthorized users.

### 4.31 `GET /api/v1/interviews` — B3

Student only. Returns own sessions, newest first; include IDs, round, status, created/completed timestamps and overall score if completed. Do not return all message bodies in the history list.

---

## 5. Optional endpoint contracts — B5 only

These endpoints are not part of the MUST acceptance gate. Add them only after F1–F5 work.

### 5.1 Code Lab

- `GET /api/v1/code/problems`: return `id`, `title`, `statement`, `difficulty`, `sampleInput`, `sampleOutput`; never `hiddenTests`.
- `POST /api/v1/code/run`: body `{ "language": "python|java|cpp|javascript", "code": "...", "stdin": "..." }`; invoke hosted runner only. Return `{ "stdout": "...", "stderr": "...", "runtimeMs": 123, "status": "success|error|unavailable", "demoFallback": false }`.
- `POST /api/v1/code/problems/{problemId}/submit`: body `{ "language": "...", "code": "..." }`; return `{ "testsPassed": 3, "testsTotal": 5, "runtimeMs": 123, "results": [{"case": 1, "passed": true}] }`. Do not return hidden input/expected output.
- Never execute submitted code locally on the FastAPI host. If provider unavailable, clearly mark demo fallback.

### 5.2 Leaderboard

`GET /api/v1/leaderboard` returns top 10 students in the current student's batch: `rank`, `userId`, `name`, `points`, `streakCount`. Do not permit cross-batch queries from students.

### 5.3 Study library

- `GET /api/v1/library/modules?track=service|product` returns seeded modules and completion state.
- `POST /api/v1/library/modules/{moduleId}/complete` records completion for the current student.
- A future smart plan may use `GET /api/v1/study-plan` and `POST /api/v1/study-plan/regenerate`; do not add until implemented.

---

## 6. Flow map for the end-to-end demo

```text
S1 Launch Gate
  └─ POST /auth/login → accessToken + UserPublic
      ├─ Student → S2 Mission Control
      │   ├─ GET /dashboard/student → score, assigned tests, next action
      │   ├─ S6 Resume Lab
      │   │   └─ POST /resumes/analyze → ResumeReport + readiness update
      │   ├─ S5 Interview Room
      │   │   ├─ POST /interviews → first question
      │   │   ├─ POST /interviews/{id}/answer → adaptive/fallback follow-up
      │   │   └─ POST /interviews/{id}/end → report + readiness update
      │   └─ S3 Test Arena
      │       ├─ POST /tests/{id}/start → shuffled safe questions + attemptId
      │       ├─ POST /attempts/{id}/submit → saved score + readiness update
      │       └─ GET /attempts/{id}/debrief → S4 Debrief
      └─ Trainer/Admin → S8 Command Center
          ├─ GET /analytics/overview → roster + weak topics
          ├─ POST /tests → create test
          ├─ POST /tests/{id}/questions/import → bulk import
          ├─ POST /tests/{id}/assign → assign/publish
          └─ GET /analytics/batches/{id}/readiness.csv → export
```

The trainer view reflects the student's saved updated score when it refetches or polls. Do not claim push-based real-time updates unless a push mechanism is implemented.

---

## 7. Mock data rule

The frontend may use mock data **only** for:
1. Static layout development before the relevant API is available.
2. Clearly labelled fallback/demo output when an external provider is unavailable, as defined in the PRD.
3. A deterministic demo fixture loaded into MongoDB by `seed.py`.

Once an endpoint is integrated, the frontend must read its saved API data and must not silently replace an API failure with invented successful data. Show a loading state, a meaningful error, and a retry action. If the demo fallback is used, label it as fallback/demo mode. Seeded records are real database records, even though their content is fictional.

---

## 8. Frontend/backend handshake checklist

Before integration, both developers must confirm:

- [ ] Base URL and `/api/v1` prefix agree.
- [ ] `GET /health` stays available for Render.
- [ ] Every JSON response uses `{ success, data }` or `{ success, error }`.
- [ ] Auth token property is exactly `accessToken`; header is `Authorization: Bearer ...`.
- [ ] Roles are lowercase: `student`, `trainer`, `admin`.
- [ ] Canonical page names: S1 Launch Gate, S2 Mission Control, S3 Test Arena, S4 Debrief, S5 Interview Room, S6 Resume Lab, S7 Code Lab, S8 Command Center.
- [ ] IDs are JSON strings named `id` (not raw `_id`).
- [ ] Field names are camelCase.
- [ ] Student test questions never contain `correctIndex`.
- [ ] Attempt scores are computed by the backend.
- [ ] CSV header/order and accepted `correctOption` values match.
- [ ] Resume upload uses multipart field `file`; optional description field is `jobDescription`.
- [ ] Resume analysis returns the agreed nested shape: `data.report`, `data.readinessScore`, `data.readinessAreasUsed`.
- [ ] Interview round values are `hr`, `technical`, `behavioral`.
- [ ] Interview report skill names are exact: `Communication`, `Technical Depth`, `Problem Solving`, `Structure of Answers`.
- [ ] Readiness score is 0–100; UI shows `areasUsed`/`basedOn` when data is missing.
- [ ] AI fallback is indicated by `usedFallback` or `analysisMode`.
- [ ] Trainer endpoints enforce managed-batch scope.
- [ ] CORS includes the exact deployed frontend origin.
- [ ] Optional routes are hidden/disabled until they are actually implemented.
- [ ] No real user resume, password, token, or API key is placed in logs or demo screenshots.

---

## 9. Contract changelog and open decisions

| Version | Change |
|---|---|
| v1.0 | Initial contract aligned to the Apogee PRD and existing FastAPI envelope. |

### Open decisions

1. **AI provider/model:** PRD leaves provider selection open. Until chosen, `AI_PROVIDER=none`; fallback behavior is required.
2. **Retakes:** recommended MVP is one attempt per student per test. If retakes are required, update the database index and readiness policy.
3. **Trainer report access:** PRD says college staff can see student progress, but does not precisely define access to raw resume/interview content. Default to least privilege; authorize trainer detail access only for managed batches.
4. **Readiness threshold:** PRD does not specify a threshold for “below threshold” analytics. MVP recommendation is 60 and the response should expose the threshold used.
5. **Timer grace:** agree whether a small network grace period is permitted. Server is authoritative.
6. **F6 readiness weight:** PRD says code practice takes 15% from test/interview weights but does not specify the exact revised weights. Do not change the formula until the team agrees.
7. **Resume analyzer response:** this contract recommends nesting public report fields under `data.report` with readiness fields alongside. Frontend and backend must confirm before implementation.

---

## 10. Build order and definition of contract compliance

- **B0:** Preserve skeleton, response envelope, health route, CORS and config.
- **B1 / Group 1:** Auth, roles, batches, test builder, CSV import/assignment, Command Center basics.
- **B2 / Group 2:** Timed test attempt, server-side scoring, Debrief, batch average, readiness v1.
- **B3 / Group 3:** Resume rules + AI fallback, interview chat + report fallback, readiness v2.
- **B4:** Seed, deployment, smoke tests, end-to-end demo.
- **B5:** Optional F6–F11 only after MUST features pass.

The contract is compliant when the backend implements the required endpoint behavior, uses the shared schemas and error envelope, enforces role/ownership/batch access, and the frontend consumes real persisted data. A successful HTTP status alone is not enough if the returned data violates the schema or exposes private/hidden fields.
