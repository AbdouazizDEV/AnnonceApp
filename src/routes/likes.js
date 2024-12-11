// src/routes/likes.js
// src/routes/likes.js

/**
* @swagger
* components:
*   schemas:
*     LikeResponse:
*       type: object
*       properties:
*         success:
*           type: boolean
*           example: true
*         message:
*           type: string
*         liked:
*           type: boolean
*           description: Indique si l'annonce est likée ou non après l'action
*     
*     LikeInfo:
*       type: object
*       properties:
*         totalLikes:
*           type: integer
*           description: Nombre total de likes sur l'annonce
*         userHasLiked:
*           type: boolean
*           description: Indique si l'utilisateur courant a liké l'annonce
*         likedUsers:
*           type: array
*           description: Liste des utilisateurs ayant liké l'annonce
*           items:
*             type: object
*             properties:
*               id:
*                 type: integer
*               nom:
*                 type: string
*               prenom:
*                 type: string
*               photo:
*                 type: string
*                 description: URL de la photo de profil
*/

/**
* @swagger
* /api/annonces/{annonceId}/like:
*   post:
*     summary: Ajouter ou retirer un like sur une annonce
*     description: Toggle le like d'un utilisateur sur une annonce (ajoute si absent, retire si présent)
*     tags: [Likes]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: annonceId
*         required: true
*         schema:
*           type: string
*         description: ID de l'annonce à liker/unliker
*     responses:
*       200:
*         description: Like modifié avec succès
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/LikeResponse'
*             examples:
*               like:
*                 value:
*                   success: true
*                   message: "Like ajouté avec succès"
*                   liked: true
*               unlike:
*                 value:
*                   success: true
*                   message: "Like retiré avec succès"
*                   liked: false
*       401:
*         description: Utilisateur non authentifié
*       404:
*         description: Annonce non trouvée
* 
* /api/annonces/{annonceId}/likes:
*   get:
*     summary: Obtenir les informations des likes d'une annonce
*     description: Récupère le nombre total de likes et la liste des utilisateurs ayant liké l'annonce
*     tags: [Likes]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: annonceId
*         required: true
*         schema:
*           type: string
*         description: ID de l'annonce
*     responses:
*       200:
*         description: Informations des likes récupérées avec succès
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   $ref: '#/components/schemas/LikeInfo'
*             example:
*               success: true
*               data:
*                 totalLikes: 42
*                 userHasLiked: true
*                 likedUsers:
*                   - id: 1
*                     nom: "Doe"
*                     prenom: "John"
*                     photo: "https://example.com/photo.jpg"
*       401:
*         description: Utilisateur non authentifié
*       404:
*         description: Annonce non trouvée
*/
import express from 'express';
import LikeController from '../controllers/likeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new LikeController();

router.post('/annonces/:annonceId/like', verifyToken, controller.toggleLike.bind(controller));
router.get('/annonces/:annonceId/likes', verifyToken, controller.getLikeInfo.bind(controller));

export default router;