-- ============================================================================
-- StudyMateAI — PostgreSQL Schema
-- Database schema for academic documents, text chunks, embeddings, and quizzes
-- Compatible with PostgreSQL 14+ (and pgvector extension where available)
-- ============================================================================

-- Optional: Enable pgvector extension if vector column is used
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(50) NOT NULL,
    regulation VARCHAR(20) NOT NULL DEFAULT 'PVP20',
    semester VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Academic Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    subject_code VARCHAR(20) NOT NULL REFERENCES subjects(code) ON DELETE CASCADE,
    subject_name VARCHAR(150) NOT NULL,
    regulation VARCHAR(20) NOT NULL DEFAULT 'PVP20',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-25',
    unit_number VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Lecture Notes', 'Syllabus', 'Previous QP', 'Lab Manual'
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    page_count INT DEFAULT 1,
    uploaded_by VARCHAR(100) DEFAULT 'Faculty Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Document Chunks & Vector Store Table
CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(50) PRIMARY KEY,
    document_id VARCHAR(50) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    subject_code VARCHAR(20) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    chunk_index INT NOT NULL,
    page_number INT DEFAULT 1,
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    -- embedding vector(768), -- Enable when pgvector is installed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_subject ON document_chunks(subject_code);
CREATE INDEX IF NOT EXISTS idx_chunks_unit ON document_chunks(unit_number);

-- 4. Practice Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(50) PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL REFERENCES subjects(code) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_questions INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Quiz Questions Table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(50) PRIMARY KEY,
    quiz_id VARCHAR(50) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 4 string options
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    reference_unit VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Chat History & Audit Log
CREATE TABLE IF NOT EXISTS chat_audit (
    id VARCHAR(50) PRIMARY KEY,
    session_id VARCHAR(100),
    subject_code VARCHAR(20),
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    sources JSONB,
    mode VARCHAR(20) NOT NULL DEFAULT 'demo', -- 'live_rag' or 'demo'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
