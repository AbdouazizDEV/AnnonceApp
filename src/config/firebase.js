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
        const doc = await this.db.collection(collection).doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    async findAll(collection) {
        const snapshot = await this.db.collection(collection).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async update(collection, id, data) {
        await this.db.collection(collection).doc(id).update(data);
        return id;
    }

    async delete(collection, id) {
        await this.db.collection(collection).doc(id).delete();
        return id;
    }
    async findByField(collection, field, value) {
        const snapshot = await this.db.collection(collection)
            .where(field, '==', value)
            .limit(1)
            .get();
        
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
}
export default FirebaseDatabase;