import express from 'express';
import { generateAssignment, submitAssignment, getAssignments, getAssignment, runCode } from '../controllers/assignmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/generate', protect, generateAssignment);
router.post('/run', protect, runCode);
router.post('/submit', protect, submitAssignment);
router.get('/', protect, getAssignments);
router.get('/:id', protect, getAssignment);

export default router;
