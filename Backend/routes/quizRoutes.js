import express from 'express';
import { generateQuiz, submitQuiz, getQuizResults, getQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/generate', protect, generateQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/results', protect, getQuizResults);
router.get('/:id', protect, getQuiz);

export default router;
