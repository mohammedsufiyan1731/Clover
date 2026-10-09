# Apogee Backend Specification

**Source of truth:** Apogee Product Requirements Document (PRD)  
**Purpose:** Implementation-ready backend plan for the CYPHER 4.0 hackathon  
**Stack:** Python 3.11, FastAPI, Uvicorn, Pydantic v2, pydantic-settings, synchronous PyMongo, MongoDB Atlas, certifi, python-dotenv  
**Hosting:** Render backend; MongoDB Atlas M0  
**Build rule:** Extend the existing backend skeleton. Do not redesign it.

---

## 1. Backend overview

Apogee is a placement-preparation LMS for students, trainers, and admins. The backend authenticates users, enforces role and batch access, stores practice activity, calculates the Launch Readiness Score, and serves the frontend pages S1–S8.

### 1.1 Backend responsibilities

- Register and authenticate users; issue and validate JWTs.
- Enforce `student`, `trainer`, and `admin` permissions on every protected route.
- Support batches, tests, question creation and CSV question import.
- Deliver assigned tests without exposing correct answers.
- Score submitted test attempts, calculate topic accuracy and batch averages, and update readiness.
- Provide rule-based resume analysis even if the hosted AI API fails.
- Provide mock interview sessions, adaptive follow-ups, and a scored report, with a seeded-question fallback.
- Support CSV exports and trainer-facing batch analytics.
- Provide optional SHOULD/COULD features only after F1–F5 work end to end.
- Return consistent JSON envelopes and useful validation errors.

### 1.2 Non-responsibilities

- No frontend code or frontend hosting.
- No direct database access from the browser.
- No model training.
- No running user-submitted code on the FastAPI server.
- No voice/video interviews or camera proctoring.
- No scanned-image OCR requirement; the MVP supports text-based PDFs only.
- No payment, job board, email notification, or native mobile app.

### 1.3 Existing skeleton — preserve it

The deployed repository already has:

```text
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── db.py
│   └── routers/
│       ├── health.py
│       └── items.py       # demo router; do not let it define product API conventions
├── seed.py
└── ...
```

Keep `app/main.py`, `app/config.py`, `app/db.py`, `app/routers/health.py`, the existing `{ "success": true, "data": ... }` response convention, CORS environment configuration, `GET /health`, and Render auto-deploy from `main`. The demo `items` router may be removed from registration or left clearly marked as demo-only; do not expose it as a product feature.

### 1.4 Recommended target structure

```text
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── db.py
│   ├── dependencies/
│   │   ├── auth.py              # current user, role guards
│   │   └── pagination.py
│   ├── models/                  # Pydantic request/response schemas
│   │   ├── common.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── batches.py
│   │   ├── tests.py
│   │   ├── attempts.py
│   │   ├── interviews.py
│   │   └── resumes.py
│   ├── routers/
│   │   ├── health.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── batches.py
│   │   ├── tests.py
│   │   ├── attempts.py
│   │   ├── interviews.py
│   │   ├── resumes.py
│   │   ├── analytics.py
│   │   └── optional.py           # SHOULD/COULD routes, added only when built
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── readiness_service.py
│   │   ├── test_service.py
│   │   ├── csv_service.py
│   │   ├── resume_service.py
│   │   ├── interview_service.py
│   │   └── ai_provider.py
│   └── utils/
│       ├── ids.py
│       ├── errors.py
│       └── dates.py
├── tests/
│   ├── test_health.py
│   ├── test_auth.py
│   ├── test_tests.py
│   ├── test_attempts.py
│   ├── test_resume.py
│   └── test_interviews.py
├── seed.py
├── requirements.txt
└── .env.example
```

This is a proposed organization, not a requirement to move files that already work. Keep implementation simple enough for a 14–16 hour build.

---

## 2. Configuration and environment variables

Use `pydantic-settings` with a `Settings` class in `app/config.py`. Load `.env` locally with `python-dotenv`; never commit `.env`.

| Variable | Required | Purpose |
|---|---:|---|
| `MONGODB_URI` | Yes | Atlas connection string |
| `MONGODB_DB_NAME` | Yes | Database name, e.g. `apogee` |
| `JWT_SECRET_KEY` | Yes | Long random signing secret; never use a demo value in deployment |
| `JWT_ALGORITHM` | No | Default `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Default 720 for the hackathon; reduce for production |
| `CORS_ORIGINS` | Yes in deployment | Comma-separated exact frontend origins, e.g. `http://localhost:5173,https://your-app.vercel.app` |
| `AI_PROVIDER` | No | `none` until provider is selected; then provider adapter name |
| `AI_API_KEY` | No | Secret for hosted AI provider; backend only |
| `AI_MODEL` | No | Provider-specific model name |
| `AI_TIMEOUT_SECONDS` | No | Default 15 |
| `CODE_RUNNER_URL` | No | Optional hosted code execution service |
| `CODE_RUNNER_API_KEY` | No | Optional code-runner secret |
| `MAX_RESUME_BYTES` | No | Default 5 MiB |
| `MAX_CSV_BYTES` | No | Default 2 MiB |
| `APP_ENV` | No | `development` or `production` |

Do not print secret values in logs. Validate required database/JWT configuration at startup. In local development, `CORS_ORIGINS` may include the Vite origin; in Render, set only the real deployed frontend origin(s).

### 2.1 Dependencies

Use the fixed stack and add only necessary packages. Likely additions:

