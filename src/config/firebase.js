//firebase.js
import admin from 'firebase-admin';
import IDatabase from '../interfaces/IDatabase.js';
import dotenv from 'dotenv';
/* import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs'; */
import { db } from './firebaseConfig.js';


class FirebaseDatabase extends IDatabase {
    constructor() {
        super();
        this.db = db;
    }

    async create(collection, data) {
        const docRef = await this.db.collection(collection).add(data);
        return docRef.id;
    }

    async findById(collection, id) {
        try {
            // Pour Firebase, assurons-nous que l'id est une chaîne
            const docRef = this.db.collection(collection).doc(String(id));
            const doc = await docRef.get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error(`Error in findById: ${error}`);
            return null;
        }
    }

    async findAll(collection) {
        try {
            const snapshot = await this.db.collection(collection).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error in findAll: ${error}`);
            return [];
        }
    }
    async update(collection, id, data) {
        await this.db.collection(collection).doc(id).update(data);
        return id;
    }

    async delete(collection, id) {
        await this.db.collection(collection).doc(id).delete();
        return id;
    }
    async findAllByField(collection, field, value) {
        try {
            const snapshot = await this.db.collection(collection)
                .where(field, '==', value)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error in findAllByField: ${error}`);
            return [];
        }
    }
    // Dans la classe FirebaseDatabase
async findByField(collection, field, value) {
    try {
        const snapshot = await this.db.collection(collection)
            .where(field, '==', value)
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error(`Error in findByField: ${error}`);
        throw error;
    }
}
async findLike(userId, annonceId) {
    const snapshot = await this.db.collection('likes_annonces')
        .where('user_id', '==', userId)
        .where('annonce_id', '==', annonceId)
        .limit(1)
        .get();
    
    if (snapshot.empty) return null;
    return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
    };
}
async findAllLikesForAnnonce(annonceId) {
    const snapshot = await this.db.collection('likes_annonces')
        .where('annonce_id', '==', annonceId)
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
async findAllCommentsForAnnonce(annonceId) {
    const snapshot = await this.db.collection('commentaires')
        .where('annonce_id', '==', annonceId)
        .orderBy('created_at', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
async findAllCommentsForAnnonce(annonceId) {
    try {
        // D'abord récupérer tous les commentaires de l'annonce
        const snapshot = await this.db.collection('commentaires')
            .where('annonce_id', '==', annonceId)
            .get();
        
        // Puis trier côté application
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Trier par date décroissante
        return comments.sort((a, b) => {
            return b.created_at.toDate() - a.created_at.toDate();
        });
    } catch (error) {
        console.error('Error in findAllCommentsForAnnonce:', error);
        return [];
    }
}
}
export default FirebaseDatabase;