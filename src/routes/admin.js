// src/routes/admin.js
import express from 'express';
import AdminController from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new AdminController();

// Routes de gestion des annonces
router.put('/annonces/:id/validate', verifyToken, controller.validateAnnonce.bind(controller));

// Routes de gestion des utilisateurs
router.post('/users/:id', verifyToken, controller.manageUser.bind(controller));

export default router;