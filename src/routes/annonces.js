// src/routes/annonces.js
/**
* @swagger
* tags:
*   name: Annonces
*   description: API pour la gestion des annonces
*/

/**
* @swagger
* components:
*   schemas:
*     Annonce:
*       type: object
*       required:
*         - titre
*         - description
*         - categorie_id
*       properties:
*         id:
*           type: string
*           description: ID de l'annonce
*         titre:
*           type: string
*           description: Titre de l'annonce
*         description:
*           type: string
*           description: Description détaillée
*         image:
*           type: string
*           description: URL de l'image sur Cloudinary
*         etat:
*           type: string
*           enum: [en_attente, validee, rejetee]
*         validate:
*           type: boolean
*         cloudinary_id:
*           type: string
*         date_creation:
*           type: string
*           format: date-time
*         date_update:
*           type: string
*           format: date-time
*         categorie_id:
*           type: integer
*         user_id:
*           type: integer
*     
*     Categorie:
*       type: object
*       properties:
*         id:
*           type: integer
*         designation:
*           type: string
*/

/**
* @swagger
* /api/annonces:
*   get:
*     summary: Récupère toutes les annonces validées
*     tags: [Annonces]
*     parameters:
*       - in: query
*         name: categorie_id
*         schema:
*           type: integer
*         description: Filtrer par catégorie
*       - in: query
*         name: page
*         schema:
*           type: integer
*         description: Numéro de la page
*       - in: query
*         name: limit
*         schema:
*           type: integer
*         description: Nombre d'annonces par page
*     responses:
*       200:
*         description: Liste des annonces paginée
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 data:
*                   type: object
*                   properties:
*                     annonces:
*                       type: array
*                       items:
*                         $ref: '#/components/schemas/Annonce'
*                     pagination:
*                       type: object
*                       properties:
*                         current_page:
*                           type: integer
*                         total_pages:
*                           type: integer
*                         total_items:
*                           type: integer
*   
*   post:
*     summary: Crée une nouvelle annonce
*     tags: [Annonces]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             required:
*               - titre
*               - description
*               - categorie_id
*             properties:
*               titre:
*                 type: string
*               description:
*                 type: string
*               categorie_id:
*                 type: integer
*               image:
*                 type: string
*                 format: binary
*     responses:
*       201:
*         description: Annonce créée avec succès
*       401:
*         description: Non authentifié
*       400:
*         description: Données invalides
*/

/**
* @swagger
* /api/annonces/{id}:
*   put:
*     summary: Met à jour une annonce existante
*     tags: [Annonces]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               titre:
*                 type: string
*               description:
*                 type: string
*               categorie_id:
*                 type: integer
*               image:
*                 type: string
*                 format: binary
*     responses:
*       200:
*         description: Annonce mise à jour avec succès
*       403:
*         description: Non autorisé
*       404:
*         description: Annonce non trouvée
* 
*   delete:
*     summary: Supprime une annonce
*     tags: [Annonces]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Annonce supprimée avec succès
*       403:
*         description: Non autorisé
*       404:
*         description: Annonce non trouvée
*/

/**
* @swagger
* /api/annonces/categories:
*   get:
*     summary: Récupère la liste des catégories
*     tags: [Annonces]
*     responses:
*       200:
*         description: Liste des catégories
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 data:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Categorie'
*/

import express from 'express';
import AnnonceController from '../controllers/annonceController.js';
import upload from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const controller = new AnnonceController('firebase');
const router = express.Router();

router.post('/', verifyToken, upload.single('image'), controller.createAnnonce.bind(controller));
router.put('/:id', verifyToken, upload.single('image'), controller.updateAnnonce.bind(controller));
router.delete('/:id', verifyToken, controller.deleteAnnonce.bind(controller));
router.get('/', controller.getAllAnnonces.bind(controller));
router.get('/categories', controller.getCategories.bind(controller));

export default router;