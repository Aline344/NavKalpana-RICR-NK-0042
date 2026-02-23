import express from 'express';
import { generateAssignment, submitAssignment, getAssignments, getAssignment } from '../controllers/assignmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/generate', protect, generateAssignment);
router.post('/submit', protect, submitAssignment);
router.get('/', protect, getAssignments);
router.get('/:id', protect, getAssignment);

export default router;
