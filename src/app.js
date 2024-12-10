// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import annoncesRoutes from './routes/annonces.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Important pour form-data

// Routes
app.use('/api/annonces', annoncesRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));