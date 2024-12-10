//firebase.js
import admin from 'firebase-admin';
import IDatabase from '../interfaces/IDatabase.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
// Lire le fichier de configuration
const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, 'annonceapp-333a7-firebase-adminsdk-ebfg2-789cfbf378.json'))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


class FirebaseDatabase extends IDatabase {
    constructor() {
        super();
        this.db = admin.firestore();
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