- `fastapi`, `uvicorn[standard]`
- `pydantic>=2`, `pydantic-settings`
- `pymongo`, `certifi`, `python-dotenv`
- `PyJWT` (or one JWT library selected by the team)
- `pwdlib[argon2]` or `passlib[bcrypt]` for password hashing; choose one and use consistently
- `python-multipart` for file uploads
- `pypdf` for text-based PDF extraction
- `pytest`, `httpx` for tests

Pin working versions in `requirements.txt` once installed. Avoid adding an ODM; synchronous PyMongo is the agreed approach.

---

## 3. Authentication and authorization decision

### 3.1 Decision

Use **JWT bearer access tokens** and hashed passwords. This matches the PRD's login-token flow and is simple for a React SPA talking to FastAPI.

- `POST /api/v1/auth/register` accepts `name`, `email`, `password`, and a permitted self-registration role.
- Public self-registration is allowed for `student` and `trainer` in the hackathon demo, matching the PRD assumption. **Never allow public self-registration as `admin`.**
- Admin users are created by the seed script. If the team later needs admin creation, it must be an authenticated admin-only operation.
- `POST /api/v1/auth/login` returns `accessToken`, `tokenType`, and the safe user object.
- Frontend sends `Authorization: Bearer <token>` on protected requests.
- The server validates signature, expiry, and subject; then loads the user from MongoDB so disabled/deleted users cannot continue using a stale token.
- Logout is client-side token removal for this MVP. No server-side token revocation collection is needed for the hackathon; document that a stolen unexpired token remains usable until expiry.

### 3.2 Passwords and token contents

- Hash passwords with Argon2 or bcrypt. Never store or return plaintext passwords.
- JWT claims: `sub` (user ObjectId string), `role`, `iat`, `exp`. Treat the database user record as authoritative for role checks.
- Use a cryptographically random `JWT_SECRET_KEY`; no hard-coded fallback secret in production.
- Do not put resume text, passwords, or other personal data into JWT claims.
- Normalize email to lowercase and trim whitespace before lookup/insertion.

### 3.3 Role and scope rules

| Operation | Student | Trainer | Admin |
|---|---|---|---|
| Read/update own basic profile | Own only | Own only | Own only |
| View own readiness and attempts | Yes | No, except trainer analytics | Admin overview only |
| Create/edit tests and import questions | No | Yes, tests they created or manage | Yes |
| Assign tests to batches | No | Batches where `trainerId` matches | Any batch |
| Take an assigned test | Own account and assigned batch | No | No |
| View a student's detailed resume/interview report | Own only | Only students in trainer-managed batch, if needed for coaching | Authorized college-wide access |
| Create batches and assign trainers | No | No | Yes |
| Export batch readiness CSV | No | Managed batches only | Any batch |
| View hidden correct answers before submit | Never | Only when authoring/managing a test | Only when authoring/managing a test |

Every authorization decision is enforced on the backend, not only by hiding frontend controls. Return `403` for an authenticated user who lacks permission and `404` when resource hiding is appropriate to avoid revealing another user's resource.

---

## 4. API conventions and response envelopes

Base path: `/api/v1`. Keep existing `GET /health` at the root for deployment health checks. JSON APIs use the existing envelope.

### 4.1 Success

```json
{
  "success": true,
  "data": {
    "id": "665f...",
    "name": "Example"
  }
}
```

For paginated lists, `data` is an object:

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

### 4.2 Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": []
  }
}
```

Use a shared exception handler so custom errors and FastAPI validation errors have this shape. `details` may be an array of `{ "field": "email", "message": "Invalid email address" }`. Never expose stack traces, database URIs, provider responses containing secrets, or raw exception internals.

### 4.3 Common status codes

- `200 OK`: successful read/update/submit.
- `201 Created`: created resource.
- `202 Accepted`: optional asynchronous operation only if one is actually implemented.
- `400 Bad Request`: malformed CSV/PDF content or business-rule failure.
- `401 Unauthorized`: missing/invalid/expired token or invalid credentials.
- `403 Forbidden`: role/scope denied.
- `404 Not Found`: resource missing or intentionally hidden.
- `409 Conflict`: duplicate email or duplicate/invalid state transition.
- `413 Payload Too Large`: upload exceeds configured limit.
- `422 Unprocessable Entity`: Pydantic input validation (normalized into the shared error envelope).
- `429 Too Many Requests`: rate limit if implemented; otherwise do not pretend rate limiting exists.
- `502 Bad Gateway` or `503 Service Unavailable`: external service failure only when no fallback can provide a valid result.
- `500 Internal Server Error`: unexpected error with generic client message and server-side log.

---

## 5. MongoDB design

Use MongoDB collections named exactly as below. Store MongoDB `_id` as ObjectId; serialize all public IDs as 24-character hex strings named `id`. All timestamps are UTC. Store relationship fields as ObjectId internally and expose string IDs over the API. Do not return raw MongoDB documents.

### 5.1 Collections

#### `users` — canonical entity: User

```json
{
  "_id": "ObjectId",
  "name": "Aarav Sharma",
  "email": "aarav@example.test",
  "passwordHash": "...",
  "role": "student",
  "batchId": "ObjectId or null",
  "readinessScore": 54,
  "readinessBreakdown": {
    "test": null,
    "interview": null,
    "resume": null,
    "consistency": null,
    "areasUsed": 0
  },
  "streakCount": 0,
  "lastActiveDate": "YYYY-MM-DD or null",
  "points": 0,
  "isActive": true,
  "createdAt": "UTC datetime",
  "updatedAt": "UTC datetime"
}
```

#### `batches` — canonical entity: Batch

```json
{
  "_id": "ObjectId",
  "name": "CSE-A 2027",
  "year": 2027,
  "trainerId": "ObjectId",
  "createdAt": "UTC datetime",
  "updatedAt": "UTC datetime"
}
```

#### `tests` — canonical entity: Test

```json
{
  "_id": "ObjectId",
  "title": "Aptitude Fundamentals",
  "topic": "Aptitude",
  "durationMinutes": 20,
  "createdBy": "ObjectId",
  "assignedBatchIds": ["ObjectId"],
  "isPublished": true,
  "questionCount": 20,
  "createdAt": "UTC datetime",
  "updatedAt": "UTC datetime"
}
```

A test is visible to a student only if published and their `batchId` appears in `assignedBatchIds`. For the hackathon, editing a published test after attempts exist should be blocked or restricted to avoid changing historical scoring.

#### `questions` — canonical entity: Question

```json
{
  "_id": "ObjectId",
  "testId": "ObjectId",
  "text": "Which data structure uses FIFO?",
  "options": ["Stack", "Queue", "Tree", "Graph"],
  "correctIndex": 1,
  "topic": "Data Structures",
  "difficulty": "easy",
  "createdAt": "UTC datetime"
}
```

Never send `correctIndex` in a student test-delivery response. Trainer responses may include it when creating/reviewing their own test.

#### `test_attempts` — canonical entity: TestAttempt

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "testId": "ObjectId",
  "answers": [
    {
      "questionId": "ObjectId",
      "selectedIndex": 1,
      "isCorrect": true,
      "timeSpentSeconds": 12
    }
  ],
  "score": 16,
  "totalQuestions": 20,
  "accuracy": 80.0,
  "topicAccuracy": [
    {"topic": "Data Structures", "correct": 4, "total": 5, "accuracy": 80.0}
  ],
  "tabSwitchCount": 0,
  "startedAt": "UTC datetime",
  "submittedAt": "UTC datetime",
  "durationSeconds": 600
}
```

