// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import annoncesRoutes from './routes/annonces.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js'
import likeRoutes from './routes/likes.js';
import commentsRoutes from './routes/comments.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Important pour form-data

// Routes
app.use('/api/annonces', annoncesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', likeRoutes);
app.use('/api', commentsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));