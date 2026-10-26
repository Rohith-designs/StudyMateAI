import express from 'express';
import { ragController } from '../controllers/ragController.js';

const router = express.Router();

router.post('/chat', ragController.chat);
router.get('/status', ragController.status);

export default router;