Answers and score are computed/validated by the backend. Do not trust a client-submitted `isCorrect`, score, total, or topic accuracy.

#### `interview_sessions` — canonical entity: InterviewSession

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "round": "technical",
  "status": "active",
  "focusKeywords": ["Docker", "REST API"],
  "resumeReportId": "ObjectId or null",
  "messages": [
    {
      "role": "assistant",
      "content": "What have you used Docker for?",
      "kind": "question",
      "createdAt": "UTC datetime"
    },
    {
      "role": "user",
      "content": "I used Docker once.",
      "kind": "answer",
      "createdAt": "UTC datetime"
    }
  ],
  "questionCount": 1,
  "report": null,
  "usedFallback": false,
  "createdAt": "UTC datetime",
  "completedAt": null
}
```

Final `report` shape:

```json
{
  "skillScores": [
    {"skill": "Communication", "score": 6, "maxScore": 10},
    {"skill": "Technical Depth", "score": 4, "maxScore": 10},
    {"skill": "Problem Solving", "score": 5, "maxScore": 10},
    {"skill": "Structure of Answers", "score": 6, "maxScore": 10}
  ],
  "strengths": ["Explains the basic concept"],
  "weaknesses": ["Needs more specific implementation examples"],
  "answerComments": [
    {"messageIndex": 1, "comment": "Add a concrete example and outcome."}
  ],
  "overallScore": 5.25,
  "summary": "..."
}
```

#### `resume_reports` — canonical entity: ResumeReport

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "resumeText": "Extracted plain text...",
  "jobDescription": "Optional pasted description...",
  "atsScore": 61,
  "sectionFeedback": [
    {"section": "Education", "score": 8, "feedback": "..."},
    {"section": "Skills", "score": 6, "feedback": "..."},
    {"section": "Projects", "score": 7, "feedback": "..."},
    {"section": "Experience", "score": 5, "feedback": "..."}
  ],
  "missingKeywords": ["REST API", "Docker", "SQL joins"],
  "matchedKeywords": ["Python", "Git"],
  "lineSuggestions": [
    {"originalLine": "Built an API", "suggestedLine": "Built a REST API ...", "reason": "..."}
  ],
  "analysisMode": "ai or rules",
  "createdAt": "UTC datetime"
}
```

Only return resume text to its owner or authorized college staff. Never log resume contents.

#### Optional/SHOULD/COULD collections

- `coding_problems`: `title`, `statement`, `difficulty`, `sampleInput`, `sampleOutput`, `hiddenTests`, `createdAt`. Never return `hiddenTests` to the client.
- `code_submissions`: `userId`, `problemId`, `language`, `code`, `testsPassed`, `testsTotal`, `runtimeMs`, `status`, `submittedAt`.
- `points_events`: `userId`, `reason`, `points`, `createdAt`.
- `study_modules`: `title`, `category`, `companyTrack`, `content`, `order`.
- `module_progress`: `userId`, `moduleId`, `completedAt`.
- `study_plans`: `userId`, `days`, `generatedAt`.
- Do not build these collections before F1–F5 are stable, except `coding_problems` if F6 is explicitly started.

### 5.2 Indexes

Create idempotently at startup or in `seed.py`:

| Collection | Index |
|---|---|
| `users` | Unique ascending `email` |
| `users` | Compound `{ role: 1, batchId: 1 }` |
| `batches` | `{ trainerId: 1, name: 1 }` |
| `tests` | `{ assignedBatchIds: 1, isPublished: 1 }` |
| `tests` | `{ createdBy: 1, createdAt: -1 }` |
| `questions` | `{ testId: 1 }` |
| `test_attempts` | Unique compound `{ userId: 1, testId: 1 }` only if product rule is one attempt per test; otherwise use non-unique `{ userId: 1, testId: 1, submittedAt: -1 }` |
| `test_attempts` | `{ testId: 1, submittedAt: -1 }` |
| `test_attempts` | `{ userId: 1, submittedAt: -1 }` |
| `interview_sessions` | `{ userId: 1, createdAt: -1 }` |
| `resume_reports` | `{ userId: 1, createdAt: -1 }` |
| `code_submissions` | `{ userId: 1, submittedAt: -1 }` |
| `points_events` | `{ userId: 1, createdAt: -1 }` |

