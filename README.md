# NavKalpana Team Project

Team Code: NK-0042  
Team Leader: Shashank Suman  


Team member 1:Aditya kumar Gupta
2. Ajeet kumar yadav
3. Shivam saket

This repository contains NavKalpana project files.
# 🧠 AI Career Intelligence Engine (ACIE)

### AI-Powered Preparation-to-Placement Platform


---

## 📋 Table of Contents

- [Product Overview](#-product-overview)
- [Team Members](#-team-members--roles)
- [Problem Statement](#-problem-statement)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Installation Steps](#-installation-steps)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)

---

## 🎯 Product Overview

The **AI Career Intelligence Engine (ACIE)** is an intelligent career preparation ecosystem that connects:

```
Learning → Skill Development → Interview Performance → Career Readiness
```

It continuously adapts preparation strategies based on measurable performance signals, creating a personalized learning journey for every student.

### Product Vision

- ✅ Identifies academic weaknesses automatically
- ✅ Generates personalized study plans via AI
- ✅ Simulates real interview assessments
- ✅ Quantifies career readiness with measurable scores
- ✅ Optimizes preparation dynamically based on performance

---

## 👥 Team Members & Roles

| # | Name | Role | Responsibilities |
|---|------|------|-----------------|
| 1 | **Aditya Kumar Gupta** | Full-Stack Lead | Backend APIs, Database, Authentication, Deployment |
| 2 | **Ajeet Kumar Yadav** | Frontend Developer | React UI, Components, Styling, Animations |
| 3 | **Shivam Saket** | AI/Logic Developer | AI Integration (Gemini), Quiz Engine, Resume Analysis, Controllers |
| 4 | **Shashank Suman** | Docs & Testing | Documentation, PPT, Screenshots, API Docs, Testing |

---

## 📌 Problem Statement

Students preparing for placements face:

1. **No personalized learning path** — Generic study materials don't adapt to individual weaknesses
2. **No real-time skill assessment** — Traditional tests don't measure true understanding
3. **Weak resume optimization** — Students don't know what recruiters look for
4. **No measurable readiness score** — No way to track placement readiness over time
5. **Disconnected preparation tools** — Separate platforms for learning, testing, and resume building

**ACIE solves all of these** by combining adaptive AI-driven learning, intelligent assessments, and resume intelligence into one seamless platform.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Framer Motion** | Animations & Transitions |
| **Tailwind CSS** | Utility-first Styling |
| **Axios** | HTTP frontend |
| **Lucide React** | Icon Library |
| **React Router DOM** | frontend-side Routing |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | NoSQL Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Multer** | File Upload (Resume) |
| **bcryptjs** | Password Hashing |

### AI / ML
| Technology | Purpose |
|------------|---------|
| **Google Gemini AI** | Quiz/Assignment Generation, Resume Analysis |
| **@google/genai SDK** | AI Service Integration |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ACIE Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   React UI   │───▶│  Express API │───▶│   MongoDB    │   │
│  │  (Frontend)  │◀───│  (Backend)   │◀───│  (Database)  │   │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘   │
│         │                   │                                │
│         │                   ▼                                │
│         │            ┌──────────────┐                        │
│         │            │  Gemini AI   │                        │
│         │            │  (Google AI) │                        │
│         │            └──────────────┘                        │
│         │                   │                                │
│         ▼                   ▼                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              AI-Powered Modules                      │    │
│  ├─────────────┬──────────────┬─────────────┬──────────┤    │
│  │ Adaptive    │ AI Quiz      │ AI Assignment│ Resume   │    │
│  │ Learning    │ Generation   │ Evaluation   │ Analysis │    │
│  │ Engine      │ & Evaluation │ Engine       │ Engine   │    │
│  └─────────────┴──────────────┴─────────────┴──────────┘    │
│                        │                                     │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │     Mastery Score  ═══▶  Study Plan  ═══▶  Readiness│    │
│  │     Calculation         Generation        Score     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. 📊 Adaptive Learning Dashboard
- Real-time Topic Mastery Heatmap
- Personalized Study Plan (AI-generated)
- Risk Level Detection (Low/Medium/High)
- Performance Analytics & Activity Feed

### 2. 🧠 AI Quiz Generation & Evaluation
- **5 Question Types:** MCQ (Single/Multi), Short Answer, Scenario-Based, Code Output
- Adaptive difficulty scaling based on past performance
- Anti-cheat detection (tab switch tracking)
- Instant AI evaluation with detailed feedback
- **Mastery Formula:** `(Quiz × 0.50) + (Assignment × 0.30) + (Consistency × 0.20)`

### 3. 📝 AI Assignment Generation & Evaluation
- **6 Assignment Types:** Code Challenge, Debugging, System Design, API Integration, UI Build, Algorithm
- **4 Submission Options:** Code Editor, File Upload, Text, GitHub Link
- AI evaluation on: Logic, Concepts, Code Quality, Completeness, Efficiency

### 4. 📄 Resume Intelligence Module
- AI-powered resume parsing (PDF upload)
- Skill extraction & project detection
- Keyword-to-role mapping
- **ATS Strength Score:** `(Skill Relevance × 0.40) + (Project Depth × 0.30) + (Experience × 0.20) + (Structure × 0.10)`

### 5. 🛡️ Admin Dashboard
- User management (view, edit roles, delete)
- Platform-wide statistics
- "A to Z" user activity viewer (Mastery, Quizzes, Assignments, Study Plan)

---

## 🚀 Installation Steps

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally or MongoDB Atlas connection string
- **Google Gemini API Key** → [Get from Google AI Studio](https://aistudio.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/NavKalpana-RICR-NK-XXXX.git
cd NavKalpana-RICR-NK-XXXX
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/acie_db
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## 📡 API Endpoints

> Full API documentation with request/response examples available in [`docs/api-documentation.md`](docs/api-documentation.md)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/profile` | Get profile |
| `PUT` | `/api/auth/profile` | Update profile |

### AI Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz/generate` | Generate AI quiz |
| `POST` | `/api/quiz/submit` | Submit & evaluate quiz |
| `GET` | `/api/quiz/results` | Get quiz history |
| `GET` | `/api/quiz/:id` | Get specific quiz |

### AI Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments/generate` | Generate AI assignment |
| `POST` | `/api/assignments/submit` | Submit assignment |
| `GET` | `/api/assignments/` | Get all assignments |
| `GET` | `/api/assignments/:id` | Get specific assignment |

### Resume Intelligence
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/analyze` | Upload & analyze resume |
| `GET` | `/api/resume/analysis` | Get analysis results |

### Dashboard & Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Student dashboard stats |
| `GET` | `/api/dashboard/admin/users` | All users (Admin) |
| `GET` | `/api/dashboard/admin/users/:id` | User details (Admin) |
| `PUT` | `/api/dashboard/admin/users/:id` | Update user (Admin) |
| `DELETE` | `/api/dashboard/admin/users/:id` | Delete user (Admin) |

---

## 📸 Screenshots

> _Add screenshots of your working application here_

| Page | Description |
|------|-------------|
| Home Page | Landing page with platform overview |
| Dashboard | Student dashboard with mastery heatmap |
| AI Quiz | Adaptive quiz interface with timer |
| Assignments | AI assignment generation & submission |
| Resume Analysis | Resume upload and ATS score display |
| Admin Panel | User management & activity viewer |

---

## 🔮 Future Improvements

1. **AI Mock Interview Module** — Real-time interview simulation with AI-driven behavioral and technical feedback.
2. **Readiness Scoring** — Advanced scoring system to quantify student preparedness for specific corporate roles.
3. **Placement Optimization** — Algorithmic matching of students to ideal job opportunities based on mastery profiles.
4. **Peer-to-Peer Learning** — Collaborative study rooms and discussion forums
5. **Job Board Integration** — Direct job matching based on skill mastery
6. **Mobile App** — React Native app for on-the-go learning
7. **Advanced Analytics** — ML-based placement prediction and career path recommendation
8. **Multi-language Support** — Hindi and regional language quiz generation
9. **Certificate Generation** — Issue skill certificates upon mastery completion
10. **Real-time Notifications** — Push notifications for study reminders and deadlines

---

## 📜 License

This project is developed as part of the **NavKalpana Hackathon**.

---

> Built with ❤️ by Team ACIE 
