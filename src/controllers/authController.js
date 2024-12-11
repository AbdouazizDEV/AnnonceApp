// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import DatabaseFactory from '../services/DatabaseFactory.js';
import CloudinaryService from '../services/CloudinaryService.js';

class AuthController {
    /* constructor(dbType = 'firebase') { // ou 'firebase'ou 'mysql'
        this.db = DatabaseFactory.getDatabase(dbType);
    } */
    /* constructor(dbType = process.env.DATABASE_TYPE || 'mysql') { 
        this.db = DatabaseFactory.getDatabase(dbType);
    } */
        constructor() {
            this.db = DatabaseFactory.getDatabase(process.env.DATABASE_TYPE || 'mysql');
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
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Vérifier que les champs requis sont présents
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email et mot de passe requis'
                });
            }

            // Rechercher l'utilisateur
            let user;
            try {
                user = await this.db.findByField('Utilisateurs', 'email', email);
            } catch (dbError) {
                console.error('Database error:', dbError);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la recherche de l\'utilisateur'
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }

            // Vérifier le mot de passe
            let isPasswordValid;
            try {
                isPasswordValid = await bcrypt.compare(password, user.password);
            } catch (bcryptError) {
                console.error('Password comparison error:', bcryptError);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la vérification du mot de passe'
                });
            }

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }

            // Générer le token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    profile_id: user.profile_id
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retourner les informations de l'utilisateur et le token
            res.status(200).json({
                success: true,
                message: 'Connexion réussie',
                data: {
                    user: {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        tel: user.tel,
                        photo: user.photo,
                        profile_id: user.profile_id
                    },
                    token
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion'
            });
        }
    }
}

export default AuthController;