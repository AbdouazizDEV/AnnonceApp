// src/controllers/userController.js
import User from '../models/User.js';
import DatabaseFactory from '../services/DatabaseFactory.js';
import CloudinaryService from '../services/CloudinaryService.js';
import bcrypt from 'bcrypt';

class UserController {
    constructor(dbType = process.env.DATABASE_TYPE || 'mysql') {
        this.db = DatabaseFactory.getDatabase(dbType);
    }

    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await this.db.findById('Utilisateurs', userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Exclure le mot de passe de la réponse
            const { password, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                data: userWithoutPassword
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { nom, prenom, email, currentPassword, newPassword, tel } = req.body;

            // Vérifier si l'utilisateur existe
            const user = await this.db.findById('Utilisateurs', userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Gérer la mise à jour de l'image de profil
            let imageUrl = user.photo;
            let cloudinaryId = user.cloudinary_id;

            if (req.file) {
                // Supprimer l'ancienne image si elle existe
                if (user.cloudinary_id) {
                    await CloudinaryService.deleteImage(user.cloudinary_id);
                }

                const result = await CloudinaryService.uploadImage(req.file.buffer);
                imageUrl = result.secure_url;
                cloudinaryId = result.public_id;
            }

            // Vérifier et mettre à jour le mot de passe si nécessaire
            let hashedPassword = user.password;
            if (currentPassword && newPassword) {
                const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mot de passe actuel incorrect'
                    });
                }
                hashedPassword = await bcrypt.hash(newPassword, 10);
            }

            // Préparer les données de mise à jour
            const updateData = {
                nom: nom || user.nom,
                prenom: prenom || user.prenom,
                email: email || user.email,
                tel: tel || user.tel,
                photo: imageUrl,
                cloudinary_id: cloudinaryId,
                password: hashedPassword
            };

            // Vérifier si le nouvel email est déjà utilisé
            if (email && email !== user.email) {
                const existingUser = await this.db.findByField('Utilisateurs', 'email', email);
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cet email est déjà utilisé'
                    });
                }
            }

            // Mettre à jour le profil
            await this.db.update('Utilisateurs', userId, updateData);

            // Retourner les données mises à jour sans le mot de passe
            const { password, ...updatedUserData } = updateData;

            res.status(200).json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: updatedUserData
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default UserController;