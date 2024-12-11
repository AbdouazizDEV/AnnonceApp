// src/routes/auth.js
/**
* @swagger
* tags:
*   name: Authentification
*   description: API pour l'authentification des utilisateurs
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - nom
*         - prenom
*         - email
*         - password
*       properties:
*         id:
*           type: integer
*           description: ID auto-généré de l'utilisateur
*         nom:
*           type: string
*           description: Nom de l'utilisateur
*         prenom:
*           type: string
*           description: Prénom de l'utilisateur
*         email:
*           type: string
*           format: email
*           description: Email unique de l'utilisateur
*         password:
*           type: string
*           format: password
*           description: Mot de passe de l'utilisateur
*         tel:
*           type: string
*           description: Numéro de téléphone
*         photo:
*           type: string
*           description: URL de la photo de profil
*         profile_id:
*           type: integer
*           description: 1 pour admin, 2 pour utilisateur normal
*     
*     LoginCredentials:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           format: email
*         password:
*           type: string
*           format: password
*     
*     AuthResponse:
*       type: object
*       properties:
*         success:
*           type: boolean
*         message:
*           type: string
*         data:
*           type: object
*           properties:
*             user:
*               $ref: '#/components/schemas/User'
*             token:
*               type: string
*               description: JWT token
*/

/**
* @swagger
* /api/auth/register:
*   post:
*     summary: Inscription d'un nouvel utilisateur
*     tags: [Authentification]
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             required:
*               - nom
*               - prenom
*               - email
*               - password
*             properties:
*               nom:
*                 type: string
*               prenom:
*                 type: string
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*                 format: password
*               tel:
*                 type: string
*               photo:
*                 type: string
*                 format: binary
*     responses:
*       201:
*         description: Utilisateur créé avec succès
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/AuthResponse'
*       400:
*         description: Données invalides ou email déjà utilisé
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
*                   example: "Cet email est déjà utilisé"
*/

/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Connexion d'un utilisateur
*     tags: [Authentification]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/LoginCredentials'
*           example:
*             email: "user@example.com"
*             password: "password123"
*     responses:
*       200:
*         description: Connexion réussie
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/AuthResponse'
*       401:
*         description: Email ou mot de passe incorrect
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
*                   example: "Email ou mot de passe incorrect"
*/

import express from 'express';
import AuthController from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
const controller = new AuthController();

router.post('/register', upload.single('photo'), controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));

export default router;