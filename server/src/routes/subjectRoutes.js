import express from 'express';
import { storage } from '../db/storage.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const subjects = await storage.getSubjects();
    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const subject = await storage.getSubjectByCode(req.params.code);
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.json({ success: true, subject });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
