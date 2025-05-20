const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const movieController = require('../controllers/movie');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const tempPath = path.join(__dirname, '../public/tmp/');
            fs.mkdirSync(tempPath, { recursive: true });
            cb(null, tempPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    })
});

router.get('/', movieController.listMovies);
router.get('/:id', movieController.getMovie);

router.post(
    '/',
    authMiddleware.authenticateToken,
    authMiddleware.verifyAdmin,
    upload.single('image'),
    movieController.createMovie
);

router.put(
    '/:id',
    authMiddleware.authenticateToken,
    authMiddleware.verifyAdmin,
    movieController.updateMovieData
);

router.put(
    '/:id/image',
    authMiddleware.authenticateToken,
    authMiddleware.verifyAdmin,
    upload.single('image'),
    movieController.updateMovieImage
);

router.delete(
    '/:id',
    authMiddleware.authenticateToken,
    authMiddleware.verifyAdmin,
    movieController.deleteMovie
);

module.exports = router;