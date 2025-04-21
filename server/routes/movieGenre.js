const express = require('express');
const router = express.Router();
const movieGenresController = require('../controllers/movieGenre');

router.get('/', movieGenresController.listMovieGenres);

module.exports = router;