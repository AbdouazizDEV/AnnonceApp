// src/models/Annonce.js
import BaseModel from './BaseModel.js';

class Annonce extends BaseModel {
    constructor(data = {}) {
        super(data);
        this.titre = data.titre || '';
        this.description = data.description || '';
        this.image = data.image || '';
        this.etat = data.etat || 'en_attente';
        this.validate = data.validate || false;
        this.cloudinary_id = data.cloudinary_id || null;
        this.date_creation = data.date_creation || new Date();
        this.date_update = data.date_update || new Date();
        this.categorie_id = data.categorie_id || null;
        this.user_id = data.user_id || null;  // Ajout de l'ID utilisateur
    }

    validate() {
        return new Promise((resolve, reject) => {
            if (!this.titre || !this.description) {
                reject(new Error('Titre et description requis'));
            } else if (!this.categorie_id) {
                reject(new Error('Catégorie requise'));
            } else {
                resolve();
            }
        });
    }

    // Méthode pour convertir l'objet en format stockable
    toDatabase() {
        return {
            titre: this.titre,
            description: this.description,
            image: this.image,
            etat: this.etat,
            validate: this.validate,
            cloudinary_id: this.cloudinary_id,
            date_creation: this.date_creation,
            date_update: this.date_update,
            categorie_id: this.categorie_id,
            user_id: this.user_id  // Inclure l'ID utilisateur
        };
    }
}

export default Annonce;