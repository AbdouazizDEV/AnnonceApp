// src/controllers/annonceController.js
import Annonce from '../models/Annonce.js';
import DatabaseFactory from '../services/DatabaseFactory.js';
import CloudinaryService from '../services/CloudinaryService.js';

class AnnonceController {
    /* constructor(dbType = 'mysql') { // ou firebase ou MySQL
        this.db = DatabaseFactory.getDatabase(dbType);
    } */
    /* constructor(dbType = process.env.DATABASE_TYPE || 'mysql') { 
        this.db = DatabaseFactory.getDatabase(dbType);
    } */
    constructor() {
        this.db = DatabaseFactory.getDatabase(process.env.DATABASE_TYPE || 'mysql');
    }
    async createAnnonce(req, res) {
        try {
            let imageUrl = null;
            let publicId = null;
            
            // Si une image est fournie
            if (req.file) {
                try {
                    const result = await CloudinaryService.uploadImage(req.file.buffer);
                    imageUrl = result.secure_url;
                    publicId = result.public_id;
                } catch (uploadError) {
                    throw new Error('Erreur lors de l\'upload de l\'image: ' + uploadError.message);
                }
            }
    
            const annonce = new Annonce({
                titre: req.body.titre,
                description: req.body.description,
                image: imageUrl,
                cloudinary_id: publicId,
                categorie_id: req.body.categorie_id,
                user_id: req.user.id  // Ajout de l'ID de l'utilisateur
            });
    
            const annonceData = annonce.toDatabase();
            const id = await this.db.create('Annonces', annonceData);
    
            res.status(201).json({ 
                success: true,
                message: 'Annonce créée avec succès',
                data: { id, ...annonceData }
            });
        } catch (error) {
            if (req.file && error.cloudinary_id) {
                await CloudinaryService.deleteImage(error.cloudinary_id);
            }
            res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
    }

    async updateAnnonce(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
    
            // Vérifier si l'annonce existe
            const existingAnnonce = await this.db.findById('Annonces', id);
            if (!existingAnnonce) {
                return res.status(404).json({
                    success: false,
                    message: 'Annonce non trouvée'
                });
            }
    
            // Vérifier si l'utilisateur est le propriétaire de l'annonce
            if (existingAnnonce.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à modifier cette annonce'
                });
            }
    
            let imageUrl = existingAnnonce.image;
            let cloudinaryId = existingAnnonce.cloudinary_id;
    
            // Si une nouvelle image est fournie
            if (req.file) {
                // Supprimer l'ancienne image si elle existe
                if (existingAnnonce.cloudinary_id) {
                    await CloudinaryService.deleteImage(existingAnnonce.cloudinary_id);
                }
    
                // Upload nouvelle image
                const result = await CloudinaryService.uploadImage(req.file.buffer);
                imageUrl = result.secure_url;
                cloudinaryId = result.public_id;
            }
    
            // Préparer les données à mettre à jour
            const updateData = {
                titre: req.body.titre || existingAnnonce.titre,
                description: req.body.description || existingAnnonce.description,
                image: imageUrl,
                cloudinary_id: cloudinaryId,
                categorie_id: req.body.categorie_id || existingAnnonce.categorie_id,
                date_update: new Date()
            };
    
            // Mettre à jour l'annonce
            await this.db.update('Annonces', id, updateData);
    
            res.status(200).json({
                success: true,
                message: 'Annonce mise à jour avec succès',
                data: {
                    id,
                    ...updateData
                }
            });
    
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteAnnonce(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
    
            // Vérifier si l'annonce existe
            const annonce = await this.db.findById('Annonces', id);
            if (!annonce) {
                return res.status(404).json({
                    success: false,
                    message: 'Annonce non trouvée'
                });
            }
    
            // Vérifier si l'utilisateur est le propriétaire ou un admin
            if (annonce.user_id !== userId && req.user.profile_id !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à supprimer cette annonce'
                });
            }
    
            // Supprimer l'image de Cloudinary si elle existe
            if (annonce.cloudinary_id) {
                try {
                    await CloudinaryService.deleteImage(annonce.cloudinary_id);
                } catch (cloudinaryError) {
                    console.error('Erreur lors de la suppression de l\'image:', cloudinaryError);
                }
            }
    
            // Supprimer l'annonce
            await this.db.delete('Annonces', id);
    
            res.status(200).json({
                success: true,
                message: 'Annonce supprimée avec succès'
            });
    
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AnnonceController;