import express from 'express';
import { quizController } from '../controllers/quizController.js';

const router = express.Router();

router.get('/', quizController.listQuizzes);
router.get('/:id', quizController.getQuiz);
router.post('/:id/submit', quizController.submitQuiz);

export default router;
