// src/controllers/commentController.js
import DatabaseFactory from '../services/DatabaseFactory.js';
class CommentController {
    constructor(dbType = process.env.DATABASE_TYPE || 'mysql') {
        this.db = DatabaseFactory.getDatabase(dbType);
    }

    // Ajouter un commentaire
    async addComment(req, res) {
        try {
            const { annonceId } = req.params;
            const { contenu } = req.body;
            const userId = req.user.id;

            if (!contenu?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Le contenu du commentaire est requis'
                });
            }

            // Vérifier si l'annonce existe
            const annonce = await this.db.findById('Annonces', annonceId);
            if (!annonce) {
                return res.status(404).json({
                    success: false,
                    message: 'Annonce non trouvée'
                });
            }

            const commentData = {
                user_id: userId,
                annonce_id: annonceId,
                contenu,
                created_at: new Date(),
                updated_at: new Date()
            };

            const commentId = await this.db.create('commentaires', commentData);
            const comment = await this.db.findById('commentaires', commentId);

            // Récupérer les infos de l'utilisateur
            const user = await this.db.findById('Utilisateurs', userId);

            res.status(201).json({
                success: true,
                message: 'Commentaire ajouté avec succès',
                data: {
                    id: commentId,
                    contenu: comment.contenu,
                    created_at: comment.created_at,
                    user: {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        photo: user.photo
                    }
                }
            });

        } catch (error) {
            console.error('Add comment error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

async getComments(req, res) {
    try {
        const { annonceId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Vérifier si l'annonce existe
        const annonce = await this.db.findById('Annonces', annonceId);
        if (!annonce) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée'
            });
        }

        const comments = await this.db.findAllCommentsForAnnonce(annonceId);

        // Enrichir avec les données utilisateur
        const enrichedComments = await Promise.all(
            comments.map(async (comment) => {
                const user = await this.db.findById('Utilisateurs', comment.user_id);
                
                // Si l'utilisateur n'existe plus, fournir des informations par défaut
                const userInfo = user ? {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    photo: user.photo
                } : {
                    id: comment.user_id,
                    nom: 'Utilisateur supprimé',
                    prenom: '',
                    photo: null
                };

                return {
                    id: comment.id,
                    contenu: comment.contenu,
                    created_at: comment.created_at,
                    user: userInfo
                };
            })
        );

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedComments = enrichedComments.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: {
                comments: paginatedComments,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(enrichedComments.length / limit),
                    total_items: enrichedComments.length
                }
            }
        });

    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
}
export default CommentController;