**MVP attempt policy:** one submitted attempt per student/test is simplest and avoids retakes complicating readiness. Enforce it in the service and with the unique index. If retakes are required, remove the unique index and explicitly define best/latest-attempt behavior before implementing.

### 5.3 ObjectId handling

- Validate every path ID before querying; invalid ID returns `400 INVALID_ID`.
- Convert valid 24-hex strings to `bson.ObjectId`.
- Convert ObjectIds to strings in response models.
- Do not expose `_id` or internal `passwordHash` fields.

---

## 6. Pydantic v2 schemas

Use `ConfigDict(extra="forbid")` on request models so misspelled or unexpected input is rejected. Keep persistence documents separate from API response models.

### 6.1 Shared schemas

```python
from typing import Any, Generic, TypeVar
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")

class ErrorDetail(BaseModel):
    field: str | None = None
    message: str

class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] = []

class SuccessEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: T

class ErrorEnvelope(BaseModel):
    success: bool = False
    error: ErrorBody

class StrictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

class Page(BaseModel):
    items: list[Any]
    page: int
    pageSize: int
    total: int
```

### 6.2 Auth and User

```python
from typing import Literal
from pydantic import EmailStr, Field

Role = Literal["student", "trainer", "admin"]

class RegisterRequest(StrictRequest):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["student", "trainer"] = "student"

class LoginRequest(StrictRequest):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: Role
    batchId: str | None = None
    readinessScore: int = 0
    streakCount: int = 0
    points: int = 0

class AuthData(BaseModel):
    accessToken: str
    tokenType: Literal["bearer"] = "bearer"
    expiresIn: int
    user: UserPublic

class UpdateProfileRequest(StrictRequest):
    name: str | None = Field(default=None, min_length=2, max_length=80)
```

### 6.3 Batch

```python
class BatchCreateRequest(StrictRequest):
    name: str = Field(min_length=2, max_length=80)
    year: int = Field(ge=2020, le=2100)
    trainerId: str

class BatchPublic(BaseModel):
    id: str
    name: str
    year: int
    trainerId: str
```

### 6.4 Tests and questions

```python
class QuestionCreateRequest(StrictRequest):
    text: str = Field(min_length=5, max_length=1000)
    options: list[str] = Field(min_length=4, max_length=4)
    correctIndex: int = Field(ge=0, le=3)
    topic: str = Field(min_length=1, max_length=80)
    difficulty: Literal["easy", "medium", "hard"] = "medium"

class TestCreateRequest(StrictRequest):
    title: str = Field(min_length=3, max_length=120)
    topic: str = Field(min_length=1, max_length=80)
    durationMinutes: int = Field(ge=1, le=180)

class TestUpdateRequest(StrictRequest):
    title: str | None = Field(default=None, min_length=3, max_length=120)
    topic: str | None = Field(default=None, min_length=1, max_length=80)
    durationMinutes: int | None = Field(default=None, ge=1, le=180)

class AssignTestRequest(StrictRequest):
    batchIds: list[str] = Field(min_length=1)

class QuestionPublic(BaseModel):
    id: str
    text: str
    options: list[str]
    topic: str
    difficulty: Literal["easy", "medium", "hard"]

class TrainerQuestionPublic(QuestionPublic):
    correctIndex: int

class TestPublic(BaseModel):
    id: str
    title: str
    topic: str
    durationMinutes: int
    questionCount: int
    assignedBatchIds: list[str] = []
    isPublished: bool = False
```

The student test-taking response uses `QuestionPublic`, never `TrainerQuestionPublic`.

### 6.5 Test attempts

```python
class AnswerInput(StrictRequest):
    questionId: str
    selectedIndex: int = Field(ge=0, le=3)
    timeSpentSeconds: int = Field(ge=0, le=7200)

class SubmitAttemptRequest(StrictRequest):
    answers: list[AnswerInput]
    tabSwitchCount: int = Field(default=0, ge=0, le=10000)

class TopicAccuracy(BaseModel):
    topic: str
    correct: int
    total: int
    accuracy: float

class AttemptSummary(BaseModel):
    id: str
    testId: str
    score: int
    totalQuestions: int
    accuracy: float
    topicAccuracy: list[TopicAccuracy]
    submittedAt: str
```

The backend calculates `isCorrect`, score, accuracy and topic accuracy. Do not accept those values from the frontend.

### 6.6 Resume analysis

```python
class ResumeAnalyzeTextRequest(StrictRequest):
    jobDescription: str | None = Field(default=None, max_length=20000)

class SectionFeedback(BaseModel):
    section: Literal["Education", "Skills", "Projects", "Experience"]
    score: int = Field(ge=0, le=10)
    feedback: str

class LineSuggestion(BaseModel):
    originalLine: str
    suggestedLine: str
    reason: str

class ResumeAnalysisPublic(BaseModel):
    id: str
    atsScore: int = Field(ge=0, le=100)
    sectionFeedback: list[SectionFeedback]
    missingKeywords: list[str]
    matchedKeywords: list[str]
    lineSuggestions: list[LineSuggestion]
    analysisMode: Literal["ai", "rules"]
    basicModeNote: str | None = None
```

