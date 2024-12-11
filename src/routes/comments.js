// src/routes/comments.js

// src/routes/comments.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique du commentaire
 *         contenu:
 *           type: string
 *           description: Contenu du commentaire
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création du commentaire
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID de l'utilisateur
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *             photo:
 *               type: string
 *               description: URL de la photo de profil
 */

/**
 * @swagger
 * /api/annonces/{annonceId}/comments:
 *   post:
 *     summary: Ajouter un commentaire à une annonce
 *     description: Permet à un utilisateur authentifié d'ajouter un commentaire sur une annonce
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: annonceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'annonce à commenter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *             properties:
 *               contenu:
 *                 type: string
 *                 description: Le contenu du commentaire
 *           example:
 *             contenu: "Super produit, je suis intéressé !"
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès
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
 *                   example: "Commentaire ajouté avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
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
 *                   example: "Le contenu du commentaire est requis"
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Annonce non trouvée
 *
 *   get:
 *     summary: Récupérer les commentaires d'une annonce
 *     description: Retourne la liste paginée des commentaires d'une annonce
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: annonceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'annonce
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre de commentaires par page
 *     responses:
 *       200:
 *         description: Liste des commentaires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                           example: 1
 *                         total_pages:
 *                           type: integer
 *                           example: 5
 *                         total_items:
 *                           type: integer
 *                           example: 48
 *       404:
 *         description: Annonce non trouvée
 */
import express from 'express';
import CommentController from '../controllers/commentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new CommentController();

router.post('/annonces/:annonceId/comments', verifyToken, controller.addComment.bind(controller));
router.get('/annonces/:annonceId/comments', controller.getComments.bind(controller));

export default router;