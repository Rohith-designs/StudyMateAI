import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './db/storage.js';
import { generateAllSamplePdfs } from './db/generateSamplePdfs.js';
import subjectRoutes from './routes/subjectRoutes.js';
import materialsRoutes from './routes/materialsRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import { ragService } from './services/ragService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files for uploaded PDFs
app.use('/uploads', express.static(UPLOADS_DIR));

// API Routes
app.use('/api/subjects', subjectRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/quizzes', quizRoutes);

// Overall Health & Status Route
app.get('/api/status', async (req, res) => {
  try {
    const stats = await storage.getStats();
    const llm = ragService.getLlmStatus();
    res.json({
      success: true,
      app: 'StudyMateAI',
      tagline: 'Your Verified AI Engineering Study Hub',
      institute: 'Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT)',
      status: 'online',
      storage: stats.storageEngine,
      mode: llm.isLive ? 'live_rag' : 'demo',
      llmProvider: llm.provider,
      totalDocuments: stats.documentsCount,
      totalChunks: stats.chunksCount,
      totalQuizzes: stats.quizzesCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to StudyMateAI API — Verified Academic Hub for PVPSIT Engineering Students',
    endpoints: {
      status: '/api/status',
      subjects: '/api/subjects',
      materials: '/api/materials',
      ragChat: 'POST /api/rag/chat',
      ragStatus: '/api/rag/status',
      quizzes: '/api/quizzes'
    }
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found: ' + req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Bootstrap server
async function startServer() {
  try {
    // Generate sample PDF files if missing
    generateAllSamplePdfs();

    // Initialize database / storage
    await storage.init();

    app.listen(PORT, () => {
      console.log('================================================================');
      console.log(`🎓 StudyMateAI Backend Server running on port ${PORT}`);
      console.log(`🏫 Institution: Prasad V. Potluri Siddhartha Institute of Technology`);
      console.log(`🤖 AI Status: ${ragService.getLlmStatus().isLive ? 'LIVE RAG ACTIVE' : 'TRANSPARENT DEMO MODE (Verified Knowledge-base)'}`);
      console.log(`💾 Storage: ${storage.isPostgres() ? 'PostgreSQL Database' : 'Resilient Local JSON Store'}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/status`);
      console.log('================================================================');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