Use multipart upload for the PDF and a form field for optional `jobDescription`, or upload the PDF first and call a second analysis endpoint. For the MVP, one multipart `POST /api/v1/resumes/analyze` is simplest. Limit PDF bytes and validate content type and parseability.

### 6.7 Interview

```python
class InterviewStartRequest(StrictRequest):
    round: Literal["hr", "technical", "behavioral"]
    focusKeywords: list[str] = Field(default_factory=list, max_length=20)
    resumeReportId: str | None = None

class InterviewAnswerRequest(StrictRequest):
    answer: str = Field(min_length=1, max_length=5000)

class InterviewMessage(BaseModel):
    role: Literal["assistant", "user"]
    content: str
    kind: Literal["question", "answer"]
    createdAt: str

class SkillScore(BaseModel):
    skill: Literal["Communication", "Technical Depth", "Problem Solving", "Structure of Answers"]
    score: int = Field(ge=0, le=10)
    maxScore: int = 10

class AnswerComment(BaseModel):
    messageIndex: int
    comment: str

class InterviewReport(BaseModel):
    skillScores: list[SkillScore]
    strengths: list[str]
    weaknesses: list[str]
    answerComments: list[AnswerComment]
    overallScore: float
    summary: str

class InterviewSessionPublic(BaseModel):
    id: str
    round: Literal["hr", "technical", "behavioral"]
    status: Literal["active", "completed"]
    focusKeywords: list[str]
    messages: list[InterviewMessage]
    report: InterviewReport | None = None
    usedFallback: bool
```

### 6.8 Important implementation notes

- Prefer `EmailStr`; add `email-validator` if needed.
- `datetime` fields should be timezone-aware UTC in code and ISO 8601 strings in JSON.
- Avoid mutable defaults in ordinary Python objects; use `Field(default_factory=list)`.
- Do not return `resumeText`, hidden coding tests, password hashes, or `correctIndex` to student clients.
- Use explicit response models on routes to make accidental data leaks less likely.

---

## 7. Query maps and aggregation pipelines

Use simple PyMongo queries first. Use aggregation only where it materially reduces complexity.

### 7.1 Query map

| Use case | Collections / query |
|---|---|
| Login | `users.find_one({"email": normalized_email, "isActive": True})` |
| Current user | `users.find_one({"_id": user_id, "isActive": True})` |
| Student dashboard | User by ID; assigned published Tests where `batchId` in `assignedBatchIds`; recent attempts, interviews and resume reports by `userId` |
| Trainer roster | Find managed batches by `trainerId`, then students whose `batchId` is in those IDs |
| Student assigned tests | `tests.find({"assignedBatchIds": batch_id, "isPublished": True})` |
| Questions for test | `questions.find({"testId": test_id})`; shuffle in service; remove `correctIndex` |
| Duplicate attempt check | `test_attempts.find_one({"userId": user_id, "testId": test_id})` |
| Debrief | Attempt by ID and owner; fetch test question topics and batch attempts for same test |
| Resume history | `resume_reports.find({"userId": user_id}).sort("createdAt", -1)` |
| Interview history | `interview_sessions.find({"userId": user_id}).sort("createdAt", -1)` |
| Batch weak topics | Attempts for tests assigned to the batch; aggregate incorrect answers grouped by question topic |
| CSV export | Managed batch users with readiness score and derived weak topics |

### 7.2 Batch roster aggregation

Use a pipeline when a trainer roster needs one result set:

```python
pipeline = [
    {"$match": {"trainerId": trainer_oid}},
    {"$lookup": {
        "from": "users",
        "localField": "_id",
        "foreignField": "batchId",
        "as": "students"
    }},
    {"$project": {
        "name": 1,
        "year": 1,
        "students.id": {"$toString": "$students._id"},
        "students.name": 1,
        "students.email": 1,
        "students.readinessScore": 1,
        "students.streakCount": 1
    }}
]
```

If projection behavior becomes awkward, fetch batches and users with two straightforward queries instead; correctness matters more than using aggregation.

### 7.3 Batch average for one test

Filter attempts by `testId` and `submittedAt`, and include only students whose batch is assigned to the test. A simple approach:

1. Read the batch's student IDs.
2. Query `test_attempts` for `testId` and `userId: {$in: student_ids}`.
3. Calculate average `accuracy` and average score in Python.
4. Return `batchAverageAccuracy`, `batchAverageScore`, and `participantsCount`.

Do not compare against unrelated batches.

### 7.4 Weak-topic aggregation

Each attempt's answer refers to a question ID. For an MVP, load those questions and count incorrect answers by `topic` in Python. Return topics sorted by descending incorrect count. This is easier to debug than a complex pipeline and is fast enough for a seeded batch of about 12 students.

---

## 8. Launch Readiness Score

Use the PRD formula:

`Readiness = 0.40 × test accuracy + 0.30 × interview score + 0.20 × resume score + 0.10 × consistency`

All component values are normalized to 0–100:

- **Test accuracy:** mean accuracy percentage of the latest five submitted test attempts.
- **Interview score:** mean `overallScore` from the latest three completed interviews, scaled from 0–10 to 0–100.
- **Resume score:** latest `atsScore` (already 0–100).
- **Consistency:** `min(streakCount / 7, 1) × 100` as the MVP interpretation of the streak component.

**Missing-data rule:** include only components that have data and divide by the sum of their weights. Return `areasUsed` and a `basedOn` list so the UI can say “Based on 2 of 4 areas.” If there is no activity in any area, score is `0` and `areasUsed` is `0`.

Example pseudocode:

