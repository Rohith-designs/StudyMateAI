import { ragService } from '../services/ragService.js';
import { storage } from '../db/storage.js';

export const ragController = {
  // POST /api/rag/chat
  async chat(req, res) {
    try {
      const { query, subjectCode, unitNumber, conversationHistory } = req.body;

      if (!query || !query.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Query text is required.'
        });
      }

      const response = await ragService.generateAnswer({
        query: query.trim(),
        subjectCode: subjectCode || null,
        unitNumber: unitNumber || null,
        conversationHistory: conversationHistory || []
      });

      res.json({
        success: true,
        data: response
      });
    } catch (err) {
      console.error('[ragController] Chat processing error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to generate study answer: ' + err.message
      });
    }
  },

  // GET /api/rag/status
  async status(req, res) {
    try {
      const llmStatus = ragService.getLlmStatus();
      const stats = await storage.getStats();

      res.json({
        success: true,
        status: {
          ...llmStatus,
          totalIndexedChunks: stats.chunksCount,
          totalDocuments: stats.documentsCount,
          storageEngine: stats.storageEngine,
          institution: stats.institution
        }
      });
    } catch (err) {
      console.error('[ragController] Status check error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
