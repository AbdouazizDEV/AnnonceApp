// src/middleware/uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    console.log('Middleware fileFilter called');
    console.log('File:', file);
    
    if (file.mimetype.startsWith('image/')) {
        console.log('File accepted');
        cb(null, true);
    } else {
        console.log('File rejected');
        cb(new Error('Format de fichier non supporté. Veuillez uploader une image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // limite à 5MB
    }
});

export default upload;