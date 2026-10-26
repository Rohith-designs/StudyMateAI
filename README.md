# StudyMateAI — Verified AI Engineering Study Hub

> **"Your Verified AI Engineering Study Hub"**  
> *Initial Institutional Testbed:* **Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT)**, Department of Computer Science & Engineering and Information Technology (PVP20 Autonomous Regulation).

---

## 1. Product Overview

Engineering students frequently face scattered study materials across messaging apps, inconsistent notes, and generic AI chat tools that hallucinate programming syntax or syllabus boundaries. 

**StudyMateAI** provides an all-in-one educational platform where:
- **Students** can browse official department lecture notes, syllabus blueprints, and previous question papers, practice exam-style multiple-choice quizzes, and interact with a **Retrieval-Augmented Generation (RAG) study assistant** grounded strictly in verified course materials.
- **Faculty and Admins** can upload semester PDFs with course metadata (Regulation, Academic Year, Department, Course Code, Unit Number, Category), which are automatically parsed, chunked, and indexed into the RAG vector search engine.
- **Academic Grounding & Transparency**: The AI tutor displays precise source citations (document name, unit, and page numbers) and **explicitly admits when supporting materials cannot be found** rather than fabricating citations or facts.

---

## 2. Technology Stack

- **Frontend**: React 18 (JavaScript, no TypeScript), Vite, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express, `multer` (multipart upload & size validation), `pdf-parse` (safe text extraction).
- **RAG & Vector Retrieval Engine**: Sliding-window semantic text chunking (~350–400 words with overlap), TF-IDF and cosine similarity vector retrieval with term weighting and course/unit boosts.
- **LLM Gateway**: Dual-mode engine supporting **Google Gemini API** (`GEMINI_API_KEY`) and **OpenAI API** (`OPENAI_API_KEY`), backed by a **Transparent Demo Mode** with pre-indexed verified PVPSIT curriculum notes when no API keys are supplied.
- **Data Persistence**: Dual-engine storage with full **PostgreSQL schema** (`schema.sql`) and an automatic disk-persisted fallback (`server/data/store.json`) for zero-barrier local operation.

---

## 3. Project Architecture & Directory Layout

```
StudyMate AI/
├── client/                     # Vite + React (JavaScript) + Tailwind CSS
│   ├── public/                 # Static branding assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Sidebar.jsx     # Desktop sidebar & mobile navigation drawer
│   │   │   ├── Navbar.jsx      # Global search, profile, mode pill
│   │   │   ├── ModeModal.jsx   # Transparency & setup guide
│   │   │   ├── SourceModal.jsx # Citation inspection modal
│   │   │   └── PdfViewerModal.jsx # Inline PDF preview & download
│   │   ├── pages/              # Primary application views
│   │   │   ├── Dashboard.jsx   # Student overview, subject cards, recent materials
│   │   │   ├── StudyMaterials.jsx # Subject & unit browser, keyword search, filters
│   │   │   ├── FacultyUpload.jsx  # PDF upload, chunk extraction, doc management
│   │   │   ├── AITutor.jsx     # RAG chat, citation tags, prompt chips
│   │   │   └── QuizHub.jsx     # Exam quizzes, instant scoring, explanations
│   │   ├── services/
│   │   │   └── api.js          # Unified REST API client wrapper
│   │   ├── App.jsx             # Main router & global state
│   │   ├── index.css           # Tailwind directives & custom scrollbars
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express API & RAG Engine
│   ├── data/                   # Seed data & local store fallback
│   ├── uploads/                # Stored course PDFs & sample documents
│   ├── src/
│   │   ├── controllers/        # materialsController, ragController, quizController
│   │   ├── services/           # pdfService, ragService (chunking, vector search, LLM)
│   │   ├── routes/             # materialsRoutes, ragRoutes, quizRoutes, subjectRoutes
│   │   ├── db/                 # storage.js, seedData.js, generateSamplePdfs.js
│   │   └── server.js           # Express app bootstrap & middleware
│   ├── schema.sql              # Production PostgreSQL DDL schema
│   ├── .env.example            # Environment template
│   ├── test-api.js             # Automated API test suite
│   └── package.json
├── package.json                # Root convenience scripts
└── README.md                   # Documentation
```

---

## 4. Quickstart & Installation

### Prerequisites
- Node.js **v18+** (tested and verified on Node **v22.12.0**)
- npm **v9+**

### Step 1: Install Dependencies

Open a terminal in the root project folder:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

The backend includes a pre-configured `.env` file. You can customize settings in `server/.env`:

```env
PORT=5000
NODE_ENV=development

# Optional PostgreSQL connection (falls back to local JSON store if omitted)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studymate_db

# Optional LLM Key for Live AI Mode (leave blank to run in Transparent Demo Mode):
GEMINI_API_KEY=
# or
OPENAI_API_KEY=
```

### Step 3: Start the Backend Server

```bash
cd server
npm start
```
*The server will start on `http://localhost:5000`.*  
Upon first startup, it automatically generates 6 authentic sample PDF notes in `server/uploads/` and seeds verified course materials for **DSA, DBMS, COA, and OS**.

### Step 4: Start the Frontend Client

In a second terminal window:

