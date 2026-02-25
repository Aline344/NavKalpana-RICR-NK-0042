import express from 'express';
import { startInterview, submitInterview, getHistory, getReport } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/submit', protect, submitInterview);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getReport);

export default router;
