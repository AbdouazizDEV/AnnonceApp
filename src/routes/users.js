// src/routes/users.js
/**
* @swagger
* tags:
*   name: Users
*   description: API pour la gestion du profil utilisateur
*/

/**
* @swagger
* components:
*   schemas:
*     Profile:
*       type: object
*       properties:
*         id:
*           type: integer
*           description: ID de l'utilisateur
*         nom:
*           type: string
*         prenom:
*           type: string
*         email:
*           type: string
*           format: email
*         tel:
*           type: string
*         photo:
*           type: string
*           description: URL de la photo de profil
*         profile_id:
*           type: integer
*           description: Type de profil (1=admin, 2=utilisateur)
*/

/**
* @swagger
* /api/users/profile:
*   get:
*     summary: Récupère le profil de l'utilisateur connecté
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Profil utilisateur récupéré avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 data:
*                   $ref: '#/components/schemas/Profile'
*       401:
*         description: Non authentifié
*       404:
*         description: Utilisateur non trouvé
*   
*   put:
*     summary: Met à jour le profil de l'utilisateur
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     requestBody:
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               nom:
*                 type: string
*               prenom:
*                 type: string
*               email:
*                 type: string
*                 format: email
*               currentPassword:
*                 type: string
*                 description: Requis si newPassword est fourni
*               newPassword:
*                 type: string
*                 description: Nouveau mot de passe
*               tel:
*                 type: string
*               photo:
*                 type: string
*                 format: binary
*     responses:
*       200:
*         description: Profil mis à jour avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*                 data:
*                   $ref: '#/components/schemas/Profile'
*       400:
*         description: Données invalides
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: false
*                 message:
*                   type: string
*                   example: "Mot de passe actuel incorrect"
*       401:
*         description: Non authentifié
*       404:
*         description: Utilisateur non trouvé
*/

import express from 'express';
import UserController from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
const controller = new UserController();

router.get('/profile', verifyToken, controller.getProfile.bind(controller));
router.put('/profile', verifyToken, upload.single('photo'), controller.updateProfile.bind(controller));

export default router;