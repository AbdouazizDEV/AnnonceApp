// src/config/firebaseConfig.js
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp;

try {
    const credentialsPath = join(__dirname, '../../config/annonceapp-333a7-firebase-adminsdk-ebfg2-d58e6aff54.json');
    console.log('Loading Firebase credentials from:', credentialsPath);
    
    const rawCredentials = readFileSync(credentialsPath);
    const serviceAccount = JSON.parse(rawCredentials);
    
    console.log('Firebase project_id:', serviceAccount.project_id);

    if (!admin.apps.length) {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
        });
        console.log('Firebase initialized successfully');
    } else {
        firebaseApp = admin.app();
        console.log('Using existing Firebase app');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
}

export const db = firebaseApp.firestore();
export default firebaseApp;