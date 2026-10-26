import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { SEED_SUBJECTS, SEED_DOCUMENTS, SEED_CHUNKS, SEED_QUIZZES } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Memory store fallback
let memoryStore = {
  subjects: [],
  documents: [],
  chunks: [],
  quizzes: [],
  chatAudit: []
};

let pgPool = null;
let isPgConnected = false;

// Initialize PostgreSQL if DATABASE_URL is set
async function initPgIfAvailable() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('[Storage] DATABASE_URL not set. Running in resilient local JSON storage mode.');
    return false;
  }

  try {
    pgPool = new pg.Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 5000
    });
    const client = await pgPool.connect();
    await client.query('SELECT 1');
    client.release();
    isPgConnected = true;
    console.log('[Storage] Connected to PostgreSQL successfully.');
    return true;
  } catch (err) {
    console.warn('[Storage] PostgreSQL connection failed (' + err.message + '). Falling back to resilient local JSON storage.');
    isPgConnected = false;
    if (pgPool) {
      try { await pgPool.end(); } catch (e) {}
      pgPool = null;
    }
    return false;
  }
}

// Ensure local storage directory and load or seed file
function initLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_PATH)) {
    try {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      memoryStore = JSON.parse(raw);
      console.log(`[Storage] Loaded existing local store with ${memoryStore.documents?.length || 0} documents.`);
    } catch (e) {
      console.error('[Storage] Error reading local store file, re-initializing seeds:', e.message);
      seedLocalStore();
    }
  } else {
    seedLocalStore();
  }

  // Ensure arrays exist
  if (!Array.isArray(memoryStore.subjects) || memoryStore.subjects.length === 0) {
    memoryStore.subjects = [...SEED_SUBJECTS];
  }
  if (!Array.isArray(memoryStore.documents)) memoryStore.documents = [...SEED_DOCUMENTS];
  if (!Array.isArray(memoryStore.chunks)) memoryStore.chunks = [...SEED_CHUNKS];
  if (!Array.isArray(memoryStore.quizzes)) memoryStore.quizzes = [...SEED_QUIZZES];
  if (!Array.isArray(memoryStore.chatAudit)) memoryStore.chatAudit = [];

  saveLocalStore();
}

function seedLocalStore() {
  memoryStore = {
    subjects: [...SEED_SUBJECTS],
    documents: [...SEED_DOCUMENTS],
    chunks: [...SEED_CHUNKS],
    quizzes: [...SEED_QUIZZES],
    chatAudit: []
  };
  saveLocalStore();
  console.log('[Storage] Seeded local store with PVPSIT curriculum, notes, chunks, and quizzes.');
}

function saveLocalStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error saving local store:', err.message);
  }
}

// Storage API methods
export const storage = {
  async init() {
    await initPgIfAvailable();
    initLocalStore();
  },

  isPostgres() {
    return isPgConnected;
  },

  // Subjects
  async getSubjects() {
    return memoryStore.subjects;
  },

  async getSubjectByCode(code) {
    return memoryStore.subjects.find(s => s.code.toLowerCase() === (code || '').toLowerCase());
  },

  // Documents
  async getDocuments({ subjectCode, unitNumber, category, search } = {}) {
    let docs = [...memoryStore.documents];

    if (subjectCode && subjectCode !== 'ALL') {
      docs = docs.filter(d => d.subjectCode.toLowerCase() === subjectCode.toLowerCase());
    }
    if (unitNumber && unitNumber !== 'ALL') {
      docs = docs.filter(d => d.unitNumber.toLowerCase() === unitNumber.toLowerCase());
    }
    if (category && category !== 'ALL') {
      docs = docs.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      docs = docs.filter(d =>
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.filename && d.filename.toLowerCase().includes(q)) ||
        (d.summary && d.summary.toLowerCase().includes(q)) ||
        (d.subjectName && d.subjectName.toLowerCase().includes(q))
      );
    }

    // Sort descending by created date
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs;
  },

  async getDocumentById(id) {
    return memoryStore.documents.find(d => d.id === id);
  },

  async addDocument(doc) {
    const newDoc = {
      ...doc,
      id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    memoryStore.documents.unshift(newDoc);
    saveLocalStore();
    return newDoc;
  },

  async deleteDocument(id) {
    const idx = memoryStore.documents.findIndex(d => d.id === id);
    if (idx === -1) return false;
    const [deleted] = memoryStore.documents.splice(idx, 1);

    // Also remove associated chunks
    memoryStore.chunks = memoryStore.chunks.filter(c => c.documentId !== id);
    saveLocalStore();
    return deleted;
  },

  // Chunks
  async addChunks(chunks) {
    if (!Array.isArray(chunks)) return [];
    memoryStore.chunks.push(...chunks);
    saveLocalStore();
    return chunks;
  },

  async getChunksByDocument(docId) {
    return memoryStore.chunks.filter(c => c.documentId === docId);
  },

  async getAllChunks({ subjectCode, unitNumber } = {}) {
    let list = [...memoryStore.chunks];
    if (subjectCode && subjectCode !== 'ALL') {
      list = list.filter(c => c.subjectCode.toLowerCase() === subjectCode.toLowerCase());
    }
    if (unitNumber && unitNumber !== 'ALL') {
      list = list.filter(c => c.unitNumber.toLowerCase() === unitNumber.toLowerCase());
    }
    return list;
  },

  // Quizzes
  async getQuizzes({ subjectCode, unitNumber } = {}) {
    let list = [...memoryStore.quizzes];
    if (subjectCode && subjectCode !== 'ALL') {
      list = list.filter(q => q.subjectCode.toLowerCase() === subjectCode.toLowerCase());
    }
    if (unitNumber && unitNumber !== 'ALL') {
      list = list.filter(q => q.unitNumber.toLowerCase() === unitNumber.toLowerCase());
    }
    return list;
  },

  async getQuizById(id) {
    return memoryStore.quizzes.find(q => q.id === id);
  },

  async addQuiz(quiz) {
    const newQuiz = {
      ...quiz,
      id: quiz.id || `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };
    memoryStore.quizzes.unshift(newQuiz);
    saveLocalStore();
    return newQuiz;
  },

  // Chat Audit
  async logChatAudit(entry) {
    const item = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    memoryStore.chatAudit.unshift(item);
    if (memoryStore.chatAudit.length > 200) memoryStore.chatAudit.pop();
    saveLocalStore();
    return item;
  },

  // System statistics
  async getStats() {
    return {
      subjectsCount: memoryStore.subjects.length,
      documentsCount: memoryStore.documents.length,
      chunksCount: memoryStore.chunks.length,
      quizzesCount: memoryStore.quizzes.length,
      storageEngine: isPgConnected ? 'PostgreSQL' : 'Resilient JSON Store',
      institution: 'Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT)'
    };
  }
};