```bash
cd client
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 5. Live AI Mode vs. Transparent Demo Mode

StudyMateAI strictly enforces the rule: **Never pretend a mock response is a real AI response**.

| Feature | Transparent Demo Mode (Default) | Live AI Mode (Configured) |
| :--- | :--- | :--- |
| **Trigger** | `GEMINI_API_KEY` and `OPENAI_API_KEY` are empty | Valid API key supplied in `server/.env` |
| **UI Badge** | Amber badge: `Demo Mode Active` | Emerald badge: `Live RAG Active` |
| **Notice** | Clearly labeled banner indicating responses are synthesized from verified PVPSIT syllabus notes | Transparent indication of the active LLM provider (e.g. Google Gemini 1.5 Flash) |
| **Retrieval** | Full TF-IDF cosine vector matching against indexed document chunks | Full TF-IDF cosine vector matching against indexed document chunks |
| **Citations** | Real document title, regulation, unit, and page references | Real document title, regulation, unit, and page references |
| **Out-of-Scope** | Explicitly admits when material is not found in course notes | Explicitly admits when material is not found in course notes |

To switch from Demo Mode to Live AI Mode:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/) or OpenAI.
2. In `server/.env`, set `GEMINI_API_KEY=your_key_here`.
3. Restart the backend server (`npm start`). The status badge will automatically turn green.

---

## 6. Core Features & User Journeys

### 🎓 1. Student Dashboard
- **PVPSIT Academic Semester Banner**: Contextualized for II B.Tech CSE & IT students under PVP20 autonomous regulation.
- **Core Subject Cards**:
  1. *Data Structures & Algorithms* (`20CS3301`)
  2. *Database Management Systems* (`20CS3402`)
  3. *Computer Organization & Architecture* (`20CS3303`)
  4. *Operating Systems* (`20CS3404`)
- **Recent Study Materials**: Direct view and download links for recent PDF notes.
- **Practice Quiz Shortcuts**: Instant access to MCQ quizzes with question counts and target passing scores.
- **Suggested AI Inquiries**: 1-click prompt pills to test AVL rotations, ACID properties, CPU addressing modes, and demand paging.

### 📚 2. Study Materials Hub
- **Unit-wise & Subject Filtering**: Filter materials across Units 1 through 5.
- **Category Filter**: Lecture Notes, Syllabus Blueprint, Previous Question Papers, Lab Manuals, Question Banks.
- **Real-Time Keyword Search**: Instant search by topic, filename, or syllabus keywords.
- **PDF Viewer & Downloader**: In-browser preview modal with metadata and authentic PDF downloads.

### 📤 3. Faculty & Admin Upload Portal
- **Multipart PDF Upload**: Accepts PDF files up to 15MB with client-side and server-side validation.
- **Structured Academic Metadata**: Document Title, Department (CSE/IT/ECE/AI&DS), Subject Code, Regulation (PVP20/PVP19), Academic Year, Unit (1–5 or General), and Category.
- **Automatic Text Extraction & Chunking**: `pdf-parse` extracts raw text, which is parsed into overlapping semantic chunks and indexed into the vector store.
- **Real-time Progress & Feedback**: Upload progress bar and chunk count confirmation.
- **Document Repository Management**: Searchable document table with preview and delete actions.

### 🤖 4. AI Study Assistant (Core RAG Feature)
- **Scoring & Context Filtering**: Select specific subjects or units to constrain RAG retrieval.
- **Citation Inspection**: Clicking any citation chip opens the **Source Modal**, displaying the exact excerpt, document name, unit, and page number.
- **Strict Grounding**: Employs rigorous academic instructions preventing hallucination of code or syntax.
- **Honest Admission**: Out-of-scope questions (e.g. quantum physics or rocket propulsion) receive a transparent message stating that no supporting material was found in the uploaded course notes.

### 📝 5. Practice Quizzes
- **Multiple-Choice Questions**: 5-question assessments per subject and unit.
- **Interactive Exam Mode**: Single question navigation, option selection, and assessment submission.
- **Comprehensive Score Card**: Score, percentage, and performance classification.
- **Syllabus-Grounded Review**: Detailed explanation for every question explaining why the correct answer is right and citing the exact syllabus unit.

---

## 7. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | System health check, storage engine, AI mode, document counts |
| `GET` | `/api/subjects` | List of PVPSIT subjects, course codes, and unit blueprints |
| `GET` | `/api/materials` | List materials with query filters (`subjectCode`, `unitNumber`, `category`, `search`) |
| `GET` | `/api/materials/:id` | Fetch document metadata and chunk statistics |
| `POST` | `/api/materials/upload` | Multipart PDF upload with automatic text parsing and chunk indexing |
| `DELETE` | `/api/materials/:id` | Delete document and cascade-remove associated chunks |
| `GET` | `/api/materials/:id/download` | Download authentic PDF file |
| `POST` | `/api/rag/chat` | RAG Q&A query with vector retrieval, citations, and grounded answer |
| `GET` | `/api/rag/status` | RAG retrieval status and provider details |
| `GET` | `/api/quizzes` | List practice quizzes filtered by subject and unit |
| `GET` | `/api/quizzes/:id` | Get quiz questions for test taking |
| `POST` | `/api/quizzes/:id/submit` | Submit answers, calculate score, and receive grounded explanations |

---

## 8. Automated Testing & Verification

StudyMateAI includes an automated test script that validates all 7 core API endpoints:

```bash
cd server
node test-api.js
```

**Verification Results:**
- `GET /api/status`: Verified online, storage engine reported, mode status reported.
- `GET /api/subjects`: Verified 4 PVPSIT subjects retrieved.
- `GET /api/materials`: Verified 6 initial study materials retrieved.
- `POST /api/rag/chat (In-Scope)`: Verified grounded retrieval with authentic sources cited.
- `POST /api/rag/chat (Out-Of-Scope)`: Verified truthful admission when context is not present.
- `GET /api/quizzes` & `POST /api/quizzes/:id/submit`: Verified grading logic and explanations.
- `POST /api/materials/upload` & `DELETE`: Verified PDF upload, text parsing, chunk indexing, and deletion.
- `npm run build (client)`: Verified 1,929 Vite modules compiled with 0 errors.

---

## 9. License

Developed for academic engineering preparation under the MIT License.
Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT) Academic Testbed.