```python
def weighted_readiness(components):
    # components: list[(weight, value)] where value is 0..100
    available = [(w, v) for w, v in components if v is not None]
    if not available:
        return 0, 0
    weight_total = sum(w for w, _ in available)
    score = round(sum(w * v for w, v in available) / weight_total)
    return max(0, min(100, score)), len(available)
```

Recalculate after a successful test submission, interview completion, resume analysis, and streak update. Keep the calculation in one `readiness_service.py` function so all routes use identical logic. Do not fabricate score jumps; the value is derived from saved data.

If F6 Code Lab is built, the PRD says it takes 15% from test accuracy and interview weights but does not specify the exact revised weights. Do not implement a new weighting silently. Ask the team to agree on revised weights first; otherwise leave code practice outside the score for the hackathon.

---

## 9. Feature module specifications

### 9.1 F1 Role Login & Dashboards — MUST

- Implement register, login, current-user and logout-on-client.
- Enforce role and batch scope in dependencies/services.
- Student dashboard includes score, `areasUsed`, assigned tests, latest activity, and one recommended next action derived from available activity.
- Trainer/Admin dashboard summary is served from `/analytics/overview`.
- Admin accounts come from `seed.py`; public registration cannot create an admin.

### 9.2 F2 Trainer Test Builder — MUST

- Trainer creates a draft test, adds questions individually or via CSV, and assigns it to one or more batches.
- CSV exact column order: `topic,question,optionA,optionB,optionC,optionD,correctOption,difficulty`.
- `correctOption` accepts `A`, `B`, `C`, `D` or `0`–`3`; normalize to integer index.
- Valid difficulty values: `easy`, `medium`, `hard`; default to `medium` only if the field is empty and the team explicitly chooses that behavior.
- Validate each row independently. Return total rows, accepted count, rejected count, and row-specific errors. Do not fail the entire upload because one row is invalid.
- Set `isPublished=true` only when at least one valid question exists and the trainer publishes/assigns the test.
- A trainer may manage only their own tests and batches they manage; admins may manage all.

### 9.3 F3 Test Arena & Debrief — MUST

- Student requests an assigned, published test; server shuffles question order and options (if options are shuffled, remap `correctIndex` server-side and return stable option IDs or remapped index).
- Simpler recommended MVP: shuffle question order only; preserve option order to avoid answer-index mapping errors.
- Never send correct answers before submission.
- Server stores `startedAt` when an attempt begins, then accepts one submission. Enforce duration on the server as well as the client timer.
- Score only questions belonging to that test; ignore/reject duplicate, unknown or cross-test question IDs.
- Missing answers count as incorrect; do not let the client submit a score.
- Debrief includes score, accuracy, topic accuracy, time per question, weak topics, batch average and participant count.
- Save `tabSwitchCount` only as a client-reported signal; do not describe it as secure proctoring.

### 9.4 F4 AI Mock Interviewer — MUST

- Round values: `hr`, `technical`, `behavioral`.
- Start session with a seeded first question or provider response.
- After each answer, send the round, focus keywords and recent/full conversation to the AI adapter; request exactly one next question/follow-up in a small structured response.
- Stop after 4–5 questions (follow-ups count toward the total) or allow the student to end early; the final report must still return four required skill scores, at least two strengths and weaknesses when enough answers exist, and comments for every answer.
- Use seeded fallback bank of about eight questions per round. Rule fallback: answer under 25 words -> ask for a specific example; detect named keyword -> ask about that keyword; otherwise use the next bank question.
- On provider timeout/error/invalid JSON, set `usedFallback=true` and continue. The interview should still complete.
- Persist messages after every turn so a refresh does not erase the session.
- A completed session cannot accept more answers.

### 9.5 F5 Resume Analyzer — MUST

- Accept text-based PDF only; enforce byte limit; extract text with `pypdf`.
- Reject empty/unparseable text with a friendly `400 RESUME_TEXT_NOT_FOUND`; do not attempt OCR.
- Rules layer always computes a usable score from section presence, length, numeric impact statements and keyword overlap.
- When a job description exists, tokenize it and the resume text, compare normalized terms, and return matched/missing keywords. Do not claim semantic matching; it is an MVP keyword comparison.
- AI layer may produce feedback and rewrites but must be constrained to quote actual lines found in the extracted resume. Validate output; discard fabricated `originalLine` values that are not present in the resume.
- If AI fails, return the rules result with `analysisMode="rules"` and `basicModeNote`.
- Save a `ResumeReport`, recalculate readiness, and return the report ID.
- Do not persist the raw uploaded PDF by default; persist extracted text only because the PRD's entity calls for it. Do not log text.

### 9.6 F6 Code Lab — SHOULD, only after MUST

- Use a hosted code execution provider only. Never use `subprocess`, `exec`, or a local shell to run user code.
- Keep provider API keys on the backend; add strict code, input, and timeout limits.
- Hidden tests are stored server-side and never returned to clients.
- If provider is unavailable, return a friendly unavailable message and a pre-recorded demo result for a seeded problem, clearly marked as a demo fallback.
- If no reliable provider is selected early, cut F6 or keep a non-executing editor-only UI.

### 9.7 F7/F8 SHOULD; F9/F10/F11 COULD

Implement only after F1–F5 pass the complete demo. Use separate optional collections from Section 5.1. Do not let optional features delay authentication, test scoring, resume fallback, or interview fallback.

---

## 10. Seed data and `seed.py`

### 10.1 Required demo fixtures

The seed script should be safe to run repeatedly and should support a deterministic reset.

- Demo users:
  - Student: Aarav Sharma, role `student`.
  - Trainer: Ms. Priya Nair, role `trainer`.
  - Admin: Dr. Rohan Kulkarni, role `admin`.
