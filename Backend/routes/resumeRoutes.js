import express from 'express';
import multer from 'multer';
import { analyzeResume, getResumeAnalysis } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
router.post('/analyze', protect, upload.single('resumeFile'), analyzeResume);
router.get('/analysis', protect, getResumeAnalysis);

export default router;
