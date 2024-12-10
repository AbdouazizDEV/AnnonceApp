// src/services/CloudinaryService.js
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

class CloudinaryService {
    static async uploadImage(buffer) {
        try {
            console.log('Attempting to upload to Cloudinary...'); // Log ajouté
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "annonces" },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error); // Log ajouté
                            return reject(error);
                        }
                        console.log('Cloudinary upload success:', result); // Log ajouté
                        resolve(result);
                    }
                );

                const stream = Readable.from(buffer);
                stream.pipe(uploadStream);
            });
        } catch (error) {
            console.error('Error in uploadImage:', error); // Log ajouté
            throw error;
        }
    }

    static async deleteImage(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'image:', error);
            throw error;
        }
    }
}

export default CloudinaryService;