- One batch: `CSE-A 2027`, assigned to the seeded trainer.
- About 12 student records in the batch with varied readiness scores and realistic but fictional names.
- Three published tests, with enough questions to demonstrate a timed test and topic breakdown. Target about 60 MCQs total if time permits.
- About eight fallback interview questions per round (HR, Technical, Behavioral).
- A sample resume text fixture and sample job description for demo/testing. The frontend can upload a sample PDF; if one is generated, ensure it is a valid text-based PDF.
- Optional: five coding problems and six study modules only if F6/F9 are started.

### 10.2 Seed account credentials

Choose clear demo-only passwords, hash them using the same production hashing helper, and document them in a local-only `DEMO_CREDENTIALS.md` or the team handoff. Never commit real credentials or use these passwords for real users. If credentials must be stored in the repository for a hackathon demo, explicitly label them as disposable demo credentials and change/remove them after the event.

### 10.3 `seed.py` behavior

1. Load configuration and connect with the shared DB helper.
2. Create required indexes idempotently.
3. Delete only known Apogee demo fixture documents (tag them with `seedKey` or use known fixture emails/IDs); do not indiscriminately drop collections in a shared database.
4. Insert batches, users, tests and questions with stable relationships.
5. Insert deterministic fallback question bank if stored in MongoDB; a Python constant is also acceptable.
6. Print counts and demo account emails (never print password hashes or secrets).
7. Exit non-zero on failure.
8. Support a `--reset-demo` flag if the team wants explicit reset semantics; default should be upsert/reseed rather than destructive reset.

### 10.4 Seed implementation contract

```python
def seed_database(db) -> None:
    create_indexes(db)
    seed_batches(db)
    seed_users(db)
    seed_tests_and_questions(db)
    seed_optional_content(db)  # no-op unless optional features are enabled
```

The actual implementation should reuse the app's config and database connection code. Do not create a second independent MongoDB connection implementation in `seed.py`.

---

## 11. AI provider adapter and fallback behavior

Provider is deliberately **not selected in the PRD**. Keep provider-specific code behind `services/ai_provider.py`; do not assume a provider or SDK until the team chooses one.

Suggested interface:

```python
class AIProvider:
    def generate_interview_question(self, *, round, messages, focus_keywords) -> str: ...
    def generate_interview_report(self, *, round, messages) -> dict: ...
    def analyze_resume(self, *, resume_text, job_description) -> dict: ...
```

Implementation rules:

- If `AI_PROVIDER=none` or key is missing, go straight to fallback.
- Set timeout around 15 seconds; catch network errors, timeouts, rate limits, and malformed structured output.
- Validate AI output with Pydantic; never trust it as arbitrary HTML or executable content.
- Keep prompts concise and send only the minimum required user content.
- Avoid logging full resumes or interview answers.
- Return `usedFallback` for interview operations and `analysisMode="rules"` for resume operations.
- Do not return provider internals, API keys, or raw exception text to the frontend.

---

## 12. Security, privacy and reliability

- Use HTTPS in deployment; keep secrets in Render environment variables.
- Hash passwords; enforce JWT expiry; load current user for each protected request.
- Enforce ownership and role checks in the backend for every resource ID.
- Use Pydantic validation, maximum lengths, upload limits, and strict CSV row validation.
- Validate uploaded file content, not only its filename or browser-supplied MIME type.
- Escape/render user content as text; do not trust AI output as HTML.
- Do not log passwords, tokens, resume text, or full interview transcripts.
- Do not return hidden answer keys or hidden coding tests.
- Add basic rate limits to login and AI endpoints if time and infrastructure permit; if not implemented, document this limitation.
- Configure CORS for known frontend origins only. CORS is not authentication.
- Set MongoDB Atlas network access to the smallest practical allowlist compatible with Render. Avoid leaving unrestricted access longer than necessary.
- Use `serverSelectionTimeoutMS` and a bounded external AI timeout so requests do not hang indefinitely.
- Add request IDs to server logs if time permits.
- Use generic authentication error text such as “Invalid email or password.”
- Ensure trainer data is scoped to managed batches. Admin is college-wide.
- The PRD states resumes and answers are visible to the student and college staff; only implement staff access needed by the demo and enforce it server-side.
- Do not claim real-time updates unless polling or another refresh mechanism is implemented. For the demo, trainer dashboard can refetch on navigation/refresh or poll at a modest interval.

---

## 13. Error handling

Create a small `AppError(status_code, code, message, details=None)` helper and a global handler. Map errors consistently.

| Code | Status | Meaning |
|---|---:|---|
| `VALIDATION_ERROR` | 422 | Invalid request fields |
| `INVALID_CREDENTIALS` | 401 | Login failed |
| `UNAUTHENTICATED` | 401 | Token missing/invalid/expired |
| `FORBIDDEN` | 403 | Role or resource scope denied |
| `NOT_FOUND` | 404 | Resource does not exist or is hidden |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `INVALID_ID` | 400 | Malformed ObjectId |
| `INVALID_STATE` | 409 | Already submitted/completed or invalid transition |
| `CSV_INVALID` | 400 | CSV file cannot be parsed |
| `CSV_ROWS_REJECTED` | 200 | Partial success; details included in success data |
| `FILE_TOO_LARGE` | 413 | Upload exceeds limit |
| `RESUME_TEXT_NOT_FOUND` | 400 | PDF has no extractable text |
| `AI_FALLBACK_USED` | 200 | Not an error envelope; result is valid but uses fallback |
| `EXTERNAL_SERVICE_UNAVAILABLE` | 503 | Required external service unavailable with no valid fallback |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

