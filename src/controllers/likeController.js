// src/controllers/likeController.js
import DatabaseFactory from '../services/DatabaseFactory.js';

class LikeController {
    constructor(dbType = process.env.DATABASE_TYPE || 'mysql') {
        this.db = DatabaseFactory.getDatabase(dbType);
    }

    async toggleLike(req, res) {
        try {
            const userId = req.user.id;
            const { annonceId } = req.params;
    
            // Vérifier si l'annonce existe
            const annonce = await this.db.findById('Annonces', annonceId);
            if (!annonce) {
                return res.status(404).json({
                    success: false,
                    message: 'Annonce non trouvée'
                });
            }
    
            // Vérifier si le like existe déjà
            const existingLike = await this.db.findLike(userId, annonceId);
    
            if (existingLike) {
                // Si le like existe, on le supprime
                await this.db.delete('likes_annonces', existingLike.id);
                res.status(200).json({
                    success: true,
                    message: 'Like retiré avec succès',
                    liked: false
                });
            } else {
                // Sinon, on crée un nouveau like
                await this.db.create('likes_annonces', {
                    user_id: userId,
                    annonce_id: annonceId
                });
                res.status(201).json({
                    success: true,
                    message: 'Like ajouté avec succès',
                    liked: true
                });
            }
        } catch (error) {
            console.error('Like toggle error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getLikeInfo(req, res) {
        try {
            const { annonceId } = req.params;

            // Vérifier si l'annonce existe
            const annonce = await this.db.findById('Annonces', annonceId);
            if (!annonce) {
                return res.status(404).json({
                    success: false,
                    message: 'Annonce non trouvée'
                });
            }

            // Récupérer tous les likes de l'annonce
            const likes = await this.db.findAllLikesForAnnonce(annonceId);

            // Enrichir les données des utilisateurs qui ont liké
            const likedUsers = await Promise.all(
                likes.map(async (like) => {
                    const user = await this.db.findById('Utilisateurs', like.user_id);
                    return {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        photo: user.photo
                    };
                })
            );

            // Si l'utilisateur est connecté, vérifier s'il a liké
            let userHasLiked = false;
            if (req.user) {
                const userLike = await this.db.findLike(req.user.id, annonceId);
                userHasLiked = !!userLike;
            }

            res.status(200).json({
                success: true,
                data: {
                    totalLikes: likes.length,
                    userHasLiked,
                    likedUsers
                }
            });

        } catch (error) {
            console.error('Get like info error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default LikeController;