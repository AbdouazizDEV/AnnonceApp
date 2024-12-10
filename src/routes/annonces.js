import express from 'express';
import AnnonceController from '../controllers/annonceController.js';
import upload from '../middleware/uploadMiddleware.js';

// Dans routes/annonces.js
const controller = new AnnonceController('mysql'); // ou 'mysql'ou 'firebase'
const router = express.Router();
//const controller = new AnnonceController();

// Important : le middleware upload.single doit être avant controller.createAnnonce
router.post('/', 
    upload.single('image'),  // 'image' doit correspondre au nom du champ dans Postman
    controller.createAnnonce.bind(controller)
);

export default router;