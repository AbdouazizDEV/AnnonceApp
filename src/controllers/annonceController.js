// src/controllers/annonceController.js
import Annonce from '../models/Annonce.js';
import DatabaseFactory from '../services/DatabaseFactory.js';
import CloudinaryService from '../services/CloudinaryService.js';

class AnnonceController {
    constructor(dbType = 'mysql') { // ou firebase ou MySQL
        this.db = DatabaseFactory.getDatabase(dbType);
    }

    async createAnnonce(req, res) {
        try {
            let imageUrl = null;
            let publicId = null;
            console.log('File received:', req.file);

            // Si une image est fournie
            if (req.file) {
                try {
                    const result = await CloudinaryService.uploadImage(req.file.buffer);
                    console.log('Cloudinary result:', result);
                    imageUrl = result.secure_url;
                    publicId = result.public_id;
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw new Error('Erreur lors de l\'upload de l\'image: ' + uploadError.message);
                }
            }

            const annonce = new Annonce({
                titre: req.body.titre,
                description: req.body.description,
                image: imageUrl,         // URL de l'image
                cloudinary_id: publicId, // ID Cloudinary
                categorie_id: req.body.categorie_id
            });

         //   await annonce.validate();
        const annonceData = annonce.toDatabase();
        const id = await this.db.create('Annonces', annonceData);

        res.status(201).json({ 
            success: true,
            message: 'Annonce créée avec succès',
            data: { id, ...annonceData }
        });
        } catch (error) {
            // Si l'upload a réussi mais que la création de l'annonce échoue,
            // on supprime l'image de Cloudinary
            if (req.file && error.cloudinary_id) {
                await CloudinaryService.deleteImage(error.cloudinary_id);
            }

            res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
    }
}

export default AnnonceController;