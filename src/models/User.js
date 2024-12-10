// src/models/User.js
import BaseModel from './BaseModel.js';

class User extends BaseModel {
    constructor(data = {}) {
        super(data);
        this.nom = data.nom || '';
        this.prenom = data.prenom || '';
        this.email = data.email || '';
        this.password = data.password || '';
        this.tel = data.tel || '';
        this.photo = data.photo || null;
        this.cloudinary_id = data.cloudinary_id || null;
        this.profile_id = data.profile_id || 2;
    }

    validate() {
        return new Promise((resolve, reject) => {
            if (!this.nom || !this.prenom) {
                reject(new Error('Nom et prénom sont requis'));
            }
            if (!this.email) {
                reject(new Error('Email est requis'));
            }
            if (!this.isValidEmail(this.email)) {
                reject(new Error('Format email invalide'));
            }
            if (!this.password || this.password.length < 6) {
                reject(new Error('Le mot de passe doit faire au moins 6 caractères'));
            }
            resolve();
        });
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    toDatabase() {
        return {
            nom: this.nom,
            prenom: this.prenom,
            email: this.email,
            password: this.password,
            tel: this.tel,
            photo: this.photo,
            cloudinary_id: this.cloudinary_id,
            profile_id: this.profile_id
        };
    }
}

export default User;