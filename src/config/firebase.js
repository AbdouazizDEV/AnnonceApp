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
}
export default FirebaseDatabase;