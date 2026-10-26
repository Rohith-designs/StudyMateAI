import { storage } from '../db/storage.js';

export const quizController = {
  // GET /api/quizzes
  async listQuizzes(req, res) {
    try {
      const { subjectCode, unitNumber } = req.query;
      const quizzes = await storage.getQuizzes({ subjectCode, unitNumber });

      // Return quiz summaries
      const summaries = quizzes.map(q => ({
        id: q.id,
        subjectCode: q.subjectCode,
        subjectName: q.subjectName,
        unitNumber: q.unitNumber,
        title: q.title,
        description: q.description,
        questionCount: q.questions?.length || 0
      }));

      res.json({
        success: true,
        quizzes: summaries
      });
    } catch (err) {
      console.error('[quizController] listQuizzes error:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch quizzes: ' + err.message });
    }
  },

  // GET /api/quizzes/:id
  async getQuiz(req, res) {
    try {
      const quiz = await storage.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }

      // Hide correct answers and explanations until student submits
      const sanitizedQuestions = quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        referenceUnit: q.referenceUnit
      }));

      res.json({
        success: true,
        quiz: {
          id: quiz.id,
          subjectCode: quiz.subjectCode,
          subjectName: quiz.subjectName,
          unitNumber: quiz.unitNumber,
          title: quiz.title,
          description: quiz.description,
          questions: sanitizedQuestions
        }
      });
    } catch (err) {
      console.error('[quizController] getQuiz error:', err);
      res.status(500).json({ success: false, error: 'Failed to load quiz: ' + err.message });
    }
  },

  // POST /api/quizzes/:id/submit
  async submitQuiz(req, res) {
    try {
      const quiz = await storage.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }

      const { userAnswers = {} } = req.body;
      let score = 0;
      const total = quiz.questions.length;

      const review = quiz.questions.map(q => {
        const selected = userAnswers[q.id];
        const isCorrect = selected === q.correctIndex;
        if (isCorrect) score++;

        return {
          questionId: q.id,
          question: q.question,
          options: q.options,
          selectedAnswer: selected !== undefined ? selected : null,
          correctAnswer: q.correctIndex,
          isCorrect,
          explanation: q.explanation,
          referenceUnit: q.referenceUnit
        };
      });

      const percentage = Math.round((score / total) * 100);
      let grade = 'Needs Revision';
      if (percentage >= 80) grade = 'Distinction';
      else if (percentage >= 60) grade = 'Good Progress';
      else if (percentage >= 40) grade = 'Pass';

      res.json({
        success: true,
        results: {
          quizId: quiz.id,
          title: quiz.title,
          subjectCode: quiz.subjectCode,
          score,
          total,
          percentage,
          grade,
          review
        }
      });
    } catch (err) {
      console.error('[quizController] submitQuiz error:', err);
      res.status(500).json({ success: false, error: 'Failed to score quiz: ' + err.message });
    }
  }
};
