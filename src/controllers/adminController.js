// src/controllers/adminController.js
import DatabaseFactory from '../services/DatabaseFactory.js';

class AdminController {
    constructor(dbType = process.env.DATABASE_TYPE || 'mysql') {
        this.db = DatabaseFactory.getDatabase(dbType);
    }

    async validateAnnonce(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body; // 'validated' ou 'rejected'

            // Vérifier si l'admin est authentifié
            if (req.user.profile_id !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé. Droits d\'administrateur requis.'
                });
            }

            const annonce = await this.db.findById('Annonces', id);
            if (!annonce) {
                return res.status(404).json({
                    success: false,
                    message: 'Annonce non trouvée'
                });
            }

            const updateData = {
                etat: status === 'validated' ? 'validee' : 'rejetee',
                validate: status === 'validated',
                date_update: new Date()
            };

            await this.db.update('Annonces', id, updateData);

            res.status(200).json({
                success: true,
                message: `Annonce ${status === 'validated' ? 'validée' : 'rejetée'} avec succès`
            });

        } catch (error) {
            console.error('Admin validation error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async manageUser(req, res) {
        try {
            const { id } = req.params;
            const { action } = req.body; // 'block' ou 'delete'

            // Vérifier si l'admin est authentifié
            if (req.user.profile_id !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé. Droits d\'administrateur requis.'
                });
            }

            const user = await this.db.findById('Utilisateurs', id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            if (user.profile_id === 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Impossible de gérer un autre administrateur'
                });
            }

            if (action === 'block') {
                await this.db.update('Utilisateurs', id, {
                    is_blocked: true,
                    blocked_at: new Date()
                });

                res.status(200).json({
                    success: true,
                    message: 'Utilisateur bloqué avec succès'
                });
            } else if (action === 'delete') {
                // Récupérer toutes les annonces de l'utilisateur
                const annonces = await this.db.findAllByField('Annonces', 'user_id', id);
                
                // Supprimer les annonces de l'utilisateur
                for (const annonce of annonces) {
                    await this.db.delete('Annonces', annonce.id);
                }

                // Supprimer l'utilisateur
                await this.db.delete('Utilisateurs', id);

                res.status(200).json({
                    success: true,
                    message: 'Utilisateur et ses annonces supprimés avec succès'
                });
            }

        } catch (error) {
            console.error('Admin manage user error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AdminController;