A partial CSV import is a successful request if the server can report accepted and rejected rows. Use a success envelope with `acceptedCount`, `rejectedCount`, and `rowErrors`; do not return an error status that causes the frontend to discard valid rows.

---

## 14. Phased backend build plan

Build groups must match the PRD and frontend groups. Estimate is for a small team using AI coding agents, not a guarantee.

### B0 — Stabilize skeleton (30–45 minutes)

- Confirm Render `/health` succeeds and DB connection settings work.
- Preserve response envelope and CORS configuration.
- Add settings validation, shared error handler and ObjectId serialization helpers.
- Add indexes and basic tests.

**Exit check:** app boots locally and on Render; `/health` works; no secrets are committed.

### B1 — Foundation / Group 1 (2–3 hours)

- Register/login/current-user and role guards.
- User and batch queries; admin-seeded account.
- Test creation, question creation, CSV import, assignment, publication.
- Student dashboard basics; trainer roster and CSV export shell.

**Exit check:** all three roles can log in; trainer creates and assigns a test; only assigned batch students see it.

### B2 — Tests / Group 2 (2–3 hours)

- Start test attempt; deliver shuffled questions without answer keys.
- Submit once; calculate score/topic accuracy/time; store attempt.
- Batch average and weak-topic analysis.
- Recalculate Launch Readiness Score.

**Exit check:** a student can take and submit a test; Debrief is derived from saved records; score changes based on the formula.

### B3 — AI / Group 3 (3–4 hours)

- PDF text extraction and rules-based resume analyzer first.
- Optional AI feedback adapter after rules path works.
- Interview session, message persistence, fallback question bank, report fallback.
- Recalculate readiness after resume and interview completion.

**Exit check:** resume analysis works with AI disabled; interview completes with AI disabled; all report fields exist.

### B4 — Hardening / demo (1–2 hours)

- Seed deterministic demo data; verify authorization; test on laptop and phone.
- Run API smoke tests, fix CORS and deployment configuration.
- Warm Render service before demo; prepare backup recording/screenshots.

**Exit check:** 90-second wow moment works end to end and trainer view shows persisted updated readiness.

### B5 — Optional extras (only if B0–B4 pass)

F6 Code Lab first if a reliable hosted runner is configured; then F7/F8. F9/F10/F11 only if there is still time. Do not start extras while a MUST feature is broken.

---

## 15. Deployment, tests and definition of done

### 15.1 Render deployment

- Root directory should match the existing backend deployment configuration.
- Start command typically: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Set `MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET_KEY`, `CORS_ORIGINS`, and chosen AI variables in Render.
- Use `python-dotenv` locally only; Render environment variables take precedence.
- Do not make `/health` depend on a live AI provider. It may check basic process health; if it checks MongoDB, clearly distinguish database status.
- Test deployment after each major group because Render deploys from `main`.

### 15.2 Minimum automated tests

- Health route and shared response envelope.
- Registration normalizes email; duplicate email returns `409`.
- Login returns token; wrong password returns generic `401`.
- Student cannot create a test or read another student's private resume report.
- Trainer cannot assign a test to a batch they do not manage.
- Student cannot see correct answer indices before submit.
- Attempt scoring is calculated server-side; unknown question IDs are rejected.
- Re-submitting an attempt is blocked.
- CSV import returns accepted/rejected row counts and row errors.
- Resume rules fallback works with AI disabled and handles unparseable PDF.
- Interview fallback asks questions and produces a complete report.
- Readiness formula renormalizes weights when components are missing.
- Seed script is repeatable.

### 15.3 Manual end-to-end checklist

- [ ] Register/login as student, trainer and admin.
- [ ] Student sees only their assigned tests.
- [ ] Trainer creates a test, imports CSV and assigns a batch.
- [ ] Student completes a timed test; timer auto-submits in UI and backend rejects late submissions.
- [ ] Debrief shows score, topic accuracy, per-question time and batch comparison.
- [ ] Resume PDF + job description returns score, four section feedback items, matched/missing keywords and a real-line rewrite.
- [ ] Turn off AI configuration; resume and interview still complete through fallback.
- [ ] Interview follow-up reacts to the student's answer; report includes four skill scores and comments.
- [ ] Readiness score recalculates after test, resume and interview.
- [ ] Trainer's Command Center shows the student's saved updated score and batch weak topics after refresh/poll.
- [ ] Verify role restrictions, CORS, and mobile layout.
- [ ] Render deployment and seed script are ready before the demo.

### 15.4 Definition of Done for MUST features

F1–F5 are done only when their PRD acceptance criteria work against real persisted data, role/batch authorization is enforced server-side, errors use the agreed envelope, and the fallback paths are tested. A static mock response alone does not satisfy the backend contract. Demo-only fixtures are allowed when explicitly seeded and labelled.

---

## 16. Decisions that must be agreed, not guessed

1. Select the hosted AI provider and model; until then `AI_PROVIDER=none` and fallback paths are the default.
2. Confirm whether a student gets one attempt per test or may retake. MVP recommendation: one attempt.
3. Confirm whether trainers can self-register. PRD says students and trainers can self-register for the demo; admin cannot.
4. If F6 is built, choose the hosted code runner and agree revised readiness weights before including code practice in the score.
5. Decide whether trainers can view detailed interview/resume reports or only aggregate readiness. Apply the same rule in API permissions and frontend UI.
6. Confirm whether the test timer's server-side limit uses strict elapsed time from `/start` or allows a small network grace window.
7. Agree exact demo credentials with the team; never rely on credentials copied into source code for a real deployment.

Until a decision is made, use the conservative defaults stated in this document and record the choice in the API contract changelog.
