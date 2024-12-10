// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import DatabaseFactory from '../services/DatabaseFactory.js';
import CloudinaryService from '../services/CloudinaryService.js';

class AuthController {
    constructor(dbType = 'firebase') { // ou 'firebase'ou 'mysql'
        this.db = DatabaseFactory.getDatabase(dbType);
    }

    async register(req, res) {
        let cloudinaryId = null; // Déclarer la variable en dehors du try
        try {
            const { nom, prenom, email, password, tel } = req.body;
            
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.db.findByField('Utilisateurs', 'email', email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Cet email est déjà utilisé'
                });
            }

            // Upload de l'image sur Cloudinary si présente
            let imageUrl = null;
            if (req.file) {
                try {
                    const result = await CloudinaryService.uploadImage(req.file.buffer);
                    imageUrl = result.secure_url;
                    cloudinaryId = result.public_id; // Assigner la valeur ici
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    return res.status(400).json({
                        success: false,
                        message: 'Erreur lors de l\'upload de l\'image: ' + uploadError.message
                    });
                }
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer le nouvel utilisateur
            const userData = {
                nom,
                prenom,
                email,
                password: hashedPassword,
                tel,
                profile_id: 2,
                photo: imageUrl,
                cloudinary_id: cloudinaryId
            };

            // Valider les données
            const user = new User(userData);
            await user.validate();

            // Sauvegarder dans la base de données
            const id = await this.db.create('Utilisateurs', user.toDatabase());

            // Générer le token JWT
            const token = jwt.sign(
                { id, email, profile_id: 2 },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'Inscription réussie',
                data: {
                    user: {
                        id,
                        nom,
                        prenom,
                        email,
                        tel,
                        photo: imageUrl,
                        profile_id: 2
                    },
                    token
                }
            });

        } catch (error) {
            // Si une erreur survient après l'upload de l'image, on la supprime de Cloudinary
            if (cloudinaryId) { // Vérifier simplement cloudinaryId
                try {
                    await CloudinaryService.deleteImage(cloudinaryId);
                } catch (deleteError) {
                    console.error('Error deleting image from Cloudinary:', deleteError);
                }
            }

            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AuthController;