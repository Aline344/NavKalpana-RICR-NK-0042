import express from 'express';
import { getDashboardStats, getAllUsers, updateUser, deleteUser, getUserDetails } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();
router.get('/stats', protect, getDashboardStats);
router.get('/admin/users', protect, admin, getAllUsers);
router.put('/admin/users/:id', protect, admin, updateUser);
router.get('/admin/users/:id', protect, admin, getUserDetails);
router.delete('/admin/users/:id', protect, admin, deleteUser);

export default router;
