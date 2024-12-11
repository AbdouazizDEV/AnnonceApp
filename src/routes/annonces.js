import express from 'express';
import AnnonceController from '../controllers/annonceController.js';
import upload from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

// Dans routes/annonces.js
const controller = new AnnonceController('firebase'); // ou 'mysql'ou 'firebase'
const router = express.Router();
//const controller = new AnnonceController();

// Important : le middleware upload.single doit être avant controller.createAnnonce
router.post('/', 
    verifyToken,
    upload.single('image'),
    controller.createAnnonce.bind(controller)
);

router.put('/:id', verifyToken, upload.single('image'), controller.updateAnnonce.bind(controller));
// src/routes/annonces.js
router.delete('/:id', verifyToken, controller.deleteAnnonce.bind(controller));

// Route publique pour obtenir toutes les annonces validées
router.get('/', controller.getAllAnnonces.bind(controller));

// Route pour obtenir les catégories
router.get('/categories', controller.getCategories.bind(controller));
export default router;