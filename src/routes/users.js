// src/routes/users.js
import express from 'express';
import UserController from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
const controller = new UserController();

router.get('/profile', verifyToken, controller.getProfile.bind(controller));
router.put('/profile', verifyToken, upload.single('photo'), controller.updateProfile.bind(controller));

export default router;