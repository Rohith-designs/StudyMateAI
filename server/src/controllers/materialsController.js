import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { storage } from '../db/storage.js';
import { pdfService } from '../services/pdfService.js';
import { ragService } from '../services/ragService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

export const materialsController = {
  // GET /api/materials
  async listMaterials(req, res) {
    try {
      const { subjectCode, unitNumber, category, search } = req.query;
      const documents = await storage.getDocuments({ subjectCode, unitNumber, category, search });
      res.json({
        success: true,
        count: documents.length,
        materials: documents
      });
    } catch (err) {
      console.error('[materialsController] listMaterials error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve materials: ' + err.message });
    }
  },

  // GET /api/materials/:id
  async getMaterial(req, res) {
    try {
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }
      const chunks = await storage.getChunksByDocument(doc.id);
      res.json({
        success: true,
        material: doc,
        chunksCount: chunks.length
      });
    } catch (err) {
      console.error('[materialsController] getMaterial error:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch material: ' + err.message });
    }
  },

  // POST /api/materials/upload
  async uploadMaterial(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded. Please select a valid PDF document.'
        });
      }

      const {
        title,
        department = 'Computer Science & Engineering',
        subjectCode,
        subjectName,
        regulation = 'PVP20',
        academicYear = '2024-25',
        unitNumber = 'Unit 1',
        category = 'Lecture Notes'
      } = req.body;

      if (!title || !title.trim()) {
        // Clean up uploaded file if validation fails
        if (req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, error: 'Document title is required.' });
      }

      if (!subjectCode) {
        if (req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, error: 'Subject code is required.' });
      }

      // Check subject existence or name
      const subject = await storage.getSubjectByCode(subjectCode);
      const resolvedSubjectName = subject ? subject.name : (subjectName || subjectCode);

      // Extract text from PDF buffer
      const fileBuffer = fs.readFileSync(req.file.path);
      let extracted = { text: '', pageCount: 1 };
      try {
        extracted = await pdfService.extractText(fileBuffer);
      } catch (parseErr) {
        console.warn('[materialsController] PDF text parse warning:', parseErr.message);
        // We still save the document, but extracted text is flagged
        extracted.text = `Document uploaded: ${req.file.originalname}. (Text extraction had a notice: ${parseErr.message})`;
      }

      const relativeFilePath = path.relative(ROOT_DIR, req.file.path).replace(/\\/g, '/');

      // Create document entry
      const newDoc = await storage.addDocument({
        title: title.trim(),
        department,
        subjectCode,
        subjectName: resolvedSubjectName,
        regulation,
        academicYear,
        unitNumber,
        category,
        filename: req.file.originalname,
        filePath: relativeFilePath,
        fileSize: req.file.size,
        pageCount: extracted.pageCount || 1,
        uploadedBy: 'Faculty Admin',
        summary: extracted.text ? (extracted.text.slice(0, 280) + '...') : 'Uploaded PDF notes for semester preparation.'
      });

      // Semantic chunking & indexing
      let chunks = [];
      if (extracted.text && extracted.text.length > 50) {
        chunks = ragService.chunkText(extracted.text, newDoc);
        if (chunks.length > 0) {
          await storage.addChunks(chunks);
        }
      }

      console.log(`[materialsController] Document "${newDoc.title}" uploaded successfully. Chunks created: ${chunks.length}`);

      res.status(201).json({
        success: true,
        message: 'Material uploaded and indexed successfully into RAG search engine.',
        material: newDoc,
        chunksIndexed: chunks.length
      });
    } catch (err) {
      console.error('[materialsController] Upload error:', err);
      // Clean file on unexpected failure
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      res.status(500).json({ success: false, error: 'Failed to process upload: ' + err.message });
    }
  },

  // DELETE /api/materials/:id
  async deleteMaterial(req, res) {
    try {
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, error: 'Material not found.' });
      }

      // Remove from storage & chunks
      const deleted = await storage.deleteDocument(doc.id);

      // Attempt to remove physical file if within server directory
      if (doc.filePath) {
        const fullPath = path.resolve(ROOT_DIR, doc.filePath);
        if (fs.existsSync(fullPath) && !doc.filePath.includes('PVPSIT_')) {
          // Do not delete sample seed PDFs
          try { fs.unlinkSync(fullPath); } catch (e) {}
        }
      }

      res.json({
        success: true,
        message: `Material "${doc.title}" deleted successfully.`,
        deletedId: doc.id
      });
    } catch (err) {
      console.error('[materialsController] deleteMaterial error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete material: ' + err.message });
    }
  },

  // GET /api/materials/:id/download
  async downloadMaterial(req, res) {
    try {
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, error: 'Material not found.' });
      }

      const fullPath = path.resolve(ROOT_DIR, doc.filePath);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          error: 'Document file not found on disk. File path: ' + doc.filePath
        });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.filename || 'document.pdf')}"`);
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
    } catch (err) {
      console.error('[materialsController] downloadMaterial error:', err);
      res.status(500).json({ success: false, error: 'Download failed: ' + err.message });
    }
  }
};
