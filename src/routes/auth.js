// src/routes/auth.js
import express from 'express';
import AuthController from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
const controller = new AuthController();
/* const controller = new AuthController('firebase'); // ou 'firebase'
 */
router.post('/register', 
    upload.single('photo'),
    controller.register.bind(controller)
);
router.post('/login', controller.login.bind(controller));

export default router;