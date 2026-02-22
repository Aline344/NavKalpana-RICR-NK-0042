# 📡 ACIE - API Documentation

> **Base URL:** `http://localhost:5000/api`
> **Authentication:** JWT Bearer Token (sent in `Authorization: Bearer <token>` header)

---

## 🔐 Authentication APIs (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ No | Register a new user |
| `POST` | `/auth/login` | ❌ No | Login and get JWT token |
| `GET` | `/auth/profile` | ✅ Yes | Get current user profile |
| `PUT` | `/auth/profile` | ✅ Yes | Update user profile |

### POST `/auth/register`
```json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm": "password123"
}


{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "jwt_token_here"
}
```

### POST `/auth/login`
```json

{
  "email": "john@example.com",
  "password": "password123"
}


{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "jwt_token_here"
}
```

---

## 🧠 AI Quiz APIs (`/api/quiz`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/quiz/generate` | ✅ Yes | AI-generated adaptive quiz |
| `POST` | `/quiz/submit` | ✅ Yes | Submit quiz answers for evaluation |
| `GET` | `/quiz/results` | ✅ Yes | Get all quiz results history |
| `GET` | `/quiz/:id` | ✅ Yes | Get specific quiz by ID |

### POST `/quiz/generate`
```json
// Request Body
{
  "topic": "JavaScript",
  "difficulty": "medium",
  "questionCount": 10
}


```

### POST `/quiz/submit`
```json
// Request Body
{
  "quizId": "quiz_object_id",
  "answers": [
    { "questionIndex": 0, "answer": "Option A" },
    { "questionIndex": 1, "answer": "Closure is..." }
  ],
  "timeTaken": 300,
  "tabSwitchCount": 2
}


```

---

## 📝 AI Assignment APIs (`/api/assignments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/assignments/generate` | ✅ Yes | AI-generated practical assignment |
| `POST` | `/assignments/submit` | ✅ Yes | Submit assignment for AI evaluation |
| `GET` | `/assignments/` | ✅ Yes | Get all assignments |
| `GET` | `/assignments/:id` | ✅ Yes | Get specific assignment |

### POST `/assignments/generate`
```json
// Request Body
{
  "topic": "React.js",
  "difficulty": "hard"
}

```

### POST `/assignments/submit`
```json
// Request Body
{
  "assignmentId": "assignment_id",
  "submissionType": "code",  
  "content": "function solve() { ... }"
}


```

---

## 📄 Resume Intelligence APIs (`/api/resume`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/resume/analyze` | ✅ Yes | Upload & analyze resume with AI |
| `GET` | `/resume/analysis` | ✅ Yes | Get stored resume analysis |

### POST `/resume/analyze`
```
Content-Type: multipart/form-data

Field: resumeFile (PDF file)

// Response: AI analysis with:
// - Skill Extraction
// - Project Detection
// - Keyword-Role Mapping
// - Experience Indicators
// - Resume Strength Score (0-100%)
// Formula: (Skill Relevance × 0.40) + (Project Depth × 0.30) + (Experience × 0.20) + (Structure × 0.10)
```

---

## 📊 Dashboard APIs (`/api/dashboard`)

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `GET` | `/dashboard/stats` | ✅ Yes | ❌ | Get student dashboard stats |
| `GET` | `/dashboard/admin/users` | ✅ Yes | ✅ | Get all users + platform stats |
| `GET` | `/dashboard/admin/users/:id` | ✅ Yes | ✅ | Get detailed user activity |
| `PUT` | `/dashboard/admin/users/:id` | ✅ Yes | ✅ | Update user role |
| `DELETE` | `/dashboard/admin/users/:id` | ✅ Yes | ✅ | Delete a user |

### GET `/dashboard/stats`
```json

{
  "topicMastery": [...],
  "studyPlan": [...],
  "recentActivity": [...],
  "resumeStrength": 75,
  "targetRole": "Full Stack Developer"
}
```

### GET `/dashboard/admin/users/:id`
```json

  "user": { "name", "email", "targetRole", "resumeStrength" },
  "topicMastery": [{ "topic", "score", "quizAvg", "assignmentAvg", "riskLevel" }],
  "studyPlan": [{ "topic", "priority", "completed" }],
  "recentActivity": [{ "type", "title", "score", "date" }]
}
```

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "message": "Error description here"
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request — Missing or invalid fields |
| `401` | Unauthorized — Missing or invalid token |
| `403` | Forbidden — Admin access required |
| `404` | Not Found — Resource doesn't exist |
| `500` | Server Error — Internal failure |
