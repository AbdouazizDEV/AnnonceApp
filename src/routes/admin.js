// src/routes/admin.js
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API pour les opérations d'administration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [validated, rejected]
 *           description: Statut de validation de l'annonce
 *     
 *     UserManagement:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         action:
 *           type: string
 *           enum: [block, delete]
 *           description: Action à effectuer sur l'utilisateur
 */

/**
 * @swagger
 * /api/admin/annonces/{id}/validate:
 *   put:
 *     summary: Valider ou rejeter une annonce
 *     description: Permet à un administrateur de valider ou rejeter une annonce
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'annonce à valider/rejeter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationStatus'
 *           example:
 *             status: "validated"
 *     responses:
 *       200:
 *         description: Annonce validée/rejetée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Annonce validée avec succès"
 *       403:
 *         description: Accès non autorisé
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
 *                   example: "Accès non autorisé. Droits d'administrateur requis."
 *       404:
 *         description: Annonce non trouvée
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   post:
 *     summary: Gérer un utilisateur (bloquer/supprimer)
 *     description: Permet à un administrateur de bloquer ou supprimer un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à gérer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserManagement'
 *           example:
 *             action: "block"
 *     responses:
 *       200:
 *         description: Action effectuée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Utilisateur bloqué avec succès"
 *       403:
 *         description: Accès non autorisé
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
 *                   example: "Accès non autorisé. Droits d'administrateur requis."
 *       404:
 *         description: Utilisateur non trouvé
 */

import express from 'express';
import AdminController from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new AdminController();

router.put('/annonces/:id/validate', verifyToken, controller.validateAnnonce.bind(controller));
router.post('/users/:id', verifyToken, controller.manageUser.bind(controller));

export default router;